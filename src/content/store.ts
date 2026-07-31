import "server-only";

import { get, put, BlobPreconditionFailedError } from "@vercel/blob";

import { defaultContent } from "./defaults";
import { imagePathname } from "./images";
import { deepMerge } from "./merge";
import type { DeepPartial, SiteContent } from "./types";

/* ──────────────────────────────────────────────────────────────────────────
 * Server-side content store — the single source of truth for the whole site.
 *
 * Two Vercel Blob stores are involved:
 *  - the PRIVATE store (BLOB_STORE_ID) holds `content.json`. It is read at
 *    render time with `useCache: false`, which bypasses the CDN and therefore
 *    the up-to-60s propagation delay: a save is visible on the very next
 *    request, on every device.
 *  - the PUBLIC store (BLOB_IMAGE_STORE_ID) holds uploaded images, served
 *    straight from the CDN. Pathnames are content hashes, so a long cache is
 *    safe by construction.
 *
 * This is the only module that talks to @vercel/blob.
 * ────────────────────────────────────────────────────────────────────────── */

const CONTENT_PATH = "content.json";

/** One year — safe because image pathnames are content-addressed. */
const IMAGE_CACHE_SECONDS = 31_536_000;

interface ContentEnvelope {
  updatedAt: string;
  content: SiteContent;
}

export interface ContentSnapshot {
  content: SiteContent;
  /** ETag of the stored blob, or null when nothing has been saved yet. */
  etag: string | null;
  updatedAt: string | null;
}

/** Snapshot used whenever the blob is missing, unreadable or malformed. */
function fallbackSnapshot(): ContentSnapshot {
  return { content: defaultContent, etag: null, updatedAt: null };
}

/** True once the private content store is wired up. */
function isConfigured(): boolean {
  return Boolean(
    process.env.BLOB_STORE_ID ??
      process.env.BLOB_READ_WRITE_TOKEN,
  );
}

/**
 * Read the live content straight from origin storage, on every request.
 *
 * Deliberately uncached. `useCache: false` bypasses the CDN, so a save is
 * visible on the very next request from any device — which is the whole point
 * of this rewrite. At this traffic level one blob read per render is cheap, and
 * it removes an entire class of "why is my edit not showing" bugs.
 *
 * Never throws: any failure degrades to the built-in defaults so a storage
 * incident can never take the public site down.
 */
export async function readContent(): Promise<ContentSnapshot> {
  if (!isConfigured()) return fallbackSnapshot();

  try {
    const result = await get(CONTENT_PATH, {
      access: "private",
      useCache: false,
    });
    if (!result || result.statusCode !== 200) return fallbackSnapshot();

    const text = await new Response(result.stream).text();
    const parsed = JSON.parse(text) as Partial<ContentEnvelope>;

    if (!parsed || typeof parsed !== "object" || !parsed.content) {
      console.warn("[content] envelope malformée dans le blob, repli sur les valeurs par défaut");
      return fallbackSnapshot();
    }

    return {
      // Merged over the defaults so a payload missing a field — an older
      // export, a hand-edited JSON — degrades to the default value instead of
      // crashing a page on an undefined read.
      content: deepMerge(defaultContent, parsed.content as DeepPartial<SiteContent>),
      etag: result.blob.etag,
      updatedAt: parsed.updatedAt ?? null,
    };
  } catch (err) {
    console.warn("[content] lecture du blob impossible, repli sur les valeurs par défaut", err);
    return fallbackSnapshot();
  }
}

export type WriteResult =
  | { ok: true; etag: string; updatedAt: string }
  | { ok: false; reason: "conflict" }
  | { ok: false; reason: "unconfigured" };

/**
 * Persist new content, guarded by the ETag the caller last read.
 *
 * A mismatched ETag means somebody else saved in the meantime; the write is
 * refused rather than silently overwriting their work.
 */
export async function writeContent(
  content: SiteContent,
  expectedEtag: string | null,
): Promise<WriteResult> {
  if (!isConfigured()) return { ok: false, reason: "unconfigured" };

  const envelope: ContentEnvelope = {
    updatedAt: new Date().toISOString(),
    content,
  };

  try {
    const result = await put(CONTENT_PATH, JSON.stringify(envelope), {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
      // Only guard when a previous version exists; the first write creates it.
      ...(expectedEtag ? { ifMatch: expectedEtag } : {}),
    });

    return { ok: true, etag: result.etag, updatedAt: envelope.updatedAt };
  } catch (err) {
    if (err instanceof BlobPreconditionFailedError) {
      return { ok: false, reason: "conflict" };
    }
    throw err;
  }
}

/** True once the public image store is wired up. */
export function isImageStoreConfigured(): boolean {
  return Boolean(process.env.BLOB_IMAGE_STORE_ID);
}

/**
 * Upload an image to the public store and return its URL.
 *
 * Idempotent: the pathname is a hash of the bytes, so re-uploading the same
 * picture overwrites it with identical content and yields the same URL.
 */
export async function uploadImage(
  bytes: Buffer,
  mime: string,
  ext: string,
): Promise<string> {
  const result = await put(imagePathname(bytes, ext), bytes, {
    access: "public",
    storeId: process.env.BLOB_IMAGE_STORE_ID,
    contentType: mime,
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: IMAGE_CACHE_SECONDS,
  });
  return result.url;
}
