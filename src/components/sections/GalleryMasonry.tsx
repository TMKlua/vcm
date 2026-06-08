"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { gallery as defaultGallery } from "@/data/gallery";
import { fadeUp, staggerParent } from "@/lib/motion";
import Lightbox from "@/components/ui/Lightbox";
import type { GalleryImage } from "@/types";

const ALL = "Tout";

interface GalleryMasonryProps {
  images?: GalleryImage[];
}

export default function GalleryMasonry({ images = defaultGallery }: GalleryMasonryProps) {
  const reduce = useReducedMotion();

  // Unique categories, in order of first appearance.
  const categories = useMemo(() => {
    const seen: string[] = [];
    for (const img of images) {
      if (!seen.includes(img.category)) seen.push(img.category);
    }
    return [ALL, ...seen];
  }, [images]);

  const [activeFilter, setActiveFilter] = useState<string>(ALL);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // The currently visible (filtered) set — the lightbox navigates within THIS array,
  // so its indices always match what is on screen.
  const filtered = useMemo(
    () =>
      activeFilter === ALL
        ? images
        : images.filter((img) => img.category === activeFilter),
    [activeFilter, images],
  );

  const handleFilter = (cat: string) => {
    setActiveFilter(cat);
    // Close any open lightbox so a stale index can't point into the old set.
    setLightboxIndex(null);
  };

  return (
    <>
      {/* ── Filter row ───────────────────────────────────────────────────── */}
      <motion.div
        variants={reduce ? undefined : staggerParent}
        initial={reduce ? undefined : "hidden"}
        whileInView={reduce ? undefined : "visible"}
        viewport={{ once: true, margin: "-60px" }}
        className="mb-10 flex flex-wrap gap-2.5 sm:mb-14"
        role="group"
        aria-label="Filtrer les photos par catégorie"
      >
        {categories.map((cat) => {
          const isActive = activeFilter === cat;
          return (
            <motion.button
              key={cat}
              type="button"
              variants={reduce ? undefined : fadeUp}
              onClick={() => handleFilter(cat)}
              aria-pressed={isActive}
              className={[
                "rounded-full border px-5 py-2 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink",
                isActive
                  ? "border-transparent bg-gradient-to-r from-violet-700 via-magenta to-fuchsia-vcm text-white shadow-lg shadow-magenta/30"
                  : "border-white/12 bg-white/[0.03] text-white/60 hover:border-violet-500/40 hover:bg-violet-700/10 hover:text-white",
              ].join(" ")}
            >
              {cat}
            </motion.button>
          );
        })}
      </motion.div>

      {/* ── Masonry grid ─────────────────────────────────────────────────── */}
      <motion.div layout={!reduce} className="columns-2 gap-4 md:columns-3 lg:columns-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {filtered.map((img, i) => (
            <motion.button
              key={img.src}
              type="button"
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              transition={{ duration: reduce ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setLightboxIndex(i)}
              aria-label={`Agrandir : ${img.alt}`}
              className="group relative mb-4 block w-full overflow-hidden rounded-xl border border-white/[0.06] break-inside-avoid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="h-auto w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
              />

              {/* Hover overlay: violet gradient + category */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-ink/85 via-violet-700/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                <span className="m-3.5 inline-block rounded-full border border-white/15 bg-ink/40 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-fuchsia-vcm backdrop-blur-sm">
                  {img.category}
                </span>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* ── Lightbox (navigates within the filtered set) ─────────────────── */}
      <Lightbox
        images={filtered}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={setLightboxIndex}
      />
    </>
  );
}
