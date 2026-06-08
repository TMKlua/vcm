"use client";

import Image from "next/image";
import {
  HeartPulse,
  Smile,
  Users,
  Sparkles,
  ShieldCheck,
  Activity,
  ArrowRight,
  Stethoscope,
  HeartHandshake,
} from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import Section from "@/components/layout/Section";
import Reveal from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import TiltCard from "@/components/ui/TiltCard";
import MagneticButton from "@/components/ui/MagneticButton";
import { useContent } from "@/content/ContentContext";

// ── Data (stays hardcoded — no content field) ─────────────────────────────────

const benefits = [
  {
    icon: HeartPulse,
    title: "Santé cardio-vasculaire",
    text: "Une activité douce qui entretient le cœur et le souffle, adaptée à votre rythme.",
  },
  {
    icon: Smile,
    title: "Plaisir & bonne humeur",
    text: "Le volley-ball, même en version douce, reste un sport collectif plein de joie et de rires.",
  },
  {
    icon: Users,
    title: "Lien social",
    text: "Rejoindre le VCM, c'est intégrer une communauté chaleureuse, ouverte et bienveillante.",
  },
  {
    icon: Sparkles,
    title: "Bien-être global",
    text: "Corps et esprit bénéficient ensemble d'une pratique régulière, légère et motivante.",
  },
  {
    icon: ShieldCheck,
    title: "Sans pression · adapté",
    text: "Pas de compétition, pas de jugement. Chacun avance à son rythme, en toute sérénité.",
  },
  {
    icon: Activity,
    title: "Remise en forme",
    text: "Idéal pour reprendre une activité physique progressive après une pause ou un arrêt médical.",
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function SportSanteView() {
  const { content } = useContent();
  const { club, teams } = content;
  const t = content.text.pages.sportSante;

  // Pull Sport Santé and Soft Volley from teams data
  const sporSante = teams.find((tm) => tm.category === "sante")!;
  const softVolley = teams.find((tm) => tm.category === "soft")!;

  return (
    <>
      {/* ── Page hero ──────────────────────────────────────────────────────── */}
      <PageHero
        kicker={t.heroKicker}
        title={t.heroTitle}
        subtitle={t.heroSubtitle}
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Sport Santé", href: "/sport-sante" },
        ]}
      />

      {/* ── Intro Section — what is it + image ─────────────────────────────── */}
      <Section tone="dark" id="intro">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20 lg:items-center">

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
                  Le volley pour tous
                </span>
              </div>
            </Reveal>

            {/* Heading */}
            <Reveal delay={0.08}>
              <h2 className="font-display text-[clamp(1.9rem,4vw,3.2rem)] leading-[0.95] tracking-tight text-white [text-wrap:balance]">
                {t.introTitle}
              </h2>
            </Reveal>

            {/* Body */}
            <Reveal delay={0.15}>
              <div className="space-y-5 text-[0.95rem] leading-relaxed text-white/75">
                {t.introBody.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </Reveal>

            {/* Objectives pull from data */}
            <Reveal delay={0.22}>
              <ul className="space-y-3">
                {sporSante.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                    <Stethoscope
                      className="mt-0.5 size-4 shrink-0 text-fuchsia-vcm"
                      aria-hidden
                    />
                    {obj}
                  </li>
                ))}
              </ul>
            </Reveal>

          </div>

          {/* Image column */}
          <Reveal delay={0.22}>
            <TiltCard className="relative">
              {/* Decorative glow */}
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl opacity-30 blur-3xl"
                style={{
                  background:
                    "radial-gradient(ellipse, rgba(255,77,210,0.55) 0%, transparent 65%)",
                }}
              />

              {/* Image frame */}
              <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/50">
                <Image
                  src={sporSante.image}
                  alt="Séance Sport Santé au Volley Club Marseillanais"
                  width={800}
                  height={560}
                  className="w-full object-cover object-center"
                  unoptimized
                  priority={false}
                />
                {/* Gradient overlay */}
                <div
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink/70 to-transparent"
                />
                {/* Caption */}
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between px-1">
                  <span className="rounded-full border border-white/15 bg-ink/70 px-4 py-2 text-xs font-medium text-white/60 backdrop-blur-sm">
                    Sport Santé · {sporSante.ageRange}
                  </span>
                </div>
              </div>
            </TiltCard>
          </Reveal>

        </div>
      </Section>

      {/* ── Benefits Section — dark ─────────────────────────────────────────── */}
      <Section tone="dark" id="benefices" className="overflow-hidden">

        {/* Section heading */}
        <div className="mb-16 sm:mb-20">
          <Reveal delay={0}>
            <div className="flex items-center gap-3 mb-5">
              <span
                aria-hidden
                className="h-px w-8 bg-gradient-to-r from-violet-700 to-fuchsia-vcm"
              />
              <span className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-fuchsia-vcm">
                Ce que vous y gagnez
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="font-display text-[clamp(2rem,5vw,4rem)] leading-[0.95] tracking-tight text-white [text-wrap:balance]">
              {t.benefitsHeading}
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-xl text-[0.95rem] leading-relaxed text-white/70">
              Sport Santé et Soft Volley ne se contentent pas d&rsquo;entretenir
              le corps — ils nourrissent aussi l&rsquo;esprit et le lien humain.
            </p>
          </Reveal>
        </div>

        {/* Cards grid */}
        <StaggerGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <StaggerItem key={i}>
                <div className="group relative flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 transition-all duration-300 hover:border-violet-500/30 hover:bg-violet-700/[0.06]">
                  {/* Icon */}
                  <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-700/30 to-fuchsia-vcm/20 border border-white/10">
                    <Icon className="size-5 text-fuchsia-vcm" aria-hidden />
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-base leading-tight text-white">
                    {benefit.title}
                  </h3>

                  {/* Text */}
                  <p className="text-sm leading-relaxed text-white/70">
                    {benefit.text}
                  </p>

                  {/* Hover accent line */}
                  <div
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-px rounded-b-2xl bg-gradient-to-r from-violet-700/0 via-fuchsia-vcm/50 to-violet-700/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>

      </Section>

      {/* ── Inclusion Section — light tone for human warmth ────────────────── */}
      <Section tone="light" id="inclusion">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20 lg:items-center">

          {/* Image column — first on large screens */}
          <Reveal delay={0.1} className="order-2 lg:order-1">
            <div className="relative">
              {/* Decorative accent blob */}
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl opacity-20 blur-3xl"
                style={{
                  background:
                    "radial-gradient(ellipse, rgba(168,85,247,0.7) 0%, transparent 65%)",
                }}
              />
              <div className="relative overflow-hidden rounded-3xl shadow-xl shadow-encre/15 border border-encre/10">
                <Image
                  src={softVolley.image}
                  alt="Soft Volley — pratique douce et accessible au VCM"
                  width={800}
                  height={560}
                  className="w-full object-cover object-center"
                  unoptimized
                  priority={false}
                />
              </div>
              {/* Caption badge */}
              <div className="absolute bottom-4 left-4">
                <span className="rounded-full border border-encre/15 bg-white/80 px-4 py-2 text-xs font-medium text-encre/70 backdrop-blur-sm shadow-sm">
                  Soft Volley · {softVolley.ageRange}
                </span>
              </div>
            </div>
          </Reveal>

          {/* Text column */}
          <div className="order-1 flex flex-col gap-8 lg:order-2">

            <Reveal delay={0}>
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="h-px w-8 bg-gradient-to-r from-violet-700 to-fuchsia-vcm"
                />
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-violet-700">
                  Accessibilité & inclusion
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <h2 className="font-display text-[clamp(1.9rem,4vw,3.2rem)] leading-[0.95] tracking-tight text-encre [text-wrap:balance]">
                {t.inclusionTitle}
              </h2>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="space-y-5 text-[0.95rem] leading-relaxed text-encre/70">
                {t.inclusionBody.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </Reveal>

            {/* Soft Volley objectives */}
            <Reveal delay={0.22}>
              <ul className="space-y-3">
                {softVolley.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-encre/65">
                    <HeartHandshake
                      className="mt-0.5 size-4 shrink-0 text-violet-700"
                      aria-hidden
                    />
                    {obj}
                  </li>
                ))}
              </ul>
            </Reveal>

          </div>
        </div>
      </Section>

      {/* ── Closing CTA ────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="sante-cta-heading"
        className="relative isolate overflow-hidden bg-night py-20 sm:py-28"
      >
        {/* Decorative glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse, rgba(255,77,210,0.7) 0%, rgba(124,58,237,0.5) 50%, transparent 70%)",
          }}
        />

        {/* Top border accent */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-vcm/40 to-transparent"
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
                  Venez essayer
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
                id="sante-cta-heading"
                className="font-display text-[clamp(2rem,5vw,4rem)] leading-[0.95] tracking-tight text-white [text-wrap:balance]"
              >
                Prêt à bouger ?
              </h2>
            </Reveal>

            {/* Body */}
            <Reveal delay={0.18}>
              <p className="mt-6 text-[0.95rem] leading-relaxed text-white/70">
                Une séance d&rsquo;essai gratuite vous attend. Pas besoin d&rsquo;équipement
                particulier — juste l&rsquo;envie de vous faire du bien. Contactez-nous
                pour planifier votre première visite au Gymnase Louis Boudou de Marseillan.
              </p>
            </Reveal>

            {/* CTAs */}
            <Reveal delay={0.28}>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
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

                <MagneticButton
                  href="/contact"
                  className="group inline-flex items-center justify-center gap-2.5 rounded-full border border-white/20 bg-white/[0.04] px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white/80 transition-all duration-300 hover:border-violet-500/50 hover:bg-violet-700/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 focus-visible:ring-offset-2 focus-visible:ring-offset-night"
                >
                  Nous contacter
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden
                  />
                </MagneticButton>
              </div>
            </Reveal>

            {/* Contact details */}
            <Reveal delay={0.35}>
              <p className="mt-8 text-sm text-white/70">
                {club.contact.person} · {club.contact.phone} ·{" "}
                <a
                  href={`mailto:${club.contact.email}`}
                  className="underline decoration-white/20 underline-offset-2 transition-colors hover:text-white/60"
                >
                  {club.contact.email}
                </a>
              </p>
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
