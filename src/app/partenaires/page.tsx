import type { Metadata } from "next";
import {
  Eye,
  Megaphone,
  Users,
  HeartHandshake,
  ArrowRight,
  Mail,
  Phone,
  Award,
  MapPin,
} from "lucide-react";

import PageHero from "@/components/layout/PageHero";
import Section from "@/components/layout/Section";
import Reveal from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import MagneticButton from "@/components/ui/MagneticButton";
import PartnerLogo from "@/components/ui/PartnerLogo";
import { partners } from "@/data/partners";
import { club } from "@/data/club";

// ── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Nos Partenaires — Volley Club Marseillanais",
  description:
    "Découvrez les partenaires et sponsors qui soutiennent le Volley Club Marseillanais à Marseillan. Rejoignez notre communauté de partenaires engagés pour le sport, la jeunesse et les valeurs du volley-ball.",
};

// ── Tier configuration ────────────────────────────────────────────────────────

type Tier = "principal" | "officiel" | "institutionnel";

const TIER_GROUPS: {
  tier: Tier;
  label: string;
  description: string;
  gridClass: string;
}[] = [
  {
    tier: "principal",
    label: "Partenaire Principal",
    description:
      "Notre partenaire majeur, présent à nos côtés sur l'ensemble des événements du club.",
    gridClass:
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 justify-items-center",
  },
  {
    tier: "officiel",
    label: "Partenaires Officiels",
    description:
      "Des acteurs locaux engagés qui contribuent au développement du volleyball à Marseillan.",
    gridClass: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6",
  },
  {
    tier: "institutionnel",
    label: "Institutions",
    description:
      "Les collectivités et fédérations qui nous accompagnent dans notre mission sportive.",
    gridClass: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6",
  },
];

// ── Contreparties data ────────────────────────────────────────────────────────

const contreparties = [
  {
    icon: Eye,
    title: "Visibilité locale",
    description:
      "Logo sur le site officiel du club, les réseaux sociaux et les supports de communication diffusés à Marseillan et autour de l'étang de Thau. {/* [À CONFIRMER] */}",
  },
  {
    icon: Megaphone,
    title: "Présence événementielle",
    description:
      "Mise en avant lors des tournois Beach Volley, des remises de prix et des événements communautaires organisés par le VCM. {/* [À CONFIRMER] */}",
  },
  {
    icon: Users,
    title: "Audience qualifiée",
    description:
      "Accès à une communauté de licenciés, familles et supporters — un public local, familial et engagé, fidèle à son club. {/* [À CONFIRMER] */}",
  },
  {
    icon: Award,
    title: "Logo sur les équipements",
    description:
      "Association de votre marque aux maillots et équipements du club, visibles lors de tous les matchs et entraînements. {/* [À CONFIRMER] */}",
  },
  {
    icon: MapPin,
    title: "Rayonnement territorial",
    description:
      "Soutien à un projet sportif ancré dans le territoire de Marseillan, reconnu pour ses valeurs de convivialité, jeunesse et santé.",
  },
  {
    icon: HeartHandshake,
    title: "Partenariat sur-mesure",
    description:
      "Formules adaptées à votre budget et à vos objectifs. Contactez-nous pour construire ensemble un partenariat qui vous ressemble. {/* [À CONFIRMER] */}",
  },
];

// ── Page component ────────────────────────────────────────────────────────────

export default function PartenairesPage() {
  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <PageHero
        kicker="Le club"
        title="Nos Partenaires"
        subtitle="Grâce à l'engagement de nos partenaires et institutions, le Volley Club Marseillanais peut offrir à tous — enfants, adultes, sportifs confirmés — un cadre de pratique de qualité au bord de l'étang de Thau."
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Partenaires", href: "/partenaires" },
        ]}
      />

      {/* ── Mur de logos ───────────────────────────────────────────────────── */}
      <Section tone="dark" id="nos-partenaires">
        {/* Section heading */}
        <div className="mb-16 sm:mb-20">
          <Reveal delay={0}>
            <div className="mb-5 flex items-center gap-3">
              <span
                aria-hidden
                className="h-px w-8 bg-gradient-to-r from-violet-700 to-fuchsia-vcm"
              />
              <span className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-fuchsia-vcm">
                Ils nous soutiennent
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="font-display text-[clamp(2rem,5vw,4rem)] leading-[0.95] tracking-tight text-white [text-wrap:balance]">
              Le VCM s&rsquo;appuie sur vous
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-xl text-[0.95rem] leading-relaxed text-white/55">
              De la commune à nos sponsors locaux, chaque partenaire contribue à
              faire vivre le volleyball à Marseillan. Merci à eux.
            </p>
          </Reveal>
        </div>

        {/* Tier groups */}
        <div className="flex flex-col gap-16 sm:gap-20">
          {TIER_GROUPS.map(({ tier, label, description, gridClass }) => {
            const tierPartners = partners.filter((p) => p.tier === tier);
            if (tierPartners.length === 0) return null;

            return (
              <div key={tier}>
                {/* Group header */}
                <Reveal delay={0}>
                  <div className="mb-8 border-b border-white/[0.07] pb-5">
                    <div className="flex flex-wrap items-end gap-3">
                      <h3 className="font-display text-lg leading-tight text-white">
                        {label}
                      </h3>
                      <span className="mb-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/35">
                        {tierPartners.length}{" "}
                        {tierPartners.length > 1 ? "membres" : "membre"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-white/45">{description}</p>
                  </div>
                </Reveal>

                {/* Logo grid */}
                <StaggerGroup className={gridClass}>
                  {tierPartners.map((partner) => (
                    <StaggerItem key={partner.name} className="w-full">
                      <PartnerLogo partner={partner} />
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ── Devenir partenaire ─────────────────────────────────────────────── */}
      {/* Gradient panel — visually strong, neither pure dark nor pure light */}
      <section
        aria-labelledby="devenir-partenaire-heading"
        className="relative isolate overflow-hidden bg-night py-20 sm:py-28"
      >
        {/* Decorative radial glow — magenta left */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 top-0 -z-10 h-[700px] w-[700px] rounded-full opacity-20 blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse, rgba(192,38,211,0.9) 0%, transparent 65%)",
          }}
        />
        {/* Decorative radial glow — violet right */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 bottom-0 -z-10 h-[600px] w-[600px] rounded-full opacity-15 blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse, rgba(124,58,237,0.8) 0%, transparent 65%)",
          }}
        />
        {/* Top border accent */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent"
        />

        <div className="relative z-10 mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-12">

          {/* Header */}
          <div className="mb-14 sm:mb-18 text-center max-w-3xl mx-auto">
            <Reveal delay={0}>
              <div className="mb-6 flex items-center justify-center gap-3">
                <span
                  aria-hidden
                  className="h-px w-8 bg-gradient-to-r from-violet-700 to-fuchsia-vcm"
                />
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-fuchsia-vcm">
                  Rejoignez-nous
                </span>
                <span
                  aria-hidden
                  className="h-px w-8 bg-gradient-to-r from-fuchsia-vcm to-violet-700"
                />
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <h2
                id="devenir-partenaire-heading"
                className="font-display text-[clamp(2.2rem,6vw,4.5rem)] leading-[0.93] tracking-tight text-white [text-wrap:balance]"
              >
                Devenez{" "}
                <span className="text-gradient [-webkit-text-fill-color:transparent]">
                  partenaire
                </span>{" "}
                du VCM
              </h2>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-6 text-[0.95rem] leading-relaxed text-white/60 max-w-2xl mx-auto">
                Le Volley Club Marseillanais, c&rsquo;est plus de cent licenciés,
                des familles, des événements sportifs ouverts à tous et une
                communauté ancrée dans le territoire de l&rsquo;étang de Thau.
                Associer votre nom au VCM, c&rsquo;est soutenir le sport local
                et afficher vos valeurs.
              </p>
            </Reveal>
          </div>

          {/* Contreparties grid */}
          <StaggerGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-16 sm:mb-20">
            {contreparties.map((item, i) => {
              const Icon = item.icon;
              return (
                <StaggerItem key={i}>
                  <div className="group relative flex h-full flex-col gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 transition-all duration-300 hover:border-violet-500/30 hover:bg-violet-700/[0.06]">
                    {/* Icon badge */}
                    <div className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-violet-700/30 to-fuchsia-vcm/20">
                      <Icon className="size-5 text-fuchsia-vcm" aria-hidden />
                    </div>

                    <h3 className="font-display text-base leading-tight text-white">
                      {item.title}
                    </h3>

                    <p className="text-sm leading-relaxed text-white/55 flex-1">
                      {item.description}
                    </p>

                    {/* Hover bottom accent */}
                    <div
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-px rounded-b-2xl bg-gradient-to-r from-violet-700/0 via-fuchsia-vcm/50 to-violet-700/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerGroup>

          {/* CTA panel */}
          <Reveal delay={0.1}>
            <div className="mx-auto max-w-2xl rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-700/10 to-fuchsia-vcm/5 p-8 sm:p-10 text-center">
              <div className="flex items-center justify-center gap-3 mb-5">
                <span
                  aria-hidden
                  className="h-px w-6 bg-gradient-to-r from-violet-700 to-fuchsia-vcm"
                />
                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-violet-500">
                  Contactez-nous
                </span>
                <span
                  aria-hidden
                  className="h-px w-6 bg-gradient-to-r from-fuchsia-vcm to-violet-700"
                />
              </div>

              <h3 className="font-display text-[clamp(1.4rem,3vw,2.2rem)] leading-[0.95] tracking-tight text-white mb-4 [text-wrap:balance]">
                Construisons votre partenariat ensemble
              </h3>

              <p className="text-sm leading-relaxed text-white/55 mb-8 max-w-lg mx-auto">
                Nos formules sont adaptables selon votre structure et vos
                objectifs. Discutons ensemble de la meilleure façon de vous
                associer au Volley Club Marseillanais.{" "}
                {/* [À CONFIRMER] */}
              </p>

              {/* Primary CTA */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                <MagneticButton
                  href={`mailto:${club.contact.email}`}
                  className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-violet-700 via-magenta to-fuchsia-vcm px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white shadow-xl shadow-magenta/35 transition-shadow duration-300 hover:shadow-magenta/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 focus-visible:ring-offset-2 focus-visible:ring-offset-night"
                >
                  Devenir partenaire
                  <Mail className="size-4" aria-hidden />
                </MagneticButton>

                <a
                  href={`tel:${club.contact.phone.replace(/\s/g, "")}`}
                  className="group inline-flex items-center justify-center gap-2.5 rounded-full border border-white/20 bg-white/[0.04] px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white/80 transition-all duration-300 hover:border-violet-500/50 hover:bg-violet-700/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 focus-visible:ring-offset-2 focus-visible:ring-offset-night"
                >
                  <Phone className="size-4" aria-hidden />
                  {club.contact.phone}
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden
                  />
                </a>
              </div>
            </div>
          </Reveal>

        </div>

        {/* Bottom border */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent"
        />
      </section>
    </>
  );
}
