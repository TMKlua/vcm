"use client";

import { Plus } from "lucide-react";
import type { GalleryImage } from "@/types";
import { useAdminDraft } from "../useAdminDraft";
import {
  Button,
  Card,
  Field,
  NumberInput,
  SectionTitle,
  TextInput,
} from "../ui";
import ImageInput from "../ImageInput";
import { moveItem } from "./shared";
import { ItemControls, EmptyState } from "./CollectionControls";

export default function GalleryEditor() {
  const { draft, setSection } = useAdminDraft();
  if (!draft) return null;
  const gallery = draft.gallery;

  function commit(next: GalleryImage[]) {
    setSection("gallery", next);
  }
  function patch(i: number, partial: Partial<GalleryImage>) {
    commit(gallery.map((g, idx) => (idx === i ? { ...g, ...partial } : g)));
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Galerie"
        description="Les photos affichées dans la galerie du site."
      />

      {gallery.length === 0 && (
        <EmptyState>Aucune photo pour le moment.</EmptyState>
      )}

      <div className="space-y-4">
        {gallery.map((img, i) => (
          <Card key={i} className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-white/70">
                Photo #{i + 1}
              </h3>
              <ItemControls
                index={i}
                count={gallery.length}
                label={img.alt || `Photo #${i + 1}`}
                onMoveUp={() => commit(moveItem(gallery, i, i - 1))}
                onMoveDown={() => commit(moveItem(gallery, i, i + 1))}
                onRemove={() => commit(gallery.filter((_, idx) => idx !== i))}
              />
            </div>
            <ImageInput
              label="Image"
              value={img.src}
              help="Les dimensions sont remplies automatiquement à l'import."
              onChange={(src, dims) =>
                patch(
                  i,
                  dims
                    ? { src, width: dims.width, height: dims.height }
                    : { src },
                )
              }
            />
            <Field label="Texte alternatif (alt)" htmlFor={`gal-alt-${i}`}>
              <TextInput
                id={`gal-alt-${i}`}
                value={img.alt}
                onChange={(e) => patch(i, { alt: e.target.value })}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Largeur" htmlFor={`gal-w-${i}`}>
                <NumberInput
                  id={`gal-w-${i}`}
                  value={img.width}
                  onChange={(e) =>
                    patch(i, { width: Number(e.target.value) || 0 })
                  }
                />
              </Field>
              <Field label="Hauteur" htmlFor={`gal-h-${i}`}>
                <NumberInput
                  id={`gal-h-${i}`}
                  value={img.height}
                  onChange={(e) =>
                    patch(i, { height: Number(e.target.value) || 0 })
                  }
                />
              </Field>
              <Field label="Catégorie" htmlFor={`gal-cat-${i}`}>
                <TextInput
                  id={`gal-cat-${i}`}
                  value={img.category}
                  onChange={(e) => patch(i, { category: e.target.value })}
                />
              </Field>
            </div>
          </Card>
        ))}
      </div>

      <Button
        variant="primary"
        onClick={() =>
          commit([
            ...gallery,
            { src: "", alt: "", width: 1200, height: 800, category: "" },
          ])
        }
      >
        <Plus className="h-4 w-4" /> Ajouter une photo
      </Button>
    </div>
  );
}
