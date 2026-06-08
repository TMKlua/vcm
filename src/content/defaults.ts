import { club } from "@/data/club";
import { stats } from "@/data/stats";
import { teams } from "@/data/teams";
import { news } from "@/data/news";
import { events } from "@/data/events";
import { partners } from "@/data/partners";
import { gallery } from "@/data/gallery";
import { faq } from "@/data/faq";
import { timeline } from "@/data/timeline";

import type { SiteContent, SiteText, TeamContent, Player } from "./types";

/* ──────────────────────────────────────────────────────────────────────────
 * Players — [À CONFIRMER]
 * Realistic French rosters attached to the relevant teams. All names, roles and
 * numbers are placeholders to be confirmed by the club. No images by default.
 * ────────────────────────────────────────────────────────────────────────── */

const playersBySlug: Record<string, Player[]> = {
  // [À CONFIRMER] — Équipes de Compétition (8 joueurs)
  competition: [
    { id: "competition-p1", name: "Lucas Bernard", role: "Passeur", number: "5" },
    { id: "competition-p2", name: "Mathéo Garcia", role: "Pointu", number: "9" },
    { id: "competition-p3", name: "Hugo Moreau", role: "Central", number: "11" },
    { id: "competition-p4", name: "Théo Rousseau", role: "Central", number: "12" },
    { id: "competition-p5", name: "Nathan Lefèvre", role: "Réceptionneur-attaquant", number: "7" },
    { id: "competition-p6", name: "Enzo Martin", role: "Réceptionneur-attaquant", number: "8" },
    { id: "competition-p7", name: "Antoine Girard", role: "Libéro", number: "3" },
    { id: "competition-p8", name: "Romain Faure", role: "Pointu", number: "14" },
  ],
  // [À CONFIRMER] — Pôle Jeunes (6 joueuses)
  jeunes: [
    { id: "jeunes-p1", name: "Camille Dubois", role: "Passeuse", number: "6" },
    { id: "jeunes-p2", name: "Léa Fontaine", role: "Réceptionneuse-attaquante", number: "10" },
    { id: "jeunes-p3", name: "Manon Petit", role: "Centrale", number: "4" },
    { id: "jeunes-p4", name: "Chloé Robert", role: "Pointue", number: "13" },
    { id: "jeunes-p5", name: "Inès Lambert", role: "Libéro", number: "2" },
    { id: "jeunes-p6", name: "Sarah Mercier", role: "Réceptionneuse-attaquante", number: "15" },
  ],
  // [À CONFIRMER] — Loisir 6×6 (6 joueurs)
  loisir: [
    { id: "loisir-p1", name: "Julien Roux", role: "Passeur" },
    { id: "loisir-p2", name: "Maxime Blanc", role: "Pointu" },
    { id: "loisir-p3", name: "Sébastien Henry", role: "Central" },
    { id: "loisir-p4", name: "Olivier Renaud", role: "Réceptionneur-attaquant" },
    { id: "loisir-p5", name: "Damien Colin", role: "Réceptionneur-attaquant" },
    { id: "loisir-p6", name: "Fabien Morel", role: "Libéro" },
  ],
  // [À CONFIRMER] — Soft Volley (2 joueurs)
  "soft-volley": [
    { id: "soft-volley-p1", name: "Pascal Durand", role: "Joueur loisir" },
    { id: "soft-volley-p2", name: "Sylvie Lemaire", role: "Joueuse loisir" },
  ],
  // [À CONFIRMER] — Beach Volley (2 duos)
  "beach-volley": [
    { id: "beach-volley-p1", name: "Adrien Caron", role: "Beach – Défenseur" },
    { id: "beach-volley-p2", name: "Quentin Olivier", role: "Beach – Attaquant" },
  ],
};

const teamsWithPlayers: TeamContent[] = teams.map((team) => {
  const players = playersBySlug[team.slug];
  return players ? { ...team, players } : { ...team };
});

/* ──────────────────────────────────────────────────────────────────────────
 * SiteText — default copy extracted verbatim (where practical) from the
 * existing sections and pages so defaults render identically to today.
 * ────────────────────────────────────────────────────────────────────────── */

const text: SiteText = {
  hero: {
    kicker: club.name,
    titleLine1: "Joue. Smash.",
    titleLine2: "Gagne.",
    subtitle:
      "Le volley pour tous, au bord de l'étang de Thau — du Baby Volley dès 3 ans à la compétition.",
    locationChip: `${club.address.city} · Étang de Thau`,
    ctaPrimary: "Rejoindre le club",
    ctaSecondary: "Découvrir le club",
  },
  intro: {
    kicker: "Le Club",
    title: "Le volley, au bord",
    titleAccent: "de l'étang de Thau",
    body: club.description,
    cta: "Notre histoire",
  },
  stats: {
    kicker: "En chiffres",
    title: "En chiffres",
  },
  teamsPreview: {
    kicker: "Nos pratiques",
    title: "Une équipe pour chacun",
    subtitle:
      "Du baby volley dès 3 ans au sport santé en passant par la compétition et le beach — il y a une place pour vous au VCM.",
    cta: "Toutes nos équipes",
  },
  events: {
    kicker: "Agenda",
    title: "Les prochains rendez-vous",
    subtitle:
      "Tournois, événements, journées portes ouvertes — ne manquez rien de la saison VCM.",
    cta: "Toutes les actualités",
  },
  gallery: {
    kicker: "Galerie",
    title: "En images",
    subtitle:
      "Matchs, entraînements, beach, événements — la vie du VCM en photos.",
    cta: "Voir la galerie",
  },
  partners: {
    kicker: "Partenaires",
    title: "Ils nous soutiennent",
    cta: "Devenir partenaire",
  },
  join: {
    title: "Prêt à entrer sur le terrain ?",
    subtitle:
      "Rejoignez le Volley Club Marseillanais — du Baby Volley dès 3 ans à la compétition, pour tous les niveaux, toute l'année.",
    cta: "Rejoindre le club",
  },
  contactQuick: {
    kicker: "Contact",
    title: "Venez nous rejoindre",
    cta: "Nous contacter",
  },
  footer: {
    tagline: club.tagline,
    copyright: "Volley Club Marseillanais. Tous droits réservés.",
  },
  pages: {
    histoire: {
      heroKicker: "Le club",
      heroTitle: "Notre Histoire",
      heroSubtitle:
        "Depuis les premières passes au Gymnase Louis Boudou jusqu'aux plages de Marseillan, une aventure humaine et sportive ancrée dans le cœur de l'Hérault.",
      introParagraphs: [
        "Tout a commencé avec quelques passionnés déterminés à faire vivre le volley-ball dans ce coin de l'Hérault baigné par l'étang de Thau. Le Volley Club Marseillanais — le VCM — est né de cette conviction simple : le sport, pratiqué dans la convivialité, transforme les individus et soude les communautés.", // [À CONFIRMER]
        "Dès ses premières saisons, le club a posé ses valeurs : ouverture à tous les âges, exigence sportive et esprit de famille. Les entraînements sous les poutres du Gymnase Louis Boudou résonnaient autant de rires que de smashes — une atmosphère que le club a su préserver au fil des années, même en grandissant.",
        "Aujourd'hui, le VCM, c'est du Baby Volley dès 3 ans jusqu'à la compétition régionale, un programme Beach Volley sur les plages de Marseillan en partenariat avec le Comité Départemental de l'Hérault, et des créneaux Sport Santé pensés pour le bien-être de toutes et tous. Une diversité qui fait la fierté du club.", // [À CONFIRMER]
        `${club.description} Chaque nouveau licencié qui pousse la porte du gymnase porte en lui la même étincelle que les fondateurs : l'amour du jeu et l'envie de le partager.`,
      ],
      timelineHeading: "Les grandes étapes",
      visionTitle: "L'aventure continue",
      visionBody:
        "Depuis près de trente ans, le Volley Club Marseillanais aborde une nouvelle ère avec ambition et sérénité. La refonte de son identité digitale et le renforcement de toutes ses sections témoignent d'un club qui regarde vers l'avenir sans oublier ses racines.", // [À CONFIRMER]
      cta: "Rejoindre l'aventure",
    },
    equipes: {
      heroKicker: "Le club",
      heroTitle: "Nos Équipes",
      heroSubtitle:
        "Du Baby Volley dès 3 ans à la compétition régionale, en passant par le Beach Volley et le Sport Santé — le VCM propose une pratique adaptée à chaque âge, chaque profil et chaque ambition.",
      cta: "S'inscrire au club",
    },
    sportSante: {
      heroKicker: "Le club",
      heroTitle: "Sport Santé & Soft Volley",
      heroSubtitle:
        "Une pratique accessible, chaleureuse et sans pression — pour prendre soin de soi tout en s'épanouissant collectivement, à tout âge.",
      introTitle: "Le volley autrement",
      introBody: [
        "Le Soft Volley est une version adaptée du volley-ball, jouée avec un ballon plus léger et des règles simplifiées. Une pratique ludique et conviviale, particulièrement adaptée aux personnes non sportives, débutantes ou en reprise d'activité physique.",
        "Le programme Sport Santé va encore plus loin : conçu pour les personnes souhaitant une activité physique adaptée dans un cadre médical ou de prévention, il est encadré de manière spécifique pour répondre aux besoins de chacun — qu'il s'agisse de rééducation, de maladie chronique ou simplement du désir de bouger avec bienveillance.",
        "Ici, tous les âges sont bienvenus : il n'existe ni niveau minimum, ni pression de performance. L'objectif ? Se retrouver, bouger et sourire ensemble, au bord de l'étang de Thau.",
      ],
      benefitsHeading: "Les bénéfices",
      inclusionTitle: "Une place pour chacun",
      inclusionBody: [
        "Au VCM, le Sport Santé et le Soft Volley reposent sur une conviction simple : le sport est fait pour tout le monde. Peu importe l'âge, la condition physique ou le passé sportif — notre programme s'adapte à vous, jamais l'inverse.",
        "Les séances sont encadrées par des animateurs formés à l'activité physique adaptée (APA), en partenariat avec des professionnels de santé quand la situation le nécessite. Les règles sont simplifiées, le ballon plus léger, et l'ambiance reste celle que le VCM cultive depuis toujours : chaleureuse, inclusive et sans jugement.",
        "Que vous soyez en rééducation, atteint d'une maladie chronique, en reprise après une longue période d'inactivité ou simplement curieux de bouger différemment — venez tel que vous êtes.",
      ],
      cta: "S'inscrire",
    },
    inscriptions: {
      heroKicker: "Rejoindre",
      heroTitle: "Inscriptions",
      heroSubtitle:
        "Rejoindre le VCM en quatre étapes simples. Séance d'essai gratuite pour tous — du Baby Volley au Sport Santé, il y a une place pour vous.",
      stepsHeading: "Comment rejoindre le club",
      documentsHeading: "Documents nécessaires",
      linksHeading: "Liens utiles",
      faqHeading: "Questions fréquentes",
      cta: "S'inscrire en ligne",
    },
    partenaires: {
      heroKicker: "Le club",
      heroTitle: "Nos Partenaires",
      heroSubtitle:
        "Grâce à l'engagement de nos partenaires et institutions, le Volley Club Marseillanais peut offrir à tous — enfants, adultes, sportifs confirmés — un cadre de pratique de qualité au bord de l'étang de Thau.",
      wallHeading: "Le VCM s'appuie sur vous",
      becomeTitle: "Devenez partenaire du VCM",
      becomeBody: [
        "Le Volley Club Marseillanais, c'est plus de cent licenciés, des familles, des événements sportifs ouverts à tous et une communauté ancrée dans le territoire de l'étang de Thau. Associer votre nom au VCM, c'est soutenir le sport local et afficher vos valeurs.", // [À CONFIRMER]
        "Nos formules sont adaptables selon votre structure et vos objectifs. Discutons ensemble de la meilleure façon de vous associer au Volley Club Marseillanais.", // [À CONFIRMER]
      ],
      cta: "Devenir partenaire",
    },
    galerie: {
      heroKicker: "Le club",
      heroTitle: "Galerie",
      heroSubtitle:
        "Matchs disputés, entraînements, tournois de beach volley et moments de partage : revivez en images les temps forts du Volley Club Marseillanais.",
    },
    actualites: {
      heroKicker: "Le club",
      heroTitle: "Actualités",
      heroSubtitle:
        "Les dernières nouvelles du Volley Club Marseillanais : résultats, événements, inscriptions et vie du club.",
    },
    contact: {
      heroKicker: "Le club",
      heroTitle: "Contact",
      heroSubtitle:
        "Une question sur les inscriptions, les entraînements ou la vie du club ? L'équipe du Volley Club Marseillanais est là pour vous répondre.",
      infoHeading: "Trouvez-nous à Marseillan",
      formHeading: "Écrivez-nous",
      mapHeading: "Gymnase Louis Boudou",
    },
  },
};

/**
 * The default content — what the site renders before any localStorage override
 * is applied. Composed from the existing `@/data` collections plus the
 * `text` tree above.
 */
export const defaultContent: SiteContent = {
  club,
  stats,
  teams: teamsWithPlayers,
  news,
  events,
  partners,
  gallery,
  faq,
  timeline,
  text,
};
