"use client";

import Image from "next/image";
import {
  Baby,
  Users,
  Smile,
  Trophy,
  HeartHandshake,
  HeartPulse,
  Sun,
  Check,
  Clock,
  type LucideIcon,
} from "lucide-react";
import TiltCard from "@/components/ui/TiltCard";
import Reveal from "@/components/motion/Reveal";
import type { Team } from "@/types";

const categoryIcon: Record<Team["category"], LucideIcon> = {
  baby: Baby,
  jeunes: Users,
  loisir: Smile,
  competition: Trophy,
  soft: HeartHandshake,
  sante: HeartPulse,
  beach: Sun,
};

const categoryLabel: Record<Team["category"], string> = {
  baby: "Baby Volley",
  jeunes: "Jeunes",
  loisir: "Loisir",
  competition: "Compétition",
  soft: "Soft Volley",
  sante: "Sport Santé",
  beach: "Beach Volley",
};

interface TeamDetailCardProps {
  team: Team;
  index: number;
}

export default function TeamDetailCard({ team, index }: TeamDetailCardProps) {
  const isEven = index % 2 === 0;
  const Icon = categoryIcon[team.category];
  const label = categoryLabel[team.category];

  return (
    <Reveal delay={0.05}>
      <article
        id={team.slug}
        scroll-mt-32=""
        className={[
          "scroll-mt-32 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16",
          "items-center",
        ].join(" ")}
      >
        {/* ── Image block ──────────────────────────────────────────── */}
        <div className={isEven ? "lg:order-first" : "lg:order-last"}>
          <TiltCard className="relative">
            {/* Gradient border frame */}
            <div
              aria-hidden
              className="absolute -inset-px rounded-3xl bg-gradient-to-br from-violet-700 via-magenta to-fuchsia-vcm opacity-60"
            />
            {/* Glow behind the card */}
            <div
              aria-hidden
              className="absolute -inset-4 rounded-[2rem] opacity-30 blur-2xl"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(192,38,211,0.55), transparent 70%)",
              }}
            />
            {/* Image wrapper */}
            <div className="relative overflow-hidden rounded-3xl">
              <div className="group relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={team.image}
                  alt={team.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.25,0,0,1)] group-hover:scale-105"
                />
                {/* Subtle dark vignette at bottom for continuity */}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent"
                />
              </div>
            </div>
          </TiltCard>
        </div>

        {/* ── Text block ───────────────────────────────────────────── */}
        <div className={isEven ? "lg:order-last" : "lg:order-first"}>

          {/* Category badge */}
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-700 to-magenta px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-lg shadow-magenta/25">
              <Icon className="size-3.5" aria-hidden />
              {label}
            </span>
            {/* Age range chip */}
            {team.ageRange && (
              <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 backdrop-blur-sm">
                {team.ageRange}
              </span>
            )}
          </div>

          {/* Team name */}
          <h2 className="font-display text-[clamp(1.8rem,3.5vw,2.75rem)] leading-[0.95] tracking-tight text-white [text-wrap:balance]">
            {team.name}
          </h2>

          {/* Description */}
          <p className="mt-5 text-[0.95rem] leading-relaxed text-white/60">
            {team.description}
          </p>

          {/* Objectives */}
          <div className="mt-7">
            <h3 className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-fuchsia-vcm">
              Objectifs
            </h3>
            <ul className="space-y-2.5">
              {team.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-white/75">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-violet-700/30 text-violet-500">
                    <Check className="size-3" aria-hidden />
                  </span>
                  {obj}
                </li>
              ))}
            </ul>
          </div>

          {/* Schedule */}
          <div className="mt-7 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur-sm">
            <Clock className="mt-0.5 size-4 shrink-0 text-fuchsia-vcm" aria-hidden />
            <div>
              <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-white/40">
                Créneaux
              </span>
              <span className="mt-1 block text-sm text-white/80">{team.schedule}</span>
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );
}
