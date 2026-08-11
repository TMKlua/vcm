"use client";

import { useAdminDraft } from "../useAdminDraft";
import { Card, Field, SectionTitle, TextInput, TextArea } from "../ui";
import ImageInput from "../ImageInput";
import type { SeoPageMeta } from "@/content/types";

/* ──────────────────────────────────────────────────────────────────────────
 * Référencement & favicon.
 *
 * Pilote ce que voient l'onglet du navigateur, Google et les aperçus de
 * partage (Facebook, WhatsApp, iMessage…). Un champ laissé vide retombe sur la
 * valeur livrée avec le site, jamais sur du vide.
 * ────────────────────────────────────────────────────────────────────────── */

const PAGES: { key: keyof NonNullable<SeoPagesMap>; label: string }[] = [
  { key: "home", label: "Accueil" },
  { key: "histoire", label: "Histoire" },
  { key: "equipes", label: "Équipes" },
  { key: "sportSante", label: "Sport Santé" },
  { key: "inscriptions", label: "Inscriptions" },
  { key: "partenaires", label: "Partenaires" },
  { key: "galerie", label: "Galerie" },
  { key: "actualites", label: "Actualités" },
  { key: "contact", label: "Contact" },
];

type SeoPagesMap = Record<string, SeoPageMeta | undefined>;

export default function SeoEditor() {
  const { draft, update } = useAdminDraft();
  if (!draft) return null;
  const seo = draft.seo ?? {};
  const pages = (seo.pages ?? {}) as SeoPagesMap;

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Référencement & favicon"
        description="Ce que voient l'onglet du navigateur, Google et les aperçus de partage. Un champ vide reprend la valeur livrée avec le site."
      />

      <Card className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-white/50">
          Icône de l&apos;onglet (favicon)
        </h3>
        <ImageInput
          label="Favicon"
          value={seo.favicon ?? ""}
          onChange={(val) => update("seo.favicon", val)}
          defaultValue="/icon.png"
          help="Petite icône affichée dans l'onglet du navigateur, dans les favoris et à côté du lien dans les résultats Google. PNG carré, 512 × 512 px de préférence. Le changement peut mettre quelques heures à apparaître chez Google (et un rafraîchissement forcé du navigateur peut être nécessaire pour l'onglet)."
        />
        <ImageInput
          label="Icône iPhone / iPad"
          value={seo.appleIcon ?? ""}
          onChange={(val) => update("seo.appleIcon", val)}
          defaultValue="/apple-icon.png"
          help="Icône utilisée quand quelqu'un ajoute le site à l'écran d'accueil de son iPhone. PNG carré 180 × 180 px."
        />
      </Card>

      <Card className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-white/50">
          Image de partage
        </h3>
        <ImageInput
          label="Aperçu affiché sur Facebook, WhatsApp, iMessage…"
          value={seo.ogImage ?? ""}
          onChange={(val) => update("seo.ogImage", val)}
          defaultValue="/og-image.jpg"
          help="Format paysage 1200 × 630 px. C'est la grande image qui accompagne le lien quand on partage le site."
        />
      </Card>

      <Card className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-white/50">
          Identité du site
        </h3>
        <Field
          label="Nom du site"
          htmlFor="seo-siteName"
          hint="Utilisé par les réseaux sociaux et les données structurées Google."
        >
          <TextInput
            id="seo-siteName"
            value={seo.siteName ?? ""}
            onChange={(e) => update("seo.siteName", e.target.value)}
          />
        </Field>
        <Field
          label="Titre de l'onglet - accueil"
          htmlFor="seo-defaultTitle"
          hint="Environ 60 caractères maximum pour être affiché en entier par Google."
        >
          <TextInput
            id="seo-defaultTitle"
            value={seo.defaultTitle ?? ""}
            onChange={(e) => update("seo.defaultTitle", e.target.value)}
          />
        </Field>
        <Field
          label="Gabarit des autres pages"
          htmlFor="seo-titleTemplate"
          hint="« %s » est remplacé par le titre de la page. Exemple : %s · Volley Club Marseillanais"
        >
          <TextInput
            id="seo-titleTemplate"
            value={seo.titleTemplate ?? ""}
            onChange={(e) => update("seo.titleTemplate", e.target.value)}
          />
        </Field>
        <Field
          label="Description par défaut"
          htmlFor="seo-description"
          hint="Le texte affiché sous le lien dans Google. Environ 155 caractères."
        >
          <TextArea
            id="seo-description"
            rows={3}
            value={seo.description ?? ""}
            onChange={(e) => update("seo.description", e.target.value)}
          />
        </Field>
        <Field
          label="Mots-clés"
          htmlFor="seo-keywords"
          hint="Un mot-clé par ligne. Les lignes vides sont ignorées."
        >
          <TextArea
            id="seo-keywords"
            rows={Math.max(4, (seo.keywords?.length ?? 0) + 1)}
            value={(seo.keywords ?? []).join("\n")}
            onChange={(e) =>
              update(
                "seo.keywords",
                e.target.value
                  .split("\n")
                  .map((s) => s.trim())
                  .filter(Boolean),
              )
            }
          />
        </Field>
      </Card>

      <Card className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white/50">
            Titre et description page par page
          </h3>
          <p className="mt-1 text-xs text-white/40">
            Ce qui apparaît dans l&apos;onglet du navigateur et dans les résultats
            Google pour chaque page du site.
          </p>
        </div>

        {PAGES.map(({ key, label }) => (
          <div
            key={key}
            className="space-y-3 rounded-xl border border-white/10 bg-black/20 p-4"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
              {label}
            </p>
            <Field label="Titre de l'onglet" htmlFor={`seo-${key}-title`}>
              <TextInput
                id={`seo-${key}-title`}
                value={pages[key]?.title ?? ""}
                onChange={(e) => update(`seo.pages.${key}.title`, e.target.value)}
              />
            </Field>
            <Field label="Description Google" htmlFor={`seo-${key}-description`}>
              <TextArea
                id={`seo-${key}-description`}
                rows={3}
                value={pages[key]?.description ?? ""}
                onChange={(e) =>
                  update(`seo.pages.${key}.description`, e.target.value)
                }
              />
            </Field>
          </div>
        ))}
      </Card>
    </div>
  );
}
