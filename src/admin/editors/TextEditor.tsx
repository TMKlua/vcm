"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useAdminDraft } from "../useAdminDraft";
import { Field, SectionTitle, TextInput, TextArea } from "../ui";

/* ──────────────────────────────────────────────────────────────────────────
 * Textes du site — edits the entire `draft.text` tree.
 *
 * Each top-level section is an accordion. Leaves are TextInput/TextArea.
 * string[] leaves (paragraph blocks) are edited as a multiline textarea:
 * one paragraph per line. Empty lines are dropped on write.
 * ────────────────────────────────────────────────────────────────────────── */

function Accordion({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#15082e]/60">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-6 py-4 text-left transition hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#a855f7]/40"
      >
        <span className="font-display text-sm uppercase tracking-wide text-white">
          {title}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-white/50 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open && <div className="space-y-4 border-t border-white/10 px-6 py-5">{children}</div>}
    </div>
  );
}

type UpdateFn = (path: string, value: unknown) => void;

/** Single-line string leaf. */
function Str({
  path,
  label,
  value,
  update,
}: {
  path: string;
  label: string;
  value: string;
  update: UpdateFn;
}) {
  const id = `text-${path}`;
  return (
    <Field label={label} htmlFor={id}>
      <TextInput
        id={id}
        value={value}
        onChange={(e) => update(path, e.target.value)}
      />
    </Field>
  );
}

/** Multi-line string leaf. */
function Multi({
  path,
  label,
  value,
  update,
}: {
  path: string;
  label: string;
  value: string;
  update: UpdateFn;
}) {
  const id = `text-${path}`;
  return (
    <Field label={label} htmlFor={id}>
      <TextArea
        id={id}
        rows={3}
        value={value}
        onChange={(e) => update(path, e.target.value)}
      />
    </Field>
  );
}

/** string[] leaf — one paragraph per line. */
function List({
  path,
  label,
  value,
  update,
}: {
  path: string;
  label: string;
  value: string[];
  update: UpdateFn;
}) {
  const id = `text-${path}`;
  return (
    <Field
      label={label}
      htmlFor={id}
      hint="Un paragraphe par ligne. Les lignes vides sont ignorées."
    >
      <TextArea
        id={id}
        rows={Math.max(4, value.length + 1)}
        value={value.join("\n")}
        onChange={(e) =>
          update(
            path,
            e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
          )
        }
      />
    </Field>
  );
}

export default function TextEditor() {
  const { draft, update } = useAdminDraft();
  if (!draft) return null;
  const t = draft.text;

  return (
    <div className="space-y-4">
      <SectionTitle
        title="Textes du site"
        description="Tous les textes éditoriaux des sections de la page d'accueil et des pages internes."
      />

      <Accordion title="Accueil — Hero" defaultOpen>
        <Str path="text.hero.kicker" label="Kicker" value={t.hero.kicker} update={update} />
        <Str path="text.hero.titleLine1" label="Titre ligne 1" value={t.hero.titleLine1} update={update} />
        <Str path="text.hero.titleLine2" label="Titre ligne 2" value={t.hero.titleLine2} update={update} />
        <Multi path="text.hero.subtitle" label="Sous-titre" value={t.hero.subtitle} update={update} />
        <Str path="text.hero.locationChip" label="Localisation (chip)" value={t.hero.locationChip} update={update} />
        <Str path="text.hero.ctaPrimary" label="CTA principal" value={t.hero.ctaPrimary} update={update} />
        <Str path="text.hero.ctaSecondary" label="CTA secondaire" value={t.hero.ctaSecondary} update={update} />
      </Accordion>

      <Accordion title="Accueil — Intro">
        <Str path="text.intro.kicker" label="Kicker" value={t.intro.kicker} update={update} />
        <Str path="text.intro.title" label="Titre" value={t.intro.title} update={update} />
        <Str path="text.intro.titleAccent" label="Titre (accent)" value={t.intro.titleAccent ?? ""} update={update} />
        <Multi path="text.intro.body" label="Texte" value={t.intro.body} update={update} />
        <Str path="text.intro.cta" label="CTA" value={t.intro.cta} update={update} />
      </Accordion>

      <Accordion title="Accueil — Chiffres clés">
        <Str path="text.stats.kicker" label="Kicker" value={t.stats.kicker} update={update} />
        <Str path="text.stats.title" label="Titre" value={t.stats.title} update={update} />
      </Accordion>

      <Accordion title="Accueil — Aperçu équipes">
        <Str path="text.teamsPreview.kicker" label="Kicker" value={t.teamsPreview.kicker} update={update} />
        <Str path="text.teamsPreview.title" label="Titre" value={t.teamsPreview.title} update={update} />
        <Multi path="text.teamsPreview.subtitle" label="Sous-titre" value={t.teamsPreview.subtitle} update={update} />
        <Str path="text.teamsPreview.cta" label="CTA" value={t.teamsPreview.cta} update={update} />
      </Accordion>

      <Accordion title="Accueil — Aperçu événements">
        <Str path="text.events.kicker" label="Kicker" value={t.events.kicker} update={update} />
        <Str path="text.events.title" label="Titre" value={t.events.title} update={update} />
        <Multi path="text.events.subtitle" label="Sous-titre" value={t.events.subtitle ?? ""} update={update} />
        <Str path="text.events.cta" label="CTA" value={t.events.cta} update={update} />
      </Accordion>

      <Accordion title="Accueil — Aperçu galerie">
        <Str path="text.gallery.kicker" label="Kicker" value={t.gallery.kicker} update={update} />
        <Str path="text.gallery.title" label="Titre" value={t.gallery.title} update={update} />
        <Multi path="text.gallery.subtitle" label="Sous-titre" value={t.gallery.subtitle ?? ""} update={update} />
        <Str path="text.gallery.cta" label="CTA" value={t.gallery.cta} update={update} />
      </Accordion>

      <Accordion title="Accueil — Partenaires">
        <Str path="text.partners.kicker" label="Kicker" value={t.partners.kicker} update={update} />
        <Str path="text.partners.title" label="Titre" value={t.partners.title} update={update} />
        <Multi path="text.partners.subtitle" label="Sous-titre" value={t.partners.subtitle ?? ""} update={update} />
        <Str path="text.partners.cta" label="CTA" value={t.partners.cta} update={update} />
      </Accordion>

      <Accordion title="Accueil — Bandeau « Rejoindre »">
        <Str path="text.join.title" label="Titre" value={t.join.title} update={update} />
        <Multi path="text.join.subtitle" label="Sous-titre" value={t.join.subtitle} update={update} />
        <Str path="text.join.cta" label="CTA" value={t.join.cta} update={update} />
      </Accordion>

      <Accordion title="Accueil — Contact rapide">
        <Str path="text.contactQuick.kicker" label="Kicker" value={t.contactQuick.kicker} update={update} />
        <Str path="text.contactQuick.title" label="Titre" value={t.contactQuick.title} update={update} />
        <Multi path="text.contactQuick.subtitle" label="Sous-titre" value={t.contactQuick.subtitle ?? ""} update={update} />
        <Str path="text.contactQuick.cta" label="CTA" value={t.contactQuick.cta} update={update} />
      </Accordion>

      <Accordion title="Pied de page">
        <Str path="text.footer.tagline" label="Slogan" value={t.footer.tagline} update={update} />
        <Str path="text.footer.copyright" label="Copyright" value={t.footer.copyright ?? ""} update={update} />
      </Accordion>

      {/* ── Pages internes ─────────────────────────────────────────── */}

      <Accordion title="Page — Histoire">
        <Str path="text.pages.histoire.heroKicker" label="Hero kicker" value={t.pages.histoire.heroKicker} update={update} />
        <Str path="text.pages.histoire.heroTitle" label="Hero titre" value={t.pages.histoire.heroTitle} update={update} />
        <Multi path="text.pages.histoire.heroSubtitle" label="Hero sous-titre" value={t.pages.histoire.heroSubtitle} update={update} />
        <List path="text.pages.histoire.introParagraphs" label="Paragraphes d'intro" value={t.pages.histoire.introParagraphs} update={update} />
        <Str path="text.pages.histoire.timelineHeading" label="Titre timeline" value={t.pages.histoire.timelineHeading} update={update} />
        <Str path="text.pages.histoire.visionTitle" label="Titre vision" value={t.pages.histoire.visionTitle} update={update} />
        <Multi path="text.pages.histoire.visionBody" label="Texte vision" value={t.pages.histoire.visionBody} update={update} />
        <Str path="text.pages.histoire.cta" label="CTA" value={t.pages.histoire.cta} update={update} />
      </Accordion>

      <Accordion title="Page — Équipes">
        <Str path="text.pages.equipes.heroKicker" label="Hero kicker" value={t.pages.equipes.heroKicker} update={update} />
        <Str path="text.pages.equipes.heroTitle" label="Hero titre" value={t.pages.equipes.heroTitle} update={update} />
        <Multi path="text.pages.equipes.heroSubtitle" label="Hero sous-titre" value={t.pages.equipes.heroSubtitle} update={update} />
        <Str path="text.pages.equipes.cta" label="CTA" value={t.pages.equipes.cta} update={update} />
      </Accordion>

      <Accordion title="Page — Sport Santé">
        <Str path="text.pages.sportSante.heroKicker" label="Hero kicker" value={t.pages.sportSante.heroKicker} update={update} />
        <Str path="text.pages.sportSante.heroTitle" label="Hero titre" value={t.pages.sportSante.heroTitle} update={update} />
        <Multi path="text.pages.sportSante.heroSubtitle" label="Hero sous-titre" value={t.pages.sportSante.heroSubtitle} update={update} />
        <Str path="text.pages.sportSante.introTitle" label="Titre intro" value={t.pages.sportSante.introTitle ?? ""} update={update} />
        <List path="text.pages.sportSante.introBody" label="Texte intro" value={t.pages.sportSante.introBody} update={update} />
        <Str path="text.pages.sportSante.benefitsHeading" label="Titre bénéfices" value={t.pages.sportSante.benefitsHeading ?? ""} update={update} />
        <Str path="text.pages.sportSante.inclusionTitle" label="Titre inclusion" value={t.pages.sportSante.inclusionTitle} update={update} />
        <List path="text.pages.sportSante.inclusionBody" label="Texte inclusion" value={t.pages.sportSante.inclusionBody} update={update} />
        <Str path="text.pages.sportSante.cta" label="CTA" value={t.pages.sportSante.cta} update={update} />
      </Accordion>

      <Accordion title="Page — Inscriptions">
        <Str path="text.pages.inscriptions.heroKicker" label="Hero kicker" value={t.pages.inscriptions.heroKicker} update={update} />
        <Str path="text.pages.inscriptions.heroTitle" label="Hero titre" value={t.pages.inscriptions.heroTitle} update={update} />
        <Multi path="text.pages.inscriptions.heroSubtitle" label="Hero sous-titre" value={t.pages.inscriptions.heroSubtitle} update={update} />
        <Str path="text.pages.inscriptions.stepsHeading" label="Titre étapes" value={t.pages.inscriptions.stepsHeading ?? ""} update={update} />
        <Str path="text.pages.inscriptions.documentsHeading" label="Titre documents" value={t.pages.inscriptions.documentsHeading ?? ""} update={update} />
        <Str path="text.pages.inscriptions.linksHeading" label="Titre liens" value={t.pages.inscriptions.linksHeading ?? ""} update={update} />
        <Str path="text.pages.inscriptions.faqHeading" label="Titre FAQ" value={t.pages.inscriptions.faqHeading} update={update} />
        <Str path="text.pages.inscriptions.cta" label="CTA" value={t.pages.inscriptions.cta} update={update} />
      </Accordion>

      <Accordion title="Page — Partenaires">
        <Str path="text.pages.partenaires.heroKicker" label="Hero kicker" value={t.pages.partenaires.heroKicker} update={update} />
        <Str path="text.pages.partenaires.heroTitle" label="Hero titre" value={t.pages.partenaires.heroTitle} update={update} />
        <Multi path="text.pages.partenaires.heroSubtitle" label="Hero sous-titre" value={t.pages.partenaires.heroSubtitle} update={update} />
        <Str path="text.pages.partenaires.wallHeading" label="Titre mur" value={t.pages.partenaires.wallHeading ?? ""} update={update} />
        <Str path="text.pages.partenaires.becomeTitle" label="Titre « Devenir partenaire »" value={t.pages.partenaires.becomeTitle} update={update} />
        <List path="text.pages.partenaires.becomeBody" label="Texte « Devenir partenaire »" value={t.pages.partenaires.becomeBody} update={update} />
        <Str path="text.pages.partenaires.cta" label="CTA" value={t.pages.partenaires.cta} update={update} />
      </Accordion>

      <Accordion title="Page — Galerie">
        <Str path="text.pages.galerie.heroKicker" label="Hero kicker" value={t.pages.galerie.heroKicker} update={update} />
        <Str path="text.pages.galerie.heroTitle" label="Hero titre" value={t.pages.galerie.heroTitle} update={update} />
        <Multi path="text.pages.galerie.heroSubtitle" label="Hero sous-titre" value={t.pages.galerie.heroSubtitle} update={update} />
      </Accordion>

      <Accordion title="Page — Actualités">
        <Str path="text.pages.actualites.heroKicker" label="Hero kicker" value={t.pages.actualites.heroKicker} update={update} />
        <Str path="text.pages.actualites.heroTitle" label="Hero titre" value={t.pages.actualites.heroTitle} update={update} />
        <Multi path="text.pages.actualites.heroSubtitle" label="Hero sous-titre" value={t.pages.actualites.heroSubtitle} update={update} />
      </Accordion>

      <Accordion title="Page — Contact">
        <Str path="text.pages.contact.heroKicker" label="Hero kicker" value={t.pages.contact.heroKicker} update={update} />
        <Str path="text.pages.contact.heroTitle" label="Hero titre" value={t.pages.contact.heroTitle} update={update} />
        <Multi path="text.pages.contact.heroSubtitle" label="Hero sous-titre" value={t.pages.contact.heroSubtitle} update={update} />
        <Str path="text.pages.contact.infoHeading" label="Titre infos" value={t.pages.contact.infoHeading ?? ""} update={update} />
        <Str path="text.pages.contact.formHeading" label="Titre formulaire" value={t.pages.contact.formHeading ?? ""} update={update} />
        <Str path="text.pages.contact.mapHeading" label="Titre carte" value={t.pages.contact.mapHeading ?? ""} update={update} />
      </Accordion>
    </div>
  );
}
