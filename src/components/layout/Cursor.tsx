"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/**
 * Cursor — custom dot + trailing ring cursor.
 * Disabled entirely (renders null, native cursor restored) when:
 *   - prefers-reduced-motion
 *   - coarse pointer (touch/stylus devices)
 * Guards all window access in useEffect (SSR safe).
 */
export default function Cursor() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(false); // true once mounted + fine pointer confirmed
  const [hovering, setHovering] = useState(false);
  const isCoarse = useRef(false);

  // Raw mouse position
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  // Dot: near-instant follow
  const dotX = useSpring(rawX, { stiffness: 800, damping: 35 });
  const dotY = useSpring(rawY, { stiffness: 800, damping: 35 });

  // Ring: languid follow
  const ringX = useSpring(rawX, { stiffness: 120, damping: 18 });
  const ringY = useSpring(rawY, { stiffness: 120, damping: 18 });

  useEffect(() => {
    // Check for coarse pointer (touch devices)
    if (typeof window === "undefined") return;
    isCoarse.current = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarse.current || reduce) return;

    setActive(true);
    document.body.style.cursor = "none";

    function onMove(e: MouseEvent) {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    }

    function onOver(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (
        target.closest("a, button, [data-cursor]") !== null
      ) {
        setHovering(true);
      } else {
        setHovering(false);
      }
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.body.style.cursor = "";
    };
  }, [reduce, rawX, rawY]);

  // Render nothing until mounted and confirmed fine pointer
  if (!active) return null;

  const DOT_SIZE = 5;
  const RING_SIZE = 28;

  return (
    <>
      {/* Dot — fuchsia fill, nearly instant */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed z-[200] rounded-full"
        style={{
          width: DOT_SIZE,
          height: DOT_SIZE,
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          background: "#ff4dd2",
          top: 0,
          left: 0,
        }}
      />

      {/* Ring — violet outline, languid follow, grows on hover */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed z-[199] rounded-full"
        style={{
          width: RING_SIZE,
          height: RING_SIZE,
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          top: 0,
          left: 0,
          border: hovering
            ? "1px solid rgba(255, 77, 210, 0.8)"
            : "1px solid rgba(168, 85, 247, 0.6)",
          background: "transparent",
        }}
        animate={{
          scale: hovering ? 1.8 : 1,
        }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      />
    </>
  );
}
