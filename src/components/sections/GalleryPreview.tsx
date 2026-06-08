"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import Reveal from "@/components/motion/Reveal";
import TextReveal from "@/components/motion/TextReveal";
import ParallaxImage from "@/components/motion/ParallaxImage";
import MagneticButton from "@/components/ui/MagneticButton";
import { useContent } from "@/content/ContentContext";

/**
 * GalleryPreview — immersive bento-mosaic gallery teaser.
 *
 * Layout strategy (8 images picked from the 14-image gallery):
 *   - Desktop (lg): asymmetric CSS grid with 3 columns and mixed row-spans.
 *     Tile layout: [large-feat | tall | tall ] / [wide | square | square ]
 *     yielding a dynamic, magazine-editorial bento feel.
 *   - Mobile: 2-column grid, uniform aspect ratio, simplified.
 *
 * Hover: image zoom + violet/magenta overlay with category label.
 * No lightbox — that's the full /galerie page.
 */

// Pick 8 representative images from the 14 available
const PREVIEW_INDICES = [0, 4, 2, 7, 8, 10, 5, 13]; // strategic mix of categories

// CSS grid areas for the bento mosaic (desktop, 3 columns)
// We assign each tile a grid-column/row span via the index in MOSAIC_SPANS
const MOSAIC_SPANS = [
  // tile 0 — big feature left (Matchs)
  "col-span-1 row-span-2 lg:col-span-1 lg:row-span-2",
  // tile 1 — tall right-top (Beach)
  "col-span-1 row-span-1 lg:col-span-1 lg:row-span-1",
  // tile 2 — tall right-top-2 (Matchs)
  "col-span-1 row-span-1 lg:col-span-1 lg:row-span-1",
  // tile 3 — wide bottom-left (Événements)
  "col-span-2 row-span-1 lg:col-span-1 lg:row-span-1",
  // tile 4 — square middle (Matchs)
  "col-span-1 row-span-1 lg:col-span-1 lg:row-span-1",
  // tile 5 — wide bottom (Beach)
  "col-span-1 row-span-1 lg:col-span-1 lg:row-span-1",
  // tile 6 — square (Entraînements)
  "col-span-1 row-span-1 lg:col-span-1 lg:row-span-1",
  // tile 7 — square (Événements)
  "col-span-1 row-span-1 lg:col-span-1 lg:row-span-1",
];

// Height classes for each tile's inner aspect ratio
const ASPECT_CLASSES = [
  "aspect-[3/4]",   // 0: tall feature
  "aspect-[4/3]",   // 1
  "aspect-[4/3]",   // 2
  "aspect-[16/9]",  // 3: wide
  "aspect-square",  // 4
  "aspect-[4/3]",   // 5
  "aspect-square",  // 6
  "aspect-square",  // 7
];

export default function GalleryPreview() {
  const { content } = useContent();
  const { gallery, text } = content;
  const pickedImages = PREVIEW_INDICES.map((i) => gallery[i]).filter(Boolean);

  return (
    <section
      aria-labelledby="gallery-preview-heading"
      className="relative isolate overflow-hidden bg-night py-24 sm:py-32"
    >
      {/* Top separator */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-vcm/30 to-transparent"
      />

      {/* Atmospheric glow — bottom left */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-32 -z-10 h-[500px] w-[500px] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(168,85,247,0.7) 0%, transparent 65%)" }}
      />

      <div className="relative z-10 mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-12">

        {/* ── Section header ──────────────────────────────────────────────── */}
        <div className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          {/* Left: kicker + headline */}
          <div className="max-w-xl">
            <Reveal delay={0.05}>
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-8 bg-gradient-to-r from-violet-500 to-fuchsia-vcm" aria-hidden />
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-fuchsia-vcm">
                  {text.gallery.kicker}
                </span>
              </div>
            </Reveal>

            <h2
              id="gallery-preview-heading"
              className="font-display text-[clamp(1.9rem,4.5vw,3.5rem)] leading-[0.95] tracking-tight text-white"
            >
              {(() => {
                const title = text.gallery.title;
                const words = title.split(" ");
                const mid = Math.ceil(words.length / 2);
                const titleMain = words.slice(0, mid).join(" ");
                const titleAccent = words.slice(mid).join(" ");
                return (
                  <>
                    <TextReveal text={titleMain} className="block" />
                    {titleAccent && (
                      <span className="mt-0.5 block text-gradient [-webkit-text-fill-color:transparent]">
                        <TextReveal text={titleAccent} className="block" />
                      </span>
                    )}
                  </>
                );
              })()}
            </h2>

            <Reveal delay={0.3}>
              <p className="mt-4 text-sm leading-relaxed text-white/70 sm:text-[0.95rem]">
                {text.gallery.subtitle}
              </p>
            </Reveal>
          </div>

          {/* Right: CTA (desktop) */}
          <Reveal delay={0.2}>
            <MagneticButton
              href="/galerie"
              className="group hidden sm:inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm transition-colors duration-300 hover:border-white/35 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              {text.gallery.cta}
              <ArrowRight
                className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              />
            </MagneticButton>
          </Reveal>
        </div>

        {/* ── Bento mosaic grid ───────────────────────────────────────────── */}
        {/*
          Mobile (default): 2-column grid, simple aspect-ratio tiles
          Desktop (lg): 3-column asymmetric grid with mixed row-spans (bento)
          We use grid-rows auto so tiles dictate their own height via inner aspect-ratio divs.
        */}
        <div
          className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-3"
          role="list"
          aria-label="Aperçu galerie"
        >
          {pickedImages.map((img, idx) => (
            <motion.div
              key={img.src}
              role="listitem"
              className={[MOSAIC_SPANS[idx], "group relative overflow-hidden rounded-xl sm:rounded-2xl"].join(" ")}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Inner wrapper gives the aspect ratio */}
              <div className={["relative w-full overflow-hidden", ASPECT_CLASSES[idx]].join(" ")}>
                {/* Image — the featured tile (idx 0) gets a subtle scroll parallax */}
                {idx === 0 ? (
                  <ParallaxImage className="absolute inset-0" amount={26}>
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover object-center"
                    />
                  </ParallaxImage>
                ) : (
                  <motion.div
                    className="absolute inset-0"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.6, ease: [0.25, 0, 0, 1] }}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover object-center"
                    />
                  </motion.div>
                )}

                {/* Violet overlay on hover — shows category */}
                <motion.div
                  className="absolute inset-0 flex items-end p-3 sm:p-4"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  style={{
                    background: "linear-gradient(135deg, rgba(124,58,237,0.72) 0%, rgba(192,38,211,0.72) 100%)",
                  }}
                >
                  <span className="rounded-full border border-white/30 bg-black/30 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                    {img.category}
                  </span>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Bottom CTA (mobile) ──────────────────────────────────────────── */}
        <Reveal delay={0.1}>
          <div className="mt-10 flex justify-center sm:hidden">
            <MagneticButton
              href="/galerie"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-700 via-magenta to-fuchsia-vcm px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white shadow-xl shadow-magenta/25 transition-shadow duration-300 hover:shadow-magenta/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              {text.gallery.cta}
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              />
            </MagneticButton>
          </div>
        </Reveal>
      </div>

      {/* Bottom separator */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-700/30 to-transparent"
      />
    </section>
  );
}
