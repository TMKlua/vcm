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
import ParallaxImage from "@/components/motion/ParallaxImage";
import type { Team } from "@/types";
import type { Player, SubTeam, TeamContent } from "@/content/types";
import { useContent } from "@/content/ContentContext";

const categoryIcon: Record<Team["category"], LucideIcon> = {
  baby: Baby,
  jeunes: Users,
  loisir: Smile,
  competition: Trophy,
  soft: HeartHandshake,
  sante: HeartPulse,
  beach: Sun,
};

/** Repli si le contenu ne fournit pas d'intitulé pour la catégorie. */
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
  team: TeamContent;
  index: number;
}

/** Initials for the avatar placeholder when a player has no photo. */
function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** A single player card within the roster grid. */
function PlayerCard({ player }: { player: Player }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center transition-colors duration-300 hover:border-violet-500/40 hover:bg-violet-700/10">
      <div className="relative">
        {player.image ? (
          // Plain <img>: srcs may be data URLs from the CMS; avoids next/image config.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={player.image}
            alt={player.name}
            className="size-16 rounded-full object-cover ring-2 ring-magenta/30"
          />
        ) : (
          <span
            aria-hidden
            className="grid size-16 place-items-center rounded-full bg-gradient-to-br from-violet-700 to-magenta text-base font-semibold text-white ring-2 ring-magenta/30"
          >
            {initials(player.name)}
          </span>
        )}
        {player.number && (
          <span className="absolute -bottom-1 -right-1 grid size-6 place-items-center rounded-full bg-ink text-[0.7rem] font-bold text-fuchsia-vcm ring-1 ring-white/15">
            {player.number}
          </span>
        )}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-white">{player.name}</p>
        <p className="mt-0.5 truncate text-xs text-white/55">{player.role}</p>
      </div>
    </div>
  );
}

export default function TeamDetailCard({ team, index }: TeamDetailCardProps) {
  const ui = useContent().content.text.ui;
  const isEven = index % 2 === 0;
  const Icon = categoryIcon[team.category];
  const label =
    ui?.teamCategories?.[team.category] || categoryLabel[team.category];

  const subTeams = team.subTeams ?? [];

  return (
    <Reveal delay={0.05}>
      <article id={team.slug} className="scroll-mt-32">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
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
                {/* `h-full w-full`, pas `absolute inset-0` : ParallaxImage pose
                    déjà `relative` sur son wrapper, et les deux classes de
                    position se contredisaient — `relative` gagnait, `inset-0`
                    ne s'appliquait plus et la hauteur retombait à 0. Résultat :
                    les photos d'équipes existaient mais mesuraient 616×0. */}
                <ParallaxImage className="h-full w-full" amount={22}>
                  <Image
                    src={team.image}
                    alt={team.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.25,0,0,1)] group-hover:scale-105"
                  />
                </ParallaxImage>
                {/* Subtle dark vignette at bottom for continuity */}
                <div
                  aria-hidden
                  className="absolute inset-0 z-10 bg-gradient-to-t from-ink/40 via-transparent to-transparent"
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
          <p className="mt-5 text-[0.95rem] leading-relaxed text-white/70">
            {team.description}
          </p>

          {/* Objectives */}
          <div className="mt-7">
            <h3 className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-fuchsia-vcm">
              {ui?.teamObjectives ?? "Objectifs"}
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
              <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-white/70">
                {ui?.teamSchedule ?? "Créneaux"}
              </span>
              <span className="mt-1 block text-sm text-white/80">{team.schedule}</span>
            </div>
          </div>

          {/* Roster / Effectif */}
          {team.players && team.players.length > 0 && (
            <div className="mt-7">
              <h3 className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-fuchsia-vcm">
                {ui?.teamRoster ?? "Effectif"}
              </h3>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {team.players.map((player) => (
                  <li key={player.id}>
                    <PlayerCard player={player} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        </div>

        {/* ── Sous-équipes ─────────────────────────────────────────── */}
        {subTeams.length > 0 && (
          <div className="mt-12 border-t border-white/[0.08] pt-10">
            <h3 className="mb-6 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-fuchsia-vcm">
              {ui?.teamSubTeams ?? "Sous-équipes"}
            </h3>
            <ul className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {subTeams.map((sub) => (
                <li key={sub.id}>
                  <SubTeamCard sub={sub} rosterLabel={ui?.teamRoster ?? "Effectif"} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>
    </Reveal>
  );
}

/* ── Sous-équipe ─────────────────────────────────────────────────────────── */

function SubTeamCard({ sub, rosterLabel }: { sub: SubTeam; rosterLabel: string }) {
  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-colors duration-300 hover:border-violet-500/30 hover:bg-violet-700/[0.06] sm:flex-row sm:gap-5">
      {/* Photo — masquée si la sous-équipe n'en a pas */}
      {sub.image && (
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl sm:aspect-square sm:w-32">
          {/* Plain <img> : la source peut être une URL du blob ou un chemin local. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={sub.image}
            alt={sub.name}
            className="absolute inset-0 size-full object-cover object-center"
          />
        </div>
      )}

      <div className="flex min-w-0 flex-col gap-2">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h4 className="font-display text-base leading-tight text-white">{sub.name}</h4>
          {sub.ageRange && (
            <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[0.7rem] font-medium text-white/70">
              {sub.ageRange}
            </span>
          )}
        </div>

        {sub.schedule && (
          <p className="flex items-center gap-2 text-xs text-white/60">
            <Clock className="size-3.5 shrink-0 text-fuchsia-vcm" aria-hidden />
            {sub.schedule}
          </p>
        )}

        {sub.description && (
          <p className="text-sm leading-relaxed text-white/70">{sub.description}</p>
        )}

        {sub.players && sub.players.length > 0 && (
          <div className="mt-1">
            <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-white/50">
              {rosterLabel}
            </p>
            <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {sub.players.map((player) => (
                <li key={player.id}>
                  <PlayerCard player={player} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
