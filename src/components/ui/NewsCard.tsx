"use client";

import { useContent } from "@/content/ContentContext";

import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowUpRight } from "lucide-react";
import type { NewsArticle } from "@/types";
import { formatFrDate } from "@/lib/date";

/* ─────────────────────────────────────────────────────────────────────────────
   Category badge colour mapping
───────────────────────────────────────────────────────────────────────────── */
const CATEGORY_PALETTE: Record<string, string> = {
  "Beach Volley":
    "border-fuchsia-vcm/30 bg-fuchsia-vcm/10 text-fuchsia-vcm",
  "Vie du club":
    "border-violet-500/30 bg-violet-500/10 text-violet-400",
  "Sport Santé":
    "border-magenta/30 bg-magenta/10 text-pink-400",
  Compétition:
    "border-violet-700/40 bg-violet-700/15 text-violet-300",
};
function categoryClass(cat: string): string {
  return (
    CATEGORY_PALETTE[cat] ??
    "border-white/20 bg-white/[0.06] text-white/60"
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   NewsCard
───────────────────────────────────────────────────────────────────────────── */
interface NewsCardProps {
  article: NewsArticle;
  featured?: boolean;
}

export default function NewsCard({ article, featured = false }: NewsCardProps) {
  if (featured) {
    return <FeaturedCard article={article} />;
  }
  return <StandardCard article={article} />;
}

/* ── Standard card ──────────────────────────────────────────────────────── */
function StandardCard({ article }: { article: NewsArticle }) {
  return (
    <Link
      href={`/actualites/${article.slug}`}
      className={[
        "group relative flex flex-col overflow-hidden rounded-2xl",
        "border border-white/10 bg-night",
        "shadow-lg shadow-black/40",
        "transition-all duration-500 hover:shadow-violet-700/30 hover:shadow-2xl",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink",
      ].join(" ")}
    >
      {/* Glow ring on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 rounded-2xl opacity-0 ring-1 ring-inset ring-fuchsia-vcm/40 transition-all duration-500 group-hover:opacity-100"
        style={{ boxShadow: "inset 0 0 28px 0 rgba(192,38,211,0.12)" }}
      />

      {/* Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={article.image}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.25,0,0,1)] group-hover:scale-105"
          unoptimized
        />
        {/* bottom gradient */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-night/80 via-night/20 to-transparent"
        />

        {/* Category badge — overlaid on image */}
        <div className="absolute left-4 top-4 z-10">
          <span
            className={[
              "inline-flex items-center rounded-full border px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em]",
              "backdrop-blur-md bg-black/30",
              categoryClass(article.category),
            ].join(" ")}
          >
            {article.category}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="relative z-10 flex flex-1 flex-col gap-3 p-5 pb-6">
        {/* Date */}
        <div className="flex items-center gap-1.5 text-xs text-white/60">
          <Calendar className="size-3.5 shrink-0 text-fuchsia-vcm/60" aria-hidden />
          <time dateTime={article.date}>{formatFrDate(article.date)}</time>
        </div>

        {/* Title */}
        <h3 className="font-display text-[1.05rem] leading-tight text-white line-clamp-2 [text-wrap:balance]">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="flex-1 text-sm leading-relaxed text-white/70 line-clamp-3">
          {article.excerpt}
        </p>

        {/* CTA affordance */}
        <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-fuchsia-vcm/70 transition-colors duration-300 group-hover:text-fuchsia-vcm">
          <span>Lire la suite</span>
          <ArrowUpRight
            className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden
          />
        </div>
      </div>

      {/* Bottom accent bar */}
      <div
        aria-hidden
        className="h-px w-full bg-gradient-to-r from-transparent via-violet-700/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
    </Link>
  );
}

/* ── Featured card (horizontal on desktop) ───────────────────────────────── */
function FeaturedCard({ article }: { article: NewsArticle }) {
  const ui = useContent().content.text.ui;
  return (
    <Link
      href={`/actualites/${article.slug}`}
      className={[
        "group relative flex flex-col overflow-hidden rounded-2xl lg:flex-row",
        "border border-white/10 bg-night",
        "shadow-xl shadow-black/50",
        "transition-all duration-500 hover:shadow-fuchsia-vcm/20 hover:shadow-2xl",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink",
      ].join(" ")}
    >
      {/* Glow ring on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 rounded-2xl opacity-0 ring-1 ring-inset ring-fuchsia-vcm/40 transition-all duration-500 group-hover:opacity-100"
        style={{ boxShadow: "inset 0 0 40px 0 rgba(192,38,211,0.14)" }}
      />

      {/* Image — ~60% on desktop */}
      <div className="relative aspect-[16/10] w-full overflow-hidden lg:aspect-auto lg:w-[60%] lg:shrink-0">
        <Image
          src={article.image}
          alt={article.title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.25,0,0,1)] group-hover:scale-105"
          unoptimized
        />
        {/* Gradient: bottom fade on mobile, right fade on desktop */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-night/80 via-night/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-night"
        />

        {/* Featured label */}
        <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
          <span
            aria-hidden
            className="inline-flex h-1.5 w-1.5 rounded-full bg-fuchsia-vcm ring-2 ring-fuchsia-vcm/30"
          />
          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-fuchsia-vcm">
            {ui?.newsFeatured ?? "À la une"}
          </span>
        </div>

        {/* Category badge */}
        <div className="absolute bottom-4 left-4 z-10 lg:hidden">
          <span
            className={[
              "inline-flex items-center rounded-full border px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em]",
              "backdrop-blur-md bg-black/30",
              categoryClass(article.category),
            ].join(" ")}
          >
            {article.category}
          </span>
        </div>
      </div>

      {/* Text column */}
      <div className="relative z-10 flex flex-1 flex-col justify-center gap-5 p-6 sm:p-8 lg:p-10">
        {/* Category (desktop only) */}
        <div className="hidden lg:block">
          <span
            className={[
              "inline-flex items-center rounded-full border px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em]",
              categoryClass(article.category),
            ].join(" ")}
          >
            {article.category}
          </span>
        </div>

        {/* Date */}
        <div className="flex items-center gap-1.5 text-xs text-white/60">
          <Calendar className="size-3.5 shrink-0 text-fuchsia-vcm/60" aria-hidden />
          <time dateTime={article.date}>{formatFrDate(article.date)}</time>
        </div>

        {/* Title */}
        <h3 className="font-display text-[clamp(1.35rem,2.5vw,1.9rem)] leading-tight text-white [text-wrap:balance]">
          {article.title}
        </h3>

        {/* Excerpt — 3 lines */}
        <p className="text-[0.95rem] leading-relaxed text-white/70 line-clamp-3">
          {article.excerpt}
        </p>

        {/* CTA */}
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-fuchsia-vcm/70 transition-colors duration-300 group-hover:text-fuchsia-vcm">
          <span>Lire la suite</span>
          <ArrowUpRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden
          />
        </div>
      </div>

      {/* Bottom accent bar */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-fuchsia-vcm/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
    </Link>
  );
}
