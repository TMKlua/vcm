"use client";

import { ArrowRight } from "lucide-react";

import Reveal from "@/components/motion/Reveal";
import TextReveal from "@/components/motion/TextReveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import MagneticButton from "@/components/ui/MagneticButton";
import TeamCard from "@/components/ui/TeamCard";
import { teams } from "@/data/teams";

const previewTeams = teams.slice(0, 6);

export default function TeamsPreview() {
  return (
    <section
      aria-labelledby="teams-preview-heading"
      className="relative isolate overflow-hidden bg-ink py-24 sm:py-32"
    >
      {/* Subtle top border gradient */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-700/40 to-transparent"
      />

      {/* Radial violet glow — bottom left atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-32 -z-10 h-[500px] w-[500px] rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(124,58,237,0.8) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-12">

        {/* ── Section header ─────────────────────────────────────────────── */}
        <div className="mb-14 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          {/* Left: kicker + headline + subtitle */}
          <div className="max-w-xl">
            {/* Kicker */}
            <Reveal delay={0.05}>
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-8 bg-gradient-to-r from-violet-700 to-fuchsia-vcm" aria-hidden />
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-fuchsia-vcm">
                  Nos pratiques
                </span>
              </div>
            </Reveal>

            {/* Headline */}
            <h2
              id="teams-preview-heading"
              className="font-display text-[clamp(1.9rem,4.5vw,3.5rem)] leading-[0.95] tracking-tight text-white"
            >
              <TextReveal text="Une équipe" className="block" />
              <span className="mt-0.5 block text-gradient [-webkit-text-fill-color:transparent]">
                <TextReveal text="pour chacun" className="block" />
              </span>
            </h2>

            {/* Subtitle */}
            <Reveal delay={0.3}>
              <p className="mt-4 text-sm leading-relaxed text-white/70 sm:text-[0.95rem]">
                Du baby volley dès 3 ans au sport santé en passant par la
                compétition et le beach — il y a une place pour vous au VCM.
              </p>
            </Reveal>
          </div>

          {/* Right: CTA — top-right on desktop */}
          <Reveal delay={0.2}>
            <MagneticButton
              href="/equipes"
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm transition-colors duration-300 hover:border-white/35 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              Toutes nos équipes
              <ArrowRight
                className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              />
            </MagneticButton>
          </Reveal>
        </div>

        {/* ── Teams grid ─────────────────────────────────────────────────── */}
        <StaggerGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {previewTeams.map((team) => (
            <StaggerItem key={team.slug}>
              <TeamCard team={team} className="h-full" />
            </StaggerItem>
          ))}
        </StaggerGroup>

        {/* ── Bottom CTA (mobile-friendly repeat) ─────────────────────────── */}
        <Reveal delay={0.1}>
          <div className="mt-12 flex justify-center sm:hidden">
            <MagneticButton
              href="/equipes"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-700 via-magenta to-fuchsia-vcm px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white shadow-xl shadow-magenta/25 transition-shadow duration-300 hover:shadow-magenta/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              Voir toutes les équipes
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              />
            </MagneticButton>
          </div>
        </Reveal>
      </div>

      {/* Subtle bottom border gradient */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-700/30 to-transparent"
      />
    </section>
  );
}
