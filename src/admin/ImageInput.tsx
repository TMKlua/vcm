"use client";

import { useId, useRef, useState } from "react";
import { ImageIcon, Loader2, Upload, RotateCcw } from "lucide-react";
import { Button, Field, TextInput } from "./ui";
import { fileToImageData, dataUrlBytes } from "./image";

/* ──────────────────────────────────────────────────────────────────────────
 * Reusable image field for the admin.
 *
 * - Previews the current value (works for /images/… paths AND data URLs).
 * - File picker → downscales + converts via fileToImageData → emits a data URL.
 * - Manual text field to paste a path or URL instead.
 * - Optional "Réinitialiser" back to a default path.
 * ────────────────────────────────────────────────────────────────────────── */

/** Soft warning threshold for a single image data URL (~500 KB). */
const LARGE_BYTES = 500 * 1024;

export default function ImageInput({
  label,
  value,
  onChange,
  help,
  defaultValue,
}: {
  label: string;
  value: string;
  onChange: (dataUrlOrPath: string, dims?: { width: number; height: number }) => void;
  help?: string;
  /** When provided, shows a "Réinitialiser" button restoring this value. */
  defaultValue?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const baseId = useId();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isData = value.startsWith("data:");
  const bytes = isData ? dataUrlBytes(value) : 0;
  const kb = Math.round(bytes / 1024);
  const tooLarge = bytes > LARGE_BYTES;

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      const { dataUrl, width, height } = await fileToImageData(file);
      onChange(dataUrl, { width, height });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Échec du traitement de l'image.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Field label={label} hint={help}>
      <div className="space-y-3">
        <div className="flex items-start gap-4">
          {/* Preview */}
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-white/15 bg-[#0a0418]">
            {value ? (
              // Plain <img>: works for both paths and data URLs without next/image config.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="grid h-full w-full place-items-center text-white/30">
                <ImageIcon className="h-6 w-6" aria-hidden />
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
              aria-label={`Importer une image pour ${label}`}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                disabled={busy}
                onClick={() => fileRef.current?.click()}
              >
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <Upload className="h-4 w-4" aria-hidden />
                )}
                {busy ? "Traitement…" : "Importer une image"}
              </Button>
              {defaultValue !== undefined && value !== defaultValue && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setError(null);
                    onChange(defaultValue);
                  }}
                >
                  <RotateCcw className="h-4 w-4" aria-hidden /> Réinitialiser
                </Button>
              )}
            </div>

            {isData && (
              <p
                className={`text-xs ${tooLarge ? "text-amber-300" : "text-white/40"}`}
              >
                Image intégrée · {kb} Ko
                {tooLarge &&
                  " — volumineuse : risque de saturer le stockage local. Préférez une image plus petite ou exportez le contenu."}
              </p>
            )}
            {error && (
              <p role="alert" className="text-xs text-rose-400">
                {error}
              </p>
            )}
          </div>
        </div>

        {/* Manual path / URL */}
        <div>
          <label htmlFor={`${baseId}-path`} className="sr-only">
            {`Chemin ou URL de l'image pour ${label}`}
          </label>
          <TextInput
            id={`${baseId}-path`}
            value={isData ? "" : value}
            placeholder="/images/… ou https://…"
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>
    </Field>
  );
}
