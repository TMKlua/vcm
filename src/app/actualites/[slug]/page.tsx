import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User, ArrowUpRight } from "lucide-react";
import Section from "@/components/layout/Section";
import Reveal from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import NewsCard from "@/components/ui/NewsCard";
import { news } from "@/data/news";
import { formatFrDate, sortByDateDesc } from "@/lib/date";

/* ─────────────────────────────────────────────────────────────────────────────
   Static params — prerenders all 5 article slugs at build time
───────────────────────────────────────────────────────────────────────────── */
export function generateStaticParams() {
  return news.map((n) => ({ slug: n.slug }));
}

/* ─────────────────────────────────────────────────────────────────────────────
   Metadata — Next 16: params is a Promise
───────────────────────────────────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = news.find((n) => n.slug === slug);

  if (!article) {
    return {
      title: "Article introuvable",
    };
  }

  return {
    title: `${article.title}`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.image }],
    },
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
   Category badge colour mapping (kept in sync with NewsCard)
───────────────────────────────────────────────────────────────────────────── */
const CATEGORY_PALETTE: Record<string, string> = {
  "Beach Volley": "border-fuchsia-vcm/30 bg-fuchsia-vcm/10 text-fuchsia-vcm",
  "Vie du club": "border-violet-500/30 bg-violet-500/10 text-violet-400",
  "Sport Santé": "border-magenta/30 bg-magenta/10 text-pink-400",
  Compétition: "border-violet-700/40 bg-violet-700/15 text-violet-300",
};
function categoryClass(cat: string): string {
  return (
    CATEGORY_PALETTE[cat] ?? "border-white/20 bg-white/[0.06] text-white/60"
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Page component — Next 16: params is a Promise
───────────────────────────────────────────────────────────────────────────── */
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = news.find((n) => n.slug === slug);

  if (!article) notFound();

  /* "À lire aussi" — 2 most recent articles that are not the current one */
  const related = sortByDateDesc(news)
    .filter((n) => n.slug !== slug)
    .slice(0, 2);

  return (
    <>
      {/* ── Article header ─────────────────────────────────────────────── */}
      <header
        className="relative isolate overflow-hidden bg-ink pt-32 pb-16 sm:pt-40 sm:pb-20"
        aria-label={article.title}
      >
        {/* Decorative gradient blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/4 top-1/2 -z-10 h-[500px] w-[700px] -translate-y-1/2 rounded-full opacity-20 blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse, rgba(168,85,247,0.7) 0%, transparent 65%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 -z-10 h-[350px] w-[450px] rounded-full opacity-15 blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse, rgba(192,38,211,0.8) 0%, transparent 65%)",
          }}
        />

        {/* Top border accent */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent"
        />

        <div className="relative z-10 mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-12">
          {/* Back link */}
          <Reveal delay={0}>
            <Link
              href="/actualites"
              className="mb-10 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/40 transition-colors duration-200 hover:text-white/70 focus-visible:outline-none focus-visible:underline"
            >
              <ArrowLeft className="size-3.5" aria-hidden />
              Retour aux actualités
            </Link>
          </Reveal>

          <div className="mx-auto max-w-4xl">
            {/* Category + date meta row */}
            <Reveal delay={0.05}>
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <span
                  className={[
                    "inline-flex items-center rounded-full border px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em]",
                    categoryClass(article.category),
                  ].join(" ")}
                >
                  {article.category}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-white/60">
                  <Calendar className="size-3.5 shrink-0 text-fuchsia-vcm/60" aria-hidden />
                  <time dateTime={article.date}>{formatFrDate(article.date)}</time>
                </div>
                {article.author && (
                  <div className="flex items-center gap-1.5 text-xs text-white/60">
                    <User className="size-3.5 shrink-0 text-violet-500/60" aria-hidden />
                    <span>{article.author}</span>
                  </div>
                )}
              </div>
            </Reveal>

            {/* Title */}
            <Reveal delay={0.1}>
              <h1 className="font-display text-[clamp(2rem,5vw,4rem)] leading-[0.95] tracking-tight text-white [text-wrap:balance]">
                {article.title}
              </h1>
            </Reveal>

            {/* Excerpt lead */}
            <Reveal delay={0.18}>
              <p className="mt-6 text-[1.05rem] leading-relaxed text-white/70 [text-wrap:balance] max-w-2xl">
                {article.excerpt}
              </p>
            </Reveal>
          </div>
        </div>

        {/* Bottom fade */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-ink"
        />
      </header>

      {/* ── Hero image ─────────────────────────────────────────────────── */}
      <div className="bg-ink">
        <div className="mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-12">
          <Reveal delay={0}>
            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/60">
              <Image
                src={article.image}
                alt={article.title}
                fill
                priority
                sizes="(max-width: 1400px) 100vw, 1400px"
                className="object-cover object-center"
                unoptimized
              />
              {/* Subtle bottom gradient */}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent"
              />
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── Article body ───────────────────────────────────────────────── */}
      <Section tone="dark">
        <div className="mx-auto max-w-3xl">
          <Reveal delay={0}>
            <div className="space-y-6 text-[1rem] leading-[1.85] text-white/70">
              {article.content.map((paragraph, i) => (
                <p key={i} className="[text-wrap:pretty]">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>

          {/* Divider */}
          <div
            aria-hidden
            className="my-12 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
          />

          {/* Share / back strip */}
          <Reveal delay={0.1}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/actualites"
                className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/40 transition-colors duration-200 hover:text-white/70 focus-visible:outline-none focus-visible:underline"
              >
                <ArrowLeft
                  className="size-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
                  aria-hidden
                />
                Toutes les actualités
              </Link>

              <Link
                href="/inscriptions"
                className="group inline-flex items-center gap-2 rounded-full border border-fuchsia-vcm/30 bg-fuchsia-vcm/10 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-fuchsia-vcm transition-all duration-300 hover:bg-fuchsia-vcm/20 hover:border-fuchsia-vcm/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70"
              >
                Rejoindre le club
                <ArrowUpRight
                  className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </Link>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ── À lire aussi ───────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section
          aria-labelledby="related-heading"
          className="bg-night py-20 sm:py-28"
        >
          {/* Top border */}
          <div
            aria-hidden
            className="pointer-events-none mb-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent"
          />

          <div className="mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-12">
            {/* Section heading */}
            <Reveal delay={0}>
              <div className="mb-10 flex items-center gap-3">
                <span
                  aria-hidden
                  className="h-px w-8 bg-gradient-to-r from-violet-700 to-fuchsia-vcm"
                />
                <h2
                  id="related-heading"
                  className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-fuchsia-vcm"
                >
                  À lire aussi
                </h2>
              </div>
            </Reveal>

            <StaggerGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {related.map((rel) => (
                <StaggerItem key={rel.slug}>
                  <NewsCard article={rel} />
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </section>
      )}
    </>
  );
}
