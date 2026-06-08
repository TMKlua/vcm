"use client";

import { MapPin, Phone, Mail, Globe } from "lucide-react";
import { motion } from "framer-motion";

import Reveal from "@/components/motion/Reveal";
import MagneticButton from "@/components/ui/MagneticButton";
import { club } from "@/data/club";

/**
 * ContactQuick — condensed contact block (dark, bg-ink).
 *
 * Shows:
 *   - Address with MapPin icon
 *   - Phone as tel: link with Phone icon
 *   - Email as mailto: link with Mail icon
 *   - Social links: Globe for website; inline SVG "f" path for Facebook
 *     (lucide-react v1 has no Facebook icon — we use a minimal inline SVG)
 *   - MagneticButton "Nous contacter" → /contact
 *
 * Layout: two-column on md+ (contact info left, decorative gradient panel right)
 */

// Minimal Facebook "f" icon as inline SVG — avoids non-existent lucide Facebook import
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

export default function ContactQuick() {
  return (
    <section
      aria-labelledby="contact-quick-heading"
      className="relative isolate overflow-hidden bg-ink py-24 sm:py-32"
    >
      {/* Top separator */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-700/40 to-transparent"
      />

      {/* Atmospheric violet glow — bottom center */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-[360px] w-[640px] -translate-x-1/2 rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.8) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-12">

        {/* ── Section header ──────────────────────────────────────────────── */}
        <Reveal delay={0.05}>
          <div className="mb-12 flex items-center gap-3">
            <span className="h-px w-8 bg-gradient-to-r from-violet-700 to-fuchsia-vcm" aria-hidden />
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-fuchsia-vcm">
              Contact
            </span>
          </div>
        </Reveal>

        {/* ── Two-column layout (stacked on mobile) ───────────────────────── */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:gap-16 lg:items-center">

          {/* Left: contact info + CTA */}
          <div>
            <Reveal delay={0.1}>
              <h2
                id="contact-quick-heading"
                className="mb-8 font-display text-[clamp(1.8rem,4vw,3rem)] leading-[0.95] tracking-tight text-white"
              >
                Venez nous{" "}
                <span className="text-gradient [-webkit-text-fill-color:transparent]">
                  rejoindre
                </span>
              </h2>
            </Reveal>

            {/* Contact rows */}
            <div className="flex flex-col gap-5">

              {/* Address */}
              <Reveal delay={0.15}>
                <div className="flex items-start gap-3.5">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                    <MapPin className="size-4 text-fuchsia-vcm" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{club.address.venue}</p>
                    <p className="mt-0.5 text-sm text-white/70">
                      {club.address.street}
                    </p>
                    <p className="text-sm text-white/70">
 {club.address.city}
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* Phone */}
              <Reveal delay={0.2}>
                <div className="flex items-center gap-3.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                    <Phone className="size-4 text-fuchsia-vcm" aria-hidden />
                  </span>
                  <a
                    href={`tel:${club.contact.phone.replace(/\s/g, "")}`}
                    className="text-sm font-medium text-white/80 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:underline"
                  >
                    {club.contact.phone}
                  </a>
                </div>
              </Reveal>

              {/* Email */}
              <Reveal delay={0.25}>
                <div className="flex items-center gap-3.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                    <Mail className="size-4 text-fuchsia-vcm" aria-hidden />
                  </span>
                  <a
                    href={`mailto:${club.contact.email}`}
                    className="break-all text-sm font-medium text-white/80 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:underline"
                  >
                    {club.contact.email}
                  </a>
                </div>
              </Reveal>
            </div>

            {/* Social links */}
            <Reveal delay={0.3}>
              <div className="mt-7 flex items-center gap-3">
                {/* Website */}
                {club.socials.website && (
                  <a
                    href={club.socials.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Site officiel du VCM (nouvel onglet)"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all duration-200 hover:border-violet-500/50 hover:bg-violet-500/10 hover:text-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                  >
                    <Globe className="size-4" aria-hidden />
                  </a>
                )}

                {/* Facebook — inline SVG icon (lucide-react has no Facebook icon) */}
                {club.socials.facebook && (
                  <a
                    href={club.socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Page Facebook du VCM (nouvel onglet)"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all duration-200 hover:border-blue-400/50 hover:bg-blue-400/10 hover:text-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                  >
                    <FacebookIcon className="size-4" />
                  </a>
                )}

                {/* Clubeo */}
                {club.socials.clubeo && (
                  <a
                    href={club.socials.clubeo}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="VCM sur Clubeo (nouvel onglet)"
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white/70 transition-all duration-200 hover:border-fuchsia-vcm/40 hover:bg-fuchsia-vcm/10 hover:text-fuchsia-vcm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                  >
                    Clubeo
                  </a>
                )}
              </div>
            </Reveal>

            {/* CTA */}
            <Reveal delay={0.35}>
              <div className="mt-9">
                <MagneticButton
                  href="/contact"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-700 via-magenta to-fuchsia-vcm px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white shadow-xl shadow-magenta/25 transition-shadow duration-300 hover:shadow-magenta/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                >
                  Nous contacter
                  <Mail className="size-4" aria-hidden />
                </MagneticButton>
              </div>
            </Reveal>
          </div>

          {/* Right: decorative gradient panel */}
          <Reveal delay={0.2}>
            <motion.div
              className="relative hidden overflow-hidden rounded-3xl border border-white/10 bg-night md:block"
              style={{ minHeight: "22rem" }}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.4, ease: [0.25, 0, 0, 1] }}
            >
              {/* Gradient mesh background */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(135deg, #15082e 0%, #1a0b3a 40%, rgba(124,58,237,0.25) 80%, rgba(192,38,211,0.2) 100%)",
                }}
              />

              {/* Subtle court grid lines overlay */}
              <svg
                aria-hidden
                className="absolute inset-0 h-full w-full opacity-[0.06] text-violet-500"
                viewBox="0 0 400 280"
                fill="none"
                preserveAspectRatio="xMidYMid slice"
              >
                {/* Horizontal lines */}
                {[40, 100, 140, 180, 240].map((y) => (
                  <line key={y} x1="20" y1={y} x2="380" y2={y} stroke="currentColor" strokeWidth="1" />
                ))}
                {/* Vertical lines */}
                {[60, 140, 200, 260, 340].map((x) => (
                  <line key={x} x1={x} y1="20" x2={x} y2="260" stroke="currentColor" strokeWidth="1" />
                ))}
                {/* Center/net */}
                <line x1="200" y1="20" x2="200" y2="260" stroke="currentColor" strokeWidth="2" strokeDasharray="6 5" />
              </svg>

              {/* Club info overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 text-center">
                <span className="font-display text-4xl text-white/10 select-none">VCM</span>
                <div className="h-px w-20 bg-gradient-to-r from-transparent via-fuchsia-vcm/40 to-transparent" aria-hidden />
                <p className="text-sm font-medium text-white/75">
                  Gymnase Louis Boudou
                </p>
                <p className="text-xs text-white/60">
                      {club.address.postalCode} Marseillan · Hérault
                </p>
                <div className="mt-4 h-px w-20 bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" aria-hidden />
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-fuchsia-vcm/70">
                  {club.schedule}
                </p>
              </div>
            </motion.div>
          </Reveal>
        </div>
      </div>

      {/* Bottom separator */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-700/30 to-transparent"
      />
    </section>
  );
}
