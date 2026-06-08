"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Volleyball from "@/components/motion/Volleyball";

export default function Loader() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Show on EVERY load/reload (no session gate).
  useEffect(() => {
    setMounted(true);
    setVisible(true);
    document.body.style.overflow = "hidden";

    const duration = reduce ? 300 : 2500;
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [reduce]);

  useEffect(() => {
    if (!visible && mounted) document.body.style.overflow = "";
  }, [visible, mounted]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="vcm-loader"
          role="status"
          aria-label="Chargement Volley Club Marseillanais"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "#0a0418" }}
          initial={{ opacity: 1 }}
          exit={
            reduce
              ? { opacity: 0, transition: { duration: 0.2 } }
              : { opacity: 0, transition: { duration: 0.55, delay: 0.35, ease: [0.65, 0, 0.35, 1] } }
          }
        >
          {/* Ambient gradient glow */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 size-[130vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(168,85,247,0.22) 0%, rgba(192,38,211,0.12) 42%, transparent 70%)",
            }}
            initial={reduce ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          {/* Impact flash at the moment the ball settles */}
          {!reduce && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 size-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
              style={{ background: "radial-gradient(circle, rgba(255,255,255,0.5), transparent 60%)" }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: [0, 0, 0.8, 0], scale: [0.6, 0.6, 1.3, 1.6] }}
              transition={{ duration: 1.3, times: [0, 0.46, 0.6, 1], ease: "easeOut" }}
            />
          )}

          {/* Noise grain */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
              backgroundRepeat: "repeat",
              backgroundSize: "128px",
            }}
          />

          {/* ── The ball: enters full-screen then recedes (smash) to land at center ── */}
          <motion.div
            className="relative size-[46vmin] max-w-[460px]"
            style={{ filter: "drop-shadow(0 24px 60px rgba(168,85,247,0.5))" }}
            initial={
              reduce
                ? { scale: 1, opacity: 1 }
                : { scale: 3.4, opacity: 0, x: "8vw", y: "-6vh", rotate: -70 }
            }
            animate={
              reduce
                ? { scale: 1, opacity: 1 }
                : {
                    scale: [3.4, 0.9, 1.06, 1],
                    opacity: [0, 1, 1, 1],
                    x: ["8vw", "0vw", "0vw", "0vw"],
                    y: ["-6vh", "0vh", "0vh", "0vh"],
                    rotate: [-70, 8, -3, 0],
                  }
            }
            transition={
              reduce
                ? { duration: 0 }
                : { duration: 1.5, times: [0, 0.5, 0.78, 1], ease: [0.22, 1, 0.36, 1] }
            }
            exit={
              reduce
                ? { opacity: 0, transition: { duration: 0.2 } }
                : {
                    // Fly to the upper-right, shrinking to the size of the hero
                    // ball so it visually "places itself" on the home page.
                    x: "32vw",
                    y: "-25vh",
                    scale: 0.55,
                    opacity: [1, 1, 0],
                    transition: { duration: 0.8, ease: [0.5, 0, 0.2, 1], times: [0, 0.75, 1] },
                  }
            }
          >
            {/* gentle idle spin layered on top of the entrance */}
            <motion.div
              className="size-full"
              animate={reduce ? {} : { rotate: 360 }}
              transition={reduce ? {} : { duration: 6, ease: "linear", repeat: Infinity }}
            >
              <Volleyball className="size-full" />
            </motion.div>
          </motion.div>

          {/* ── Wordmark, appears as the ball settles ── */}
          <motion.h1
            className="text-gradient mt-[5vmin] font-display text-[clamp(2.6rem,9vw,6rem)] leading-none tracking-[0.12em]"
            initial={reduce ? {} : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 14, transition: { duration: 0.35 } }}
            transition={reduce ? {} : { duration: 0.55, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
          >
            VCM
          </motion.h1>

          <motion.p
            className="mt-2 font-sans text-[0.7rem] uppercase tracking-[0.3em]"
            style={{ color: "rgba(236,228,255,0.5)" }}
            initial={reduce ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={reduce ? {} : { duration: 0.55, delay: 1.45, ease: "easeOut" }}
          >
            Volley Club Marseillanais
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
