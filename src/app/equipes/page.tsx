import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import TeamDetailCard from "@/components/sections/TeamDetailCard";
import MagneticButton from "@/components/ui/MagneticButton";
import { teams } from "@/data/teams";

export const metadata: Metadata = {
  title: "Nos Équipes",
  description:
    "Découvrez toutes les équipes et pratiques du Volley Club Marseillanais : Baby Volley, Pôle Jeunes, Loisir, Compétition, Soft Volley, Sport Santé et Beach Volley. Une place pour chaque âge et chaque niveau à Marseillan.",
};

export default function EquipesPage() {
  return (
    <>
      {/* ── Page hero ─────────────────────────────────────────────── */}
      <PageHero
        kicker="Le club"
        title="Nos Équipes"
        subtitle="Du Baby Volley dès 3 ans à la compétition régionale, en passant par le Beach Volley et le Sport Santé — le VCM propose une pratique adaptée à chaque âge, chaque profil et chaque ambition."
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Équipes", href: "/equipes" },
        ]}
      />

      {/* ── Quick-jump category nav ────────────────────────────────── */}
      <div className="sticky top-[4.5rem] z-30 border-b border-white/[0.07] bg-ink/90 backdrop-blur-xl">
        <div className="mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-12">
          <nav
            aria-label="Accès rapide aux équipes"
            className="-mx-1 flex items-center gap-1 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {teams.map((team) => (
              <a
                key={team.slug}
                href={`#${team.slug}`}
                className="inline-flex shrink-0 items-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white/60 transition-colors hover:border-violet-500/50 hover:bg-violet-700/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70"
              >
                {team.name}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Teams list ─────────────────────────────────────────────── */}
      <div className="bg-ink">
        <div className="mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-12">
          <div className="divide-y divide-white/[0.07]">
            {teams.map((team, i) => (
              <div key={team.slug} className="py-20 sm:py-28">
                <TeamDetailCard team={team} index={i} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Closing CTA ────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-night py-20 sm:py-28">
        {/* Decorative glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse, rgba(192,38,211,0.7) 0%, transparent 65%)",
          }}
        />
        {/* Top border */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent"
        />

        <div className="relative mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col items-center gap-8 text-center">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-fuchsia-vcm">
              Rejoignez l&rsquo;aventure
            </p>
            <h2 className="font-display text-[clamp(2rem,5vw,4rem)] leading-[0.95] tracking-tight text-white [text-wrap:balance]">
              Prêt à jouer ?
            </h2>
            <p className="max-w-xl text-[0.95rem] leading-relaxed text-white/70">
              Quelle que soit votre discipline de prédilection, nos équipes vous
              accueillent à bras ouverts. Remplissez le formulaire d&rsquo;inscription
              et nous vous recontacterons rapidement.
            </p>
            <MagneticButton
              href="/inscriptions"
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-violet-700 via-magenta to-fuchsia-vcm px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white shadow-xl shadow-magenta/35 transition-shadow duration-300 hover:shadow-magenta/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 focus-visible:ring-offset-2 focus-visible:ring-offset-night"
            >
              S&rsquo;inscrire au club
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              />
            </MagneticButton>
          </div>
        </div>

        {/* Bottom border */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent"
        />
      </div>
    </>
  );
}
