"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import Reveal from "@/components/motion/Reveal";
import MagneticButton from "@/components/ui/MagneticButton";
import { useContent } from "@/content/ContentContext";

/**
 * PartnersStrip — partners/sponsors section.
 *
 * Design:
 *   - bg-ink, dark tone, subtle grid/separator borders.
 *   - Logos displayed grayscale + low opacity by default; full-color + full opacity on hover.
 *   - If the partner has a `url`, its logo is wrapped in an anchor (target=_blank).
 *   - Optionally a subtle marquee-style motion on desktop (respects reduced-motion: static row).
 *   - Tier labels: "institutionnel", "principal", "officiel" grouped and labeled.
 */

// Tier display labels — repli si le contenu ne fournit rien.
const TIER_LABELS: Record<string, string> = {
  institutionnel: "Partenaires institutionnels",
  principal: "Partenaire principal",
  officiel: "Partenaires officiels",
};

// Group partners by tier for display
const tierOrder: Array<"institutionnel" | "principal" | "officiel"> = [
  "institutionnel",
  "principal",
  "officiel",
];

export default function PartnersStrip() {
  const { content } = useContent();
  const { partners, text } = content;
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="partners-heading"
      className="relative isolate overflow-hidden bg-ink py-24 sm:py-32"
    >
      {/* Top separator */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-700/40 to-transparent"
      />

      {/* Subtle glow right */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-1/2 -z-10 h-[400px] w-[400px] -translate-y-1/2 rounded-full opacity-10 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(168,85,247,0.9) 0%, transparent 65%)" }}
      />

      <div className="relative z-10 mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-12">

        {/* ── Section header ──────────────────────────────────────────────── */}
        <div className="mb-14 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div className="max-w-xl">
            <Reveal delay={0.05}>
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-8 bg-gradient-to-r from-violet-700 to-fuchsia-vcm" aria-hidden />
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-fuchsia-vcm">
                  {text.partners.kicker}
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h2
                id="partners-heading"
                className="font-display text-[clamp(1.9rem,4.5vw,3.5rem)] leading-[0.95] tracking-tight text-white"
              >
                {(() => {
                  const title = text.partners.title;
                  const lastSpace = title.lastIndexOf(" ");
                  const titleMain = lastSpace > 0 ? title.slice(0, lastSpace) : title;
                  const titleAccent = lastSpace > 0 ? title.slice(lastSpace + 1) : "";
                  return (
                    <>
                      {titleMain}{" "}
                      {titleAccent && (
                        <span className="text-gradient [-webkit-text-fill-color:transparent]">
                          {titleAccent}
                        </span>
                      )}
                    </>
                  );
                })()}
              </h2>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <MagneticButton
              href="/partenaires"
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm transition-colors duration-300 hover:border-white/35 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              {text.partners.cta}
              <ArrowRight
                className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              />
            </MagneticButton>
          </Reveal>
        </div>

        {/* ── Partners by tier ─────────────────────────────────────────────── */}
        <div className="flex flex-col gap-12">
          {tierOrder.map((tier) => {
            const tierPartners = partners.filter((p) => p.tier === tier);
            if (tierPartners.length === 0) return null;

            return (
              <div key={tier}>
                {/* Tier label */}
                <Reveal delay={0.05}>
                  <p className="mb-6 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-white/70">
                    {text.ui?.partnerTierTitles?.[tier] || TIER_LABELS[tier]}
                  </p>
                </Reveal>

                {/* Logos row */}
                <div
                  className={[
                    "flex flex-wrap items-center gap-6 sm:gap-8 lg:gap-10",
                    tier === "principal" ? "justify-center" : "justify-start",
                  ].join(" ")}
                >
                  {tierPartners.map((partner, i) => {
                    const logoEl = (
                      <motion.div
                        key={partner.name}
                        className="relative flex items-center justify-center"
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{
                          duration: 0.5,
                          delay: reduce ? 0 : i * 0.07,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        whileHover={reduce ? undefined : { scale: 1.05 }}
                      >
                        {/* Grayscale → color on hover (CSS filter approach) */}
                        <div
                          className="
                            group relative flex items-center justify-center
                            rounded-xl border border-white/8 bg-white/4
                            px-6 py-4 transition-all duration-400
                            grayscale opacity-70
                            hover:grayscale-0 hover:opacity-100 hover:border-white/15 hover:bg-white/8
                            focus-within:grayscale-0 focus-within:opacity-100
                          "
                          style={{ minWidth: "9rem" }}
                        >
                          <Image
                            src={partner.logo}
                            alt={partner.name}
                            width={200}
                            height={60}
                            style={{ height: "auto", maxHeight: "3.5rem", width: "auto", maxWidth: "10rem" }}
                            className="object-contain"
                          />
                        </div>
                      </motion.div>
                    );

                    if (partner.url) {
                      return (
                        <a
                          key={partner.name}
                          href={partner.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${partner.name} — site officiel (nouvel onglet)`}
                          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink rounded-xl"
                        >
                          {logoEl}
                        </a>
                      );
                    }

                    return (
                      <div key={partner.name} aria-label={partner.name}>
                        {logoEl}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
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
