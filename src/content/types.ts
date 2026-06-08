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

/** The existing `Team` type extended with an optional roster of players. */
export type TeamContent = Team & {
  players?: Player[];
};

/**
 * Comprehensive, nested tree of all editable copy on the site.
 *
 * Every leaf is a `string` (or `string[]` where a block of paragraphs/items is
 * rendered). Later tasks will refactor the components/pages to read these
 * values from the content context instead of hardcoded JSX.
 */
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
  };
  /** Home — Intro section. */
  intro: {
    kicker: string;
    title: string;
    titleAccent?: string;
    body: string;
    cta: string;
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
    };
    equipes: {
      heroKicker: string;
      heroTitle: string;
      heroSubtitle: string;
      cta: string;
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
    };
    partenaires: {
      heroKicker: string;
      heroTitle: string;
      heroSubtitle: string;
      wallHeading?: string;
      becomeTitle: string;
      becomeBody: string[];
      cta: string;
    };
    galerie: {
      heroKicker: string;
      heroTitle: string;
      heroSubtitle: string;
    };
    actualites: {
      heroKicker: string;
      heroTitle: string;
      heroSubtitle: string;
    };
    contact: {
      heroKicker: string;
      heroTitle: string;
      heroSubtitle: string;
      infoHeading?: string;
      formHeading?: string;
      mapHeading?: string;
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
}

/**
 * Recursive partial — used for the localStorage overrides layer. Every property
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
