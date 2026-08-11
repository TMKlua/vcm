"use client";

import PageHero from "@/components/layout/PageHero";
import Section from "@/components/layout/Section";
import NewsCard from "@/components/ui/NewsCard";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import Reveal from "@/components/motion/Reveal";
import { sortByDateDesc } from "@/lib/date";
import { useContent } from "@/content/ContentContext";
import { useNavLabel } from "@/data/useNavLinks";

export default function ActualitesView() {
  const { content } = useContent();
  const t = content.text.pages.actualites;
  const breadcrumbLabel = useNavLabel("actualites", "Actualités");

  const sorted = sortByDateDesc(content.news);
  const [featured, ...rest] = sorted;

  return (
    <>
      {/* ── Page hero ──────────────────────────────────────────────────── */}
      <PageHero
        kicker={t.heroKicker}
        title={t.heroTitle}
        subtitle={t.heroSubtitle}
        breadcrumb={[
          { label: content.text.ui?.breadcrumbHome ?? "Accueil", href: "/" },
          { label: breadcrumbLabel, href: "/actualites" },
        ]}
      />

      {/* ── News list ──────────────────────────────────────────────────── */}
      <Section tone="dark" id="actualites">
        {/* ── Featured article ────────────────────────────────────────── */}
        <Reveal delay={0}>
          <div className="mb-16">
            <div className="mb-6 flex items-center gap-3">
              <span
                aria-hidden
                className="h-px w-8 bg-gradient-to-r from-violet-700 to-fuchsia-vcm"
              />
              <span className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-fuchsia-vcm">
                {t.latestLabel ?? "Dernière actualité"}
              </span>
            </div>
            <NewsCard article={featured} featured />
          </div>
        </Reveal>

        {/* ── Divider ─────────────────────────────────────────────────── */}
        <div
          aria-hidden
          className="mb-16 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />

        {/* ── Rest of articles ────────────────────────────────────────── */}
        {rest.length > 0 && (
          <>
            <Reveal delay={0}>
              <div className="mb-10 flex items-center gap-3">
                <span
                  aria-hidden
                  className="h-px w-8 bg-gradient-to-r from-violet-700 to-fuchsia-vcm"
                />
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-fuchsia-vcm">
                  {t.allLabel ?? "Toutes les actualités"}
                </span>
              </div>
            </Reveal>

            <StaggerGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((article) => (
                <StaggerItem key={article.slug}>
                  <NewsCard article={article} />
                </StaggerItem>
              ))}
            </StaggerGroup>
          </>
        )}
      </Section>
    </>
  );
}
