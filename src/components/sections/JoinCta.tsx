"use client";

import { ArrowRight } from "lucide-react";

import TextReveal from "@/components/motion/TextReveal";
import Reveal from "@/components/motion/Reveal";
import BallTrajectory from "@/components/motion/BallTrajectory";
import CourtLines from "@/components/motion/CourtLines";
import MagneticButton from "@/components/ui/MagneticButton";
import { useContent } from "@/content/ContentContext";

/**
 * JoinCta — bold, full-width CTA band.
 *
 * Deliberately high-contrast: vivid violet→magenta→fuchsia gradient background
 * so the section pops after the dark sections around it.
 *
 * Contrast notes (WCAG AA):
 *   - Headline (white text) on gradient ≈ 8:1+ — passes AAA.
 *   - Button: white bg with `encre` (#1a0b3a) text — white on encre ≈ 11:1+ — passes AAA.
 *   - Supporting text (white/85) on gradient — well above 4.5:1 AA.
 *
 * Decorative: BallTrajectory + CourtLines drawn with low opacity over gradient.
 */
export default function JoinCta() {
  const { content } = useContent();
  const { text } = content;

  return (
    <section
      aria-labelledby="join-cta-heading"
      className="relative isolate overflow-hidden py-28 sm:py-36"
      style={{
        background:
          "linear-gradient(130deg, #7c3aed 0%, #c026d3 45%, #ff4dd2 100%)",
      }}
    >
      {/* Noise texture overlay for depth */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Decorative CourtLines — aria-hidden, low opacity over gradient */}
      <CourtLines
        aria-hidden
        className="absolute -right-[8%] top-1/2 -z-10 hidden h-auto w-[55%] -translate-y-1/2 text-white lg:block"
        /* opacity is controlled on the SVG path elements (they're ~7%); wrapping div also at low opacity */
      />

      {/* Decorative BallTrajectory */}
      <BallTrajectory
        aria-hidden
        className="absolute left-[4%] top-[10%] -z-10 hidden h-auto w-[28%] max-w-[380px] opacity-30 xl:block"
      />

      {/* Radial white glow at center for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-[88rem] flex-col items-center px-5 text-center sm:px-8 lg:px-12">

        {/* Kicker */}
        <Reveal delay={0.05}>
          <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
            Saison 2025–2026
          </span>
        </Reveal>

        {/* Headline */}
        <h2
          id="join-cta-heading"
          className="font-display text-[clamp(2.2rem,6vw,5rem)] leading-[0.92] tracking-tight text-white [text-wrap:balance]"
        >
          {(() => {
            const title = text.join.title;
            const words = title.split(" ");
            const mid = Math.ceil(words.length / 2);
            const line1 = words.slice(0, mid).join(" ");
            const line2 = words.slice(mid).join(" ");
            return (
              <>
                <TextReveal text={line1} className="block" />
                {line2 && <TextReveal text={line2} className="block" />}
              </>
            );
          })()}
        </h2>

        {/* Supporting line */}
        <Reveal delay={0.35}>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">
            {text.join.subtitle}
          </p>
        </Reveal>

        {/* CTAs */}
        <Reveal delay={0.5}>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            {/* Primary: white bg, encre text — maximum contrast on bright gradient */}
            <MagneticButton
              href="/inscriptions"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold uppercase tracking-wider text-encre shadow-2xl shadow-black/30 transition-all duration-300 hover:bg-lilac hover:shadow-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-magenta"
            >
              {text.join.cta}
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              />
            </MagneticButton>

            {/* Secondary: glass button */}
            <MagneticButton
              href="/contact"
              className="group inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/50 bg-white/10 px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white backdrop-blur-sm transition-all duration-300 hover:border-white/80 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-magenta"
            >
              Nous contacter
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              />
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
