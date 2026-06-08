"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import TiltCard from "@/components/ui/TiltCard";
import type { Team } from "@/types";

interface TeamCardProps {
  team: Team;
  className?: string;
}

export default function TeamCard({ team, className }: TeamCardProps) {
  return (
    <TiltCard
      className={[
        "group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl",
        "border border-white/10 bg-night",
        "shadow-lg shadow-black/40",
        "transition-shadow duration-500 hover:shadow-violet-700/25 hover:shadow-2xl",
        className ?? "",
      ].join(" ")}
    >
      {/* Glow ring on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 rounded-2xl opacity-0 ring-2 ring-inset ring-violet-700/60 transition-all duration-500 group-hover:opacity-100 group-hover:ring-fuchsia-vcm/70"
        style={{
          boxShadow: "inset 0 0 32px 0 rgba(192,38,211,0.18)",
        }}
      />

      {/* Image container — fixed aspect ratio */}
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <motion.div
          className="absolute inset-0"
          whileHover={{ scale: 1.07 }}
          transition={{ duration: 0.55, ease: [0.25, 0, 0, 1] }}
        >
          <Image
            src={team.image}
            alt={team.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center"
          />
        </motion.div>

        {/* Bottom-up gradient overlay for text legibility */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-night via-night/50 to-transparent"
        />

        {/* Age range chip */}
        {team.ageRange && (
          <span className="absolute left-3 top-3 z-10 rounded-full border border-white/15 bg-black/50 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/80 backdrop-blur-md">
            {team.ageRange}
          </span>
        )}

        {/* Hover: ArrowUpRight affordance badge */}
        <motion.span
          aria-hidden
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-700 to-fuchsia-vcm shadow-lg shadow-magenta/40"
          initial={{ opacity: 0, scale: 0.7, rotate: -15 }}
          whileHover={{ opacity: 1, scale: 1, rotate: 0 }}
          // Controlled via group hover via CSS, use initial/animate trick below
        >
          <ArrowUpRight className="size-4 text-white" />
        </motion.span>
      </div>

      {/* Card body */}
      <div className="relative z-10 flex flex-1 flex-col gap-2.5 p-5">
        {/* Team name */}
        <h3 className="font-display text-xl leading-tight text-white [text-wrap:balance]">
          {team.name}
        </h3>

        {/* Short description */}
        <p className="flex-1 text-sm leading-relaxed text-white/60">
          {team.shortDescription}
        </p>

        {/* Découvrir affordance */}
        <div className="mt-1 flex items-center gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-500 transition-colors duration-300 group-hover:text-fuchsia-vcm">
            Découvrir
          </span>
          <motion.span
            className="text-violet-500 transition-colors duration-300 group-hover:text-fuchsia-vcm"
            initial={{ x: 0, y: 0 }}
            whileHover={{ x: 2, y: -2 }}
            transition={{ duration: 0.25 }}
          >
            <ArrowUpRight className="size-3.5" aria-hidden />
          </motion.span>
        </div>
      </div>

      {/* Full-card accessible link — sits on top, behind visual chrome */}
      <Link
        href={`/equipes#${team.slug}`}
        className="absolute inset-0 z-30 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
        aria-label={`Découvrir l'équipe ${team.name}`}
      />
    </TiltCard>
  );
}
