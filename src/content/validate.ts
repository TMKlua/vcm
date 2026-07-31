import type { SiteContent } from "./types";

/* ──────────────────────────────────────────────────────────────────────────
 * Content validation — shared by the admin (import) and the server (save).
 *
 * Keeping a single source of truth here means the browser and the API route
 * can never disagree about what a valid content payload looks like.
 * ────────────────────────────────────────────────────────────────────────── */

/** Top-level keys every valid content payload must contain. */
export const REQUIRED_KEYS: (keyof SiteContent)[] = [
  "club",
  "stats",
  "teams",
  "news",
  "events",
  "partners",
  "gallery",
  "faq",
  "timeline",
  "text",
];

/**
 * Max serialized size accepted by the save route.
 *
 * Vercel Functions cap request bodies at 4.5 MB for server uploads. Once images
 * live in the Blob store instead of the JSON, real content weighs tens of KB —
 * this ceiling only ever trips on a payload still carrying inline base64.
 */
export const MAX_CONTENT_BYTES = 2 * 1024 * 1024;

/** Structural check: is this object shaped like SiteContent? */
export function isValidContent(value: unknown): value is SiteContent {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  return REQUIRED_KEYS.every((k) => k in obj);
}

export type ValidationResult =
  | { ok: true; content: SiteContent }
  | { ok: false; error: string };

/**
 * Full validation of an untrusted payload: structure, then serialized size.
 *
 * Inline `data:` images are NOT rejected — the save route uploads them to the
 * image store and rewrites them to URLs. That is what makes migrating existing
 * localStorage content work without any manual step.
 */
export function validateContent(raw: unknown): ValidationResult {
  if (!isValidContent(raw)) {
    const missing = REQUIRED_KEYS.filter(
      (k) => typeof raw !== "object" || raw === null || !(k in raw),
    );
    return {
      ok: false,
      error: `Contenu invalide — sections manquantes : ${missing.join(", ")}.`,
    };
  }

  const bytes = new TextEncoder().encode(JSON.stringify(raw)).length;
  if (bytes > MAX_CONTENT_BYTES) {
    const mb = (bytes / (1024 * 1024)).toFixed(1);
    return {
      ok: false,
      error: `Contenu trop volumineux (${mb} Mo, maximum ${MAX_CONTENT_BYTES / (1024 * 1024)} Mo). Réduisez le poids des images.`,
    };
  }

  return { ok: true, content: raw };
}
