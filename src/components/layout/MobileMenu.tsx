"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { X, Globe, ArrowUpRight } from "lucide-react";
import { navLinks } from "@/data/nav";
import { useContent } from "@/content/ContentContext";
import BrandLogo from "./BrandLogo";

/** Inline Facebook glyph (lucide v1 dropped brand icons). */
function FacebookGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.5-3.91 3.78-3.91 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.9h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
    </svg>
  );
}

/** Inline Instagram glyph (lucide v1 dropped brand icons). */
function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

type MobileMenuProps = {
  onClose: () => void;
  isActive: (href: string) => boolean;
};

export default function MobileMenu({ onClose, isActive }: MobileMenuProps) {
  const { content } = useContent();
  const { club } = content;
  const reduce = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Escape to close + body scroll lock + focus management
  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    }
    document.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // focus first link after the panel mounts
    const t = setTimeout(() => firstLinkRef.current?.focus(), 60);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      clearTimeout(t);
      previouslyFocused.current?.focus?.();
    };
  }, [onClose]);

  const container = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      };

  const list = {
    animate: { transition: { staggerChildren: reduce ? 0 : 0.05, delayChildren: 0.08 } },
  };
  const item = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
      };

  return (
    <motion.div
      ref={dialogRef}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu de navigation"
      {...container}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex flex-col bg-ink/98 backdrop-blur-xl lg:hidden"
    >
      {/* decorative glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-24 right-0 size-72 rounded-full bg-magenta/20 blur-3xl"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 -left-20 size-72 rounded-full bg-violet-700/20 blur-3xl"
      />

      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-4">
        <span className="flex items-center gap-2.5">
          <BrandLogo className="size-12" />
          <span className="font-display text-xl uppercase tracking-tight text-white">
            {club.shortName}
          </span>
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer le menu"
          className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70"
        >
          <X className="size-5" aria-hidden />
        </button>
      </div>

      {/* Links */}
      <motion.nav
        aria-label="Navigation principale mobile"
        variants={list}
        initial="initial"
        animate="animate"
        className="relative flex-1 overflow-y-auto px-6 py-4"
      >
        <ul className="flex flex-col gap-1">
          {navLinks.map((link, i) => {
            const active = isActive(link.href);
            return (
              <motion.li key={link.label} variants={item}>
                <Link
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={link.href}
                  onClick={onClose}
                  aria-current={active ? "page" : undefined}
                  className={`group flex items-center justify-between gap-2 py-2 font-display text-3xl uppercase tracking-tight outline-none transition-colors focus-visible:text-fuchsia-vcm ${
                    active ? "text-gradient" : "text-white/85 hover:text-white"
                  }`}
                >
                  {link.label}
                  <ArrowUpRight
                    className="size-6 -translate-x-2 text-fuchsia-vcm opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                    aria-hidden
                  />
                </Link>
                {link.children && (
                  <ul className="mb-1 ml-1 flex flex-col gap-1 border-l border-white/10 pl-4">
                    {link.children.map((child) => {
                      const childActive = isActive(child.href);
                      return (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={onClose}
                            aria-current={childActive ? "page" : undefined}
                            className={`block py-1 text-sm outline-none transition-colors focus-visible:text-fuchsia-vcm ${
                              childActive
                                ? "text-fuchsia-vcm"
                                : "text-white/55 hover:text-white"
                            }`}
                          >
                            {child.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </motion.li>
            );
          })}
        </ul>
      </motion.nav>

      {/* Footer: CTA + socials */}
      <motion.div
        variants={item}
        initial="initial"
        animate="animate"
        transition={{ delay: reduce ? 0 : 0.3 }}
        className="relative border-t border-white/10 px-6 py-5"
      >
        <Link
          href="/inscriptions"
          onClick={onClose}
          className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-700 via-magenta to-fuchsia-vcm px-6 py-3.5 font-semibold uppercase tracking-wide text-white shadow-lg shadow-magenta/30 outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
        >
          Rejoindre le club
          <ArrowUpRight className="size-5" aria-hidden />
        </Link>

        <div className="mt-5 flex items-center justify-center gap-3">
          {club.socials.facebook && (
            <a
              href={club.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook du VCM"
              className="grid size-11 place-items-center rounded-full border border-white/10 bg-white/5 text-white/80 outline-none transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70"
            >
              <FacebookGlyph className="size-5" />
            </a>
          )}
          {club.socials.instagram && (
            <a
              href={club.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram du VCM"
              className="grid size-11 place-items-center rounded-full border border-white/10 bg-white/5 text-white/80 outline-none transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70"
            >
              <InstagramGlyph className="size-5" />
            </a>
          )}
          {club.socials.website && (
            <a
              href={club.socials.website}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Site officiel du VCM"
              className="grid size-11 place-items-center rounded-full border border-white/10 bg-white/5 text-white/80 outline-none transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70"
            >
              <Globe className="size-5" aria-hidden />
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
