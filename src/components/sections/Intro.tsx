"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";

import Reveal from "@/components/motion/Reveal";
import TextReveal from "@/components/motion/TextReveal";
import AnimatedGradient from "@/components/motion/AnimatedGradient";
import CourtLines from "@/components/motion/CourtLines";
import ParallaxImage from "@/components/motion/ParallaxImage";
import ScrollBall from "@/components/motion/ScrollBall";
import TiltCard from "@/components/ui/TiltCard";
import MagneticButton from "@/components/ui/MagneticButton";
import { useContent } from "@/content/ContentContext";

export default function Intro() {
  const { content } = useContent();
  const { club, text } = content;
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="intro-heading"
      className="relative isolate overflow-hidden bg-ink py-24 sm:py-32 lg:py-40"
    >
      {/* ── Decorative background ─────────────────────────────────────────── */}
      <AnimatedGradient className="opacity-30" />

      {/* Faint court lines — top-left accent */}
      <CourtLines
        className="absolute -left-[8%] top-1/2 -z-10 hidden w-[42%] -translate-y-1/2 text-violet-700 opacity-50 lg:block"
      />

      {/* Scroll-driven volleyball — drifts in the top-right margin */}
      <ScrollBall className="absolute -right-10 top-12 -z-10 hidden h-28 w-28 opacity-20 lg:block xl:h-36 xl:w-36" />

      {/* Noise grain layer */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ── Content grid ──────────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto grid max-w-[88rem] grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-12">

        {/* ── Left: text column ───────────────────────────────────────────── */}
        <div className="order-2 lg:order-1">

          {/* Kicker */}
          <Reveal delay={0.05}>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-gradient-to-r from-violet-700 to-fuchsia-vcm" aria-hidden />
              <span className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-fuchsia-vcm">
                {text.intro.kicker}
              </span>
            </div>
          </Reveal>

          {/* Headline — uses TextReveal for staggered word entrance */}
          <h2
            id="intro-heading"
            className="font-display text-[clamp(2rem,5vw,3.75rem)] leading-[0.95] tracking-tight text-white [text-wrap:balance]"
          >
            <TextReveal
              text={text.intro.title}
              className="block"
            />
            {text.intro.titleAccent && (
              <span className="mt-1 block">
                <TextReveal
                  text={text.intro.titleAccent}
                  className="block"
                  wordClassName="text-gradient"
                />
              </span>
            )}
          </h2>

          {/* Body copy */}
          <Reveal delay={0.25}>
            <p className="mt-7 max-w-lg text-base leading-relaxed text-white/75 sm:text-[1.05rem]">
              {text.intro.body}
            </p>
          </Reveal>

          {/* Location badge */}
          <Reveal delay={0.35}>
            <div className="mt-5 flex items-center gap-2">
              <MapPin className="size-4 text-fuchsia-vcm" aria-hidden />
              <span className="text-sm text-white/70">
                {club.address.venue} · {club.address.city}
              </span>
            </div>
          </Reveal>

          {/* CTA */}
          <Reveal delay={0.45}>
            <div className="mt-9">
              <MagneticButton
                href="/histoire"
                className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-violet-700 via-magenta to-fuchsia-vcm px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white shadow-xl shadow-magenta/25 transition-shadow duration-300 hover:shadow-magenta/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                {text.intro.cta}
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden
                />
              </MagneticButton>
            </div>
          </Reveal>
        </div>

        {/* ── Right: image column ──────────────────────────────────────────── */}
        <div className="relative order-1 lg:order-2">

          {/* Decorative glow blob behind the image */}
          <div
            aria-hidden
            className="absolute -inset-10 -z-10 rounded-full opacity-30 blur-3xl"
            style={{
              background:
                "radial-gradient(ellipse, rgba(124,58,237,0.55) 0%, rgba(192,38,211,0.3) 50%, transparent 70%)",
            }}
          />

          {/* Decorative geometric accent — top-right corner */}
          <motion.div
            aria-hidden
            className="absolute -right-4 -top-4 z-10 h-16 w-16 rounded-full border border-fuchsia-vcm/30"
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            aria-hidden
            className="absolute -right-4 -top-4 z-10 h-16 w-16 rounded-full border border-violet-700/20"
            style={{ borderStyle: "dashed" }}
            animate={reduce ? undefined : { rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />

          {/* Floating dot accent — bottom-left */}
          <div
            aria-hidden
            className="absolute -bottom-3 -left-3 z-10 h-5 w-5 rounded-full bg-gradient-to-br from-violet-700 to-fuchsia-vcm shadow-lg shadow-magenta/50"
          />

          {/* Image inside TiltCard */}
          <Reveal delay={0.1}>
            <TiltCard className="relative overflow-hidden rounded-3xl shadow-2xl shadow-black/60">
              {/* Inner gradient overlay at bottom */}
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 z-10 h-1/3 bg-gradient-to-t from-night/70 to-transparent"
              />

              <ParallaxImage className="aspect-[4/3] w-full" amount={24}>
                <Image
                  src={text.intro.image || "/images/gallery/1.jpg"}
                  alt={text.intro.imageCaption ?? club.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              </ParallaxImage>

              {/* Floating caption badge */}
              <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 rounded-full border border-white/15 bg-black/55 px-4 py-2 backdrop-blur-md">
                <span className="h-2 w-2 animate-pulse rounded-full bg-fuchsia-vcm" aria-hidden />
                <span className="text-xs font-medium text-white/85">
                  {text.intro.imageCaption ?? "Saison 2024–2025"}
                </span>
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
