"use client";

import { ArrowRight } from "lucide-react";

import Reveal from "@/components/motion/Reveal";
import TextReveal from "@/components/motion/TextReveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import MagneticButton from "@/components/ui/MagneticButton";
import EventCard from "@/components/ui/EventCard";
import { events } from "@/data/events";

/**
 * EventsPreview — homepage agenda section.
 *
 * Dark bg-ink section with violet-glow atmosphere.
 * Shows all 4 events in a responsive grid: 1-col mobile, 2-col md+.
 */
export default function EventsPreview() {
  return (
    <section
      aria-labelledby="events-preview-heading"
      className="relative isolate overflow-hidden bg-ink py-24 sm:py-32"
    >
      {/* Top separator */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-700/40 to-transparent"
      />

      {/* Radial glow — top right */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 -z-10 h-[480px] w-[480px] rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(192,38,211,0.8) 0%, transparent 65%)" }}
      />

      <div className="relative z-10 mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-12">

        {/* ── Section header ──────────────────────────────────────────────── */}
        <div className="mb-14 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          {/* Left: kicker + headline */}
          <div className="max-w-xl">
            <Reveal delay={0.05}>
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-8 bg-gradient-to-r from-violet-700 to-fuchsia-vcm" aria-hidden />
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-fuchsia-vcm">
                  Agenda
                </span>
              </div>
            </Reveal>

            <h2
              id="events-preview-heading"
              className="font-display text-[clamp(1.9rem,4.5vw,3.5rem)] leading-[0.95] tracking-tight text-white"
            >
              <TextReveal text="Les prochains" className="block" />
              <span className="mt-0.5 block text-gradient [-webkit-text-fill-color:transparent]">
                <TextReveal text="rendez-vous" className="block" />
              </span>
            </h2>

            <Reveal delay={0.3}>
              <p className="mt-4 text-sm leading-relaxed text-white/55 sm:text-[0.95rem]">
                Tournois, événements, journées portes ouvertes — ne manquez rien de la saison VCM.
              </p>
            </Reveal>
          </div>

          {/* Right: CTA (desktop) */}
          <Reveal delay={0.2}>
            <MagneticButton
              href="/actualites"
              className="group hidden sm:inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm transition-colors duration-300 hover:border-white/35 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              Toutes les actualités
              <ArrowRight
                className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              />
            </MagneticButton>
          </Reveal>
        </div>

        {/* ── Events grid ─────────────────────────────────────────────────── */}
        <StaggerGroup className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {events.map((event) => (
            <StaggerItem key={event.id}>
              <EventCard event={event} className="h-full" />
            </StaggerItem>
          ))}
        </StaggerGroup>

        {/* ── Bottom CTA (mobile) ──────────────────────────────────────────── */}
        <Reveal delay={0.1}>
          <div className="mt-12 flex justify-center sm:hidden">
            <MagneticButton
              href="/actualites"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-700 via-magenta to-fuchsia-vcm px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white shadow-xl shadow-magenta/25 transition-shadow duration-300 hover:shadow-magenta/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              Toutes les actualités
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              />
            </MagneticButton>
          </div>
        </Reveal>
      </div>

      {/* Bottom separator */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-700/30 to-transparent"
      />
    </section>
  );
}
