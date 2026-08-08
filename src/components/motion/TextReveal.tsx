"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/* ──────────────────────────────────────────────────────────────────────────
 * TextReveal — les mots montent un par un depuis le bas d'un masque.
 *
 * Deux garde-fous, parce que sur iOS ces titres restaient parfois invisibles :
 *
 *  1. Filet de sécurité temporel. Les mots sont décalés de 110 % dans un
 *     conteneur `overflow-hidden` : si l'animation ne part jamais, le texte
 *     n'est pas « pas encore animé », il est *absent de l'écran*. On force donc
 *     l'état révélé après un court délai, quoi qu'il arrive côté détection de
 *     visibilité.
 *
 *  2. Dégradé porté par le mot lui-même (`wordClassName`), et non par un parent.
 *     `background-clip: text` sur un ancêtre dont l'enfant est transformé ne
 *     peint rien sur WebKit — le texte devient transparent sur transparent.
 *
 * `prefers-reduced-motion` : rendu direct, sans masque ni transform.
 * ────────────────────────────────────────────────────────────────────────── */

export default function TextReveal({
  text,
  className,
  wordClassName,
}: {
  text: string;
  className?: string;
  /** Classes posées sur chaque mot — c'est ici que va un éventuel dégradé. */
  wordClassName?: string;
}) {
  const words = text.split(" ");
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  // Filet : au-delà de ce délai le texte s'affiche, vu ou pas vu.
  const [timedOut, setTimedOut] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setTimedOut(true), 1200);
    return () => clearTimeout(id);
  }, []);

  const revealed = inView || timedOut;

  if (reduce) {
    return (
      <span ref={ref} className={className}>
        <span className={wordClassName}>{text}</span>
      </span>
    );
  }

  return (
    <span ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="inline-block overflow-hidden align-bottom pt-[0.2em] -mt-[0.2em] pb-[0.1em] -mb-[0.1em]"
        >
          <motion.span
            className={`inline-block ${wordClassName ?? ""}`}
            initial={{ y: "110%" }}
            animate={revealed ? { y: 0 } : { y: "110%" }}
            transition={{
              duration: 0.6,
              delay: revealed ? i * 0.05 : 0,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}
