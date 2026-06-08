"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryImage } from "@/types";

interface LightboxProps {
  /** The (filtered) set of images the lightbox navigates within. */
  images: GalleryImage[];
  /** Index of the currently displayed image, or `null` when closed. */
  index: number | null;
  /** Called when the lightbox should close. */
  onClose: () => void;
  /** Called when navigation changes the active index. */
  onIndexChange: (i: number) => void;
}

/**
 * Accessible full-screen image lightbox.
 *
 * Controlled component: the parent owns `index` (or `null` when closed).
 * - Keyboard: ArrowLeft / ArrowRight navigate (clamped), Escape closes.
 * - Focus: moves focus to the close button on open, restores focus to the
 *   previously-focused element on close, and traps Tab within the dialog.
 * - Body scroll is locked while open.
 * - Respects prefers-reduced-motion (enter/exit transitions curtailed).
 */
export default function Lightbox({
  images,
  index,
  onClose,
  onIndexChange,
}: LightboxProps) {
  const reduce = useReducedMotion();
  const isOpen = index !== null;

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  // Element focused before the dialog opened, to restore on close.
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const count = images.length;
  const current = isOpen && index! >= 0 && index! < count ? images[index!] : null;

  const goPrev = useCallback(() => {
    if (index === null) return;
    if (index > 0) onIndexChange(index - 1);
  }, [index, onIndexChange]);

  const goNext = useCallback(() => {
    if (index === null) return;
    if (index < count - 1) onIndexChange(index + 1);
  }, [index, count, onIndexChange]);

  // ── Capture the trigger element + body scroll lock + focus restore ──────────
  useEffect(() => {
    if (!isOpen) return;
    if (typeof document === "undefined") return;

    previouslyFocused.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    // Lock body scroll, compensating for the scrollbar width to avoid layout shift.
    const { body, documentElement } = document;
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Move focus into the dialog.
    const raf = requestAnimationFrame(() => closeBtnRef.current?.focus());

    return () => {
      cancelAnimationFrame(raf);
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
      // Restore focus to the element that opened the lightbox.
      previouslyFocused.current?.focus?.();
    };
  }, [isOpen]);

  // ── Keyboard handling: navigation, close, and focus trap ────────────────────
  useEffect(() => {
    if (!isOpen) return;
    if (typeof window === "undefined") return;

    const onKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          e.preventDefault();
          onClose();
          break;
        case "ArrowLeft":
          e.preventDefault();
          goPrev();
          break;
        case "ArrowRight":
          e.preventDefault();
          goNext();
          break;
        case "Tab": {
          // Basic focus trap: cycle Tab among the dialog's interactive controls.
          const dialog = dialogRef.current;
          if (!dialog) return;
          const focusables = dialog.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
          );
          if (focusables.length === 0) return;
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          const active = document.activeElement;

          if (e.shiftKey) {
            if (active === first || !dialog.contains(active)) {
              e.preventDefault();
              last.focus();
            }
          } else if (active === last || !dialog.contains(active)) {
            e.preventDefault();
            first.focus();
          }
          break;
        }
        default:
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose, goPrev, goNext]);

  const overlayTransition = reduce
    ? { duration: 0 }
    : { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const };

  const imageTransition = reduce
    ? { duration: 0 }
    : { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const };

  const hasPrev = index !== null && index > 0;
  const hasNext = index !== null && index < count - 1;

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Galerie photo"
          ref={dialogRef}
          className="fixed inset-0 z-[120] flex flex-col bg-ink/95 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={overlayTransition}
          onClick={onClose}
        >
          {/* ── Top bar: counter + close ───────────────────────────────────── */}
          <div className="relative z-10 flex items-center justify-between gap-4 px-5 py-4 sm:px-8">
            <span
              className="font-display text-sm tracking-wide text-white/60 tabular-nums"
              aria-live="polite"
            >
              {(index ?? 0) + 1}{" "}
              <span className="text-white/30">/ {count}</span>
            </span>

            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              aria-label="Fermer la galerie"
              className="inline-flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/80 transition-colors hover:border-fuchsia-vcm/50 hover:bg-fuchsia-vcm/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>

          {/* ── Stage ──────────────────────────────────────────────────────── */}
          <div className="relative flex flex-1 items-center justify-center px-4 pb-2 sm:px-20">
            {/* Prev */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              disabled={!hasPrev}
              aria-label="Image précédente"
              className="absolute left-2 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/80 transition-colors hover:border-fuchsia-vcm/50 hover:bg-fuchsia-vcm/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:border-white/15 disabled:hover:bg-white/[0.04] disabled:hover:text-white/80 sm:left-5"
            >
              <ChevronLeft className="size-6" aria-hidden />
            </button>

            {/* Image (clicks here must not close) */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={current.src}
                className="relative flex max-h-full max-w-full flex-col items-center"
                initial={reduce ? false : { opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                transition={imageTransition}
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={current.src}
                  alt={current.alt}
                  width={current.width}
                  height={current.height}
                  sizes="(max-width: 640px) 92vw, 80vw"
                  priority
                  className="h-auto max-h-[72vh] w-auto max-w-full rounded-xl object-contain shadow-2xl shadow-black/60 sm:max-h-[78vh]"
                />
              </motion.figure>
            </AnimatePresence>

            {/* Next */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              disabled={!hasNext}
              aria-label="Image suivante"
              className="absolute right-2 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/80 transition-colors hover:border-fuchsia-vcm/50 hover:bg-fuchsia-vcm/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:border-white/15 disabled:hover:bg-white/[0.04] disabled:hover:text-white/80 sm:right-5"
            >
              <ChevronRight className="size-6" aria-hidden />
            </button>
          </div>

          {/* ── Caption (clicks here must not close) ───────────────────────── */}
          <div
            className="relative z-10 px-5 pb-6 pt-3 text-center sm:px-8"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="mb-1.5 inline-block text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-fuchsia-vcm">
              {current.category}
            </span>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-white/70 [text-wrap:balance]">
              {current.alt}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
