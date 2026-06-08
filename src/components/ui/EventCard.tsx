"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import type { ClubEvent } from "@/types";
import { formatFrDate } from "@/lib/date";

interface EventCardProps {
  event: ClubEvent;
  className?: string;
}

/**
 * EventCard — premium dark event card.
 *
 * Design: bg-night, rounded-2xl, subtle border-white/10, hover lift + violet glow.
 * Date badge: large day number + month/year in smaller caps, overlaid on photo.
 * Hover: image zoom + glow ring + lift shadow.
 */
export default function EventCard({ event, className }: EventCardProps) {
  const dateObj = new Date(event.date);
  const day = dateObj.toLocaleString("fr-FR", { day: "2-digit" });
  const month = dateObj.toLocaleString("fr-FR", { month: "short" }).replace(".", "").toUpperCase();
  const year = dateObj.getFullYear();

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: [0.25, 0, 0, 1] }}
      className={[
        "group relative flex flex-col overflow-hidden rounded-2xl",
        "border border-white/10 bg-night",
        "shadow-lg shadow-black/40",
        "transition-shadow duration-500 hover:shadow-violet-700/30 hover:shadow-2xl",
        className ?? "",
      ].join(" ")}
    >
      {/* Glow ring on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 rounded-2xl opacity-0 ring-1 ring-inset ring-fuchsia-vcm/40 transition-all duration-500 group-hover:opacity-100"
        style={{ boxShadow: "inset 0 0 28px 0 rgba(192,38,211,0.12)" }}
      />

      {/* Photo container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <motion.div
          className="absolute inset-0"
          whileHover={{ scale: 1.07 }}
          transition={{ duration: 0.6, ease: [0.25, 0, 0, 1] }}
        >
          <Image
            src={event.image}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center"
          />
        </motion.div>

        {/* Bottom gradient for legibility */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-transparent"
        />

        {/* Date badge — top-left */}
        <div
          aria-hidden
          className="absolute left-4 top-4 z-10 flex flex-col items-center justify-center rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-center backdrop-blur-md min-w-[3.25rem]"
        >
          <span className="block font-display text-3xl leading-none text-white">{day}</span>
          <span className="mt-0.5 block text-[0.6rem] font-bold uppercase tracking-[0.18em] text-fuchsia-vcm">
            {month}
          </span>
          <span className="block text-[0.58rem] font-medium tracking-wide text-white/55">
            {year}
          </span>
        </div>

        {/* Accessible date (visually hidden, for screen readers) */}
        <time
          dateTime={event.date}
          className="sr-only"
        >
          {formatFrDate(event.date)}
        </time>
      </div>

      {/* Card body */}
      <div className="relative z-10 flex flex-1 flex-col gap-3 p-5">
        {/* Title */}
        <h3 className="font-display text-lg leading-tight text-white [text-wrap:balance] line-clamp-2">
          {event.title}
        </h3>

        {/* Location */}
        <p className="flex items-start gap-1.5 text-sm text-white/55">
          <MapPin className="mt-0.5 size-3.5 shrink-0 text-fuchsia-vcm" aria-hidden />
          <span className="line-clamp-1">{event.location}</span>
        </p>

        {/* Description */}
        <p className="flex-1 text-sm leading-relaxed text-white/55 line-clamp-3">
          {event.description}
        </p>
      </div>

      {/* Bottom accent bar */}
      <div
        aria-hidden
        className="h-px w-full bg-gradient-to-r from-transparent via-violet-700/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
    </motion.article>
  );
}
