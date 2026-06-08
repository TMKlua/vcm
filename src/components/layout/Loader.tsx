"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Volleyball from "@/components/motion/Volleyball";

type ExitTarget = { dx: number; dy: number; scale: number } | "fade" | null;

export default function Loader() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [exitTarget, setExitTarget] = useState<ExitTarget>(null);
  const ballRef = useRef<HTMLDivElement>(null);

  // Show on every load. After a hold, measure the hero ball and compute the
  // exact landing transform so the loader ball flies onto it pixel-perfectly.
  useEffect(() => {
    setMounted(true);
    setVisible(true);
    document.body.style.overflow = "hidden";

    const HOLD = reduce ? 250 : 1900;
    const t = setTimeout(() => {
      if (reduce) {
        setExitTarget("fade");
        return;
      }
      const hero = document.getElementById("vcm-hero-ball");
      const ball = ballRef.current;
      if (hero && ball) {
        const h = hero.getBoundingClientRect();
        const b = ball.getBoundingClientRect();
        if (h.width > 0 && b.width > 0) {
          setExitTarget({
            dx: h.left + h.width / 2 - (b.left + b.width / 2),
            dy: h.top + h.height / 2 - (b.top + b.height / 2),
            scale: h.width / b.width,
          });
          return;
        }
      }
      setExitTarget("fade");
    }, HOLD);

    return () => clearTimeout(t);
  }, [reduce]);

  // Once the exit target is known (committed in a render where the loader is
  // still visible), trigger the unmount on the next frame so AnimatePresence
  // reads the up-to-date exit prop.
  useEffect(() => {
    if (exitTarget !== null && visible) {
      const id = requestAnimationFrame(() => setVisible(false));
      return () => cancelAnimationFrame(id);
    }
  }, [exitTarget, visible]);

  useEffect(() => {
    if (!visible && mounted) document.body.style.overflow = "";
  }, [visible, mounted]);

  if (!mounted) return null;

  const ballExit =
    reduce || exitTarget === "fade" || exitTarget === null
      ? { opacity: 0, scale: 0.6, transition: { duration: 0.4 } }
      : {
          // SMASH onto the hero ball: small wind-up, fast spike, full spin so
          // the seams realign with the (static) hero ball. Lands exactly on it.
          x: [0, -26, exitTarget.dx],
          y: [0, 16, exitTarget.dy],
          scale: [1, 1.12, exitTarget.scale],
          rotate: [0, -18, 360],
          transition: {
            duration: 0.8,
            times: [0, 0.2, 1],
            ease: [0.5, 0, 0.18, 1] as [number, number, number, number],
          },
        };

  return (
    <AnimatePresence
      onExitComplete={() => {
        try {
          window.dispatchEvent(new Event("vcm:loader-landed"));
        } catch {
          /* no-op */
        }
      }}
    >
      {visible && (
        <motion.div
          key="vcm-loader"
          role="status"
          aria-label="Chargement Volley Club Marseillanais"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={reduce ? { opacity: 0, transition: { duration: 0.2 } } : { transition: { duration: 0.9 } }}
        >
          {/* Dark backdrop — fades out EARLY so the home page is already visible
              while the ball flies onto it: no visible cut. */}
          <motion.div
            aria-hidden
            className="absolute inset-0"
            style={{ background: "#0a0418" }}
            initial={{ opacity: 1 }}
            exit={
              reduce
                ? { opacity: 0, transition: { duration: 0.2 } }
                : { opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }
            }
          >
            <motion.div
              className="pointer-events-none absolute left-1/2 top-1/2 size-[130vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(168,85,247,0.22) 0%, rgba(192,38,211,0.12) 42%, transparent 70%)",
              }}
              initial={reduce ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
                backgroundRepeat: "repeat",
                backgroundSize: "128px",
              }}
            />
          </motion.div>

          {/* Impact flash when the ball settles */}
          {!reduce && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 size-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
              style={{ background: "radial-gradient(circle, rgba(255,255,255,0.5), transparent 60%)" }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: [0, 0, 0.7, 0], scale: [0.6, 0.6, 1.2, 1.5] }}
              transition={{ duration: 1.1, times: [0, 0.5, 0.66, 1], ease: "easeOut" }}
            />
          )}

          {/* The ball: smash-in, then fly onto the hero ball */}
          <motion.div
            ref={ballRef}
            className="relative z-10 size-[46vmin] max-w-[460px]"
            style={{ filter: "drop-shadow(0 24px 60px rgba(168,85,247,0.5))" }}
            initial={reduce ? { scale: 1, opacity: 1 } : { scale: 3.4, opacity: 0, x: "8vw", y: "-6vh", rotate: -70 }}
            animate={
              reduce
                ? { scale: 1, opacity: 1 }
                : { scale: [3.4, 0.92, 1.05, 1], opacity: [0, 1, 1, 1], x: ["8vw", "0vw", "0vw", "0vw"], y: ["-6vh", "0vh", "0vh", "0vh"], rotate: [-70, 6, -2, 0] }
            }
            transition={reduce ? { duration: 0 } : { duration: 1.0, times: [0, 0.5, 0.8, 1], ease: [0.22, 1, 0.36, 1] }}
            exit={ballExit}
          >
            <Volleyball className="size-full" />
          </motion.div>

          {/* Wordmark — shown promptly */}
          <motion.h1
            className="text-gradient relative z-30 mt-[5vmin] font-display text-[clamp(2.6rem,9vw,6rem)] leading-none tracking-[0.12em]"
            style={{ filter: "drop-shadow(0 4px 24px rgba(10,4,24,0.55))" }}
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12, transition: { duration: 0.22 } }}
          >
            VCM
          </motion.h1>

          <motion.p
            className="relative z-30 mt-2 font-sans text-[0.72rem] font-medium uppercase tracking-[0.3em] text-white"
            style={{ textShadow: "0 2px 16px rgba(10,4,24,0.7)" }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.18 } }}
          >
            Volley Club Marseillanais
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
