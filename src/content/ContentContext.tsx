"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { defaultContent } from "./defaults";
import { deepMerge } from "./merge";
import type { DeepPartial, SiteContent } from "./types";

/** localStorage key for the persisted overrides layer. */
export const CONTENT_STORAGE_KEY = "vcm_content_v1";

interface ContentContextValue {
  /** Default content deep-merged with the current overrides. */
  content: SiteContent;
  /** The raw overrides layer (what gets persisted). */
  overrides: DeepPartial<SiteContent>;
  /** Replace the full overrides object (state + localStorage). */
  setOverrides: (next: DeepPartial<SiteContent>) => void;
  /** Clear all overrides (state + remove localStorage key). */
  resetOverrides: () => void;
  /** True once the client has read localStorage (post-hydration). */
  isLoaded: boolean;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  // Start empty so the first render (SSR + initial client render) renders
  // exactly `defaultContent` — avoids any hydration mismatch.
  const [overrides, setOverridesState] = useState<DeepPartial<SiteContent>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Read persisted overrides once, on the client, after mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CONTENT_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as DeepPartial<SiteContent>;
        setOverridesState(parsed);
      }
    } catch (err) {
      console.warn("[content] failed to read overrides from localStorage", err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Cross-tab live update: when the admin saves in another tab the `storage`
  // event fires here, so the public site reloads overrides without a refresh.
  // (The `storage` event only fires in *other* tabs, never the one that wrote.)
  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key !== CONTENT_STORAGE_KEY) return;
      try {
        if (event.newValue) {
          setOverridesState(JSON.parse(event.newValue) as DeepPartial<SiteContent>);
        } else {
          // Key removed (reset to factory defaults in another tab).
          setOverridesState({});
        }
      } catch (err) {
        console.warn("[content] failed to sync overrides from storage event", err);
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setOverrides = useCallback((next: DeepPartial<SiteContent>) => {
    setOverridesState(next);
    try {
      window.localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(next));
    } catch (err) {
      console.warn("[content] failed to persist overrides to localStorage", err);
    }
  }, []);

  const resetOverrides = useCallback(() => {
    setOverridesState({});
    try {
      window.localStorage.removeItem(CONTENT_STORAGE_KEY);
    } catch (err) {
      console.warn("[content] failed to clear overrides from localStorage", err);
    }
  }, []);

  const content = useMemo(
    () => deepMerge(defaultContent, overrides),
    [overrides],
  );

  const value = useMemo<ContentContextValue>(
    () => ({ content, overrides, setOverrides, resetOverrides, isLoaded }),
    [content, overrides, setOverrides, resetOverrides, isLoaded],
  );

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
}

/** Access the merged content + admin controls. Throws if used outside the provider. */
export function useContent(): ContentContextValue {
  const ctx = useContext(ContentContext);
  if (ctx === null) {
    throw new Error("useContent must be used within a <ContentProvider>");
  }
  return ctx;
}

/** Admin-focused accessor — overrides + setters. Throws if used outside the provider. */
export function useContentAdmin(): Pick<
  ContentContextValue,
  "overrides" | "setOverrides" | "resetOverrides" | "isLoaded"
> {
  const { overrides, setOverrides, resetOverrides, isLoaded } = useContent();
  return { overrides, setOverrides, resetOverrides, isLoaded };
}
