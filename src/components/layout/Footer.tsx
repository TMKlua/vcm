"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, Globe, Volleyball } from "lucide-react";
import { navLinks } from "@/data/nav";
import CourtLines from "@/components/motion/CourtLines";
import { useContent } from "@/content/ContentContext";

/** Inline Facebook glyph (lucide v1 dropped brand icons). */
function FacebookGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.5-3.91 3.78-3.91 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.9h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
    </svg>
  );
}

/** Inline Instagram glyph (lucide v1 dropped brand icons). */
function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

const FOOTER_TEAM_SLUGS = ["baby-volley", "jeunes", "loisir", "competition", "beach-volley"];

export default function Footer() {
  const { content } = useContent();
  const { club, teams, text } = content;
  const year = new Date().getFullYear();
  const { address, contact, socials } = club;

  const footerTeams = FOOTER_TEAM_SLUGS
    .map((slug) => teams.find((t) => t.slug === slug))
    .filter((t): t is typeof teams[number] => Boolean(t));

  return (
    <footer className="relative isolate overflow-hidden border-t border-white/10 bg-night text-white/70">
      {/* top accent: court blueprint + gradient line */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-vcm/60 to-transparent"
      />
      <CourtLines className="pointer-events-none absolute -top-10 right-0 hidden h-64 w-[34rem] text-fuchsia-vcm/40 md:block" />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-violet-700/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <Link
              href="/"
              aria-label={`${club.name} — accueil`}
              className="group inline-flex items-center gap-2.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70"
            >
              <span className="relative grid size-10 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-violet-700 via-magenta to-fuchsia-vcm shadow-lg shadow-magenta/30">
                <span aria-hidden className="absolute -right-2 -top-2 size-6 rounded-full bg-white/25 blur-md" />
                <Volleyball className="relative size-5 text-white" aria-hidden />
              </span>
              <span className="font-display text-2xl uppercase leading-none tracking-tight text-white">
                VCM
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
              <span className="font-display text-lg uppercase tracking-wide text-gradient">
                {text.footer.tagline}
              </span>
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/70">
              {club.name}, au bord de l&rsquo;étang de Thau.
            </p>

            <div className="mt-5 flex items-center gap-3">
              {socials.facebook && (
                <a
                  href={socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook du VCM"
                  className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white/80 outline-none transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70"
                >
                  <FacebookGlyph className="size-4.5" />
                </a>
              )}
              {socials.instagram && (
                <a
                  href={socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram du VCM"
                  className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white/80 outline-none transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70"
                >
                  <InstagramGlyph className="size-4.5" />
                </a>
              )}
              {socials.website && (
                <a
                  href={socials.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Site officiel du VCM"
                  className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white/80 outline-none transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70"
                >
                  <Globe className="size-4.5" aria-hidden />
                </a>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav aria-label="Navigation du pied de page">
            <h2 className="font-display text-sm uppercase tracking-widest text-white">
              Navigation
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-block text-white/60 outline-none transition-colors hover:text-white focus-visible:text-fuchsia-vcm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Pratiques */}
          <nav aria-label="Nos pratiques">
            <h2 className="font-display text-sm uppercase tracking-widest text-white">
              Nos pratiques
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {footerTeams.map((team) => (
                <li key={team.slug}>
                  <Link
                    href={`/equipes#${team.slug}`}
                    className="inline-block text-white/60 outline-none transition-colors hover:text-white focus-visible:text-fuchsia-vcm"
                  >
                    {team.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className="font-display text-sm uppercase tracking-widest text-white">
              Contact
            </h2>
            <address className="mt-4 space-y-3 text-sm not-italic">
              <p className="flex items-start gap-2.5 text-white/60">
                <MapPin className="mt-0.5 size-4 shrink-0 text-fuchsia-vcm" aria-hidden />
                <span>
                  {address.venue}
                  <br />
                  {address.street}
                  <br />
                  {address.postalCode} {address.city}
                </span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-fuchsia-vcm" aria-hidden />
                <a
                  href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                  className="text-white/60 outline-none transition-colors hover:text-white focus-visible:text-fuchsia-vcm"
                >
                  {contact.phone}
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-fuchsia-vcm" aria-hidden />
                <a
                  href={`mailto:${contact.email}`}
                  className="break-all text-white/60 outline-none transition-colors hover:text-white focus-visible:text-fuchsia-vcm"
                >
                  {contact.email}
                </a>
              </p>
              <p className="pt-1 text-xs text-white/60">
                Contact&nbsp;: {contact.person}
              </p>
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/60 sm:flex-row">
          <p>© {year} {text.footer.copyright ?? "Volley Club Marseillanais. Tous droits réservés."}</p>
          <div className="flex items-center gap-5">
            <Link
              href="/contact"
              className="outline-none transition-colors hover:text-white focus-visible:text-fuchsia-vcm"
            >
              Mentions légales
            </Link>
            <span className="text-white/60">
              Conçu avec passion au bord de l&rsquo;étang de Thau.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
