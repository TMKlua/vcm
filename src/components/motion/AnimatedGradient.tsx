"use client";
import { motion, useReducedMotion } from "framer-motion";
export default function AnimatedGradient({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}>
      <motion.div className="absolute -top-1/3 left-1/4 size-[60vw] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(168,85,247,.35), transparent 60%)" }}
        animate={reduce ? undefined : { x: [0, 60, 0], y: [0, 40, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute bottom-0 right-1/5 size-[50vw] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(192,38,211,.30), transparent 60%)" }}
        animate={reduce ? undefined : { x: [0, -50, 0], y: [0, -30, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} />
    </div>
  );
}
