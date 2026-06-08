import type { Metadata } from "next";

import PageHero from "@/components/layout/PageHero";
import Section from "@/components/layout/Section";
import Reveal from "@/components/motion/Reveal";
import GalleryMasonry from "@/components/sections/GalleryMasonry";

export const metadata: Metadata = {
  title: "Galerie",
  description:
    "Plongez dans la vie du Volley Club Marseillanais en images : matchs, entraînements, beach volley, jeunes et événements du club à Marseillan, au bord de l'étang de Thau.",
};

export default function GaleriePage() {
  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <PageHero
        kicker="Le club"
        title="Galerie"
        subtitle="Matchs disputés, entraînements, tournois de beach volley et moments de partage : revivez en images les temps forts du Volley Club Marseillanais."
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Galerie", href: "/galerie" },
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
                En images
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="font-display text-[clamp(2rem,5vw,4rem)] leading-[0.95] tracking-tight text-white [text-wrap:balance]">
              Le VCM en mouvement
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-xl text-[0.95rem] leading-relaxed text-white/70">
              Filtrez par catégorie et cliquez sur une photo pour l&rsquo;agrandir.
              Toute l&rsquo;énergie du club, du gymnase à la plage.
            </p>
          </Reveal>
        </div>

        <GalleryMasonry />
      </Section>
    </>
  );
}
