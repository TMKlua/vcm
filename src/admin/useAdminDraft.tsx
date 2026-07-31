"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useContent } from "@/content/ContentContext";
import { defaultContent } from "@/content/defaults";
import type { SiteContent } from "@/content/types";
import { ADMIN_HEADER } from "./apiAuth";
import { ADMIN_PASSWORD } from "./config";

/* ──────────────────────────────────────────────────────────────────────────
 * Admin draft — the spine all editors build on.
 *
 * The draft is an in-memory copy of the live content. Nothing is persisted in
 * the browser: `save()` posts to /api/content, which writes the shared blob so
 * the change is live for every visitor on every device.
 *
 * Because there is no local safety net, an unsaved draft is lost when the tab
 * closes — hence the beforeunload guard below.
 *
 * Concurrency: the ETag read alongside the content travels back on save. If
 * somebody else saved in between, the server refuses the write (409) instead of
 * silently discarding their work.
 * ────────────────────────────────────────────────────────────────────────── */

/** Dotted path into SiteContent, e.g. "club.contact.email" or "text.hero.kicker". */
type Path = string;

export type SaveOutcome = { ok: true } | { ok: false; error: string };

interface AdminDraftValue {
  /** The editable working copy. `null` until content has loaded. */
  draft: SiteContent | null;
  /** True once the draft has been initialised. */
  ready: boolean;
  /** Immutable deep set by dotted path. */
  update: (path: Path, value: unknown) => void;
  /** Replace a whole top-level section (club, text, teams, …). */
  setSection: <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => void;
  /** True when the draft differs from the last saved snapshot. */
  dirty: boolean;
  /** True while a save request is in flight. */
  saving: boolean;
  /** Set when the last save was refused because someone else published first. */
  conflict: boolean;
  /**
   * Pull the published content back into the draft and clear the conflict.
   * Discards unsaved edits — the caller confirms first.
   */
  reload: () => Promise<SaveOutcome>;
  /** Publish the draft for everyone. */
  save: () => Promise<SaveOutcome>;
  /** Atomically replace the draft with `next` AND publish it (used by Import). */
  saveObject: (next: SiteContent) => Promise<SaveOutcome>;
  /** Reset the draft back to the last published content. */
  discard: () => void;
  /** Load the factory defaults into the draft (still needs a save to go live). */
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
  const { content, etag: serverEtag } = useContent();
  const router = useRouter();

  const [draft, setDraft] = useState<SiteContent>(() => clone(content));
  const [savedSnapshot, setSavedSnapshot] = useState<string>(() =>
    JSON.stringify(content),
  );
  const [etag, setEtag] = useState<string | null>(serverEtag);
  const [saving, setSaving] = useState(false);
  const [conflict, setConflict] = useState(false);

  const update = useCallback((path: Path, value: unknown) => {
    setDraft((prev) => setByPath(prev, path, value));
  }, []);

  const setSection = useCallback(
    <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => {
      setDraft((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const dirty = useMemo(
    () => JSON.stringify(draft) !== savedSnapshot,
    [draft, savedSnapshot],
  );

  /** POST the given content and, on success, mark it as the new baseline. */
  const publish = useCallback(
    async (next: SiteContent): Promise<SaveOutcome> => {
      setSaving(true);
      try {
        const response = await fetch("/api/content", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            [ADMIN_HEADER]: ADMIN_PASSWORD,
          },
          body: JSON.stringify({ content: next, etag }),
        });

        const payload = (await response.json().catch(() => null)) as
          | { ok?: boolean; etag?: string; error?: string }
          | null;

        if (!response.ok || !payload?.ok) {
          if (response.status === 409) setConflict(true);
          return {
            ok: false,
            error: payload?.error ?? "Échec de l'enregistrement.",
          };
        }

        setConflict(false);
        setEtag(payload.etag ?? null);
        setSavedSnapshot(JSON.stringify(next));
        // Re-render server components so the public site picks up the change.
        router.refresh();
        return { ok: true };
      } catch {
        return {
          ok: false,
          error: "Connexion impossible. Vérifiez votre réseau et réessayez.",
        };
      } finally {
        setSaving(false);
      }
    },
    [etag, router],
  );

  const save = useCallback(() => publish(draft), [publish, draft]);

  const saveObject = useCallback(
    async (next: SiteContent): Promise<SaveOutcome> => {
      const cloned = clone(next);
      setDraft(cloned);
      return publish(cloned);
    },
    [publish],
  );

  const reload = useCallback(async (): Promise<SaveOutcome> => {
    setSaving(true);
    try {
      const response = await fetch("/api/content", {
        headers: { [ADMIN_HEADER]: ADMIN_PASSWORD },
        cache: "no-store",
      });
      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; content?: SiteContent; etag?: string | null; error?: string }
        | null;

      if (!response.ok || !payload?.ok || !payload.content) {
        return { ok: false, error: payload?.error ?? "Rechargement impossible." };
      }

      const fresh = clone(payload.content);
      setDraft(fresh);
      setSavedSnapshot(JSON.stringify(fresh));
      setEtag(payload.etag ?? null);
      setConflict(false);
      router.refresh();
      return { ok: true };
    } catch {
      return { ok: false, error: "Connexion impossible. Réessayez." };
    } finally {
      setSaving(false);
    }
  }, [router]);

  const discard = useCallback(() => {
    const fresh = clone(content);
    setDraft(fresh);
    setSavedSnapshot(JSON.stringify(fresh));
  }, [content]);

  const resetAll = useCallback(() => {
    // Loaded into the draft only — going live still requires an explicit save,
    // so a mis-click can never wipe the published site.
    setDraft(clone(defaultContent));
  }, []);

  const loadDraft = useCallback((next: SiteContent) => {
    setDraft(clone(next));
  }, []);

  // No localStorage fallback any more: warn before losing an unsaved draft.
  useEffect(() => {
    if (!dirty) return;
    function onBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const value = useMemo<AdminDraftValue>(
    () => ({
      draft,
      ready: true,
      update,
      setSection,
      dirty,
      saving,
      conflict,
      reload,
      save,
      saveObject,
      discard,
      resetAll,
      loadDraft,
    }),
    [draft, update, setSection, dirty, saving, conflict, reload, save, saveObject, discard, resetAll, loadDraft],
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
