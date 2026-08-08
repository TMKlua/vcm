"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Baby,
  Users,
  Smile,
  Trophy,
  HeartHandshake,
  HeartPulse,
  Sun,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import type { NavLink, Team } from "@/types";
import { useContent } from "@/content/ContentContext";

/**
 * MegaMenu — reusable animated dropdown panel for the Navbar.
 *
 * API:
 *   - open       : controlled visibility
 *   - onClose    : called when the panel should close (Escape, outside click, link click)
 *   - variant    : "teams" (rich grid of the 7 teams) | "club" (children links + promo card)
 *   - links      : NavLink children (used by the "club" variant)
 *   - triggerRef : the element to return focus to when closing via Escape
 *   - align      : horizontal anchor of the panel relative to its trigger
 *
 * Behaviour: closes on Escape (returning focus to the trigger), on outside
 * pointer-down, and on any link activation. Fully keyboard navigable; honours
 * prefers-reduced-motion.
 */

const categoryIcon: Record<Team["category"], LucideIcon> = {
  baby: Baby,
  jeunes: Users,
  loisir: Smile,
  competition: Trophy,
  soft: HeartHandshake,
  sante: HeartPulse,
  beach: Sun,
};

type MegaMenuProps = {
  open: boolean;
  onClose: () => void;
  variant: "teams" | "club";
  links?: NavLink[];
  teams?: Team[];
  triggerRef?: React.RefObject<HTMLElement | null>;
  align?: "left" | "center" | "right";
};

export default function MegaMenu({
  open,
  onClose,
  variant,
  links = [],
  teams = [],
  triggerRef,
  align = "left",
}: MegaMenuProps) {
  const ui = useContent().content.text.ui;
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  // Escape + outside pointer-down handling
  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        triggerRef?.current?.focus();
      }
    }
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (triggerRef?.current?.contains(target)) return;
      onClose();
    }

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, onClose, triggerRef]);

  const alignClass =
    align === "center"
      ? "left-1/2 -translate-x-1/2"
      : align === "right"
        ? "right-0"
        : "left-0";

  const initial = reduce ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 };
  const animate = reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 };
  const exit = reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          initial={initial}
          animate={animate}
          exit={exit}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className={`absolute top-full mt-3 ${alignClass} z-50 origin-top`}
          role="menu"
          aria-label={variant === "teams" ? "Nos équipes" : "Le Club"}
        >
          {/* invisible hover bridge so the pointer can travel from trigger to panel */}
          <span aria-hidden className="absolute -top-3 left-0 h-3 w-full" />

          {variant === "teams" ? (
            <div className="w-[min(46rem,calc(100vw-2rem))] rounded-2xl border border-white/10 bg-night/95 p-3 shadow-2xl shadow-black/50 backdrop-blur-xl">
              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {teams.map((team) => {
                  const Icon = categoryIcon[team.category];
                  return (
                    <Link
                      key={team.slug}
                      href={`/equipes#${team.slug}`}
                      onClick={onClose}
                      role="menuitem"
                      className="group/item flex items-start gap-3 rounded-xl p-3 outline-none transition-colors hover:bg-white/5 focus-visible:bg-white/5 focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70"
                    >
                      <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-violet-700 to-magenta text-white shadow-lg shadow-magenta/20 transition-transform group-hover/item:scale-105">
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1 font-display text-sm uppercase tracking-wide text-white">
                          {team.name}
                          <ArrowUpRight
                            className="size-3.5 -translate-x-1 text-fuchsia-vcm opacity-0 transition-all group-hover/item:translate-x-0 group-hover/item:opacity-100"
                            aria-hidden
                          />
                        </span>
                        <span className="mt-0.5 block text-xs leading-snug text-white/70">
                          {team.shortDescription}
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="w-[min(34rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/10 bg-night/95 shadow-2xl shadow-black/50 backdrop-blur-xl">
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.1fr]">
                <div className="p-3">
                  {links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={onClose}
                      role="menuitem"
                      className="group/item flex items-center justify-between gap-2 rounded-xl px-3 py-3 outline-none transition-colors hover:bg-white/5 focus-visible:bg-white/5 focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70"
                    >
                      <span className="font-display text-sm uppercase tracking-wide text-white">
                        {link.label}
                      </span>
                      <ArrowUpRight
                        className="size-4 -translate-x-1 text-fuchsia-vcm opacity-0 transition-all group-hover/item:translate-x-0 group-hover/item:opacity-100"
                        aria-hidden
                      />
                    </Link>
                  ))}
                </div>
                {/* promo card */}
                <Link
                  href="/inscriptions"
                  onClick={onClose}
                  role="menuitem"
                  className="group/promo relative flex flex-col justify-end overflow-hidden p-5 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-fuchsia-vcm/70"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-br from-violet-700 via-magenta to-fuchsia-vcm opacity-90 transition-opacity group-hover/promo:opacity-100"
                  />
                  <span
                    aria-hidden
                    className="absolute -right-8 -top-10 size-32 rounded-full bg-white/20 blur-2xl"
                  />
                  <span className="relative z-10 font-display text-lg uppercase leading-tight text-white">
                    {ui?.megaMenuTitle ?? "Rejoignez le club"}
                  </span>
                  <span className="relative z-10 mt-1 text-xs leading-snug text-white/85">
                    {ui?.megaMenuText ?? "Du Baby Volley à la compétition, une place pour chacun."}
                  </span>
                  <span className="relative z-10 mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-white">
                    {ui?.megaMenuCta ?? "S’inscrire"}
                    <ArrowUpRight className="size-4 transition-transform group-hover/promo:translate-x-0.5 group-hover/promo:-translate-y-0.5" aria-hidden />
                  </span>
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
