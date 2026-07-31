import { createHash } from "node:crypto";

/* ──────────────────────────────────────────────────────────────────────────
 * Inline-image extraction.
 *
 * The admin can produce `data:image/…` values (image picker, or content
 * migrated from the old localStorage store). Those must never reach the
 * content blob: they bloat the JSON and defeat CDN caching. These pure helpers
 * find them, name them deterministically, and swap them for their public URL.
 *
 * Filenames derive from a hash of the bytes, so the same image always lands on
 * the same path — uploads are idempotent and the store never accumulates
 * duplicates of an identical picture.
 * ────────────────────────────────────────────────────────────────────────── */

/** Image types the upload path accepts, mapped to their file extension. */
export const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "image/png": "png",
};

/** Max decoded size of a single image. */
export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

export interface DecodedImage {
  mime: string;
  ext: string;
  bytes: Buffer;
}

/**
 * Decode a `data:image/…;base64,…` URL.
 *
 * Returns null for anything that is not a base64 data URL of an allowed image
 * type, or whose payload exceeds MAX_IMAGE_BYTES.
 */
export function parseDataUrl(value: string): DecodedImage | null {
  const match = /^data:([a-z]+\/[a-z0-9.+-]+);base64,([\s\S]*)$/i.exec(value);
  if (!match) return null;

  const mime = match[1].toLowerCase();
  const ext = ALLOWED_IMAGE_TYPES[mime];
  if (!ext) return null;

  let bytes: Buffer;
  try {
    bytes = Buffer.from(match[2], "base64");
  } catch {
    return null;
  }
  if (bytes.length === 0 || bytes.length > MAX_IMAGE_BYTES) return null;

  return { mime, ext, bytes };
}

/** Deterministic blob pathname for an image, derived from its bytes. */
export function imagePathname(bytes: Buffer, ext: string): string {
  const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 16);
  return `images/${hash}.${ext}`;
}

/** Collect every distinct inline image data URL found anywhere in the tree. */
export function collectDataUrls(value: unknown, out = new Set<string>()): Set<string> {
  if (typeof value === "string") {
    if (value.startsWith("data:image/")) out.add(value);
    return out;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectDataUrls(item, out);
    return out;
  }
  if (value !== null && typeof value === "object") {
    for (const item of Object.values(value)) collectDataUrls(item, out);
  }
  return out;
}

/**
 * Return a copy of `value` where every string present in `map` is replaced by
 * its mapped value. Never mutates the input.
 */
export function replaceDataUrls<T>(value: T, map: Map<string, string>): T {
  if (typeof value === "string") {
    return (map.get(value) ?? value) as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => replaceDataUrls(item, map)) as unknown as T;
  }
  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      out[key] = replaceDataUrls(item, map);
    }
    return out as T;
  }
  return value;
}
