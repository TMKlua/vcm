"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import Section from "@/components/layout/Section";
import Reveal from "@/components/motion/Reveal";
import Timeline from "@/components/sections/Timeline";
import MagneticButton from "@/components/ui/MagneticButton";
import { useContent } from "@/content/ContentContext";
import { useNavLabel } from "@/data/useNavLinks";

export default function HistoireView() {
  const { content } = useContent();
  const { club, timeline, text } = content;
  const t = content.text.pages.histoire;
  const breadcrumbLabel = useNavLabel("histoire", "Histoire");

  return (
    <>
      {/* ── Page hero ──────────────────────────────────────────────────── */}
      <PageHero
        kicker={t.heroKicker}
        title={t.heroTitle}
        subtitle={t.heroSubtitle}
        breadcrumb={[
          { label: content.text.ui?.breadcrumbHome ?? "Accueil", href: "/" },
          { label: breadcrumbLabel, href: "/histoire" },
        ]}
      />

      {/* ── Storytelling intro ─────────────────────────────────────────── */}
      <Section tone="dark" id="notre-histoire">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20 lg:items-start">

          {/* Text column */}
          <div className="flex flex-col gap-8">

            {/* Kicker */}
            <Reveal delay={0}>
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="h-px w-8 bg-gradient-to-r from-violet-700 to-fuchsia-vcm"
                />
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-fuchsia-vcm">
                  {t.introBadge ?? "Depuis 1996"}
                </span>
              </div>
            </Reveal>

            {/* Heading */}
            <Reveal delay={0.08}>
              <h2 className="font-display text-[clamp(1.9rem,4vw,3.2rem)] leading-[0.95] tracking-tight text-white [text-wrap:balance]">
                {t.introKicker ?? "Nés au bord de l’étang de Thau"}
              </h2>
            </Reveal>

            {/* Body text */}
            <Reveal delay={0.15}>
              <div className="space-y-5 text-[0.95rem] leading-relaxed text-white/75">
                {t.introParagraphs.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </Reveal>

          </div>

          {/* Image column */}
          <Reveal delay={0.22}>
            <div className="relative">
              {/* Decorative glow behind image */}
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl opacity-30 blur-3xl"
                style={{
                  background:
                    "radial-gradient(ellipse, rgba(168,85,247,0.6) 0%, transparent 65%)",
                }}
              />

              {/* Image frame */}
              <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/40">
                <Image
                  src={text.pages.histoire.image || "/images/gallery/2.jpg"}
                  alt={t.imageCaption ?? `${club.address.city} · ${club.address.venue}`}
                  width={800}
                  height={560}
                  className="w-full object-cover object-center"
                  priority={false}
                />
                {/* Subtle gradient overlay at bottom */}
                <div
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/60 to-transparent"
                />
              </div>

              {/* Caption badge */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between px-1">
                <span className="rounded-full border border-white/15 bg-ink/70 px-4 py-2 text-xs font-medium text-white/60 backdrop-blur-sm">
                  {t.imageCaption ?? `${club.address.city} · ${club.address.venue}`}
                </span>
              </div>
            </div>
          </Reveal>

        </div>
      </Section>

      {/* ── Timeline section ───────────────────────────────────────────── */}
      <Section tone="dark" id="timeline" className="overflow-hidden">
        {/* Section heading */}
        <div className="mb-16 sm:mb-24">
          <Reveal delay={0}>
            <div className="flex items-center gap-3 mb-5">
              <span
                aria-hidden
                className="h-px w-8 bg-gradient-to-r from-violet-700 to-fuchsia-vcm"
              />
              <span className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-fuchsia-vcm">
                {t.timelineKicker ?? "Chronologie"}
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="font-display text-[clamp(2rem,5vw,4.2rem)] leading-[0.95] tracking-tight text-white [text-wrap:balance]">
              {t.timelineHeading}
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-xl text-[0.95rem] leading-relaxed text-white/70">
              {t.timelineSubtitle ??
                "De la fondation du club à aujourd’hui, retour sur les moments clés qui ont forgé l’identité du VCM."}
            </p>
          </Reveal>
        </div>

        {/* Timeline component (client, GSAP ScrollTrigger) */}
        <Timeline entries={timeline} />
      </Section>

      {/* ── Vision actuelle / closing CTA ─────────────────────────────── */}
      <section
        aria-labelledby="vision-heading"
        className="relative isolate overflow-hidden bg-night py-20 sm:py-28"
      >
        {/* Decorative glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse, rgba(192,38,211,0.8) 0%, transparent 65%)",
          }}
        />

        {/* Top border accent */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent"
        />

        <div className="relative z-10 mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl text-center">

            {/* Kicker */}
            <Reveal delay={0}>
              <div className="mb-6 flex items-center justify-center gap-3">
                <span
                  aria-hidden
                  className="h-px w-8 bg-gradient-to-r from-violet-700 to-fuchsia-vcm"
                />
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-fuchsia-vcm">
                  {t.visionKicker ?? "Vision actuelle"}
                </span>
                <span
                  aria-hidden
                  className="h-px w-8 bg-gradient-to-r from-fuchsia-vcm to-violet-700"
                />
              </div>
            </Reveal>

            {/* Heading */}
            <Reveal delay={0.08}>
              <h2
                id="vision-heading"
                className="font-display text-[clamp(2rem,5vw,4rem)] leading-[0.95] tracking-tight text-white [text-wrap:balance]"
              >
                {t.visionTitle}
              </h2>
            </Reveal>

            {/* Body */}
            <Reveal delay={0.18}>
              <div className="mt-6 space-y-5 text-[0.95rem] leading-relaxed text-white/70">
                <p>{t.visionBody}</p>
                <p>
                  {t.visionExtra ??
                    "Que vous soyez parent cherchant une activité pour votre enfant, adulte souhaitant (re)découvrir le volley en loisir, sportif en quête de compétition ou simplement curieux de bouger dans un cadre bienveillant — le VCM a une place pour vous. Rejoignez-nous !"}
                </p>
              </div>
            </Reveal>

            {/* CTA */}
            <Reveal delay={0.28}>
              <div className="mt-10">
                <MagneticButton
                  href="/inscriptions"
                  className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-violet-700 via-magenta to-fuchsia-vcm px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white shadow-xl shadow-magenta/35 transition-shadow duration-300 hover:shadow-magenta/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 focus-visible:ring-offset-2 focus-visible:ring-offset-night"
                >
                  {t.cta}
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden
                  />
                </MagneticButton>
              </div>
            </Reveal>

          </div>
        </div>

        {/* Bottom border accent */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent"
        />
      </section>
    </>
  );
}
