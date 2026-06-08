"use client";
import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
export default function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 150, damping: 12 });
  const ry = useSpring(useMotionValue(0), { stiffness: 150, damping: 12 });
  function onMove(e: React.MouseEvent) {
    const r = ref.current!.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 12); rx.set(-py * 12);
  }
  function reset() { rx.set(0); ry.set(0); }
  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={reset} style={{ rotateX: rx, rotateY: ry, transformPerspective: 800 }} className={className}>
      {children}
    </motion.div>
  );
}
