"use client";
import { motion, useReducedMotion } from "framer-motion";

/**
 * CourtLines — stylised volleyball court blueprint overlay.
 * Aria-hidden, pointer-events-none. Animates path tracing on whileInView.
 * Static (full pathLength) when prefers-reduced-motion is set.
 */
export default function CourtLines({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  /*
   * Court dimensions in SVG viewBox units (0 0 200 120):
   *   Outer rect: 10,10 → 190,110  (180×100)
   *   Center line: x=100, y=10→110
   *   Attack lines: x=40 and x=160, y=10→110
   *   Net: x=97→103, y=10→110  (thick band representing net posts + top tape)
   *
   * All paths are listed so each can be individually traced.
   */
  const paths = [
    // Outer rectangle (split into 4 sides for sequential reveal)
    { d: "M10 10 L190 10", key: "top" },
    { d: "M190 10 L190 110", key: "right" },
    { d: "M190 110 L10 110", key: "bottom" },
    { d: "M10 110 L10 10", key: "left" },
    // Center line
    { d: "M100 10 L100 110", key: "center" },
    // Attack lines
    { d: "M40 10 L40 110", key: "attack-left" },
    { d: "M160 10 L160 110", key: "attack-right" },
    // Net (vertical dashed line at center — styled via strokeDasharray on the element)
    { d: "M100 10 L100 110", key: "net" },
  ];

  // Stagger delay per path
  const delays = [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 0.6];

  return (
    <svg
      aria-hidden
      className={`pointer-events-none ${className ?? ""}`}
      viewBox="0 0 200 120"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background court lines */}
      {paths.map(({ d, key }, i) => {
        const isNet = key === "net";
        const baseProps = {
          d,
          stroke: "currentColor",
          strokeWidth: isNet ? 2.5 : 0.6,
          strokeLinecap: "round" as const,
          strokeDasharray: isNet ? "3 4" : undefined,
          opacity: isNet ? 0.12 : 0.07,
        };

        if (reduce) {
          return <path key={key} {...baseProps} />;
        }

        return (
          <motion.path
            key={key}
            {...baseProps}
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{
              pathLength: 1,
              opacity: isNet ? 0.12 : 0.07,
            }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              pathLength: {
                duration: isNet ? 0.6 : 1.2,
                delay: delays[i],
                ease: [0.25, 0, 0, 1],
              },
              opacity: {
                duration: 0.3,
                delay: delays[i],
              },
            }}
          />
        );
      })}
    </svg>
  );
}
