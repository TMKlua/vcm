import { NextResponse } from "next/server";

import { isAuthorized } from "@/admin/apiAuth";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/content/images";
import { isImageStoreConfigured, uploadImage } from "@/content/store";

/**
 * Upload one image to the public store and return its URL.
 *
 * Body: multipart form-data with a single `file` field.
 *
 * The admin calls this as soon as a picture is picked, so images never travel
 * inside the content payload. The stored pathname is a hash of the bytes,
 * computed server-side — never derived from anything the client sends.
 */
export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  if (!isImageStoreConfigured()) {
    return NextResponse.json(
      { error: "Stockage d'images non configuré (BLOB_IMAGE_STORE_ID manquant)." },
      { status: 500 },
    );
  }

  let file: File | null = null;
  try {
    const form = await request.formData();
    const candidate = form.get("file");
    if (candidate instanceof File) file = candidate;
  } catch {
    return NextResponse.json({ error: "Requête illisible." }, { status: 400 });
  }

  if (!file) {
    return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
  }

  const mime = file.type.toLowerCase();
  const ext = ALLOWED_IMAGE_TYPES[mime];
  if (!ext) {
    return NextResponse.json(
      { error: "Format non accepté. Utilisez WebP, JPEG ou PNG." },
      { status: 400 },
    );
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return NextResponse.json(
      { error: `Image trop lourde (maximum ${MAX_IMAGE_BYTES / (1024 * 1024)} Mo).` },
      { status: 400 },
    );
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.length === 0) {
    return NextResponse.json({ error: "Fichier vide." }, { status: 400 });
  }

  try {
    const url = await uploadImage(bytes, mime, ext);
    return NextResponse.json({ ok: true, url });
  } catch (err) {
    console.error("[upload] échec de l'envoi", err);
    return NextResponse.json({ error: "Échec de l'envoi de l'image." }, { status: 502 });
  }
}
