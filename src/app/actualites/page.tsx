import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import Section from "@/components/layout/Section";
import NewsCard from "@/components/ui/NewsCard";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import Reveal from "@/components/motion/Reveal";
import { news } from "@/data/news";
import { sortByDateDesc } from "@/lib/date";

export const metadata: Metadata = {
  title: "Actualités",
  description:
    "Retrouvez toutes les dernières actualités du Volley Club Marseillanais : résultats, événements, vie du club, beach volley, sport santé et bien plus.",
};

export default function ActualitesPage() {
  const sorted = sortByDateDesc(news);
  const [featured, ...rest] = sorted;

  return (
    <>
      {/* ── Page hero ──────────────────────────────────────────────────── */}
      <PageHero
        kicker="Le club"
        title="Actualités"
        subtitle="Les dernières nouvelles du Volley Club Marseillanais : résultats, événements, inscriptions et vie du club."
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Actualités", href: "/actualites" },
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
                Dernière actualité
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
                  Toutes les actualités
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
