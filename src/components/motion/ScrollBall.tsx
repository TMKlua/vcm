"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

/**
 * ScrollBall — a decorative volleyball that rotates and drifts along a gentle
 * arc as it scrolls through the viewport.
 *
 * - Uses scroll progress over [start end → end start] to drive rotate + a small
 *   x/y arc translate (GPU transforms only).
 * - Decorative: aria-hidden, pointer-events-none. Low opacity, meant to frame
 *   not cover content.
 * - prefers-reduced-motion: renders static, no scroll bindings.
 */

interface ScrollBallProps {
  className?: string;
  /** Rotation at scroll start (deg). */
  from?: number;
  /** Rotation at scroll end (deg). */
  to?: number;
}

function BallSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <radialGradient id="scrollball-grad" cx="38%" cy="34%" r="66%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="55%" stopColor="#d8b4fe" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0.7" />
        </radialGradient>
      </defs>
      {/* Ball body */}
      <circle cx="50" cy="50" r="46" fill="url(#scrollball-grad)" />
      {/* Three curved seams */}
      <g
        stroke="rgba(124,58,237,0.55)"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      >
        <path d="M50 4 C 30 30, 30 70, 50 96" />
        <path d="M9 32 C 38 44, 62 44, 91 32" />
        <path d="M14 74 C 36 58, 64 58, 86 74" />
      </g>
      {/* Soft highlight */}
      <ellipse cx="36" cy="32" rx="13" ry="8" fill="#ffffff" opacity="0.35" />
    </svg>
  );
}

export default function ScrollBall({
  className,
  from = 0,
  to = 360,
}: ScrollBallProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rotate = useTransform(scrollYProgress, [0, 1], [from, to]);
  // Gentle parabolic arc: rises slightly toward the middle, drifts sideways.
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [40, -24, 40]);
  const x = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  if (reduce) {
    return (
      <div
        ref={ref}
        aria-hidden
        className={`pointer-events-none ${className ?? ""}`}
      >
        <BallSvg className="h-full w-full" />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none ${className ?? ""}`}
    >
      <motion.div className="h-full w-full will-change-transform" style={{ rotate, x, y }}>
        <BallSvg className="h-full w-full" />
      </motion.div>
    </div>
  );
}
