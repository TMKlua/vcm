import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import Section from "@/components/layout/Section";
import Reveal from "@/components/motion/Reveal";
import Timeline from "@/components/sections/Timeline";
import MagneticButton from "@/components/ui/MagneticButton";
import { club } from "@/data/club";

export const metadata: Metadata = {
  title: "Notre Histoire — Volley Club Marseillanais",
  description:
    "Découvrez l'histoire du Volley Club Marseillanais : des origines du club au bord de l'étang de Thau jusqu'à aujourd'hui, en passant par le développement des sections jeunes, beach volley et sport santé.",
};

export default function HistoirePage() {
  return (
    <>
      {/* ── Page hero ──────────────────────────────────────────────────── */}
      <PageHero
        kicker="Le club"
        title="Notre Histoire"
        subtitle="Depuis les premières passes au Gymnase Louis Boudou jusqu'aux plages de Marseillan, une aventure humaine et sportive ancrée dans le cœur de l'Hérault."
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Histoire", href: "/histoire" },
        ]}
      />

      {/* ── Storytelling intro ─────────────────────────────────────────── */}
      <Section tone="dark" id="notre-histoire">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20 lg:items-start">

          {/* Text column */}
          <div className="flex flex-col gap-8">

            {/* Kicker */}
            <Reveal delay={0}>
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="h-px w-8 bg-gradient-to-r from-violet-700 to-fuchsia-vcm"
                />
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-fuchsia-vcm">
                  Depuis {/* [À CONFIRMER] */}1996
                </span>
              </div>
            </Reveal>

            {/* Heading */}
            <Reveal delay={0.08}>
              <h2 className="font-display text-[clamp(1.9rem,4vw,3.2rem)] leading-[0.95] tracking-tight text-white [text-wrap:balance]">
                Nés au bord de l&rsquo;étang de Thau
              </h2>
            </Reveal>

            {/* Body text */}
            <Reveal delay={0.15}>
              <div className="space-y-5 text-[0.95rem] leading-relaxed text-white/65">
                <p>
                  Tout a commencé avec quelques passionnés déterminés à faire vivre le
                  volley-ball dans ce coin de l&apos;Hérault baigné par l&apos;étang de Thau.{" "}
                  {club.name} — le <strong className="text-white/85">VCM</strong> — est
                  né de cette conviction simple : le sport, pratiqué dans la convivialité,
                  transforme les individus et soude les communautés. {/* [À CONFIRMER] */}
                </p>
                <p>
                  Dès ses premières saisons, le club a posé ses valeurs : ouverture à
                  tous les âges, exigence sportive et esprit de famille. Les entraînements
                  sous les poutres du Gymnase Louis Boudou résonnaient autant de rires que
                  de smashes — une atmosphère que le club a su préserver au fil des années,
                  même en grandissant.
                </p>
                <p>
                  Aujourd&apos;hui, le VCM, c&apos;est du <strong className="text-white/85">Baby
                  Volley dès 3 ans</strong> jusqu&apos;à la compétition régionale, un programme
                  Beach Volley sur les plages de Marseillan en partenariat avec le Comité
                  Départemental de l&apos;Hérault, et des créneaux Sport Santé pensés pour le
                  bien-être de toutes et tous. Une diversité qui fait la fierté du club.{" "}
                  {/* [À CONFIRMER] */}
                </p>
                <p>
                  {club.description} Chaque nouveau licencié qui pousse la porte du gymnase
                  porte en lui la même étincelle que les fondateurs : l&apos;amour du jeu et
                  l&apos;envie de le partager.
                </p>
              </div>
            </Reveal>

          </div>

          {/* Image column */}
          <Reveal delay={0.22}>
            <div className="relative">
              {/* Decorative glow behind image */}
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl opacity-30 blur-3xl"
                style={{
                  background:
                    "radial-gradient(ellipse, rgba(168,85,247,0.6) 0%, transparent 65%)",
                }}
              />

              {/* Image frame */}
              <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/40">
                <Image
                  src="/images/gallery/2.jpg"
                  alt="Joueurs du Volley Club Marseillanais en action"
                  width={800}
                  height={560}
                  className="w-full object-cover object-center"
                  priority={false}
                />
                {/* Subtle gradient overlay at bottom */}
                <div
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/60 to-transparent"
                />
              </div>

              {/* Caption badge */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between px-1">
                <span className="rounded-full border border-white/15 bg-ink/70 px-4 py-2 text-xs font-medium text-white/60 backdrop-blur-sm">
                  {club.address.city} · {club.address.venue}
                </span>
              </div>
            </div>
          </Reveal>

        </div>
      </Section>

      {/* ── Timeline section ───────────────────────────────────────────── */}
      <Section tone="dark" id="timeline" className="overflow-hidden">
        {/* Section heading */}
        <div className="mb-16 sm:mb-24">
          <Reveal delay={0}>
            <div className="flex items-center gap-3 mb-5">
              <span
                aria-hidden
                className="h-px w-8 bg-gradient-to-r from-violet-700 to-fuchsia-vcm"
              />
              <span className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-fuchsia-vcm">
                Chronologie
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="font-display text-[clamp(2rem,5vw,4.2rem)] leading-[0.95] tracking-tight text-white [text-wrap:balance]">
              Les grandes étapes
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-xl text-[0.95rem] leading-relaxed text-white/55">
              De la fondation du club à aujourd&apos;hui, retour sur les moments clés
              qui ont forgé l&apos;identité du VCM.
            </p>
          </Reveal>
        </div>

        {/* Timeline component (client, GSAP ScrollTrigger) */}
        <Timeline />
      </Section>

      {/* ── Vision actuelle / closing CTA ─────────────────────────────── */}
      <section
        aria-labelledby="vision-heading"
        className="relative isolate overflow-hidden bg-night py-20 sm:py-28"
      >
        {/* Decorative glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse, rgba(192,38,211,0.8) 0%, transparent 65%)",
          }}
        />

        {/* Top border accent */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent"
        />

        <div className="relative z-10 mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl text-center">

            {/* Kicker */}
            <Reveal delay={0}>
              <div className="mb-6 flex items-center justify-center gap-3">
                <span
                  aria-hidden
                  className="h-px w-8 bg-gradient-to-r from-violet-700 to-fuchsia-vcm"
                />
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-fuchsia-vcm">
                  Vision actuelle
                </span>
                <span
                  aria-hidden
                  className="h-px w-8 bg-gradient-to-r from-fuchsia-vcm to-violet-700"
                />
              </div>
            </Reveal>

            {/* Heading */}
            <Reveal delay={0.08}>
              <h2
                id="vision-heading"
                className="font-display text-[clamp(2rem,5vw,4rem)] leading-[0.95] tracking-tight text-white [text-wrap:balance]"
              >
                L&apos;aventure continue
              </h2>
            </Reveal>

            {/* Body */}
            <Reveal delay={0.18}>
              <div className="mt-6 space-y-5 text-[0.95rem] leading-relaxed text-white/60">
                <p>
                  Après plus de vingt-cinq ans d&apos;existence, le{" "}
                  <strong className="text-white/80">Volley Club Marseillanais</strong> aborde
                  une nouvelle ère avec ambition et sérénité. La refonte de son identité
                  digitale et le renforcement de toutes ses sections témoignent d&apos;un club
                  qui regarde vers l&apos;avenir sans oublier ses racines.{/* [À CONFIRMER] */}
                </p>
                <p>
                  Que vous soyez parent cherchant une activité pour votre enfant, adulte
                  souhaitant (re)découvrir le volley en loisir, sportif en quête de
                  compétition ou simplement curieux de bouger dans un cadre bienveillant —
                  le VCM a une place pour vous. Rejoignez-nous !
                </p>
              </div>
            </Reveal>

            {/* CTA */}
            <Reveal delay={0.28}>
              <div className="mt-10">
                <MagneticButton
                  href="/inscriptions"
                  className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-violet-700 via-magenta to-fuchsia-vcm px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white shadow-xl shadow-magenta/35 transition-shadow duration-300 hover:shadow-magenta/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 focus-visible:ring-offset-2 focus-visible:ring-offset-night"
                >
                  Rejoindre l&apos;aventure
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden
                  />
                </MagneticButton>
              </div>
            </Reveal>

          </div>
        </div>

        {/* Bottom border accent */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent"
        />
      </section>
    </>
  );
}
