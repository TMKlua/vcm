/* ──────────────────────────────────────────────────────────────────────────
 * Image upload helper for the client-side CMS.
 *
 * Takes any raster image File the browser can decode (PNG, JPEG, WebP, GIF,
 * AVIF, BMP…), downscales it to a max width preserving aspect ratio (never
 * upscales), and exports a compact data URL — WebP when supported (keeps alpha),
 * falling back to JPEG. The data URL is stored directly in the content overrides
 * (localStorage), so keeping it small matters.
 *
 * Runs only in the browser (called from event handlers); guarded for SSR.
 * ────────────────────────────────────────────────────────────────────────── */

export interface ImageData {
  dataUrl: string;
  width: number;
  height: number;
}

export interface FileToImageOpts {
  /** Max width in px; image is scaled down to fit, never up. Default 1600. */
  maxWidth?: number;
  /** Output quality 0..1 for lossy export. Default 0.82. */
  quality?: number;
}

/** Decode a File into something drawable, preferring createImageBitmap. */
async function decode(
  file: File,
): Promise<{ source: CanvasImageSource; width: number; height: number; cleanup: () => void }> {
  // Fast path: createImageBitmap handles most formats and respects orientation
  // in modern browsers.
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file);
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        cleanup: () => bitmap.close(),
      };
    } catch {
      // Fall through to the HTMLImageElement path.
    }
  }

  // Fallback: load via an object URL into an <img>.
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () =>
        reject(new Error("Impossible de décoder cette image."));
      el.src = url;
    });
    return {
      source: img,
      width: img.naturalWidth || img.width,
      height: img.naturalHeight || img.height,
      cleanup: () => URL.revokeObjectURL(url),
    };
  } catch (err) {
    URL.revokeObjectURL(url);
    throw err;
  }
}

/** Returns true if the canvas can export the given mime type. */
function canExport(canvas: HTMLCanvasElement, mime: string): boolean {
  try {
    return canvas.toDataURL(mime).startsWith(`data:${mime}`);
  } catch {
    return false;
  }
}

export async function fileToImageData(
  file: File,
  opts: FileToImageOpts = {},
): Promise<ImageData> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    throw new Error("Le traitement d'image n'est disponible que dans le navigateur.");
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("Le fichier sélectionné n'est pas une image.");
  }

  const maxWidth = opts.maxWidth ?? 1600;
  const quality = opts.quality ?? 0.82;

  const { source, width: srcW, height: srcH, cleanup } = await decode(file);

  try {
    if (!srcW || !srcH) {
      throw new Error("Dimensions d'image invalides.");
    }

    // Scale down to maxWidth, never up.
    const scale = srcW > maxWidth ? maxWidth / srcW : 1;
    const outW = Math.max(1, Math.round(srcW * scale));
    const outH = Math.max(1, Math.round(srcH * scale));

    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Contexte canvas indisponible.");
    }
    ctx.drawImage(source, 0, 0, outW, outH);

    // Prefer WebP (smaller + supports alpha); fall back to JPEG, then PNG.
    let mime = "image/webp";
    if (!canExport(canvas, mime)) {
      mime = "image/jpeg";
    }
    let dataUrl = canvas.toDataURL(mime, quality);
    if (!dataUrl.startsWith("data:image/")) {
      // Last resort.
      dataUrl = canvas.toDataURL("image/png");
    }

    return { dataUrl, width: outW, height: outH };
  } finally {
    cleanup();
  }
}

/** Approximate byte size of a data URL (base64 payload). */
export function dataUrlBytes(dataUrl: string): number {
  const comma = dataUrl.indexOf(",");
  if (comma === -1) return dataUrl.length;
  const base64 = dataUrl.slice(comma + 1);
  // 4 base64 chars => 3 bytes; subtract padding.
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  return Math.floor((base64.length * 3) / 4) - padding;
}
