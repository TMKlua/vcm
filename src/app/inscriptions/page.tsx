import type { Metadata } from "next";
import {
  ArrowRight,
  MessageSquare,
  ClipboardList,
  Calendar,
  CreditCard,
  FileText,
  Check,
  Mail,
  Phone,
  ExternalLink,
} from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import Section from "@/components/layout/Section";
import Reveal from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import Accordion from "@/components/ui/Accordion";
import MagneticButton from "@/components/ui/MagneticButton";
import { club } from "@/data/club";
import { faq } from "@/data/faq";

export const metadata: Metadata = {
  title: "Inscriptions",
  description:
    "Comment rejoindre le Volley Club Marseillanais : étapes d'inscription, documents nécessaires (certificat médical, licence FFVolley), tarifs et FAQ. Contactez-nous pour une séance d'essai gratuite à Marseillan.",
};

// ── Data ──────────────────────────────────────────────────────────────────────

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Prendre contact",
    description:
      "Contactez-nous par email, téléphone ou venez directement au Gymnase Louis Boudou lors des entraînements. Une séance d'essai gratuite est proposée à tous les nouveaux venus, quel que soit l'âge ou le niveau.", // [À CONFIRMER]
  },
  {
    number: "02",
    icon: ClipboardList,
    title: "Constituer le dossier",
    description:
      "Rassemblez les documents nécessaires : certificat médical de non contre-indication à la pratique du volley-ball (ou questionnaire de santé selon votre situation), formulaire de licence FFVolley et une photo d'identité.",
  },
  {
    number: "03",
    icon: Calendar,
    title: "Choisir sa pratique",
    description:
      "Baby Volley, Pôle Jeunes, Loisir, Compétition, Sport Santé, Soft Volley ou Beach Volley — choisissez la pratique et le créneau qui vous correspond. Nous vous guiderons selon votre profil et vos disponibilités.",
  },
  {
    number: "04",
    icon: CreditCard,
    title: "Régler la cotisation",
    description:
      "Les tarifs varient selon la catégorie et la saison. Contactez le club pour connaître les montants en vigueur. Le règlement peut se faire en plusieurs fois selon les modalités du club.",
  },
];

const documents = [
  {
    icon: FileText,
    label: "Certificat médical de non contre-indication à la pratique du volley-ball",
    note: "Ou questionnaire de santé selon votre catégorie",
  },
  {
    icon: FileText,
    label: "Formulaire de demande de licence FFVolley",
    note: "Disponible auprès du club ou sur ffvolley.org",
  },
  {
    icon: FileText,
    label: "Photo d'identité",
    note: null,
  },
  {
    icon: CreditCard,
    label: "Règlement de la cotisation",
    note: "Tarifs à confirmer auprès du club pour la saison en cours",
  },
  {
    icon: FileText,
    label: "Autorisation parentale (pour les mineurs)",
    note: null,
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function InscriptionsPage() {
  return (
    <>
      {/* ── Page hero ──────────────────────────────────────────────────────── */}
      <PageHero
        kicker="Rejoindre"
        title="Inscriptions"
        subtitle="Rejoindre le VCM en quatre étapes simples. Séance d'essai gratuite pour tous — du Baby Volley au Sport Santé, il y a une place pour vous."
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Inscriptions", href: "/inscriptions" },
        ]}
      />

      {/* ── Stepper Section — dark ─────────────────────────────────────────── */}
      <Section tone="dark" id="comment-rejoindre">

        {/* Section heading */}
        <div className="mb-16 sm:mb-20">
          <Reveal delay={0}>
            <div className="flex items-center gap-3 mb-5">
              <span
                aria-hidden
                className="h-px w-8 bg-gradient-to-r from-violet-700 to-fuchsia-vcm"
              />
              <span className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-fuchsia-vcm">
                Mode d&rsquo;emploi
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="font-display text-[clamp(2rem,5vw,4rem)] leading-[0.95] tracking-tight text-white [text-wrap:balance]">
              Comment rejoindre le club
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-xl text-[0.95rem] leading-relaxed text-white/70">
              En quatre étapes simples, devenez membre du Volley Club Marseillanais
              et intégrez une communauté sportive accueillante à Marseillan.
            </p>
          </Reveal>
        </div>

        {/* Steps */}
        <StaggerGroup className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <StaggerItem key={i}>
                <div className="group relative flex h-full flex-col gap-5 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 transition-all duration-300 hover:border-violet-500/30 hover:bg-violet-700/[0.06]">

                  {/* Number + Icon row */}
                  <div className="flex items-center justify-between">
                    {/* Big number */}
                    <span
                      className="font-display text-[3rem] leading-none tracking-tight text-gradient opacity-80"
                      aria-hidden
                    >
                      {step.number}
                    </span>

                    {/* Icon badge */}
                    <div className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-violet-700/30 to-fuchsia-vcm/20">
                      <Icon className="size-5 text-fuchsia-vcm" aria-hidden />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-base leading-tight text-white">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm leading-relaxed text-white/70">
                    {step.description}
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

      </Section>

      {/* ── Documents Section — light tone ─────────────────────────────────── */}
      <Section tone="light" id="documents">

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20 lg:items-start">

          {/* Text column */}
          <div className="flex flex-col gap-8">

            <Reveal delay={0}>
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="h-px w-8 bg-gradient-to-r from-violet-700 to-fuchsia-vcm"
                />
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-violet-700">
                  À préparer
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <h2 className="font-display text-[clamp(1.9rem,4vw,3.2rem)] leading-[0.95] tracking-tight text-encre [text-wrap:balance]">
                Documents nécessaires
              </h2>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="text-[0.95rem] leading-relaxed text-encre/65">
                Pour finaliser votre inscription, merci de préparer les pièces
                suivantes. En cas de doute, notre responsable club vous guidera
                pour compléter votre dossier.
              </p>
            </Reveal>

            <Reveal delay={0.22}>
              <ul className="space-y-4">
                {documents.map((doc, i) => {
                  return (
                    <li
                      key={i}
                      className="flex items-start gap-4 rounded-xl border border-encre/10 bg-lilac/60 px-5 py-4"
                    >
                      {/* Check badge */}
                      <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-700/20 to-fuchsia-vcm/15 border border-violet-700/20">
                        <Check className="size-3.5 text-violet-700" aria-hidden />
                      </div>

                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-encre">
                          {doc.label}
                        </span>
                        {doc.note && (
                          <span className="text-xs text-encre/50">{doc.note}</span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Reveal>

          </div>

          {/* Info panel */}
          <Reveal delay={0.3}>
            <div className="flex flex-col gap-5">

              {/* Contact card */}
              <div className="rounded-2xl border border-encre/12 bg-white shadow-sm shadow-encre/8 p-7 flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="h-px w-6 bg-gradient-to-r from-violet-700 to-fuchsia-vcm"
                  />
                  <span className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-violet-700">
                    Contact
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="font-medium text-encre">{club.contact.person}</p>
                  <p className="text-xs text-encre/50">Responsable des inscriptions</p>
                </div>

                <div className="space-y-3">
                  <a
                    href={`tel:${club.contact.phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-3 text-sm text-encre/70 transition-colors hover:text-encre"
                  >
                    <Phone className="size-4 text-violet-700 shrink-0" aria-hidden />
                    {club.contact.phone}
                  </a>
                  <a
                    href={`mailto:${club.contact.email}`}
                    className="flex items-center gap-3 text-sm text-encre/70 transition-colors hover:text-encre"
                  >
                    <Mail className="size-4 text-violet-700 shrink-0" aria-hidden />
                    {club.contact.email}
                  </a>
                </div>

                <div className="border-t border-encre/8 pt-5 space-y-2">
                  <p className="text-xs font-medium text-encre/60 uppercase tracking-wide">
                    Horaires d&rsquo;entraînement
                  </p>
                  <p className="text-sm text-encre/70">{club.schedule}</p>
                  <p className="text-sm text-encre/70">
                    {club.address.venue}, {club.address.street}, {club.address.city}
                  </p>
                </div>
              </div>

              {/* Essai gratuit nudge */}
              <div className="rounded-2xl border border-violet-700/20 bg-gradient-to-br from-violet-700/5 to-fuchsia-vcm/5 p-6 flex flex-col gap-3">
                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-violet-700">
                  Bon à savoir
                </span>
                <p className="text-sm leading-relaxed text-encre/70">
                  Une <strong className="text-encre/85">séance d&rsquo;essai gratuite</strong>{" "}
                  est proposée à tous les nouveaux membres. {/* [À CONFIRMER] */}
                  C&rsquo;est l&rsquo;occasion parfaite de découvrir l&rsquo;ambiance
                  du club avant de vous engager.
                </p>
              </div>

            </div>
          </Reveal>

        </div>
      </Section>

      {/* ── Liens utiles Section — dark ────────────────────────────────────── */}
      <Section tone="dark" id="liens-utiles">

        {/* Section heading */}
        <div className="mb-12 sm:mb-16">
          <Reveal delay={0}>
            <div className="flex items-center gap-3 mb-5">
              <span
                aria-hidden
                className="h-px w-8 bg-gradient-to-r from-violet-700 to-fuchsia-vcm"
              />
              <span className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-fuchsia-vcm">
                Plateformes
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="font-display text-[clamp(2rem,5vw,4rem)] leading-[0.95] tracking-tight text-white [text-wrap:balance]">
              Liens utiles
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-xl text-[0.95rem] leading-relaxed text-white/70">
              Toutes les ressources pour préparer votre inscription et rester
              connecté à la vie du club.
            </p>
          </Reveal>
        </div>

        {/* Link cards */}
        <StaggerGroup className="grid grid-cols-1 gap-5 sm:grid-cols-3">

          {/* Clubeo */}
          <StaggerItem>
            <div className="group relative flex flex-col gap-5 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-7 transition-all duration-300 hover:border-violet-500/30 hover:bg-violet-700/[0.06]">
              <div className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-violet-700/30 to-fuchsia-vcm/20">
                <ExternalLink className="size-5 text-fuchsia-vcm" aria-hidden />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-display text-base leading-tight text-white">
                  Espace club (Clubeo)
                </h3>
                <p className="text-sm leading-relaxed text-white/70">
                  Inscriptions en ligne, actualités et documents sur la plateforme
                  officielle du VCM.
                </p>
              </div>
              <MagneticButton
                href={club.socials.clubeo!}
                className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-fuchsia-vcm transition-colors hover:text-white"
              >
                Accéder au Clubeo
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
              </MagneticButton>
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-px rounded-b-2xl bg-gradient-to-r from-violet-700/0 via-fuchsia-vcm/50 to-violet-700/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </div>
          </StaggerItem>

          {/* FFVolley */}
          <StaggerItem>
            <div className="group relative flex flex-col gap-5 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-7 transition-all duration-300 hover:border-violet-500/30 hover:bg-violet-700/[0.06]">
              <div className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-violet-700/30 to-fuchsia-vcm/20">
                <FileText className="size-5 text-fuchsia-vcm" aria-hidden />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-display text-base leading-tight text-white">
                  Licence FFVolley
                  {/* [À CONFIRMER] */}
                </h3>
                <p className="text-sm leading-relaxed text-white/70">
                  Renseignements sur la licence fédérale, les catégories et les
                  formulaires officiels.
                </p>
              </div>
              <MagneticButton
                href="https://www.ffvolley.org/"
                className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-fuchsia-vcm transition-colors hover:text-white"
              >
                Site FFVolley {/* [À CONFIRMER] */}
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
              </MagneticButton>
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-px rounded-b-2xl bg-gradient-to-r from-violet-700/0 via-fuchsia-vcm/50 to-violet-700/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </div>
          </StaggerItem>

          {/* Email */}
          <StaggerItem>
            <div className="group relative flex flex-col gap-5 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-7 transition-all duration-300 hover:border-violet-500/30 hover:bg-violet-700/[0.06]">
              <div className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-violet-700/30 to-fuchsia-vcm/20">
                <Mail className="size-5 text-fuchsia-vcm" aria-hidden />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-display text-base leading-tight text-white">
                  Contacter le club
                </h3>
                <p className="text-sm leading-relaxed text-white/70">
                  Une question sur votre inscription ? Envoyez-nous un email, nous
                  vous répondrons rapidement.
                </p>
              </div>
              <MagneticButton
                href={`mailto:${club.contact.email}`}
                className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-fuchsia-vcm transition-colors hover:text-white"
              >
                {club.contact.email}
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
              </MagneticButton>
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-px rounded-b-2xl bg-gradient-to-r from-violet-700/0 via-fuchsia-vcm/50 to-violet-700/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </div>
          </StaggerItem>

        </StaggerGroup>

      </Section>

      {/* ── FAQ Section — dark (Accordion requires dark bg for text-white/70 readability) ── */}
      <Section tone="dark" id="faq" className="border-t border-white/[0.06]">

        {/* Section heading */}
        <div className="mb-14 sm:mb-18">
          <Reveal delay={0}>
            <div className="flex items-center gap-3 mb-5">
              <span
                aria-hidden
                className="h-px w-8 bg-gradient-to-r from-violet-700 to-fuchsia-vcm"
              />
              <span className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-fuchsia-vcm">
                Vos questions
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="font-display text-[clamp(2rem,5vw,4rem)] leading-[0.95] tracking-tight text-white [text-wrap:balance]">
              Questions fréquentes
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-xl text-[0.95rem] leading-relaxed text-white/70">
              Vous ne trouvez pas la réponse à votre question ? Contactez-nous
              directement à{" "}
              <a
                href={`mailto:${club.contact.email}`}
                className="text-fuchsia-vcm underline decoration-fuchsia-vcm/40 underline-offset-2 transition-colors hover:text-white"
              >
                {club.contact.email}
              </a>.
            </p>
          </Reveal>
        </div>

        {/* Accordion — on dark bg so text-white/70 answer text is readable */}
        <Reveal delay={0.2}>
          <div className="mx-auto max-w-3xl">
            <Accordion items={faq} />
          </div>
        </Reveal>

      </Section>

      {/* ── Closing CTA ────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="inscriptions-cta-heading"
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

        {/* Top border */}
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
                  Rejoignez l&rsquo;aventure
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
                id="inscriptions-cta-heading"
                className="font-display text-[clamp(2rem,5vw,4rem)] leading-[0.95] tracking-tight text-white [text-wrap:balance]"
              >
                Prêt à jouer ?
              </h2>
            </Reveal>

            {/* Body */}
            <Reveal delay={0.18}>
              <p className="mt-6 text-[0.95rem] leading-relaxed text-white/70">
                Quelle que soit votre section, le Volley Club Marseillanais vous
                accueille à bras ouverts. Commencez par une séance d&rsquo;essai
                gratuite et rejoignez une communauté sportive unique au bord de
                l&rsquo;étang de Thau.
              </p>
            </Reveal>

            {/* CTAs */}
            <Reveal delay={0.28}>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <MagneticButton
                  href={club.socials.clubeo!}
                  className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-violet-700 via-magenta to-fuchsia-vcm px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white shadow-xl shadow-magenta/35 transition-shadow duration-300 hover:shadow-magenta/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 focus-visible:ring-offset-2 focus-visible:ring-offset-night"
                >
                  S&rsquo;inscrire en ligne
                  <ExternalLink
                    className="size-4"
                    aria-hidden
                  />
                </MagneticButton>

                <MagneticButton
                  href="/contact"
                  className="group inline-flex items-center justify-center gap-2.5 rounded-full border border-white/20 bg-white/[0.04] px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white/80 transition-all duration-300 hover:border-violet-500/50 hover:bg-violet-700/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 focus-visible:ring-offset-2 focus-visible:ring-offset-night"
                >
                  Nous contacter
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden
                  />
                </MagneticButton>
              </div>
            </Reveal>

          </div>
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
