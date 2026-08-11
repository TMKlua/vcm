import type { Metadata } from "next";
import "./globals.css";
import { display, sans } from "@/lib/fonts";
import { ContentProvider } from "@/content/ContentContext";
import { getContent } from "@/content/store";
import { metadataFor, SITE_URL } from "@/lib/seo";

/* ── Root metadata ──────────────────────────────────────────────────────────── */

/**
 * Titre d'onglet, description Google, image de partage et favicon.
 *
 * Tout vient de `content.seo`, éditable depuis /admin (section
 * « Référencement & favicon »). Les valeurs livrées avec le site reproduisent à
 * l'identique les métadonnées qui étaient figées ici auparavant.
 */
export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getContent();
  // Sans clé de page : la racine porte le titre de l'accueil ET le gabarit
  // « %s · … » appliqué aux pages internes.
  return metadataFor(content, undefined, "/");
}

/* ── JSON-LD SportsClub structured data ─────────────────────────────────────── */

/* ── Root layout ────────────────────────────────────────────────────────────── */

/**
 * Render every page per request.
 *
 * Without this Next prerenders the tree at build time and bakes in whatever
 * content existed then — an edit would only appear after a redeploy, which is
 * precisely the bug this architecture removes. Reading the blob per request is
 * what makes a save visible everywhere immediately.
 */
export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Resolved on the server, for every request: this is what makes an edit made
  // on one device show up for every visitor on every other device.
  const { content, etag, updatedAt } = await getContent();
  const { club, seo } = content;

  // Données structurées bâties sur le contenu publié, pas sur les valeurs du
  // code : renommer le club ou changer son logo depuis /admin se répercute
  // aussi sur ce que Google affiche.
  const logo = seo?.favicon?.trim() || club.logo?.trim() || "/icon.png";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsClub",
    name: club.name,
    sport: "Volleyball",
    url: SITE_URL,
    logo: logo.startsWith("http") ? logo : `${SITE_URL}${logo}`,
    telephone: club.contact.phone,
    email: club.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: club.address.street,
      addressLocality: club.address.city,
      postalCode: club.address.postalCode,
      addressCountry: "FR",
    },
    sameAs: [
      club.socials.facebook,
      club.socials.instagram,
      club.socials.website,
    ].filter(Boolean),
  };

  return (
    <html lang="fr" className={`${display.variable} ${sans.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* ContentProvider wraps BOTH the public site and /admin so the admin
            can edit content and the public site reflects the changes. */}
        <ContentProvider content={content} etag={etag} updatedAt={updatedAt}>
          {children}
        </ContentProvider>
      </body>
    </html>
  );
}
