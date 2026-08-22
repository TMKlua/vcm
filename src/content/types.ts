import type {
  ClubInfo,
  Stat,
  Team,
  NewsArticle,
  ClubEvent,
  Partner,
  GalleryImage,
  FaqItem,
  TimelineEntry,
} from "@/types";

/**
 * Content store types for the client-side CMS.
 *
 * `SiteContent` is the single source of truth consumed (eventually) by the
 * whole app via React context. It is composed of the existing collection types
 * from `@/types` plus a comprehensive `SiteText` tree that captures every piece
 * of editable copy currently hardcoded across the sections and pages.
 */

/** A single player within a team roster. */
export interface Player {
  id: string;
  name: string;
  role: string;
  number?: string;
  image?: string;
}

/**
 * Une sous-équipe : une formation rattachée à une équipe (ex. « Minimes Filles »
 * sous le Pôle Jeunes). Tout est optionnel sauf l'identifiant et le nom — une
 * sous-équipe peut n'être qu'un nom et un créneau.
 */
export interface SubTeam {
  id: string;
  name: string;
  /** Tranche d'âge affichée à côté du nom. */
  ageRange?: string;
  /** Créneaux propres à cette sous-équipe. */
  schedule?: string;
  description?: string;
  image?: string;
  /** Effectif propre à la sous-équipe. */
  players?: Player[];
}

/**
 * Le type `Team` étendu de son effectif et de ses sous-équipes.
 *
 * `subTeams` absent (`undefined`) et `subTeams: []` ne veulent pas dire la même
 * chose : le premier signifie « jamais renseigné » et reçoit l'exemple livré
 * avec le site, le second « vidé depuis /admin » et reste vide.
 */
export type TeamContent = Team & {
  players?: Player[];
  subTeams?: SubTeam[];
};

/**
 * Comprehensive, nested tree of all editable copy on the site.
 *
 * Every leaf is a `string` (or `string[]` where a block of paragraphs/items is
 * rendered). Later tasks will refactor the components/pages to read these
 * values from the content context instead of hardcoded JSX.
 */
/** Une étape numérotée (page Inscriptions). */
export interface StepItem {
  title: string;
  description: string;
}

/** Une pièce à fournir (page Inscriptions). */
export interface DocumentItem {
  label: string;
  note?: string | null;
}

/** Un bénéfice illustré (page Sport Santé, contreparties partenaires). */
export interface BenefitItem {
  title: string;
  text: string;
}

/**
 * Libellés de la navigation (barre du haut, menu mobile, méga-menu, pied de
 * page ET fils d'Ariane des pages internes).
 *
 * Les `href` restent définis dans le code (`@/data/nav`) : ce sont des routes,
 * pas du contenu. Seuls les intitulés sont éditables.
 */
export interface NavLabels {
  home?: string;
  club?: string;
  histoire?: string;
  sportSante?: string;
  equipes?: string;
  actualites?: string;
  galerie?: string;
  partenaires?: string;
  inscriptions?: string;
  contact?: string;
}

/** Titre + description d'une page, pour l'onglet du navigateur et Google. */
export interface SeoPageMeta {
  title?: string;
  description?: string;
}

/**
 * Réglages de référencement et d'identité visuelle du navigateur.
 *
 * Tout est optionnel : une clé vide fait retomber le site sur la valeur livrée
 * avec le code, de sorte qu'un contenu publié avant l'ajout de cette section
 * continue d'afficher exactement les mêmes métadonnées qu'avant.
 */
export interface SeoSettings {
  /** Nom du site (Open Graph, JSON-LD). Vide → nom du club. */
  siteName?: string;
  /** Titre de l'onglet sur l'accueil. */
  defaultTitle?: string;
  /** Gabarit des autres pages. `%s` = titre de la page. */
  titleTemplate?: string;
  /** Description affichée sous le lien dans Google. */
  description?: string;
  /** Mots-clés (un par ligne dans l'admin). */
  keywords?: string[];
  /** Image de partage (Facebook, WhatsApp, X…). */
  ogImage?: string;
  /** Icône de l'onglet du navigateur et des résultats Google. */
  favicon?: string;
  /** Icône ajoutée à l'écran d'accueil iOS. */
  appleIcon?: string;
  /** Titre et description propres à chaque page. */
  pages?: {
    home?: SeoPageMeta;
    histoire?: SeoPageMeta;
    equipes?: SeoPageMeta;
    sportSante?: SeoPageMeta;
    inscriptions?: SeoPageMeta;
    partenaires?: SeoPageMeta;
    galerie?: SeoPageMeta;
    actualites?: SeoPageMeta;
    contact?: SeoPageMeta;
  };
}

export interface SiteText {
  /** Home — Hero section. */
  hero: {
    kicker: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    locationChip: string;
    ctaPrimary: string;
    ctaSecondary: string;
    /** Photo de fond du hero. Vide → image livrée avec le site. */
    image?: string;
    /** Libellé de l'indicateur de défilement (« Défiler »). */
    scrollHint?: string;
  };
  /** Home — Intro section. */
  intro: {
    kicker: string;
    title: string;
    titleAccent?: string;
    body: string;
    cta: string;
    /** Photo de la section « Le Club ». */
    image?: string;
    /** Badge posé sur la photo (ex. « Saison 2024–2025 »). */
    imageCaption?: string;
  };
  /** Home — Stats section. */
  stats: {
    kicker: string;
    title: string;
  };
  /** Home — Teams preview section. */
  teamsPreview: {
    kicker: string;
    title: string;
    subtitle: string;
    cta: string;
    /** Bouton en bas de section (« Voir toutes les équipes »). */
    ctaAll?: string;
  };
  /** Home — Events preview section. */
  events: {
    kicker: string;
    title: string;
    subtitle?: string;
    cta: string;
  };
  /** Home — Gallery preview section. */
  gallery: {
    kicker: string;
    title: string;
    subtitle?: string;
    cta: string;
  };
  /** Home — Partners strip section. */
  partners: {
    kicker: string;
    title: string;
    subtitle?: string;
    cta: string;
  };
  /** Home — Join CTA band. */
  join: {
    title: string;
    subtitle: string;
    cta: string;
    /** Pastille au-dessus du titre (ex. « Saison 2025–2026 »). */
    kicker?: string;
    /** Second bouton (« Nous contacter »). */
    ctaSecondary?: string;
  };
  /** Home — Quick contact section. */
  contactQuick: {
    kicker: string;
    title: string;
    subtitle?: string;
    cta: string;
  };
  /** Global footer. */
  footer: {
    tagline: string;
    copyright?: string;
    /** Intitulés des colonnes et du lien légal. */
    navHeading?: string;
    practicesHeading?: string;
    contactHeading?: string;
    legalLabel?: string;
    /** Phrase sous le slogan (« … au bord de l'étang de Thau. »). */
    aboutLine?: string;
    /** Libellé devant le nom de la personne référente. */
    contactPersonLabel?: string;
  };
  /** Bandeau défilant de l'accueil — un mot par entrée. */
  marquee?: string[];
  /** Intitulés des liens de navigation et des fils d'Ariane. */
  nav?: NavLabels;
  /** Libellés d'interface réutilisés dans la navigation. */
  labels?: {
    /** Bouton de la barre de navigation (desktop). */
    navCta?: string;
    /** Bouton des menus mobile / méga-menu. */
    navCtaLong?: string;
  };
  /** Libellés partagés par plusieurs pages et composants. */
  ui?: {
    /** Premier maillon du fil d'Ariane. */
    breadcrumbHome?: string;
    /** Intitulés d'une fiche équipe. */
    teamObjectives?: string;
    teamSchedule?: string;
    teamRoster?: string;
    /** Titre du bloc des sous-équipes sur /equipes. */
    teamSubTeams?: string;
    /** Encart promotionnel du méga-menu. */
    megaMenuTitle?: string;
    megaMenuText?: string;
    megaMenuCta?: string;
    /** Lien d'évitement en haut de page. */
    skipLink?: string;
    /** Bouton d'itinéraire sous la carte. */
    mapDirections?: string;
    /** Badge « à la une » d'une actualité. */
    newsFeatured?: string;
    /** Lien au bas d'une carte actualité (« Lire la suite »). */
    newsReadMore?: string;
    /** Filtre « Tout » de la galerie. */
    galleryAll?: string;
    /** Décompte des partenaires d'un niveau (« 1 membre » / « 4 membres »). */
    memberSingular?: string;
    memberPlural?: string;
    /** Intitulés de la fiche contact. */
    addressLabel?: string;
    phoneLabel?: string;
    emailLabel?: string;
    /** Préfixe devant le nom du gymnase (« Au Gymnase… »). */
    venuePrefix?: string;
    /** Intitulé de chaque catégorie d'équipe, sur /equipes. */
    teamCategories?: {
      baby?: string;
      jeunes?: string;
      loisir?: string;
      competition?: string;
      soft?: string;
      sante?: string;
      beach?: string;
    };
    /** Titres des groupes de partenaires sur l'accueil. */
    partnerTierTitles?: {
      principal?: string;
      officiel?: string;
      institutionnel?: string;
    };
    /** Pastille de niveau sur une carte partenaire. */
    partnerTierBadges?: {
      principal?: string;
      officiel?: string;
      institutionnel?: string;
    };
    /** Lien d'une carte équipe sur l'accueil. */
    teamCardCta?: string;
    /** Libellés des boutons réseaux sociaux. */
    socialFacebook?: string;
    socialInstagram?: string;
    socialWebsite?: string;
    /** Formulaire de contact. */
    form?: {
      kicker?: string;
      heading?: string;
      note?: string;
      nameLabel?: string;
      namePlaceholder?: string;
      emailLabel?: string;
      emailPlaceholder?: string;
      messageLabel?: string;
      messagePlaceholder?: string;
      submit?: string;
      errorSummary?: string;
      successTitle?: string;
      successBody?: string;
      successAgain?: string;
    };
  };
  /** Per-page heroes and prose. */
  pages: {
    histoire: {
      heroKicker: string;
      heroTitle: string;
      heroSubtitle: string;
      introParagraphs: string[];
      timelineHeading: string;
      visionTitle: string;
      visionBody: string;
      cta: string;
      /** Photo illustrant l'intro de la page. */
      image?: string;
      /** Badge posé sur la photo (ex. « Marseillan · Gymnase … »). */
      imageCaption?: string;
      /** Pastille au-dessus du titre d'intro (ex. « Depuis 1992 »). */
      introBadge?: string;
      introKicker?: string;
      timelineKicker?: string;
      timelineSubtitle?: string;
      visionKicker?: string;
      visionExtra?: string;
    };
    equipes: {
      heroKicker: string;
      heroTitle: string;
      heroSubtitle: string;
      cta: string;
      ctaKicker?: string;
      ctaTitle?: string;
      ctaBody?: string;
    };
    sportSante: {
      heroKicker: string;
      heroTitle: string;
      heroSubtitle: string;
      introTitle?: string;
      introBody: string[];
      benefitsHeading?: string;
      inclusionTitle: string;
      inclusionBody: string[];
      cta: string;
      introKicker?: string;
      benefitsKicker?: string;
      benefitsIntro?: string;
      inclusionKicker?: string;
      ctaKicker?: string;
      ctaTitle?: string;
      ctaBody?: string;
      ctaSecondary?: string;
      /** Les 6 vignettes « Ce que vous y gagnez ». */
      benefits?: BenefitItem[];
      /**
       * Photo de la section d'intro (« Le volley autrement »).
       *
       * Vide → photo de l'équipe dont la catégorie est « sante », puis l'image
       * livrée avec le site. C'est le champ qui manquait : quand le club a
       * renommé sa catégorie Sport Santé, plus rien ne pilotait cette photo.
       */
      image?: string;
      /** Badge posé sur cette photo. */
      imageCaption?: string;
      /** Photo de la section « Une place pour chacun » (Soft Volley). */
      inclusionImage?: string;
      /** Badge posé sur la photo d'inclusion. */
      inclusionImageCaption?: string;
    };
    inscriptions: {
      heroKicker: string;
      heroTitle: string;
      heroSubtitle: string;
      stepsHeading?: string;
      documentsHeading?: string;
      linksHeading?: string;
      faqHeading: string;
      cta: string;
      stepsKicker?: string;
      stepsIntro?: string;
      ffvolleyCta?: string;
      documentsKicker?: string;
      documentsIntro?: string;
      contactHeading?: string;
      contactPersonLabel?: string;
      scheduleHeading?: string;
      tipHeading?: string;
      tipBody?: string;
      linksKicker?: string;
      linksIntro?: string;
      /** Carte « Dossier d'inscription » du bloc Liens utiles. */
      dossierTitle?: string;
      dossierBody?: string;
      dossierCta?: string;
      /** Adresse du dossier d'inscription (dossier Google Drive du club). */
      dossierUrl?: string;
      licenceTitle?: string;
      licenceBody?: string;
      contactCta?: string;
      faqKicker?: string;
      faqIntro?: string;
      ctaKicker?: string;
      ctaTitle?: string;
      ctaBody?: string;
      ctaSecondary?: string;
      /** Les étapes numérotées. */
      steps?: StepItem[];
      /** Les pièces du dossier. */
      documents?: DocumentItem[];
      /** Texte de la carte « Contacter le club » (bloc Liens utiles). */
      contactCardBody?: string;
      /** Adresse du site de la fédération, ouverte par la carte FFVolley. */
      ffvolleyUrl?: string;
    };
    partenaires: {
      heroKicker: string;
      heroTitle: string;
      heroSubtitle: string;
      wallHeading?: string;
      becomeTitle: string;
      becomeBody: string[];
      cta: string;
      wallKicker?: string;
      wallIntro?: string;
      becomeKicker?: string;
      /** Intitulés des trois niveaux de partenariat. */
      tiers?: { label: string; description: string }[];
      becomeCtaTitle?: string;
      contactCta?: string;
      /** Les vignettes « contreparties » du bloc Devenir partenaire. */
      benefits?: BenefitItem[];
    };
    galerie: {
      heroKicker: string;
      heroTitle: string;
      heroSubtitle: string;
      sectionKicker?: string;
      sectionTitle?: string;
      sectionBody?: string;
    };
    actualites: {
      heroKicker: string;
      heroTitle: string;
      heroSubtitle: string;
      latestLabel?: string;
      allLabel?: string;
      relatedHeading?: string;
      backLabel?: string;
      articleCta?: string;
      notFoundKicker?: string;
      notFoundTitle?: string;
      notFoundBody?: string;
    };
    contact: {
      heroKicker: string;
      heroTitle: string;
      heroSubtitle: string;
      infoHeading?: string;
      formHeading?: string;
      mapHeading?: string;
      contactsHeading?: string;
      contactPersonLabel?: string;
      scheduleLabel?: string;
      socialsHeading?: string;
      mapKicker?: string;
    };
  };
}

/** The full editable content model for the site. */
export interface SiteContent {
  club: ClubInfo;
  stats: Stat[];
  teams: TeamContent[];
  news: NewsArticle[];
  events: ClubEvent[];
  partners: Partner[];
  gallery: GalleryImage[];
  faq: FaqItem[];
  timeline: TimelineEntry[];
  text: SiteText;
  /**
   * Référencement, favicon et image de partage.
   *
   * Optionnel côté type : un export JSON antérieur à cette section reste
   * importable, et la fusion sur `defaultContent` remet les valeurs livrées.
   */
  seo?: SeoSettings;
}

/**
 * Recursive partial — used by `deepMerge` for partial content layers. Every property
 * (at any depth) is optional so an admin can override just a single leaf.
 *
 * Arrays are intentionally NOT made partial element-by-element: an override of
 * an array replaces the base array wholesale (see `deepMerge`).
 */
export type DeepPartial<T> = T extends (infer U)[]
  ? U[]
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;
