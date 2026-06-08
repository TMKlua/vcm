"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Detailed stylised volleyball — white panels, violet→magenta pinwheel seams.
 * The classic 3-fold "pinwheel" seam pattern that reads instantly as a volleyball.
 */
function Volleyball({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <defs>
        <radialGradient id="vb-body" cx="36%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="58%" stopColor="#f4eeff" />
          <stop offset="100%" stopColor="#cdb6ee" />
        </radialGradient>
        <linearGradient id="vb-seam" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="55%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#ff4dd2" />
        </linearGradient>
        <radialGradient id="vb-sheen" cx="32%" cy="26%" r="42%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="vb-shade" cx="68%" cy="74%" r="60%">
          <stop offset="60%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#3a1d63" stopOpacity="0.28" />
        </radialGradient>
      </defs>

      <circle cx="100" cy="100" r="95" fill="url(#vb-body)" />

      {/* Pinwheel seams: one S-curve repeated at 0°, 120°, 240° + a faint inner pair */}
      <g fill="none" stroke="url(#vb-seam)" strokeWidth="5.5" strokeLinecap="round">
        <path d="M100 6 C 36 56, 36 130, 92 196" />
        <path d="M100 6 C 36 56, 36 130, 92 196" transform="rotate(120 100 100)" />
        <path d="M100 6 C 36 56, 36 130, 92 196" transform="rotate(240 100 100)" />
      </g>
      <g fill="none" stroke="url(#vb-seam)" strokeWidth="2.5" strokeLinecap="round" opacity="0.55">
        <path d="M118 8 C 60 52, 56 126, 108 192" />
        <path d="M118 8 C 60 52, 56 126, 108 192" transform="rotate(120 100 100)" />
        <path d="M118 8 C 60 52, 56 126, 108 192" transform="rotate(240 100 100)" />
      </g>

      {/* Shading + sheen for volume */}
      <circle cx="100" cy="100" r="95" fill="url(#vb-shade)" />
      <ellipse cx="72" cy="60" rx="44" ry="32" fill="url(#vb-sheen)" />
      <circle cx="100" cy="100" r="95" fill="none" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="1.5" />
    </svg>
  );
}

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
              : { opacity: 0, scale: 1.04, transition: { duration: 0.6, ease: [0.65, 0, 0.35, 1] } }
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
            transition={reduce ? {} : { duration: 0.55, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
          >
            VCM
          </motion.h1>

          <motion.p
            className="mt-2 font-sans text-[0.7rem] uppercase tracking-[0.3em]"
            style={{ color: "rgba(236,228,255,0.5)" }}
            initial={reduce ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={reduce ? {} : { duration: 0.55, delay: 1.45, ease: "easeOut" }}
          >
            Volley Club Marseillanais
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
