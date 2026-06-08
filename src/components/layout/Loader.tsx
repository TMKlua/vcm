"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const SESSION_KEY = "vcm_loaded";

/** Tiny animated volleyball ball arcing above the wordmark */
function VolleyBall({ reduce }: { reduce: boolean | null }) {
  // Arc: rises then falls — keyframed y translation
  if (reduce) {
    return (
      <div className="mx-auto mb-6 size-6 rounded-full"
        style={{ background: "radial-gradient(circle at 38% 36%, #ffffff 0%, #d8b4fe 50%, #a855f7 100%)" }}
      />
    );
  }
  return (
    <motion.div
      className="mx-auto mb-6 size-6 rounded-full"
      style={{
        background: "radial-gradient(circle at 38% 36%, #ffffff 0%, #d8b4fe 50%, #a855f7 100%)",
        boxShadow: "0 0 16px rgba(168,85,247,0.5)",
      }}
      animate={{
        x: [0, 30, 72],
        y: [0, -36, 0],
      }}
      transition={{
        duration: 1.1,
        ease: "easeOut",
        times: [0, 0.45, 1],
      }}
    />
  );
}

export default function Loader() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Only show once per browser session
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(SESSION_KEY)) {
      return;
    }
    setVisible(true);

    // Prevent body scroll while loader is visible
    document.body.style.overflow = "hidden";

    const duration = reduce ? 150 : 1500;
    const timer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem(SESSION_KEY, "1");
    }, duration);

    return () => clearTimeout(timer);
  }, [reduce]);

  // Restore scroll when loader hides
  useEffect(() => {
    if (!visible && mounted) {
      document.body.style.overflow = "";
    }
  }, [visible, mounted]);

  // Don't render anything until mounted (avoids SSR hydration mismatch)
  if (!mounted) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="vcm-loader"
          role="status"
          aria-label="Chargement Volley Club Marseillanais"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{ background: "#0a0418" }}
          initial={{ opacity: 1, y: 0 }}
          exit={
            reduce
              ? { opacity: 0 }
              : { opacity: 0, y: "-6%", transition: { duration: 0.5, ease: [0.4, 0, 1, 1] } }
          }
        >
          {/* Subtle noise-grain overlay for depth */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
              backgroundRepeat: "repeat",
              backgroundSize: "128px",
              opacity: 0.4,
            }}
          />

          {/* Ball arc */}
          <div className="relative flex w-48 justify-start">
            <VolleyBall reduce={reduce} />
          </div>

          {/* VCM wordmark */}
          <motion.h1
            className="text-gradient font-display text-[clamp(4rem,14vw,9rem)] leading-none tracking-widest"
            initial={reduce ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            VCM
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="mt-3 font-sans text-[0.7rem] tracking-[0.25em] uppercase"
            style={{ color: "rgba(236,228,255,0.45)" }}
            initial={reduce ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
          >
            Volley Club Marseillanais
          </motion.p>

          {/* Progress bar */}
          <div
            className="relative mt-10 w-[min(220px,50vw)] overflow-hidden rounded-full"
            style={{ height: "1px", background: "rgba(168,85,247,0.15)" }}
            aria-hidden
          >
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background: "linear-gradient(90deg, #a855f7, #ff4dd2)",
                boxShadow: "0 0 8px rgba(255,77,210,0.6)",
              }}
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={
                reduce
                  ? { duration: 0.15, ease: "linear" }
                  : { duration: 1.3, delay: 0.1, ease: [0.16, 1, 0.3, 1] }
              }
            />
            {/* Traveling glow highlight */}
            {!reduce && (
              <motion.div
                className="absolute inset-y-0 w-8 rounded-full"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)",
                  boxShadow: "0 0 12px rgba(255,77,210,0.9)",
                }}
                initial={{ left: "-2rem" }}
                animate={{ left: "100%" }}
                transition={{ duration: 1.3, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
