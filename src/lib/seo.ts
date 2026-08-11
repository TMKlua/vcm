import type { Metadata } from "next";

import type { SeoSettings, SiteContent } from "@/content/types";

// [À CONFIRMER] domaine de production
export const SITE_URL = "https://www.volleymarseillan.com";

/** Clés des pages ayant un titre et une description propres. */
export type SeoPageKey = keyof NonNullable<SeoSettings["pages"]>;

/* ──────────────────────────────────────────────────────────────────────────
 * Métadonnées pilotées par le contenu.
 *
 * Titre d'onglet, description Google, image de partage ET favicon viennent
 * désormais de `content.seo`, éditable depuis /admin. Les valeurs livrées avec
 * le site (voir `defaultContent`) reproduisent à l'identique ce qui était
 * jusqu'ici figé dans `app/layout.tsx` et dans chaque `page.tsx` : tant que
 * rien n'est modifié dans l'admin, Google et le navigateur voient exactement la
 * même chose qu'avant.
 *
 * Les fichiers `public/icon.png`, `public/apple-icon.png` et
 * `public/favicon.ico` restent en place et servent de repli. Ils vivaient dans
 * `src/app/` : à cet endroit Next les traite comme des métadonnées de fichier,
 * qui écrasent systématiquement le champ `icons` — le favicon n'aurait donc
 * jamais pu être changé depuis l'admin sans les déplacer.
 * ────────────────────────────────────────────────────────────────────────── */

const FALLBACK_TITLE = "Volley Club Marseillanais - Club de volley à Marseillan";
const FALLBACK_TEMPLATE = "%s · Volley Club Marseillanais";
const FALLBACK_OG_IMAGE = "/og-image.jpg";
const FALLBACK_FAVICON = "/icon.png";
const FALLBACK_APPLE_ICON = "/apple-icon.png";

function clean(value: string | undefined, fallback: string): string {
  return value?.trim() ? value.trim() : fallback;
}

/** Icônes déclarées dans le <head>, favicon compris. */
export function iconsFor(seo: SeoSettings | undefined): Metadata["icons"] {
  const icon = clean(seo?.favicon, FALLBACK_FAVICON);
  const apple = clean(seo?.appleIcon, FALLBACK_APPLE_ICON);
  return {
    icon: [{ url: icon }],
    shortcut: [{ url: icon }],
    apple: [{ url: apple }],
  };
}

/**
 * Métadonnées d'une page.
 *
 * `page` absent → métadonnées racine (accueil + gabarit de titre pour les
 * autres pages). `page` fourni → titre et description propres à cette page.
 */
export function metadataFor(
  content: SiteContent,
  page?: SeoPageKey,
  path = "/",
): Metadata {
  const seo = content.seo;
  const siteName = clean(seo?.siteName, content.club.name);
  const siteDescription = clean(seo?.description, content.club.description);
  const ogImage = clean(seo?.ogImage, FALLBACK_OG_IMAGE);

  // `page` absent → métadonnées racine, qui portent aussi celles de l'accueil.
  const isRoot = page === undefined;
  const pageMeta = seo?.pages?.[page ?? "home"];

  const title = clean(
    pageMeta?.title,
    isRoot ? clean(seo?.defaultTitle, FALLBACK_TITLE) : siteName,
  );
  const description = clean(pageMeta?.description, siteDescription);

  const base: Metadata = {
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      siteName,
      url: path,
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    icons: iconsFor(seo),
  };

  if (isRoot) {
    // Seule la racine porte le gabarit `%s · …`, et son `default` est le titre
    // de l'accueil. Si l'accueil déclarait en plus son propre titre, le gabarit
    // s'appliquerait par-dessus et le suffixe apparaîtrait deux fois.
    return {
      ...base,
      metadataBase: new URL(SITE_URL),
      title: {
        default: title,
        template: clean(seo?.titleTemplate, FALLBACK_TEMPLATE),
      },
      keywords: seo?.keywords?.length ? seo.keywords : undefined,
      applicationName: siteName,
      authors: [{ name: content.club.contact.person }],
      creator: content.club.name,
    };
  }

  return { ...base, title };
}

/**
 * pageMetadata — helper historique, conservé pour ne rien casser d'existant.
 * Title is a plain string so the root layout template applies: "%s · Volley Club Marseillanais".
 * path must start with "/" (e.g. "/histoire").
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      url: path,
      title,
      description,
      images: [{ url: FALLBACK_OG_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [FALLBACK_OG_IMAGE],
    },
  };
}
