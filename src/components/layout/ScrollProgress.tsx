"use client";
import { useScroll, useSpring, motion } from "framer-motion";

/**
 * ScrollProgress — fixed 1px hairline bar at top of viewport.
 * scaleX is driven by scrollYProgress via a spring.
 * Gradient: violet-500 → fuchsia-vcm, matching .text-gradient utility.
 * Aria-hidden, pointer-events-none.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 right-0 top-0 z-50"
      style={{
        height: "1px",
        scaleX,
        transformOrigin: "left",
        background: "linear-gradient(90deg, #a855f7, #ff4dd2)",
        boxShadow: "0 0 8px rgba(255,77,210,0.4)",
      }}
    />
  );
}
