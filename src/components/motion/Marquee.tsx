"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  useVelocity,
  wrap,
} from "framer-motion";
import { Volleyball } from "lucide-react";
import { useContent } from "@/content/ContentContext";

/**
 * Marquee — infinite horizontal scrolling band of words separated by a small
 * volleyball icon. The band loops seamlessly via a wrapped x translate.
 *
 * - Speed couples subtly to scroll velocity (clamped) so it accelerates as you
 *   scroll, then settles back to its base speed.
 * - Decorative: aria-hidden, overflow hidden on the band (no horizontal scroll).
 * - prefers-reduced-motion: renders a single static row, no loop, no scroll coupling.
 */

/** Repli ultime si le contenu ne fournit aucun mot. */
const DEFAULT_ITEMS = [
  "VOLLEY",
  "CLUB",
  "MARSEILLANAIS",
  "ÉTANG DE THAU",
  "DEPUIS 1992",
];

/** One row of words separated by a volleyball icon. Rendered multiple times to loop. */
function MarqueeRow({ items }: { items: string[] }) {
  return (
    <span className="flex shrink-0 items-center gap-8 pr-8 sm:gap-12 sm:pr-12">
      {items.map((word, i) => (
        <span key={`${word}-${i}`} className="flex items-center gap-8 sm:gap-12">
          <span className="font-display text-[clamp(2.5rem,7vw,5.5rem)] uppercase leading-none tracking-tight text-white/[0.08]">
            {word}
          </span>
          <Volleyball
            aria-hidden
            className="size-7 shrink-0 text-fuchsia-vcm/30 sm:size-10"
          />
        </span>
      ))}
    </span>
  );
}

interface MarqueeProps {
  /** Mots affichés. Par défaut : `text.marquee`, éditable depuis /admin. */
  items?: string[];
  className?: string;
  /** Reverse the scroll direction. */
  reverse?: boolean;
  /** Base speed in px/s. */
  speed?: number;
}

export default function Marquee({
  items,
  className,
  reverse = false,
  speed = 40,
}: MarqueeProps) {
  const fromContent = useContent().content.text.marquee;
  const words =
    items ?? (fromContent && fromContent.length > 0 ? fromContent : DEFAULT_ITEMS);
  const reduce = useReducedMotion();

  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  // Map raw scroll velocity to a clamped speed-factor (1 → ~3x at fast scroll).
  const velocityFactor = useTransform(
    scrollVelocity,
    [-2000, 0, 2000],
    [3, 1, 3],
    { clamp: true }
  );

  const directionFactor = useRef<number>(reverse ? -1 : 1);

  // One row is rendered four times; we wrap over a quarter of the track width.
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let moveBy = directionFactor.current * speed * (delta / 1000);
    moveBy *= velocityFactor.get();
    // Express movement as a percentage of one row (track is 4 rows = 400%).
    baseX.set(baseX.get() + (moveBy / 16));
  });

  if (reduce) {
    return (
      <div
        aria-hidden
        className={`relative w-full overflow-hidden ${className ?? ""}`}
      >
        <div className="flex w-full items-center justify-center py-6 sm:py-8">
          <MarqueeRow items={words} />
        </div>
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className={`relative w-full overflow-hidden ${className ?? ""}`}
    >
      <motion.div
        className="flex w-max items-center py-6 sm:py-8 will-change-transform"
        style={{ x }}
      >
        <MarqueeRow items={words} />
        <MarqueeRow items={words} />
        <MarqueeRow items={words} />
        <MarqueeRow items={words} />
      </motion.div>
    </div>
  );
}
