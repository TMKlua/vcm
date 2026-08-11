"use client";

import PageHero from "@/components/layout/PageHero";
import Section from "@/components/layout/Section";
import Reveal from "@/components/motion/Reveal";
import GalleryMasonry from "@/components/sections/GalleryMasonry";
import { useContent } from "@/content/ContentContext";
import { useNavLabel } from "@/data/useNavLinks";

export default function GalerieView() {
  const { content } = useContent();
  const { gallery } = content;
  const t = content.text.pages.galerie;
  const breadcrumbLabel = useNavLabel("galerie", "Galerie");

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <PageHero
        kicker={t.heroKicker}
        title={t.heroTitle}
        subtitle={t.heroSubtitle}
        breadcrumb={[
          { label: content.text.ui?.breadcrumbHome ?? "Accueil", href: "/" },
          { label: breadcrumbLabel, href: "/galerie" },
        ]}
      />

      {/* ── Masonry + lightbox ─────────────────────────────────────────────── */}
      <Section tone="dark" id="galerie">
        <div className="mb-12 sm:mb-16">
          <Reveal delay={0}>
            <div className="mb-5 flex items-center gap-3">
              <span
                aria-hidden
                className="h-px w-8 bg-gradient-to-r from-violet-700 to-fuchsia-vcm"
              />
              <span className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-fuchsia-vcm">
                {t.sectionKicker ?? "En images"}
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="font-display text-[clamp(2rem,5vw,4rem)] leading-[0.95] tracking-tight text-white [text-wrap:balance]">
              {t.sectionTitle ?? "Le VCM en mouvement"}
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-xl text-[0.95rem] leading-relaxed text-white/70">
              {t.sectionBody ??
                "Filtrez par catégorie et cliquez sur une photo pour l’agrandir. Toute l’énergie du club, du gymnase à la plage."}
            </p>
          </Reveal>
        </div>

        <GalleryMasonry images={gallery} />
      </Section>
    </>
  );
}
