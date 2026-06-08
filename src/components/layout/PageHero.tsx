"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import AnimatedGradient from "@/components/motion/AnimatedGradient";
import CourtLines from "@/components/motion/CourtLines";
import TextReveal from "@/components/motion/TextReveal";
import Reveal from "@/components/motion/Reveal";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface PageHeroProps {
  title: string;
  subtitle?: string;
  kicker?: string;
  breadcrumb?: BreadcrumbItem[];
}

export default function PageHero({ title, subtitle, kicker, breadcrumb }: PageHeroProps) {
  return (
    <section
      aria-label={title}
      className="relative isolate overflow-hidden bg-ink pt-32 pb-20 sm:pt-40 sm:pb-28"
    >
      {/* ── Decorative layer: animated gradient blobs ──────────────── */}
      <AnimatedGradient className="opacity-60" />

      {/* ── Decorative layer: faint court lines ────────────────────── */}
      <CourtLines
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden h-full w-[55%] text-fuchsia-vcm opacity-40 md:block"
      />

      {/* ── Subtle noise grain overlay ──────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ── Top border accent ──────────────────────────────────────── */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent"
      />

      {/* ── Content ────────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-12">

        {/* Breadcrumb */}
        {breadcrumb && breadcrumb.length > 0 && (
          <Reveal delay={0}>
            <nav aria-label="Fil d'Ariane" className="mb-8">
              <ol className="flex flex-wrap items-center gap-1 text-xs font-medium text-white/40">
                {breadcrumb.map((item, i) => {
                  const isLast = i === breadcrumb.length - 1;
                  return (
                    <li key={item.href} className="flex items-center gap-1">
                      {i > 0 && (
                        <ChevronRight className="size-3 shrink-0 text-white/25" aria-hidden />
                      )}
                      {isLast ? (
                        <span aria-current="page" className="text-white/70">
                          {item.label}
                        </span>
                      ) : (
                        <Link
                          href={item.href}
                          className="transition-colors hover:text-white/70 focus-visible:text-white/70 focus-visible:outline-none focus-visible:underline"
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
          </Reveal>
        )}

        {/* Kicker */}
        {kicker && (
          <Reveal delay={0.05}>
            <div className="mb-6 flex items-center gap-3">
              <span
                aria-hidden
                className="h-px w-8 bg-gradient-to-r from-violet-700 to-fuchsia-vcm"
              />
              <span className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-fuchsia-vcm">
                {kicker}
              </span>
            </div>
          </Reveal>
        )}

        {/* Title */}
        <h1
          aria-label={title}
          className="font-display text-[clamp(2.75rem,8vw,7rem)] leading-[0.92] tracking-tight text-white [text-wrap:balance]"
        >
          <span aria-hidden>
            <TextReveal text={title} className="block" />
          </span>
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <Reveal delay={0.3}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
              {subtitle}
            </p>
          </Reveal>
        )}
      </div>

      {/* ── Bottom fade into next section ──────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-ink"
      />
    </section>
  );
}
