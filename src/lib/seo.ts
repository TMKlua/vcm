import type { Metadata } from "next";

// [À CONFIRMER] domaine de production
export const SITE_URL = "https://www.volleymarseillan.com";

/**
 * pageMetadata — helper for consistent per-page metadata.
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
      images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.jpg"],
    },
  };
}
