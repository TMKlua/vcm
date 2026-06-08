"use client";

import { useRef, useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { timeline as defaultTimeline } from "@/data/timeline";
import type { TimelineEntry } from "@/types";

// ─── Individual entry card ────────────────────────────────────────────────────

interface EntryCardProps {
  entry: TimelineEntry;
  index: number;
  isRight: boolean;
}

function EntryCard({ entry, index, isRight }: EntryCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    /**
     * Layout: on mobile, all cards appear to the right of the line.
     * On desktop, even-indexed entries go left, odd-indexed go right.
     * We use a grid with 3 columns: [card | dot | card] on desktop,
     * and 2 columns: [dot | card] on mobile.
     */
    <div
      ref={cardRef}
      data-timeline-card
      className={[
        "timeline-card",
        "grid grid-cols-[2rem_1fr] gap-x-4",
        "sm:grid-cols-[1fr_2rem_1fr]",
        "items-start",
      ].join(" ")}
    >
      {/* Left card slot (desktop only) */}
      <div
        className={[
          "hidden sm:flex sm:justify-end",
          isRight ? "sm:invisible" : "",
        ].join(" ")}
      >
        {!isRight && (
          <CardContent entry={entry} index={index} align="right" />
        )}
      </div>

      {/* Dot / node */}
      <div className="flex flex-col items-center" aria-hidden>
        {/* top spacer so dot aligns with card top-ish */}
        <div className="mt-1 size-4 shrink-0 rounded-full border-2 border-violet-500 bg-night shadow-[0_0_12px_rgba(168,85,247,0.6)] timeline-dot" />
      </div>

      {/* Right card slot */}
      <div className={!isRight ? "sm:invisible hidden sm:flex" : ""}>
        {/* Mobile: always render card on the right side of the dot */}
        <div className="sm:hidden w-full">
          <CardContent entry={entry} index={index} align="left" />
        </div>
        {/* Desktop: only render if isRight */}
        {isRight && (
          <div className="hidden sm:block">
            <CardContent entry={entry} index={index} align="left" />
          </div>
        )}
      </div>
    </div>
  );
}

interface CardContentProps {
  entry: TimelineEntry;
  index: number;
  align: "left" | "right";
}

function CardContent({ entry, align }: CardContentProps) {
  return (
    <div
      className={[
        "group relative rounded-2xl border border-white/[0.08] bg-night/70 p-5 sm:p-7",
        "backdrop-blur-sm transition-all duration-300",
        "hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-500/10",
        align === "right" ? "sm:mr-6" : "sm:ml-6",
        "w-full max-w-[28rem]",
      ].join(" ")}
    >
      {/* Subtle inner glow on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(168,85,247,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Year */}
      <span
        className="block font-display text-[clamp(2.4rem,5vw,3.5rem)] leading-none tracking-tight text-gradient"
        aria-label={`Année ${entry.year}`}
      >
        {entry.year}
      </span>

      {/* Title */}
      <h3 className="mt-3 font-display text-base leading-snug text-white sm:text-lg">
        {entry.title}
      </h3>

      {/* Description */}
      <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-[0.9rem]">
        {entry.description}
      </p>
    </div>
  );
}

// ─── Main Timeline component ──────────────────────────────────────────────────

interface TimelineProps {
  entries?: TimelineEntry[];
}

export default function Timeline({ entries = defaultTimeline }: TimelineProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    // Guard: reduced-motion → full progress line, no animation
    if (reducedMotion) {
      if (progressRef.current) {
        progressRef.current.style.transform = "scaleY(1)";
      }
      return;
    }

    // Check via matchMedia as well (covers cases where framer-motion hook isn't ready)
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      if (progressRef.current) {
        progressRef.current.style.transform = "scaleY(1)";
      }
      return;
    }

    let ctx: ReturnType<typeof import("gsap").gsap.context> | null = null;

    async function initGsap() {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      // Refresh ScrollTrigger after Lenis has had time to set up
      ScrollTrigger.refresh();

      ctx = gsap.context(() => {
        // ── Progress line scrub ────────────────────────────────────────
        if (progressRef.current) {
          gsap.fromTo(
            progressRef.current,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              transformOrigin: "top center",
              scrollTrigger: {
                trigger: rootRef.current,
                start: "top center",
                end: "bottom center",
                scrub: 0.5,
              },
            }
          );
        }

        // ── Per-card entrance animations ───────────────────────────────
        const cards =
          rootRef.current?.querySelectorAll<HTMLElement>("[data-timeline-card]");

        cards?.forEach((card, i) => {
          const isRight = i % 2 !== 0;
          const xFrom = isRight ? 48 : -48;

          gsap.fromTo(
            card,
            { opacity: 0, x: xFrom },
            {
              opacity: 1,
              x: 0,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            }
          );
        });

        // ── Dot highlight ──────────────────────────────────────────────
        const dots =
          rootRef.current?.querySelectorAll<HTMLElement>(".timeline-dot");

        dots?.forEach((dot) => {
          ScrollTrigger.create({
            trigger: dot,
            start: "top 55%",
            onEnter: () => {
              gsap.to(dot, {
                backgroundColor: "#a855f7",
                borderColor: "#ff4dd2",
                boxShadow: "0 0 18px rgba(255,77,210,0.7)",
                duration: 0.4,
                ease: "power2.out",
              });
            },
          });
        });
      }, rootRef);
    }

    initGsap().catch(console.error);

    return () => {
      ctx?.revert();
    };
  }, [reducedMotion]);

  return (
    <div
      ref={rootRef}
      className="relative"
      role="list"
      aria-label="Chronologie du club"
    >
      {/* ── Central track line ──────────────────────────────────────── */}
      {/* Mobile: left-aligned (2rem from left = dot center) */}
      {/* Desktop: centered */}
      <div
        ref={trackRef}
        aria-hidden
        className={[
          "absolute top-0 bottom-0",
          // Mobile: left side (col 1 center ≈ 1rem)
          "left-4 w-px",
          // Desktop: center of 3-col grid (col 2 center)
          "sm:left-1/2 sm:-translate-x-[0.5px]",
          "bg-white/10",
        ].join(" ")}
      />

      {/* ── Progress line (GSAP-driven scaleY) ──────────────────────── */}
      <div
        ref={progressRef}
        aria-hidden
        className={[
          "absolute top-0 bottom-0 origin-top",
          "left-4 w-px",
          "sm:left-1/2 sm:-translate-x-[0.5px]",
          // SSR / no-JS: start invisible (JS sets scaleY from 0→1)
          // Reduced motion: JS will set scaleY to 1
          reducedMotion ? "" : "scale-y-0",
        ].join(" ")}
        style={{
          background: "linear-gradient(to bottom, #7c3aed, #a855f7, #c026d3, #ff4dd2)",
          transformOrigin: "top center",
        }}
      />

      {/* ── Entries ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-14 sm:gap-20" role="presentation">
        {entries.map((entry, i) => (
          <div key={entry.year} role="listitem">
            <EntryCard entry={entry} index={i} isRight={i % 2 !== 0} />
          </div>
        ))}
      </div>
    </div>
  );
}
