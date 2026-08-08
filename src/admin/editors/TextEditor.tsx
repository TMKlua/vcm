"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useAdminDraft } from "../useAdminDraft";
import { Button, Field, SectionTitle, TextInput, TextArea } from "../ui";
import ImageInput from "../ImageInput";

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

/** Image leaf — upload ou chemin/URL. */
function Img({
  path,
  label,
  value,
  update,
  help,
  defaultValue,
}: {
  path: string;
  label: string;
  value: string;
  update: UpdateFn;
  help?: string;
  defaultValue?: string;
}) {
  return (
    <ImageInput
      label={label}
      value={value}
      onChange={(val) => update(path, val)}
      help={help}
      defaultValue={defaultValue}
    />
  );
}

/**
 * Liste d'objets éditable (étapes, documents, bénéfices, niveaux de
 * partenariat) : ajout, suppression, déplacement, un champ par propriété.
 */
function ObjectList<T extends Record<string, string>>({
  path,
  label,
  hint,
  value,
  fields,
  blank,
  update,
}: {
  path: string;
  label: string;
  hint?: string;
  value: T[] | undefined;
  /** Propriétés éditables, dans l'ordre d'affichage. */
  fields: { key: keyof T & string; label: string; multiline?: boolean }[];
  /** Gabarit d'un nouvel élément. */
  blank: T;
  update: UpdateFn;
}) {
  const items = value ?? [];

  function write(next: T[]) {
    update(path, next);
  }

  function patch(index: number, key: string, val: string) {
    write(items.map((it, i) => (i === index ? { ...it, [key]: val } : it)));
  }

  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    write(next);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-white/80">{label}</span>
        <Button type="button" onClick={() => write([...items, { ...blank }])}>
          Ajouter
        </Button>
      </div>
      {hint && <p className="text-xs text-white/40">{hint}</p>}

      {items.length === 0 && (
        <p className="text-xs text-white/40">Aucun élément pour le moment.</p>
      )}

      {items.map((item, i) => (
        <div
          key={i}
          className="space-y-3 rounded-xl border border-white/10 bg-black/20 p-4"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/40">
              {i + 1}
            </span>
            <div className="flex gap-2">
              <Button type="button" onClick={() => move(i, -1)} disabled={i === 0}>
                Monter
              </Button>
              <Button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === items.length - 1}
              >
                Descendre
              </Button>
              <Button
                type="button"
                onClick={() => write(items.filter((_, j) => j !== i))}
              >
                Supprimer
              </Button>
            </div>
          </div>
          {fields.map((f) => {
            const id = `${path}-${i}-${f.key}`;
            return (
              <Field key={f.key} label={f.label} htmlFor={id}>
                {f.multiline ? (
                  <TextArea
                    id={id}
                    rows={3}
                    value={item[f.key] ?? ""}
                    onChange={(e) => patch(i, f.key, e.target.value)}
                  />
                ) : (
                  <TextInput
                    id={id}
                    value={item[f.key] ?? ""}
                    onChange={(e) => patch(i, f.key, e.target.value)}
                  />
                )}
              </Field>
            );
          })}
        </div>
      ))}
    </div>
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
        <Str path="text.hero.scrollHint" label="Indicateur de défilement" value={t.hero.scrollHint ?? ""} update={update} />
        <Img
          path="text.hero.image"
          label="Photo de fond du hero"
          value={t.hero.image ?? ""}
          update={update}
          defaultValue="/images/hero/hero-1.jpg"
          help="Photo plein écran derrière « Joue. Smash. Gagne. ». Format paysage, 1920px de large minimum."
        />
      </Accordion>

      <Accordion title="Accueil — Intro">
        <Str path="text.intro.kicker" label="Kicker" value={t.intro.kicker} update={update} />
        <Str path="text.intro.title" label="Titre" value={t.intro.title} update={update} />
        <Str path="text.intro.titleAccent" label="Titre (accent)" value={t.intro.titleAccent ?? ""} update={update} />
        <Multi path="text.intro.body" label="Texte" value={t.intro.body} update={update} />
        <Str path="text.intro.cta" label="CTA" value={t.intro.cta} update={update} />
        <Str path="text.intro.imageCaption" label="Badge sur la photo" value={t.intro.imageCaption ?? ""} update={update} />
        <Img
          path="text.intro.image"
          label="Photo de la section « Le Club »"
          value={t.intro.image ?? ""}
          update={update}
          defaultValue="/images/gallery/1.jpg"
          help="Format paysage 4:3."
        />
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
        <Str path="text.teamsPreview.ctaAll" label="Bouton bas de section" value={t.teamsPreview.ctaAll ?? ""} update={update} />
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
        <Str path="text.join.kicker" label="Pastille (ex. « Saison 2025–2026 »)" value={t.join.kicker ?? ""} update={update} />
        <Str path="text.join.cta" label="CTA" value={t.join.cta} update={update} />
        <Str path="text.join.ctaSecondary" label="CTA secondaire" value={t.join.ctaSecondary ?? ""} update={update} />
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
        <Str path="text.footer.navHeading" label="Titre colonne « Navigation »" value={t.footer.navHeading ?? ""} update={update} />
        <Str path="text.footer.practicesHeading" label="Titre colonne « Nos pratiques »" value={t.footer.practicesHeading ?? ""} update={update} />
        <Str path="text.footer.contactHeading" label="Titre colonne « Contact »" value={t.footer.contactHeading ?? ""} update={update} />
        <Str path="text.footer.legalLabel" label="Lien mentions légales" value={t.footer.legalLabel ?? ""} update={update} />
      </Accordion>

      <Accordion title="Navigation — boutons">
        <Str path="text.labels.navCta" label="Bouton barre de navigation" value={t.labels?.navCta ?? ""} update={update} />
        <Str path="text.labels.navCtaLong" label="Bouton menu mobile" value={t.labels?.navCtaLong ?? ""} update={update} />
        <Str path="text.ui.megaMenuTitle" label="Méga-menu — titre de l'encart" value={t.ui?.megaMenuTitle ?? ""} update={update} />
        <Multi path="text.ui.megaMenuText" label="Méga-menu — texte" value={t.ui?.megaMenuText ?? ""} update={update} />
        <Str path="text.ui.megaMenuCta" label="Méga-menu — bouton" value={t.ui?.megaMenuCta ?? ""} update={update} />
      </Accordion>

      <Accordion title="Libellés partagés">
        <Str path="text.ui.breadcrumbHome" label="Fil d'Ariane — « Accueil »" value={t.ui?.breadcrumbHome ?? ""} update={update} />
        <Str path="text.ui.skipLink" label="Lien d'évitement clavier" value={t.ui?.skipLink ?? ""} update={update} />
        <Str path="text.ui.teamCardCta" label="Carte équipe — lien" value={t.ui?.teamCardCta ?? ""} update={update} />
        <Str path="text.ui.newsFeatured" label="Actualité — badge « À la une »" value={t.ui?.newsFeatured ?? ""} update={update} />
        <Str path="text.ui.mapDirections" label="Carte — bouton itinéraire" value={t.ui?.mapDirections ?? ""} update={update} />
        <Str path="text.ui.teamObjectives" label="Fiche équipe — « Objectifs »" value={t.ui?.teamObjectives ?? ""} update={update} />
        <Str path="text.ui.teamSchedule" label="Fiche équipe — « Créneaux »" value={t.ui?.teamSchedule ?? ""} update={update} />
        <Str path="text.ui.teamRoster" label="Fiche équipe — « Effectif »" value={t.ui?.teamRoster ?? ""} update={update} />
        <Str path="text.ui.socialFacebook" label="Bouton Facebook" value={t.ui?.socialFacebook ?? ""} update={update} />
        <Str path="text.ui.socialInstagram" label="Bouton Instagram" value={t.ui?.socialInstagram ?? ""} update={update} />
        <Str path="text.ui.socialWebsite" label="Bouton site officiel" value={t.ui?.socialWebsite ?? ""} update={update} />
        <Str path="text.ui.clubeoLabel" label="Bouton Clubeo" value={t.ui?.clubeoLabel ?? ""} update={update} />
      </Accordion>

      <Accordion title="Formulaire de contact">
        <Str path="text.ui.form.kicker" label="Kicker" value={t.ui?.form?.kicker ?? ""} update={update} />
        <Str path="text.ui.form.heading" label="Titre" value={t.ui?.form?.heading ?? ""} update={update} />
        <Multi path="text.ui.form.note" label="Note sous le titre" value={t.ui?.form?.note ?? ""} update={update} />
        <Str path="text.ui.form.nameLabel" label="Champ nom — libellé" value={t.ui?.form?.nameLabel ?? ""} update={update} />
        <Str path="text.ui.form.namePlaceholder" label="Champ nom — exemple" value={t.ui?.form?.namePlaceholder ?? ""} update={update} />
        <Str path="text.ui.form.emailLabel" label="Champ email — libellé" value={t.ui?.form?.emailLabel ?? ""} update={update} />
        <Str path="text.ui.form.emailPlaceholder" label="Champ email — exemple" value={t.ui?.form?.emailPlaceholder ?? ""} update={update} />
        <Str path="text.ui.form.messageLabel" label="Champ message — libellé" value={t.ui?.form?.messageLabel ?? ""} update={update} />
        <Multi path="text.ui.form.messagePlaceholder" label="Champ message — exemple" value={t.ui?.form?.messagePlaceholder ?? ""} update={update} />
        <Str path="text.ui.form.submit" label="Bouton d'envoi" value={t.ui?.form?.submit ?? ""} update={update} />
        <Multi path="text.ui.form.errorSummary" label="Message d'erreur global" value={t.ui?.form?.errorSummary ?? ""} update={update} />
        <Str path="text.ui.form.successTitle" label="Confirmation — titre" value={t.ui?.form?.successTitle ?? ""} update={update} />
        <Multi path="text.ui.form.successBody" label="Confirmation — texte" value={t.ui?.form?.successBody ?? ""} update={update} />
        <Str path="text.ui.form.successAgain" label="Confirmation — lien de retour" value={t.ui?.form?.successAgain ?? ""} update={update} />
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
        <Str path="text.pages.histoire.introKicker" label="Titre d'intro" value={t.pages.histoire.introKicker ?? ""} update={update} />
        <Str path="text.pages.histoire.timelineKicker" label="Kicker chronologie" value={t.pages.histoire.timelineKicker ?? ""} update={update} />
        <Multi path="text.pages.histoire.timelineSubtitle" label="Sous-titre chronologie" value={t.pages.histoire.timelineSubtitle ?? ""} update={update} />
        <Str path="text.pages.histoire.visionKicker" label="Kicker vision" value={t.pages.histoire.visionKicker ?? ""} update={update} />
        <Multi path="text.pages.histoire.visionExtra" label="Vision — 2e paragraphe" value={t.pages.histoire.visionExtra ?? ""} update={update} />
        <Img
          path="text.pages.histoire.image"
          label="Photo d'intro de la page Histoire"
          value={t.pages.histoire.image ?? ""}
          update={update}
          defaultValue="/images/gallery/2.jpg"
        />
      </Accordion>

      <Accordion title="Page — Équipes">
        <Str path="text.pages.equipes.heroKicker" label="Hero kicker" value={t.pages.equipes.heroKicker} update={update} />
        <Str path="text.pages.equipes.heroTitle" label="Hero titre" value={t.pages.equipes.heroTitle} update={update} />
        <Multi path="text.pages.equipes.heroSubtitle" label="Hero sous-titre" value={t.pages.equipes.heroSubtitle} update={update} />
        <Str path="text.pages.equipes.cta" label="CTA" value={t.pages.equipes.cta} update={update} />
        <Str path="text.pages.equipes.ctaKicker" label="Bloc final — kicker" value={t.pages.equipes.ctaKicker ?? ""} update={update} />
        <Str path="text.pages.equipes.ctaTitle" label="Bloc final — titre" value={t.pages.equipes.ctaTitle ?? ""} update={update} />
        <Multi path="text.pages.equipes.ctaBody" label="Bloc final — texte" value={t.pages.equipes.ctaBody ?? ""} update={update} />
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
        <Str path="text.pages.sportSante.introKicker" label="Kicker intro" value={t.pages.sportSante.introKicker ?? ""} update={update} />
        <Str path="text.pages.sportSante.benefitsKicker" label="Kicker bénéfices" value={t.pages.sportSante.benefitsKicker ?? ""} update={update} />
        <Multi path="text.pages.sportSante.benefitsIntro" label="Intro bénéfices" value={t.pages.sportSante.benefitsIntro ?? ""} update={update} />
        <ObjectList
          path="text.pages.sportSante.benefits"
          label="Les bénéfices (vignettes)"
          hint="L'icône est choisie automatiquement selon la position."
          value={t.pages.sportSante.benefits}
          fields={[
            { key: "title", label: "Titre" },
            { key: "text", label: "Texte", multiline: true },
          ]}
          blank={{ title: "", text: "" }}
          update={update}
        />
        <Str path="text.pages.sportSante.inclusionKicker" label="Kicker inclusion" value={t.pages.sportSante.inclusionKicker ?? ""} update={update} />
        <Str path="text.pages.sportSante.ctaKicker" label="Bloc final — kicker" value={t.pages.sportSante.ctaKicker ?? ""} update={update} />
        <Str path="text.pages.sportSante.ctaTitle" label="Bloc final — titre" value={t.pages.sportSante.ctaTitle ?? ""} update={update} />
        <Multi path="text.pages.sportSante.ctaBody" label="Bloc final — texte" value={t.pages.sportSante.ctaBody ?? ""} update={update} />
        <Str path="text.pages.sportSante.ctaSecondary" label="Bloc final — 2e bouton" value={t.pages.sportSante.ctaSecondary ?? ""} update={update} />
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
        <Str path="text.pages.inscriptions.stepsKicker" label="Kicker étapes" value={t.pages.inscriptions.stepsKicker ?? ""} update={update} />
        <Multi path="text.pages.inscriptions.stepsIntro" label="Intro étapes" value={t.pages.inscriptions.stepsIntro ?? ""} update={update} />
        <ObjectList
          path="text.pages.inscriptions.steps"
          label="Les étapes"
          hint="La numérotation et l'icône suivent l'ordre de la liste."
          value={t.pages.inscriptions.steps}
          fields={[
            { key: "title", label: "Titre" },
            { key: "description", label: "Description", multiline: true },
          ]}
          blank={{ title: "", description: "" }}
          update={update}
        />
        <Str path="text.pages.inscriptions.documentsKicker" label="Kicker documents" value={t.pages.inscriptions.documentsKicker ?? ""} update={update} />
        <Multi path="text.pages.inscriptions.documentsIntro" label="Intro documents" value={t.pages.inscriptions.documentsIntro ?? ""} update={update} />
        <ObjectList
          path="text.pages.inscriptions.documents"
          label="Les pièces à fournir"
          value={t.pages.inscriptions.documents as { label: string; note: string }[] | undefined}
          fields={[
            { key: "label", label: "Pièce" },
            { key: "note", label: "Précision (facultatif)" },
          ]}
          blank={{ label: "", note: "" }}
          update={update}
        />
        <Str path="text.pages.inscriptions.contactHeading" label="Encart contact — kicker" value={t.pages.inscriptions.contactHeading ?? ""} update={update} />
        <Str path="text.pages.inscriptions.contactPersonLabel" label="Encart contact — rôle" value={t.pages.inscriptions.contactPersonLabel ?? ""} update={update} />
        <Str path="text.pages.inscriptions.scheduleHeading" label="Encart contact — titre horaires" value={t.pages.inscriptions.scheduleHeading ?? ""} update={update} />
        <Str path="text.pages.inscriptions.tipHeading" label="Encart essai — titre" value={t.pages.inscriptions.tipHeading ?? ""} update={update} />
        <Multi path="text.pages.inscriptions.tipBody" label="Encart essai — texte" value={t.pages.inscriptions.tipBody ?? ""} update={update} />
        <Str path="text.pages.inscriptions.linksKicker" label="Kicker liens" value={t.pages.inscriptions.linksKicker ?? ""} update={update} />
        <Multi path="text.pages.inscriptions.linksIntro" label="Intro liens" value={t.pages.inscriptions.linksIntro ?? ""} update={update} />
        <Str path="text.pages.inscriptions.clubeoTitle" label="Carte Clubeo — titre" value={t.pages.inscriptions.clubeoTitle ?? ""} update={update} />
        <Multi path="text.pages.inscriptions.clubeoBody" label="Carte Clubeo — texte" value={t.pages.inscriptions.clubeoBody ?? ""} update={update} />
        <Str path="text.pages.inscriptions.clubeoCta" label="Carte Clubeo — lien" value={t.pages.inscriptions.clubeoCta ?? ""} update={update} />
        <Str path="text.pages.inscriptions.licenceTitle" label="Carte FFVolley — titre" value={t.pages.inscriptions.licenceTitle ?? ""} update={update} />
        <Multi path="text.pages.inscriptions.licenceBody" label="Carte FFVolley — texte" value={t.pages.inscriptions.licenceBody ?? ""} update={update} />
        <Str path="text.pages.inscriptions.ffvolleyCta" label="Carte FFVolley — lien" value={t.pages.inscriptions.ffvolleyCta ?? ""} update={update} />
        <Str path="text.pages.inscriptions.contactCta" label="Carte contact — lien" value={t.pages.inscriptions.contactCta ?? ""} update={update} />
        <Str path="text.pages.inscriptions.faqKicker" label="Kicker FAQ" value={t.pages.inscriptions.faqKicker ?? ""} update={update} />
        <Multi path="text.pages.inscriptions.faqIntro" label="Intro FAQ (avant l'email)" value={t.pages.inscriptions.faqIntro ?? ""} update={update} />
        <Str path="text.pages.inscriptions.ctaKicker" label="Bloc final — kicker" value={t.pages.inscriptions.ctaKicker ?? ""} update={update} />
        <Str path="text.pages.inscriptions.ctaTitle" label="Bloc final — titre" value={t.pages.inscriptions.ctaTitle ?? ""} update={update} />
        <Multi path="text.pages.inscriptions.ctaBody" label="Bloc final — texte" value={t.pages.inscriptions.ctaBody ?? ""} update={update} />
        <Str path="text.pages.inscriptions.ctaSecondary" label="Bloc final — 2e bouton" value={t.pages.inscriptions.ctaSecondary ?? ""} update={update} />
      </Accordion>

      <Accordion title="Page — Partenaires">
        <Str path="text.pages.partenaires.heroKicker" label="Hero kicker" value={t.pages.partenaires.heroKicker} update={update} />
        <Str path="text.pages.partenaires.heroTitle" label="Hero titre" value={t.pages.partenaires.heroTitle} update={update} />
        <Multi path="text.pages.partenaires.heroSubtitle" label="Hero sous-titre" value={t.pages.partenaires.heroSubtitle} update={update} />
        <Str path="text.pages.partenaires.wallHeading" label="Titre mur" value={t.pages.partenaires.wallHeading ?? ""} update={update} />
        <Str path="text.pages.partenaires.becomeTitle" label="Titre « Devenir partenaire »" value={t.pages.partenaires.becomeTitle} update={update} />
        <List path="text.pages.partenaires.becomeBody" label="Texte « Devenir partenaire »" value={t.pages.partenaires.becomeBody} update={update} />
        <Str path="text.pages.partenaires.cta" label="CTA" value={t.pages.partenaires.cta} update={update} />
        <Str path="text.pages.partenaires.wallKicker" label="Kicker mur" value={t.pages.partenaires.wallKicker ?? ""} update={update} />
        <Multi path="text.pages.partenaires.wallIntro" label="Intro mur" value={t.pages.partenaires.wallIntro ?? ""} update={update} />
        <ObjectList
          path="text.pages.partenaires.tiers"
          label="Niveaux de partenariat"
          hint="Dans l'ordre : Principal, Officiels, Institutions."
          value={t.pages.partenaires.tiers}
          fields={[
            { key: "label", label: "Intitulé" },
            { key: "description", label: "Description", multiline: true },
          ]}
          blank={{ label: "", description: "" }}
          update={update}
        />
        <Str path="text.pages.partenaires.becomeKicker" label="Kicker « Devenir partenaire »" value={t.pages.partenaires.becomeKicker ?? ""} update={update} />
        <Str path="text.pages.partenaires.becomeCtaTitle" label="Titre du bloc contact" value={t.pages.partenaires.becomeCtaTitle ?? ""} update={update} />
        <Str path="text.pages.partenaires.contactCta" label="Kicker du bloc contact" value={t.pages.partenaires.contactCta ?? ""} update={update} />
      </Accordion>

      <Accordion title="Page — Galerie">
        <Str path="text.pages.galerie.heroKicker" label="Hero kicker" value={t.pages.galerie.heroKicker} update={update} />
        <Str path="text.pages.galerie.heroTitle" label="Hero titre" value={t.pages.galerie.heroTitle} update={update} />
        <Multi path="text.pages.galerie.heroSubtitle" label="Hero sous-titre" value={t.pages.galerie.heroSubtitle} update={update} />
        <Str path="text.pages.galerie.sectionKicker" label="Kicker section" value={t.pages.galerie.sectionKicker ?? ""} update={update} />
        <Str path="text.pages.galerie.sectionTitle" label="Titre section" value={t.pages.galerie.sectionTitle ?? ""} update={update} />
        <Multi path="text.pages.galerie.sectionBody" label="Texte section" value={t.pages.galerie.sectionBody ?? ""} update={update} />
      </Accordion>

      <Accordion title="Page — Actualités">
        <Str path="text.pages.actualites.heroKicker" label="Hero kicker" value={t.pages.actualites.heroKicker} update={update} />
        <Str path="text.pages.actualites.heroTitle" label="Hero titre" value={t.pages.actualites.heroTitle} update={update} />
        <Multi path="text.pages.actualites.heroSubtitle" label="Hero sous-titre" value={t.pages.actualites.heroSubtitle} update={update} />
        <Str path="text.pages.actualites.latestLabel" label="Badge « Dernière actualité »" value={t.pages.actualites.latestLabel ?? ""} update={update} />
        <Str path="text.pages.actualites.allLabel" label="Lien « Toutes les actualités »" value={t.pages.actualites.allLabel ?? ""} update={update} />
        <Str path="text.pages.actualites.backLabel" label="Article — lien de retour" value={t.pages.actualites.backLabel ?? ""} update={update} />
        <Str path="text.pages.actualites.relatedHeading" label="Article — « À lire aussi »" value={t.pages.actualites.relatedHeading ?? ""} update={update} />
        <Str path="text.pages.actualites.articleCta" label="Article — bouton final" value={t.pages.actualites.articleCta ?? ""} update={update} />
        <Str path="text.pages.actualites.notFoundKicker" label="Article introuvable — kicker" value={t.pages.actualites.notFoundKicker ?? ""} update={update} />
        <Str path="text.pages.actualites.notFoundTitle" label="Article introuvable — titre" value={t.pages.actualites.notFoundTitle ?? ""} update={update} />
        <Multi path="text.pages.actualites.notFoundBody" label="Article introuvable — texte" value={t.pages.actualites.notFoundBody ?? ""} update={update} />
      </Accordion>

      <Accordion title="Page — Contact">
        <Str path="text.pages.contact.heroKicker" label="Hero kicker" value={t.pages.contact.heroKicker} update={update} />
        <Str path="text.pages.contact.heroTitle" label="Hero titre" value={t.pages.contact.heroTitle} update={update} />
        <Multi path="text.pages.contact.heroSubtitle" label="Hero sous-titre" value={t.pages.contact.heroSubtitle} update={update} />
        <Str path="text.pages.contact.infoHeading" label="Titre infos" value={t.pages.contact.infoHeading ?? ""} update={update} />
        <Str path="text.pages.contact.formHeading" label="Titre formulaire" value={t.pages.contact.formHeading ?? ""} update={update} />
        <Str path="text.pages.contact.mapHeading" label="Titre carte" value={t.pages.contact.mapHeading ?? ""} update={update} />
        <Str path="text.pages.contact.contactsHeading" label="Kicker « Nos coordonnées »" value={t.pages.contact.contactsHeading ?? ""} update={update} />
        <Str path="text.pages.contact.contactPersonLabel" label="Libellé personne référente" value={t.pages.contact.contactPersonLabel ?? ""} update={update} />
        <Str path="text.pages.contact.scheduleLabel" label="Libellé « Entraînements »" value={t.pages.contact.scheduleLabel ?? ""} update={update} />
        <Str path="text.pages.contact.socialsHeading" label="Titre « Suivez-nous »" value={t.pages.contact.socialsHeading ?? ""} update={update} />
        <Str path="text.pages.contact.mapKicker" label="Kicker « Localisation »" value={t.pages.contact.mapKicker ?? ""} update={update} />
      </Accordion>
    </div>
  );
}
