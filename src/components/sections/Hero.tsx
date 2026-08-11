"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown, MapPin, Sparkles } from "lucide-react";

import TextReveal from "@/components/motion/TextReveal";
import AnimatedGradient from "@/components/motion/AnimatedGradient";
import CourtLines from "@/components/motion/CourtLines";
import Volleyball from "@/components/motion/Volleyball";
import MagneticButton from "@/components/ui/MagneticButton";
import { useContent } from "@/content/ContentContext";

/* Choreographed mount easing — coordinated with the global Loader (~1.4s). */
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Hero — immersive, full-viewport centerpiece of the VCM site.
 *
 * Layers (back → front):
 *   1. Parallax hero photograph (next/image, fill, priority)
 *   2. Dark violet gradient overlays (bottom + left) + grain vignette
 *   3. Decorative motion: AnimatedGradient blobs, CourtLines, BallTrajectory
 *   4. Foreground content: kicker · headline · supporting line · CTAs
 *   5. Scroll indicator (bottom centre)
 *
 * Respects prefers-reduced-motion: parallax disabled, entrance reduced to a
 * gentle opacity fade, looping indicator held static.
 */
export default function Hero() {
  const { content } = useContent();
  const { club, text } = content;
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // The hero ball stays invisible (but measurable) until the loader's ball has
  // flown onto it — so there's never two balls on screen at once.
  const [ballRevealed, setBallRevealed] = useState(false);
  useEffect(() => {
    const reveal = () => setBallRevealed(true);
    window.addEventListener("vcm:loader-landed", reveal);
    // Safety: if the loader event is missed, reveal anyway.
    const fb = setTimeout(reveal, 4500);
    return () => {
      window.removeEventListener("vcm:loader-landed", reveal);
      clearTimeout(fb);
    };
  }, []);

  // Scroll-linked parallax for the background image.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  // When reduced motion is requested, collapse the parallax range to identity.
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, reduce ? 1.05 : 1.18]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.15]);

  return (
    <section
      ref={sectionRef}
      aria-label={`${club.name} - accueil`}
      className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden bg-ink"
    >
      {/* ── Layer 1: parallax background photo ──────────────────────────── */}
      <motion.div
        aria-hidden
        style={{ y, scale }}
        className="absolute inset-0 -z-30 will-change-transform"
      >
        <Image
          src={text.hero.image || "/images/hero/hero-1.jpg"}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      {/* ── Layer 2: gradient overlays + grain for legibility ───────────── */}
      {/* Bottom-up ink wash so the headline floor stays readable. */}
      <motion.div
        aria-hidden
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 -z-20 bg-gradient-to-t from-ink via-ink/55 to-ink/15"
      />
      {/* Left-anchored violet wash — supports the left-aligned content column. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-gradient-to-r from-night/85 via-ink/35 to-transparent"
      />
      {/* Top fade so the transparent navbar reads cleanly over the photo. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-20 h-40 bg-gradient-to-b from-ink/80 to-transparent"
      />
      {/* Radial vignette for cinematic focus. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(120% 90% at 70% 30%, transparent 40%, rgba(10,4,24,0.55) 100%)",
        }}
      />
      {/* Fine grain texture. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.18] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ── Layer 3: decorative motion ──────────────────────────────────── */}
      <AnimatedGradient className="-z-10 opacity-70" />
      <CourtLines className="absolute -right-[10%] top-1/2 -z-10 hidden h-auto w-[58%] -translate-y-1/2 text-fuchsia-vcm md:block" />

      {/* Hero volleyball on the right — FIXED position (no float/spin) so the
          loader ball can hand off to this exact spot, measured at runtime via
          its id for a pixel-perfect landing. */}
      <div
        id="vcm-hero-ball"
        aria-hidden
        className="absolute right-[6%] top-[36%] -z-10 hidden w-[20vmin] max-w-[260px] lg:block"
        style={{
          filter: "drop-shadow(0 24px 60px rgba(168,85,247,0.5))",
          visibility: ballRevealed ? "visible" : "hidden",
        }}
      >
        <Volleyball className="w-full" />
      </div>

      {/* ── Layer 4: foreground content ─────────────────────────────────── */}
      <div className="relative z-10 mx-auto flex w-full max-w-[88rem] flex-1 flex-col justify-center px-5 pb-28 pt-32 sm:px-8 sm:pt-36 lg:px-12 lg:pb-36">
        <div className="max-w-3xl xl:max-w-4xl">
          {/* Kicker row */}
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
            className="flex flex-wrap items-center gap-2.5"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md">
              <Sparkles className="size-3.5 text-fuchsia-vcm" aria-hidden />
              {text.hero.kicker}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-fuchsia-vcm/30 bg-fuchsia-vcm/10 px-3.5 py-1.5 text-xs font-medium text-white/85 backdrop-blur-md">
              <MapPin className="size-3.5 text-fuchsia-vcm" aria-hidden />
              {text.hero.locationChip}
            </span>
          </motion.div>

          {/* Headline — TextReveal per line; last word in brand gradient.
              The whole visual stack is aria-hidden; the h1 carries the
              accessible name so AT reads the tagline exactly once. */}
          <h1
            aria-label={club.tagline}
            className="mt-7 font-display leading-[0.92] tracking-tight text-white [text-wrap:balance]"
          >
            <span aria-hidden className="block">
              <TextReveal
                text={text.hero.titleLine1}
                className="block text-[clamp(3.25rem,11vw,9rem)]"
              />
              {/* Le dégradé est posé sur les mots, pas sur ce conteneur : sur
                  WebKit un `background-clip: text` parent ne peint rien
                  au-dessus d'un enfant transformé, et la ligne disparaissait. */}
              <span className="mt-1 block text-[clamp(3.25rem,11vw,9rem)]">
                <TextReveal
                  text={text.hero.titleLine2}
                  className="block"
                  wordClassName="text-gradient"
                />
              </span>
            </span>
          </h1>

          {/* Supporting line */}
          <motion.p
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.95 }}
            className="mt-7 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg"
          >
            {text.hero.subtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 1.15 }}
            className="mt-9 flex flex-col gap-3.5 sm:flex-row sm:items-center"
          >
            <MagneticButton
              href="/inscriptions"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-700 via-magenta to-fuchsia-vcm px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white shadow-xl shadow-magenta/30 transition-shadow duration-300 hover:shadow-magenta/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              {text.hero.ctaPrimary}
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              />
            </MagneticButton>

            <MagneticButton
              href="/histoire"
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white backdrop-blur-md transition-colors duration-300 hover:border-white/45 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              {text.hero.ctaSecondary}
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              />
            </MagneticButton>
          </motion.div>
        </div>
      </div>

      {/* ── Layer 5: scroll indicator ───────────────────────────────────── */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE, delay: 1.5 }}
        className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex flex-col items-center gap-2 sm:bottom-8"
      >
        <span className="text-[0.7rem] font-medium uppercase tracking-[0.3em] text-white/55">
          {text.hero.scrollHint ?? "Défiler"}
        </span>
        <motion.span
          animate={reduce ? undefined : { y: [0, 7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="text-white/70"
        >
          <ChevronDown className="size-5" />
        </motion.span>
      </motion.div>
    </section>
  );
}
