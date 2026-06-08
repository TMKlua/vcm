"use client";

import CourtLines from "@/components/motion/CourtLines";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import Counter from "@/components/ui/Counter";
import { stats } from "@/data/stats";

export default function StatsSection() {
  return (
    <section
      aria-label="Chiffres clés du club"
      className="relative isolate overflow-hidden bg-night py-20 sm:py-24"
    >
      {/* ── Decorative: CourtLines watermark ──────────────────────────────── */}
      <CourtLines
        className="absolute inset-0 -z-10 h-full w-full text-violet-700 opacity-[0.35]"
      />

      {/* ── Rich violet gradient band ─────────────────────────────────────── */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20"
        style={{
          background:
            "linear-gradient(135deg, rgba(124,58,237,0.18) 0%, rgba(21,8,46,1) 40%, rgba(26,11,58,0.9) 60%, rgba(192,38,211,0.14) 100%)",
        }}
      />

      {/* Subtle grain */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ── Section label ─────────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-12">
        <div className="mb-12 text-center">
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-fuchsia-vcm">
            En chiffres
          </span>
        </div>

        {/* ── Stats grid ──────────────────────────────────────────────────── */}
        <StaggerGroup className="grid grid-cols-2 gap-px lg:grid-cols-4">
          {stats.map((stat, i) => (
            <StaggerItem key={i}>
              <div className="group relative flex flex-col items-center justify-center gap-3 px-6 py-10 text-center">

                {/* Vertical divider — visible on desktop, hide on first item */}
                {i > 0 && (
                  <div
                    aria-hidden
                    className="absolute left-0 top-1/2 hidden h-16 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-white/10 to-transparent lg:block"
                  />
                )}

                {/* The big animated number */}
                <div
                  className="font-display text-gradient text-[clamp(3rem,7vw,5.5rem)] leading-none tracking-tight [-webkit-text-fill-color:transparent]"
                >
                  <Counter
                    to={stat.value}
                    suffix={stat.suffix ?? ""}
                    duration={1800}
                  />
                </div>

                {/* Label */}
                <p className="max-w-[10rem] text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-white/70 transition-colors duration-300 group-hover:text-white/75">
                  {stat.label}
                </p>

                {/* Hover accent: faint glow dot under number */}
                <span
                  aria-hidden
                  className="absolute bottom-6 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-fuchsia-vcm opacity-0 shadow-[0_0_10px_3px_rgba(255,77,210,0.5)] transition-opacity duration-500 group-hover:opacity-100"
                />
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>

        {/* ── Bottom rule ───────────────────────────────────────────────────── */}
        <div
          aria-hidden
          className="mt-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />
      </div>
    </section>
  );
}
