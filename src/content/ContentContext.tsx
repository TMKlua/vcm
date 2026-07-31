"use client";

import { createContext, useContext, useMemo } from "react";

import type { SiteContent } from "./types";

/* ──────────────────────────────────────────────────────────────────────────
 * Content context.
 *
 * The content is resolved on the SERVER (see `src/content/store.ts`) and handed
 * down as props. There is deliberately no browser-side storage layer: a single
 * server-side source of truth is what makes an edit visible on every device at
 * once. Anything cached per-browser would resurrect the original bug.
 *
 * Because the provider derives straight from its props, a `router.refresh()`
 * after a save re-renders the tree with the new content — no local state to
 * keep in sync.
 * ────────────────────────────────────────────────────────────────────────── */

interface ContentContextValue {
  /** The live site content, as resolved server-side. */
  content: SiteContent;
  /** ETag of the stored content; null when nothing has been saved yet. */
  etag: string | null;
  /** ISO date of the last save, or null. */
  updatedAt: string | null;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({
  content,
  etag = null,
  updatedAt = null,
  children,
}: {
  content: SiteContent;
  etag?: string | null;
  updatedAt?: string | null;
  children: React.ReactNode;
}) {
  const value = useMemo<ContentContextValue>(
    () => ({ content, etag, updatedAt }),
    [content, etag, updatedAt],
  );

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
}

/** Access the live content. Throws if used outside the provider. */
export function useContent(): ContentContextValue {
  const ctx = useContext(ContentContext);
  if (ctx === null) {
    throw new Error("useContent must be used within a <ContentProvider>");
  }
  return ctx;
}
