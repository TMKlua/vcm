"use client";

import { MapPin, Phone, Mail, Globe } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import Section from "@/components/layout/Section";
import Reveal from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import CourtLines from "@/components/motion/CourtLines";
import ContactForm from "@/components/sections/ContactForm";
import ClubMap from "@/components/ui/ClubMap";
import { useContent } from "@/content/ContentContext";
import { useNavLabel } from "@/data/useNavLinks";

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Strip spaces from a French phone number to produce a valid tel: href. */
function toTelHref(phone: string): string {
  // "06 81 82 26 60" → "+33681822660"
  const digits = phone.replace(/\s/g, "");
  if (digits.startsWith("0")) return `+33${digits.slice(1)}`;
  return digits;
}

// ── Instagram SVG icon (lucide has no Instagram) ──────────────────────────────

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <rect x="2" y="2" width="20" height="20" rx="5.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

// ── Facebook SVG icon (lucide has no Facebook) ────────────────────────────────

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M22 12a10 10 0 1 0-11.563 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988A10.003 10.003 0 0 0 22 12z" />
    </svg>
  );
}

// ── Contact info items ────────────────────────────────────────────────────────

const InfoRow = ({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-start gap-4">
    <span
      aria-hidden
      className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-violet-700/15"
    >
      <Icon className="size-4 text-violet-400" />
    </span>
    <div>
      <p className="mb-0.5 text-[0.7rem] font-semibold uppercase tracking-wider text-white/70">
        {label}
      </p>
      {children}
    </div>
  </div>
);

// ── View ──────────────────────────────────────────────────────────────────────

export default function ContactView() {
  const { content } = useContent();
  const { contact, address, socials, schedule } = content.club;
  const t = content.text.pages.contact;
  const breadcrumbLabel = useNavLabel("contact", "Contact");
  const telHref = `tel:${toTelHref(contact.phone)}`;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <PageHero
        kicker={t.heroKicker}
        title={t.heroTitle}
        subtitle={t.heroSubtitle}
        breadcrumb={[
          { label: content.text.ui?.breadcrumbHome ?? "Accueil", href: "/" },
          { label: breadcrumbLabel, href: "/contact" },
        ]}
      />

      {/* ── Main section: info + form ─────────────────────────────────────── */}
      <Section tone="dark" id="contact" className="relative isolate overflow-hidden">
        {/* Faint court-lines blueprint — right side, clipped by the section */}
        <CourtLines className="pointer-events-none absolute -right-[8%] top-1/2 -z-10 hidden w-[44%] -translate-y-1/2 text-violet-500 opacity-50 lg:block" />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20 lg:items-start">

          {/* ── LEFT: contact info card ──────────────────────────────────── */}
          <div className="flex flex-col gap-10">

            {/* Kicker */}
            <Reveal delay={0}>
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="h-px w-8 bg-gradient-to-r from-violet-700 to-fuchsia-vcm"
                />
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-fuchsia-vcm">
                  {t.contactsHeading ?? "Nos coordonnées"}
                </span>
              </div>
            </Reveal>

            {/* Heading */}
            <Reveal delay={0.06}>
              <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] leading-[0.95] tracking-tight text-white [text-wrap:balance]">
                {t.infoHeading}
              </h2>
            </Reveal>

            {/* Info card */}
            <Reveal delay={0.12}>
              <div className="rounded-2xl border border-white/10 bg-night/80 p-8 shadow-xl shadow-black/30">
                <StaggerGroup className="flex flex-col gap-7">

                  {/* Address */}
                  <StaggerItem>
                    <InfoRow icon={MapPin} label={content.text.ui?.addressLabel ?? "Adresse"}>
                      <address className="not-italic text-sm leading-relaxed text-white/75">
                        <strong className="text-white">{address.venue}</strong>
                        <br />
                        {address.street}
                        <br />
                        {address.postalCode} {address.city}
                      </address>
                    </InfoRow>
                  </StaggerItem>

                  {/* Contact person & phone */}
                  <StaggerItem>
                    <InfoRow icon={Phone} label={content.text.ui?.phoneLabel ?? "Téléphone"}>
                      <p className="text-sm text-white/75">
                        <span className="text-white/70">{t.contactPersonLabel ?? "Contact"} : </span>
                        <strong className="text-white">{contact.person}</strong>
                      </p>
                      <a
                        href={telHref}
                        className="mt-1 inline-block text-sm font-medium text-violet-400 underline-offset-4 transition-colors hover:text-fuchsia-vcm hover:underline focus-visible:outline-none focus-visible:underline"
                        aria-label={`Appeler ${contact.person} au ${contact.phone}`}
                      >
                        {contact.phone}
                      </a>
                    </InfoRow>
                  </StaggerItem>

                  {/* Email */}
                  <StaggerItem>
                    <InfoRow icon={Mail} label={content.text.ui?.emailLabel ?? "Email"}>
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-sm font-medium text-violet-400 underline-offset-4 transition-colors hover:text-fuchsia-vcm hover:underline focus-visible:outline-none focus-visible:underline"
                        aria-label={`Envoyer un email à ${contact.email}`}
                      >
                        {contact.email}
                      </a>
                    </InfoRow>
                  </StaggerItem>

                  {/* Schedule */}
                  <StaggerItem>
                    <div className="flex items-start gap-4">
                      <span
                        aria-hidden
                        className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-violet-700/15"
                      >
                        {/* Clock icon inline */}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="size-4 text-violet-400" aria-hidden="true">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      </span>
                      <div>
                        <p className="mb-0.5 text-[0.7rem] font-semibold uppercase tracking-wider text-white/70">
                          {t.scheduleLabel ?? "Entraînements"}
                        </p>
                        <p className="text-sm text-white/75">
                          <strong className="text-white">{schedule}</strong>
                        </p>
                        <p className="mt-0.5 text-xs text-white/70">
                          {[content.text.ui?.venuePrefix ?? "Au", address.venue]
                            .filter(Boolean)
                            .join(" ")}
                        </p>
                      </div>
                    </div>
                  </StaggerItem>

                </StaggerGroup>
              </div>
            </Reveal>

            {/* Social links */}
            <Reveal delay={0.2}>
              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/70">
                  {t.socialsHeading ?? "Suivez-nous"}
                </p>
                <div className="flex flex-wrap gap-3">
                  {/* Facebook */}
                  <a
                    href={socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Page Facebook du Volley Club Marseillanais"
                    className="group flex items-center gap-2 rounded-xl border border-white/10 bg-night/60 px-4 py-2.5 text-xs font-medium text-white/60 transition-all duration-200 hover:border-violet-500/40 hover:bg-violet-700/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60"
                  >
                    <FacebookIcon className="size-4 text-white/50 group-hover:text-fuchsia-vcm transition-colors" />
                    {content.text.ui?.socialFacebook ?? "Facebook"}
                  </a>

                  {/* Instagram */}
                  {socials.instagram && (
                    <a
                      href={socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Page Instagram du Volley Club Marseillanais"
                      className="group flex items-center gap-2 rounded-xl border border-white/10 bg-night/60 px-4 py-2.5 text-xs font-medium text-white/60 transition-all duration-200 hover:border-violet-500/40 hover:bg-violet-700/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60"
                    >
                      <InstagramIcon className="size-4 text-white/50 group-hover:text-fuchsia-vcm transition-colors" />
                      {content.text.ui?.socialInstagram ?? "Instagram"}
                    </a>
                  )}

                  {/* Website */}
                  <a
                    href={socials.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Site officiel du Volley Club Marseillanais"
                    className="group flex items-center gap-2 rounded-xl border border-white/10 bg-night/60 px-4 py-2.5 text-xs font-medium text-white/60 transition-all duration-200 hover:border-violet-500/40 hover:bg-violet-700/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60"
                  >
                    <Globe className="size-4 text-white/50 group-hover:text-fuchsia-vcm transition-colors" aria-hidden />
                    {content.text.ui?.socialWebsite ?? "Site officiel"}
                  </a>

                  {/* Clubeo */}
                  <a
                    href={socials.clubeo}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Page Clubeo du Volley Club Marseillanais"
                    className="group flex items-center gap-2 rounded-xl border border-white/10 bg-night/60 px-4 py-2.5 text-xs font-medium text-white/60 transition-all duration-200 hover:border-violet-500/40 hover:bg-violet-700/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60"
                  >
                    <Globe className="size-4 text-white/50 group-hover:text-fuchsia-vcm transition-colors" aria-hidden />
                    {content.text.ui?.clubeoLabel ?? "Clubeo"}
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          {/* ── RIGHT: contact form ──────────────────────────────────────── */}
          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </Section>

      {/* ── Map section ───────────────────────────────────────────────────── */}
      <Section tone="dark" id="localisation" className="pt-0 sm:pt-0">
        {/* Divider */}
        <div
          aria-hidden
          className="mb-12 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />

        <Reveal delay={0}>
          <div className="mb-8 flex items-center gap-3">
            <span
              aria-hidden
              className="h-px w-8 bg-gradient-to-r from-violet-700 to-fuchsia-vcm"
            />
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-fuchsia-vcm">
              {t.mapKicker ?? "Localisation"}
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="mb-8 font-display text-[clamp(1.6rem,3.5vw,2.6rem)] leading-[0.95] tracking-tight text-white">
            {t.mapHeading}
          </h2>
        </Reveal>

        {/* Carte Google Maps — même composant que l'accueil */}
        <Reveal delay={0.15}>
          <ClubMap
            address={address}
            directionsLabel={content.text.ui?.mapDirections}
            frameClassName="h-[280px] sm:h-[360px] lg:h-[420px]"
          />
        </Reveal>
      </Section>
    </>
  );
}
