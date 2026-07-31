import { NextResponse } from "next/server";

import { isAuthorized } from "@/admin/apiAuth";
import { collectDataUrls, parseDataUrl, replaceDataUrls } from "@/content/images";
import { isImageStoreConfigured, uploadImage, writeContent } from "@/content/store";
import { validateContent } from "@/content/validate";
import type { SiteContent } from "@/content/types";

/**
 * Save the site content.
 *
 * Body: `{ content: SiteContent, etag: string | null }`
 *
 * Any inline `data:image/…` still present in the payload is uploaded to the
 * public image store and rewritten to its URL before saving. That keeps base64
 * out of the content blob and makes migrating old localStorage content — which
 * embedded its images — work with no manual step.
 */
export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête illisible." }, { status: 400 });
  }

  const { content: rawContent, etag } =
    (body ?? {}) as { content?: unknown; etag?: unknown };

  const validation = validateContent(rawContent);
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  // Upload any inline image, then swap each data URL for its public URL.
  let content: SiteContent = validation.content;
  const dataUrls = [...collectDataUrls(content)];

  if (dataUrls.length > 0) {
    if (!isImageStoreConfigured()) {
      return NextResponse.json(
        { error: "Stockage d'images non configuré (BLOB_IMAGE_STORE_ID manquant)." },
        { status: 500 },
      );
    }

    const map = new Map<string, string>();
    for (const dataUrl of dataUrls) {
      const decoded = parseDataUrl(dataUrl);
      if (!decoded) {
        return NextResponse.json(
          { error: "Image intégrée invalide ou trop volumineuse (formats acceptés : WebP, JPEG, PNG, 2 Mo max)." },
          { status: 400 },
        );
      }
      try {
        map.set(dataUrl, await uploadImage(decoded.bytes, decoded.mime, decoded.ext));
      } catch (err) {
        console.error("[content] échec de l'upload d'une image", err);
        return NextResponse.json(
          { error: "Échec de l'envoi d'une image. Réessayez." },
          { status: 502 },
        );
      }
    }
    content = replaceDataUrls(content, map);
  }

  let result;
  try {
    result = await writeContent(content, typeof etag === "string" ? etag : null);
  } catch (err) {
    console.error("[content] échec de l'écriture", err);
    return NextResponse.json({ error: "Échec de l'enregistrement." }, { status: 502 });
  }

  if (!result.ok) {
    if (result.reason === "conflict") {
      return NextResponse.json(
        {
          error:
            "Le contenu a été modifié depuis un autre appareil. Rechargez la page pour repartir de la dernière version.",
        },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Stockage non configuré (BLOB_STORE_ID manquant)." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    etag: result.etag,
    updatedAt: result.updatedAt,
    imagesUploaded: dataUrls.length,
  });
}
