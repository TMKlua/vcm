"use client";
import { useReducedMotion, motion } from "framer-motion";

/**
 * BallTrajectory — aria-hidden SVG showing a volleyball serve/attack arc.
 * The dashed arc traces via pathLength; the ball travels along the arc via
 * keyframed cx/cy that follows the cubic-bezier arc analytically.
 * Respects prefers-reduced-motion: renders fully drawn, ball at end, no motion.
 */

// Cubic bezier arc: P0=(20,90) P1=(60,10) P2=(140,20) P3=(180,70)
// Ball keyframe positions sampled along the cubic bezier (t=0..1)
function cubicBezier(
  t: number,
  p0: number,
  p1: number,
  p2: number,
  p3: number
): number {
  const u = 1 - t;
  return (
    u * u * u * p0 +
    3 * u * u * t * p1 +
    3 * u * t * t * p2 +
    t * t * t * p3
  );
}

const SAMPLES = 8;
const P = {
  x: [20, 60, 140, 180],
  y: [90, 10, 20, 70],
} as const;

const keyframesX = Array.from({ length: SAMPLES + 1 }, (_, i) =>
  cubicBezier(i / SAMPLES, P.x[0], P.x[1], P.x[2], P.x[3])
);
const keyframesY = Array.from({ length: SAMPLES + 1 }, (_, i) =>
  cubicBezier(i / SAMPLES, P.y[0], P.y[1], P.y[2], P.y[3])
);

export default function BallTrajectory({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  const arcPath =
    `M ${P.x[0]} ${P.y[0]} C ${P.x[1]} ${P.y[1]}, ${P.x[2]} ${P.y[2]}, ${P.x[3]} ${P.y[3]}`;

  const endX = P.x[3];
  const endY = P.y[3];

  return (
    <svg
      aria-hidden
      className={`pointer-events-none ${className ?? ""}`}
      viewBox="0 0 200 100"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Ball radial gradient: white core → violet edge */}
        <radialGradient id="ball-grad" cx="38%" cy="36%" r="62%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#d8b4fe" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0.7" />
        </radialGradient>
        {/* Subtle ball glow */}
        <filter id="ball-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Arc trajectory */}
      {reduce ? (
        <path
          d={arcPath}
          stroke="url(#ball-grad)"
          strokeWidth="0.8"
          strokeDasharray="4 8"
          opacity={0.35}
        />
      ) : (
        <motion.path
          d={arcPath}
          stroke="rgba(168,85,247,0.5)"
          strokeWidth="0.8"
          strokeDasharray="4 8"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            pathLength: { duration: 1.8, ease: "easeOut" },
            opacity: { duration: 0.4 },
          }}
        />
      )}

      {/* Ball */}
      {reduce ? (
        <circle
          cx={endX}
          cy={endY}
          r={5}
          fill="url(#ball-grad)"
          filter="url(#ball-glow)"
          opacity={0.9}
        />
      ) : (
        <motion.circle
          r={5}
          fill="url(#ball-grad)"
          filter="url(#ball-glow)"
          initial={{ cx: keyframesX[0], cy: keyframesY[0], opacity: 0 }}
          whileInView={{
            cx: keyframesX,
            cy: keyframesY,
            opacity: [0, 1, 1, 1, 1, 1, 1, 1, 0.85],
          }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            cx: { duration: 1.8, ease: "easeOut", times: keyframesX.map((_, i) => i / SAMPLES) },
            cy: { duration: 1.8, ease: "easeOut", times: keyframesY.map((_, i) => i / SAMPLES) },
            opacity: { duration: 1.8, ease: "easeOut" },
          }}
        />
      )}
    </svg>
  );
}
