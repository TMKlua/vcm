"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useContent } from "@/content/ContentContext";
import type { SiteContent } from "@/content/types";

/* ──────────────────────────────────────────────────────────────────────────
 * Admin draft — the spine all editors build on.
 *
 * The draft is a deep clone of the live `content`, initialised once after the
 * content context has read localStorage (`isLoaded`). Editors mutate the draft
 * immutably via `update(path, value)` or `setSection`. `save()` pushes the full
 * draft into the content store (deepMerge replaces arrays + merges objects, so
 * the draft becomes the active content). `dirty` compares draft vs. last saved.
 * ────────────────────────────────────────────────────────────────────────── */

/** Dotted path into SiteContent, e.g. "club.contact.email" or "text.hero.kicker". */
type Path = string;

interface AdminDraftValue {
  /** The editable working copy. `null` until content has loaded. */
  draft: SiteContent | null;
  /** True once the draft has been initialised from loaded content. */
  ready: boolean;
  /** Immutable deep set by dotted path. */
  update: (path: Path, value: unknown) => void;
  /** Replace a whole top-level section (club, text, teams, …). */
  setSection: <K extends keyof SiteContent>(
    key: K,
    value: SiteContent[K],
  ) => void;
  /** True when the draft differs from the last saved snapshot. */
  dirty: boolean;
  /** Persist the draft (setOverrides) and mark clean. Returns true on success. */
  save: () => boolean;
  /**
   * Atomically replace the draft with `next` AND persist it (used by Import).
   * Avoids the stale-closure trap of `loadDraft(obj)` + `save()`: this both sets
   * the draft state and writes `next` straight to the content store in one go.
   * Returns true on success, false if persistence failed (draft still updated).
   */
  saveObject: (next: SiteContent) => boolean;
  /** Reset the draft back to the current live content. */
  discard: () => void;
  /** Wipe all overrides → factory defaults, and reset the draft to those. */
  resetAll: () => void;
  /** Replace the entire draft (used by Import). Marks dirty until saved. */
  loadDraft: (next: SiteContent) => void;
}

const AdminDraftContext = createContext<AdminDraftValue | null>(null);

/** Deep clone helper (structuredClone is available in modern runtimes). */
function clone<T>(value: T): T {
  return structuredClone(value);
}

/** Immutable deep-set into an object by dotted path; returns a new object. */
function setByPath<T>(obj: T, path: Path, value: unknown): T {
  const keys = path.split(".");
  const root = clone(obj) as Record<string, unknown>;
  let cursor: Record<string, unknown> = root;
  for (let i = 0; i < keys.length - 1; i += 1) {
    const key = keys[i];
    const existing = cursor[key];
    cursor[key] =
      existing && typeof existing === "object"
        ? Array.isArray(existing)
          ? [...existing]
          : { ...existing }
        : {};
    cursor = cursor[key] as Record<string, unknown>;
  }
  cursor[keys[keys.length - 1]] = value;
  return root as T;
}

export function AdminDraftProvider({ children }: { children: React.ReactNode }) {
  const { content, setOverrides, resetOverrides, isLoaded } = useContent();

  const [draft, setDraft] = useState<SiteContent | null>(null);
  // JSON snapshot of the last-saved state, used for the dirty comparison.
  const [savedSnapshot, setSavedSnapshot] = useState<string>("");

  // Initialise the draft once, after content has loaded from localStorage.
  useEffect(() => {
    if (isLoaded && draft === null) {
      const initial = clone(content);
      setDraft(initial);
      setSavedSnapshot(JSON.stringify(initial));
    }
    // Intentionally only depends on isLoaded — we snapshot once, not on every
    // content change (cross-tab changes are handled by the public site, and we
    // don't want to clobber an in-progress edit).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  const update = useCallback((path: Path, value: unknown) => {
    setDraft((prev) => (prev ? setByPath(prev, path, value) : prev));
  }, []);

  const setSection = useCallback(
    <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => {
      setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
    },
    [],
  );

  const save = useCallback((): boolean => {
    if (!draft) return false;
    try {
      setOverrides(draft);
    } catch {
      // Persistence failed (most likely localStorage quota exceeded due to
      // large embedded images). Leave the draft dirty so nothing is lost.
      return false;
    }
    // Updating the snapshot recomputes `dirty` (now false).
    setSavedSnapshot(JSON.stringify(draft));
    return true;
  }, [draft, setOverrides]);

  const saveObject = useCallback(
    (next: SiteContent): boolean => {
      const cloned = clone(next);
      // Set the draft from the passed object (not via stale closure state).
      setDraft(cloned);
      const snapshot = JSON.stringify(cloned);
      try {
        setOverrides(cloned);
      } catch {
        // Persistence failed (e.g. localStorage quota). The draft is updated
        // in memory but stays dirty so the user can export instead.
        return false;
      }
      // Mark clean: the snapshot now matches the just-persisted draft.
      setSavedSnapshot(snapshot);
      return true;
    },
    [setOverrides],
  );

  const discard = useCallback(() => {
    const fresh = clone(content);
    setDraft(fresh);
    setSavedSnapshot(JSON.stringify(fresh));
  }, [content]);

  const resetAll = useCallback(() => {
    resetOverrides();
    // After clearing overrides the live content is the factory default. We can't
    // read the post-reset content synchronously here, so reconstruct the draft
    // from defaults via a clone of current content minus overrides on next tick.
    // Simplest correct approach: reload so the provider re-reads cleared state.
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }, [resetOverrides]);

  const loadDraft = useCallback((next: SiteContent) => {
    const cloned = clone(next);
    setDraft(cloned);
    // Leave the saved snapshot as-is so the imported draft shows as dirty until
    // the caller saves it (Import flow saves immediately afterwards).
  }, []);

  const dirty = useMemo(() => {
    if (!draft) return false;
    return JSON.stringify(draft) !== savedSnapshot;
  }, [draft, savedSnapshot]);

  const value = useMemo<AdminDraftValue>(
    () => ({
      draft,
      ready: draft !== null,
      update,
      setSection,
      dirty,
      save,
      saveObject,
      discard,
      resetAll,
      loadDraft,
    }),
    [draft, update, setSection, dirty, save, saveObject, discard, resetAll, loadDraft],
  );

  return (
    <AdminDraftContext.Provider value={value}>
      {children}
    </AdminDraftContext.Provider>
  );
}

export function useAdminDraft(): AdminDraftValue {
  const ctx = useContext(AdminDraftContext);
  if (ctx === null) {
    throw new Error("useAdminDraft must be used within an <AdminDraftProvider>");
  }
  return ctx;
}
