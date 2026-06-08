"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { Partner } from "@/types";

// Tier display labels in French
const TIER_BADGE: Record<Partner["tier"], string> = {
  principal: "Principal",
  officiel: "Officiel",
  institutionnel: "Institutionnel",
};

// Subtle tier accent colour (text class)
const TIER_COLOR: Record<Partner["tier"], string> = {
  principal: "text-fuchsia-vcm",
  officiel: "text-violet-500",
  institutionnel: "text-white/50",
};

interface PartnerLogoProps {
  partner: Partner;
}

export default function PartnerLogo({ partner }: PartnerLogoProps) {
  const prefersReducedMotion = useReducedMotion();

  const tile = (
    <motion.div
      className={[
        "group relative flex flex-col items-center justify-between gap-4",
        "rounded-2xl border border-white/10 bg-white/5",
        "p-6 transition-colors duration-300",
        "hover:border-violet-500/40 hover:bg-white/[0.08]",
        "focus-within:border-violet-500/40 focus-within:bg-white/[0.08]",
      ].join(" ")}
      whileHover={
        prefersReducedMotion
          ? undefined
          : { scale: 1.03, boxShadow: "0 0 0 2px rgba(168,85,247,0.45)" }
      }
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Logo container — fixed height, centered, full visible */}
      <div className="relative flex h-14 w-full items-center justify-center">
        <Image
          src={partner.logo}
          alt={partner.name}
          width={220}
          height={66}
          unoptimized
          className="h-auto w-auto max-h-12 max-w-[10rem] object-contain opacity-80 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100"
        />
      </div>

      {/* Caption row */}
      <div className="flex w-full flex-col items-center gap-1.5">
        {/* Partner name — visible to AT and sighted users */}
        <span className="text-center text-[0.7rem] font-medium leading-snug text-white/60 transition-colors duration-300 group-hover:text-white/80">
          {partner.name}
        </span>

        {/* Tier badge */}
        <span
          className={[
            "text-[0.55rem] font-semibold uppercase tracking-[0.22em]",
            TIER_COLOR[partner.tier],
          ].join(" ")}
        >
          {TIER_BADGE[partner.tier]}
        </span>
      </div>

      {/* Bottom glow accent on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px rounded-b-2xl bg-gradient-to-r from-transparent via-violet-500/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
    </motion.div>
  );

  if (partner.url) {
    return (
      <a
        href={partner.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visiter le site de ${partner.name}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink rounded-2xl"
      >
        {tile}
        {/* Screen-reader-only explicit name (backup for decorative SVG) */}
        <span className="sr-only">{partner.name}</span>
      </a>
    );
  }

  return (
    <div aria-label={partner.name} role="img">
      {tile}
    </div>
  );
}
