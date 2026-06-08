"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

/**
 * ParallaxImage — wraps children (typically a next/image fill) and applies a
 * subtle scroll-linked vertical translate.
 *
 * The inner element is overscaled (scale 1.1) so the ±amount translate never
 * reveals edges / gaps. Only transforms are animated (GPU-friendly).
 *
 * - The wrapper must have its own size/aspect ratio; it clips via overflow-hidden.
 * - prefers-reduced-motion: no transform binding, inner sits flush (scale 1).
 */

interface ParallaxImageProps {
  children: React.ReactNode;
  className?: string;
  /** Max vertical travel in px (applied as ±amount). Default 30. */
  amount?: number;
}

export default function ParallaxImage({
  children,
  className,
  amount = 30,
}: ParallaxImageProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount]);

  if (reduce) {
    return (
      <div ref={ref} className={`relative overflow-hidden ${className ?? ""}`}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ""}`}>
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{ y, scale: 1.1 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
