"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const SESSION_KEY = "vcm_loaded";

/** Detailed stylised volleyball — white body, violet→magenta seams, soft sheen. */
function Volleyball({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <defs>
        <radialGradient id="vb-body" cx="38%" cy="33%" r="75%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#f3ecff" />
          <stop offset="100%" stopColor="#d9c7f5" />
        </radialGradient>
        <linearGradient id="vb-seam" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#ff4dd2" />
        </linearGradient>
        <radialGradient id="vb-sheen" cx="34%" cy="28%" r="40%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="100" cy="100" r="94" fill="url(#vb-body)" />

      {/* Panel seams (stylised 3-axis volleyball pattern) */}
      <g
        fill="none"
        stroke="url(#vb-seam)"
        strokeWidth="5"
        strokeLinecap="round"
      >
        <path d="M100 6 C 66 54, 66 146, 100 194" />
        <path d="M100 6 C 134 54, 134 146, 100 194" />
        <path d="M6 100 C 58 66, 142 66, 194 100" />
        <path d="M6 100 C 58 134, 142 134, 194 100" />
        <path d="M30 30 C 78 70, 122 130, 170 170" opacity="0.5" />
        <path d="M170 30 C 122 70, 78 130, 30 170" opacity="0.5" />
      </g>

      {/* Sheen highlight */}
      <ellipse cx="74" cy="64" rx="46" ry="34" fill="url(#vb-sheen)" />
      <circle cx="100" cy="100" r="94" fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="1.5" />
    </svg>
  );
}

export default function Loader() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(SESSION_KEY)) {
      return;
    }
    setVisible(true);
    document.body.style.overflow = "hidden";

    const duration = reduce ? 250 : 2600;
    const timer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem(SESSION_KEY, "1");
    }, duration);

    return () => clearTimeout(timer);
  }, [reduce]);

  useEffect(() => {
    if (!visible && mounted) {
      document.body.style.overflow = "";
    }
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
              : { opacity: 0, transition: { duration: 0.6, ease: [0.65, 0, 0.35, 1] } }
          }
        >
          {/* Ambient gradient glow */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 size-[120vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(168,85,247,0.25) 0%, rgba(192,38,211,0.12) 40%, transparent 70%)",
            }}
            initial={reduce ? {} : { opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />

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

          {/* ── The ball: drops in, bounces, spins continuously ── */}
          <div className="relative flex flex-col items-center">
            <motion.div
              className="relative"
              // vertical drop + bounce
              initial={reduce ? { y: 0 } : { y: "-115vh" }}
              animate={
                reduce
                  ? { y: 0 }
                  : {
                      y: ["-115vh", "0vh", "-18vh", "0vh", "-6vh", "0vh"],
                    }
              }
              transition={
                reduce
                  ? { duration: 0 }
                  : {
                      duration: 1.7,
                      times: [0, 0.42, 0.58, 0.76, 0.88, 1],
                      ease: ["easeIn", "easeOut", "easeIn", "easeOut", "easeIn"],
                    }
              }
            >
              {/* squash on impact */}
              <motion.div
                initial={reduce ? {} : { scaleY: 1, scaleX: 1 }}
                animate={
                  reduce
                    ? {}
                    : {
                        scaleY: [1, 1, 0.82, 1, 0.92, 1],
                        scaleX: [1, 1, 1.18, 1, 1.08, 1],
                      }
                }
                transition={
                  reduce
                    ? {}
                    : { duration: 1.7, times: [0, 0.42, 0.46, 0.6, 0.78, 0.88] }
                }
                style={{ originY: 1 }}
              >
                {/* continuous spin */}
                <motion.div
                  className="size-[42vmin] max-w-[420px]"
                  style={{
                    filter: "drop-shadow(0 20px 50px rgba(168,85,247,0.45))",
                  }}
                  animate={reduce ? {} : { rotate: 360 }}
                  transition={
                    reduce
                      ? {}
                      : { duration: 2.4, ease: "linear", repeat: Infinity }
                  }
                >
                  <Volleyball className="size-full" />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Ground shadow that reacts to the bounce */}
            {!reduce && (
              <motion.div
                aria-hidden
                className="mt-[3vmin] h-[2.2vmin] w-[30vmin] max-w-[300px] rounded-[50%] blur-md"
                style={{ background: "rgba(168,85,247,0.45)" }}
                initial={{ opacity: 0, scaleX: 0.4 }}
                animate={{
                  opacity: [0, 0, 0.7, 0.4, 0.6, 0.55],
                  scaleX: [0.4, 0.4, 1.1, 0.8, 1, 0.95],
                }}
                transition={{ duration: 1.7, times: [0, 0.42, 0.46, 0.6, 0.78, 1] }}
              />
            )}
          </div>

          {/* ── Wordmark, appears as the ball settles ── */}
          <motion.h1
            className="text-gradient mt-[5vmin] font-display text-[clamp(2.6rem,9vw,6rem)] leading-none tracking-[0.12em]"
            initial={reduce ? {} : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduce ? {} : { duration: 0.6, delay: 1.25, ease: [0.16, 1, 0.3, 1] }
            }
          >
            VCM
          </motion.h1>

          <motion.p
            className="mt-2 font-sans text-[0.7rem] uppercase tracking-[0.3em]"
            style={{ color: "rgba(236,228,255,0.5)" }}
            initial={reduce ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={reduce ? {} : { duration: 0.6, delay: 1.55, ease: "easeOut" }}
          >
            Volley Club Marseillanais
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
