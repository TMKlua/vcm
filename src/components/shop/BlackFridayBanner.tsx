"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";

import { BLACK_FRIDAY } from "@/data/shop";

/**
 * Bandeau de l'offre Black Friday. Ne s'affiche que si l'offre est active
 * (`BLACK_FRIDAY.active` dans src/data/shop.ts).
 */
export default function BlackFridayBanner({ href, className = "" }: { href?: string; className?: string }) {
  const reduce = useReducedMotion();
  if (!BLACK_FRIDAY.active) return null;

  const inner = (
    <>
      <motion.span
        aria-hidden
        className="absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent"
        animate={reduce ? undefined : { x: ["0%", "450%"] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.5 }}
      />
      <span className="relative flex items-center gap-2 font-display text-lg uppercase tracking-wide text-white sm:text-xl">
        <Zap className="size-5 fill-fuchsia-vcm text-fuchsia-vcm" aria-hidden />
        Black Friday
      </span>
      <span className="relative rounded-full bg-fuchsia-vcm px-3 py-1 font-display text-lg text-white">−{BLACK_FRIDAY.percent} %</span>
      <span className="relative text-sm text-white/80">sur toute la boutique jusqu&apos;au {BLACK_FRIDAY.until}</span>
      {href && <ArrowRight className="relative size-4 text-white transition-transform group-hover:translate-x-1" aria-hidden />}
    </>
  );

  const cls = `group relative isolate flex flex-wrap items-center justify-center gap-x-4 gap-y-2 overflow-hidden rounded-2xl border border-fuchsia-vcm/40 bg-black px-5 py-3.5 text-center shadow-lg shadow-fuchsia-vcm/10 ${className}`;
  return href ? (
    <Link href={href} className={`${cls} outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70`}>
      {inner}
    </Link>
  ) : (
    <div className={cls}>{inner}</div>
  );
}
