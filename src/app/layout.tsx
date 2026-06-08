import type { Metadata } from "next";
import "./globals.css";
import { display, sans } from "@/lib/fonts";
import SmoothScroll from "@/components/motion/SmoothScroll";
import Loader from "@/components/layout/Loader";
import Cursor from "@/components/layout/Cursor";
import ScrollProgress from "@/components/layout/ScrollProgress";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SkipLink from "@/components/ui/SkipLink";
import { club } from "@/data/club";
import { SITE_URL } from "@/lib/seo";

/* ── Root metadata ──────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Volley Club Marseillanais — Club de volley à Marseillan",
    template: "%s · Volley Club Marseillanais",
  },

  description:
    "Club de volley-ball convivial et compétitif à Marseillan, au bord de l'étang de Thau. Baby volley dès 3 ans, jeunes, loisir, compétition, beach volley et sport santé — toutes les pratiques, tous les âges.",

  keywords: [
    "volley club Marseillan",
    "VCM volleyball",
    "Volley Club Marseillanais",
    "volleyball Hérault",
    "baby volley Marseillan",
    "beach volley Marseillan",
    "sport santé volley",
    "volley étang de Thau",
    "club sportif Marseillan",
    "inscription volley Hérault",
  ],

  applicationName: "Volley Club Marseillanais",

  authors: [{ name: club.contact.person }],

  creator: club.name,

  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: club.name,
    url: "/",
    title: "Volley Club Marseillanais — Club de volley à Marseillan",
    description:
      "Club de volley-ball convivial et compétitif à Marseillan, au bord de l'étang de Thau. Baby volley dès 3 ans, jeunes, loisir, compétition, beach volley et sport santé.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Volley Club Marseillanais — Joue. Smash. Gagne.",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Volley Club Marseillanais — Club de volley à Marseillan",
    description:
      "Club de volley-ball convivial et compétitif à Marseillan, au bord de l'étang de Thau. Baby volley, beach volley, sport santé — toutes les pratiques.",
    images: ["/og-image.jpg"],
  },

  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },

  alternates: {
    canonical: "/",
  },
};

/* ── JSON-LD SportsClub structured data ─────────────────────────────────────── */

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsClub",
  name: club.name,
  sport: "Volleyball",
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
  telephone: club.contact.phone,
  email: club.contact.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: club.address.street,
    addressLocality: club.address.city,
    postalCode: club.address.postalCode,
    addressCountry: "FR",
  },
  sameAs: [club.socials.facebook, club.socials.website].filter(Boolean),
};

/* ── Root layout ────────────────────────────────────────────────────────────── */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${display.variable} ${sans.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SkipLink />
        <Loader />
        <Cursor />
        <ScrollProgress />
        <SmoothScroll>
          <Navbar />
          <main id="contenu" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
