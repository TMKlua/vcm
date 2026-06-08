"use client";
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { clampProgress, easeOutValue } from "@/lib/format";
export default function Counter({ to, suffix = "", duration = 1600 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0; let start = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = clampProgress(t - start, duration);
      setVal(easeOutValue(to, p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}
