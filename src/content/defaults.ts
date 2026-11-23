import { DEFAULT_PACKS } from "@/data/partnerPacks";
import { club } from "@/data/club";
import { stats } from "@/data/stats";
import { teams } from "@/data/teams";
import { news } from "@/data/news";
import { events } from "@/data/events";
import { partners } from "@/data/partners";
import { gallery } from "@/data/gallery";
import { faq } from "@/data/faq";
import { timeline } from "@/data/timeline";

import liveSnapshot from "./live-snapshot.json";
import { deepMerge } from "./merge";
import type {
  DeepPartial,
  Player,
  SeoSettings,
  SiteContent,
  SiteText,
  SubTeam,
  TeamContent,
} from "./types";

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

/* ──────────────────────────────────────────────────────────────────────────
 * Sous-équipes livrées avec le site, par slug d'équipe.
 *
 * Elles sont appliquées APRÈS la fusion avec le contenu publié, et seulement
 * aux équipes dont `subTeams` est absent. Une équipe dont l'admin a vidé la
 * liste porte `subTeams: []` — présent mais vide — et n'est donc pas
 * réalimentée : supprimer une sous-équipe reste définitif.
 * ────────────────────────────────────────────────────────────────────────── */

const defaultSubTeams: Record<string, SubTeam[]> = {
  jeunes: [
    {
      id: "jeunes-minimes-filles",
      name: "Minimes Filles",
      ageRange: "13 – 14 ans",
      schedule: "Lundis et mercredis", // [À CONFIRMER]
      description:
        "Les Minimes Filles disputent le championnat départemental de l'Hérault. Un groupe soudé qui travaille les fondamentaux techniques tout en prenant goût à la compétition.", // [À CONFIRMER]
      image: "",
      players: [],
    },
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
      "Le volley pour tous, au bord de l'étang de Thau - du Baby Volley dès 3 ans à la compétition.",
    locationChip: `${club.address.city} · Étang de Thau`,
    ctaPrimary: "Rejoindre le club",
    ctaSecondary: "Découvrir le club",
    image: "/images/hero/hero-1.jpg",
    scrollHint: "Défiler",
  },
  intro: {
    kicker: "Le Club",
    title: "Le volley, au bord",
    titleAccent: "de l'étang de Thau",
    body: club.description,
    cta: "Notre histoire",
    image: "/images/gallery/1.jpg",
    imageCaption: "Saison 2024–2025",
  },
  stats: {
    kicker: "En chiffres",
    title: "En chiffres",
  },
  teamsPreview: {
    kicker: "Nos pratiques",
    title: "Une équipe pour chacun",
    subtitle:
      "Du baby volley dès 3 ans au sport santé en passant par la compétition et le beach - il y a une place pour vous au VCM.",
    cta: "Toutes nos équipes",
    ctaAll: "Voir toutes les équipes",
  },
  events: {
    kicker: "Agenda",
    title: "Les prochains rendez-vous",
    subtitle:
      "Tournois, événements, journées portes ouvertes - ne manquez rien de la saison VCM.",
    cta: "Toutes les actualités",
  },
  gallery: {
    kicker: "Galerie",
    title: "En images",
    subtitle:
      "Matchs, entraînements, beach, événements - la vie du VCM en photos.",
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
      "Rejoignez le Volley Club Marseillanais - du Baby Volley dès 3 ans à la compétition, pour tous les niveaux, toute l'année.",
    cta: "Rejoindre le club",
    kicker: "Saison 2025–2026",
    ctaSecondary: "Nous contacter",
  },
  contactQuick: {
    kicker: "Contact",
    title: "Venez nous rejoindre",
    cta: "Nous contacter",
  },
  footer: {
    tagline: club.tagline,
    copyright: "Volley Club Marseillanais. Tous droits réservés.",
    navHeading: "Navigation",
    practicesHeading: "Nos pratiques",
    contactHeading: "Contact",
    legalLabel: "Mentions légales",
    aboutLine: `${club.name}, au bord de l'étang de Thau.`,
    contactPersonLabel: "Contact",
  },
  marquee: ["VOLLEY", "CLUB", "MARSEILLANAIS", "ÉTANG DE THAU", "DEPUIS 1992"],
  nav: {
    home: "Accueil",
    club: "Le Club",
    histoire: "Histoire",
    sportSante: "Sport Santé",
    equipes: "Équipes",
    actualites: "Actualités",
    galerie: "Galerie",
    partenaires: "Partenaires",
    inscriptions: "Inscriptions",
    contact: "Contact",
  },
  labels: {
    navCta: "Rejoindre",
    navCtaLong: "Rejoindre le club",
  },
  ui: {
    breadcrumbHome: "Accueil",
    teamObjectives: "Objectifs",
    teamSchedule: "Créneaux",
    teamRoster: "Effectif",
    teamSubTeams: "Sous-équipes",
    megaMenuTitle: "Rejoignez le club",
    megaMenuText: "Du Baby Volley à la compétition, une place pour chacun.",
    megaMenuCta: "S'inscrire",
    skipLink: "Aller au contenu",
    mapDirections: "Itinéraire",
    newsFeatured: "À la une",
    newsReadMore: "Lire la suite",
    galleryAll: "Tout",
    memberSingular: "membre",
    memberPlural: "membres",
    addressLabel: "Adresse",
    phoneLabel: "Téléphone",
    emailLabel: "Email",
    venuePrefix: "Au",
    teamCategories: {
      baby: "Baby Volley",
      jeunes: "Jeunes",
      loisir: "Loisir",
      competition: "Compétition",
      soft: "Soft Volley",
      sante: "Sport Santé",
      beach: "Beach Volley",
    },
    partnerTierTitles: {
      principal: "Partenaire principal",
      officiel: "Partenaires officiels",
      institutionnel: "Partenaires institutionnels",
    },
    partnerTierBadges: {
      principal: "Principal",
      officiel: "Officiel",
      institutionnel: "Institutionnel",
    },
    teamCardCta: "Découvrir",
    socialFacebook: "Facebook",
    socialInstagram: "Instagram",
    socialWebsite: "Site officiel",
    form: {
      kicker: "Formulaire de contact",
      heading: "Écrivez-nous",
      note: "Ce formulaire ouvrira votre client de messagerie avec le message pré-rempli. Aucune donnée n'est envoyée directement par ce site.",
      nameLabel: "Nom complet",
      namePlaceholder: "Jean Dupont",
      emailLabel: "Email",
      emailPlaceholder: "jean@exemple.fr",
      messageLabel: "Message",
      messagePlaceholder: "Bonjour, je souhaite en savoir plus sur les inscriptions…",
      submit: "Ouvrir ma messagerie",
      errorSummary: "Veuillez corriger les erreurs ci-dessous avant d'envoyer.",
      successTitle: "Message prêt !",
      successBody: "Envoyez-le pour contacter le VCM.",
      successAgain: "Envoyer un autre message",
    },
  },
  pages: {
    histoire: {
      heroKicker: "Le club",
      heroTitle: "Notre Histoire",
      heroSubtitle:
        "Depuis les premières passes au Gymnase Louis Boudou jusqu'aux plages de Marseillan, une aventure humaine et sportive ancrée dans le cœur de l'Hérault.",
      introParagraphs: [
        "Tout a commencé avec quelques passionnés déterminés à faire vivre le volley-ball dans ce coin de l'Hérault baigné par l'étang de Thau. Le Volley Club Marseillanais - le VCM - est né de cette conviction simple : le sport, pratiqué dans la convivialité, transforme les individus et soude les communautés.", // [À CONFIRMER]
        "Dès ses premières saisons, le club a posé ses valeurs : ouverture à tous les âges, exigence sportive et esprit de famille. Les entraînements sous les poutres du Gymnase Louis Boudou résonnaient autant de rires que de smashes - une atmosphère que le club a su préserver au fil des années, même en grandissant.",
        "Aujourd'hui, le VCM, c'est du Baby Volley dès 3 ans jusqu'à la compétition régionale, un programme Beach Volley sur les plages de Marseillan en partenariat avec le Comité Départemental de l'Hérault, et des créneaux Sport Santé pensés pour le bien-être de toutes et tous. Une diversité qui fait la fierté du club.", // [À CONFIRMER]
        `${club.description} Chaque nouveau licencié qui pousse la porte du gymnase porte en lui la même étincelle que les fondateurs : l'amour du jeu et l'envie de le partager.`,
      ],
      timelineHeading: "Les grandes étapes",
      visionTitle: "L'aventure continue",
      visionBody:
        "Depuis près de trente ans, le Volley Club Marseillanais aborde une nouvelle ère avec ambition et sérénité. La refonte de son identité digitale et le renforcement de toutes ses sections témoignent d'un club qui regarde vers l'avenir sans oublier ses racines.", // [À CONFIRMER]
      cta: "Rejoindre l'aventure",
      image: "/images/gallery/2.jpg",
      imageCaption: `${club.address.city} · ${club.address.venue}`,
      introBadge: "Depuis 1992",
      introKicker: "Nés au bord de l'étang de Thau",
      timelineKicker: "Chronologie",
      timelineSubtitle:
        "De la fondation du club à aujourd'hui, retour sur les moments clés qui ont forgé l'identité du VCM.",
      visionKicker: "Vision actuelle",
      visionExtra:
        "Que vous soyez parent cherchant une activité pour votre enfant, adulte souhaitant (re)découvrir le volley en loisir, sportif en quête de compétition ou simplement curieux de bouger dans un cadre bienveillant - le VCM a une place pour vous. Rejoignez-nous !",
    },
    equipes: {
      heroKicker: "Le club",
      heroTitle: "Nos Équipes",
      heroSubtitle:
        "Du Baby Volley dès 3 ans à la compétition régionale, en passant par le Beach Volley et le Sport Santé - le VCM propose une pratique adaptée à chaque âge, chaque profil et chaque ambition.",
      cta: "S'inscrire au club",
      ctaKicker: "Rejoignez l'aventure",
      ctaTitle: "Prêt à jouer ?",
      ctaBody:
        "Quelle que soit votre discipline de prédilection, nos équipes vous accueillent à bras ouverts. Remplissez le formulaire d'inscription et nous vous recontacterons rapidement.",
    },
    sportSante: {
      heroKicker: "Le club",
      heroTitle: "Sport Santé & Soft Volley",
      heroSubtitle:
        "Une pratique accessible, chaleureuse et sans pression - pour prendre soin de soi tout en s'épanouissant collectivement, à tout âge.",
      introTitle: "Le volley autrement",
      introBody: [
        "Le Soft Volley est une version adaptée du volley-ball, jouée avec un ballon plus léger et des règles simplifiées. Une pratique ludique et conviviale, particulièrement adaptée aux personnes non sportives, débutantes ou en reprise d'activité physique.",
        "Le programme Sport Santé va encore plus loin : conçu pour les personnes souhaitant une activité physique adaptée dans un cadre médical ou de prévention, il est encadré de manière spécifique pour répondre aux besoins de chacun - qu'il s'agisse de rééducation, de maladie chronique ou simplement du désir de bouger avec bienveillance.",
        "Ici, tous les âges sont bienvenus : il n'existe ni niveau minimum, ni pression de performance. L'objectif ? Se retrouver, bouger et sourire ensemble, au bord de l'étang de Thau.",
      ],
      benefitsHeading: "Les bénéfices",
      inclusionTitle: "Une place pour chacun",
      inclusionBody: [
        "Au VCM, le Sport Santé et le Soft Volley reposent sur une conviction simple : le sport est fait pour tout le monde. Peu importe l'âge, la condition physique ou le passé sportif - notre programme s'adapte à vous, jamais l'inverse.",
        "Les séances sont encadrées par des animateurs formés à l'activité physique adaptée (APA), en partenariat avec des professionnels de santé quand la situation le nécessite. Les règles sont simplifiées, le ballon plus léger, et l'ambiance reste celle que le VCM cultive depuis toujours : chaleureuse, inclusive et sans jugement.",
        "Que vous soyez en rééducation, atteint d'une maladie chronique, en reprise après une longue période d'inactivité ou simplement curieux de bouger différemment - venez tel que vous êtes.",
      ],
      cta: "S'inscrire",
      introKicker: "Le volley pour tous",
      benefitsKicker: "Ce que vous y gagnez",
      benefitsIntro:
        "Sport Santé et Soft Volley ne se contentent pas d'entretenir le corps - ils nourrissent aussi l'esprit et le lien humain.",
      inclusionKicker: "Accessibilité & inclusion",
      ctaKicker: "Venez essayer",
      ctaTitle: "Prêt à bouger ?",
      ctaBody:
        "Une séance d'essai gratuite vous attend. Pas besoin d'équipement particulier - juste l'envie de vous faire du bien. Contactez-nous pour planifier votre première visite au Gymnase Louis Boudou de Marseillan.",
      ctaSecondary: "Nous contacter",
      benefits: [
        {
          title: "Santé cardio-vasculaire",
          text: "Une activité douce qui entretient le cœur et le souffle, adaptée à votre rythme.",
        },
        {
          title: "Plaisir & bonne humeur",
          text: "Le volley-ball, même en version douce, reste un sport collectif plein de joie et de rires.",
        },
        {
          title: "Lien social",
          text: "Rejoindre le VCM, c'est intégrer une communauté chaleureuse, ouverte et bienveillante.",
        },
        {
          title: "Bien-être global",
          text: "Corps et esprit bénéficient ensemble d'une pratique régulière, légère et motivante.",
        },
        {
          title: "Sans pression · adapté",
          text: "Pas de compétition, pas de jugement. Chacun avance à son rythme, en toute sérénité.",
        },
        {
          title: "Remise en forme",
          text: "Idéal pour reprendre une activité physique progressive après une pause ou un arrêt médical.",
        },
      ],
      image: "/images/teams/sport-sante.jpg",
      imageCaption: "Sport Santé",
      inclusionImage: "/images/teams/soft-volley.jpg",
      inclusionImageCaption: "Soft Volley",
    },
    inscriptions: {
      heroKicker: "Rejoindre",
      heroTitle: "Inscriptions",
      heroSubtitle:
        "Rejoindre le VCM en quatre étapes simples. Séance d'essai gratuite pour tous - du Baby Volley au Sport Santé, il y a une place pour vous.",
      stepsHeading: "Comment rejoindre le club",
      documentsHeading: "Documents nécessaires",
      linksHeading: "Liens utiles",
      faqHeading: "Questions fréquentes",
      cta: "S'inscrire en ligne",
      stepsKicker: "Mode d'emploi",
      stepsIntro:
        "En quatre étapes simples, devenez membre du Volley Club Marseillanais et intégrez une communauté sportive accueillante à Marseillan.",
      ffvolleyCta: "Site FFVolley",
      documentsKicker: "À préparer",
      documentsIntro:
        "Pour finaliser votre inscription, merci de préparer les pièces suivantes. En cas de doute, notre responsable club vous guidera pour compléter votre dossier.",
      contactHeading: "Contact",
      contactPersonLabel: "Responsable des inscriptions",
      scheduleHeading: "Horaires d'entraînement",
      tipHeading: "Bon à savoir",
      tipBody:
        "Une séance d'essai gratuite est proposée à tous les nouveaux membres. C'est l'occasion parfaite de découvrir l'ambiance du club avant de vous engager.",
      linksKicker: "Plateformes",
      linksIntro:
        "Toutes les ressources pour préparer votre inscription et rester connecté à la vie du club.",
      dossierTitle: "Dossier d'inscription",
      dossierBody:
        "Tous les formulaires à télécharger, à remplir puis à remettre au club.",
      dossierCta: "Télécharger le dossier",
      dossierUrl:
        "https://drive.google.com/drive/folders/1EI80_lDsRrtzG7OWjuZfKqTUWJCUFuWC",
      licenceTitle: "Licence FFVolley",
      licenceBody:
        "Renseignements sur la licence fédérale, les catégories et les formulaires officiels.",
      contactCta: "Contacter le club",
      faqKicker: "Vos questions",
      faqIntro:
        "Vous ne trouvez pas la réponse à votre question ? Contactez-nous directement à",
      ctaKicker: "Rejoignez l'aventure",
      ctaTitle: "Prêt à jouer ?",
      ctaBody:
        "Quelle que soit votre section, le Volley Club Marseillanais vous accueille. Profitez d'une séance d'essai gratuite et rejoignez une communauté sportive unique au bord de l'étang de Thau.",
      ctaSecondary: "Nous contacter",
      steps: [
        {
          title: "Prendre contact",
          description:
            "Contactez-nous par email, téléphone ou venez directement au Gymnase Louis Boudou lors des entraînements. Une séance d'essai gratuite est proposée à tous les nouveaux venus, quel que soit l'âge ou le niveau.",
        },
        {
          title: "Constituer le dossier",
          description:
            "Rassemblez les documents nécessaires : certificat médical de non contre-indication à la pratique du volley-ball (ou questionnaire de santé selon votre situation), formulaire de licence FFVolley et une photo d'identité.",
        },
        {
          title: "Choisir sa pratique",
          description:
            "Baby Volley, Pôle Jeunes, Loisir, Compétition, Sport Santé, Soft Volley ou Beach Volley - choisissez la pratique et le créneau qui vous correspond. Nous vous guiderons selon votre profil et vos disponibilités.",
        },
        {
          title: "Régler la cotisation",
          description:
            "Les tarifs varient selon la catégorie et la saison. Contactez le club pour connaître les montants en vigueur. Le règlement peut se faire en plusieurs fois selon les modalités du club.",
        },
      ],
      documents: [
        {
          label: "Certificat médical de non contre-indication à la pratique du volley-ball",
          note: "Ou questionnaire de santé selon votre catégorie",
        },
        {
          label: "Formulaire de demande de licence FFVolley",
          note: "Disponible auprès du club ou sur ffvolley.org",
        },
        { label: "Photo d'identité", note: "" },
        {
          label: "Règlement de la cotisation",
          note: "Tarifs à confirmer auprès du club pour la saison en cours",
        },
        { label: "Autorisation parentale (pour les mineurs)", note: "" },
      ],
      contactCardBody:
        "Une question sur votre inscription ? Envoyez-nous un email, nous vous répondrons rapidement.",
      ffvolleyUrl: "https://www.ffvolley.org/",
    },
    partenaires: {
      heroKicker: "Le club",
      heroTitle: "Nos Partenaires",
      heroSubtitle:
        "Grâce à l'engagement de nos partenaires et institutions, le Volley Club Marseillanais peut offrir à tous - enfants, adultes, sportifs confirmés - un cadre de pratique de qualité au bord de l'étang de Thau.",
      wallHeading: "Le VCM s'appuie sur vous",
      becomeTitle: "Devenez partenaire du VCM",
      becomeBody: [
        "Le Volley Club Marseillanais, c'est plus de cent licenciés, des familles, des événements sportifs ouverts à tous et une communauté ancrée dans le territoire de l'étang de Thau. Associer votre nom au VCM, c'est soutenir le sport local et afficher vos valeurs.", // [À CONFIRMER]
        "Nos formules sont adaptables selon votre structure et vos objectifs. Discutons ensemble de la meilleure façon de vous associer au Volley Club Marseillanais.", // [À CONFIRMER]
      ],
      cta: "Devenir partenaire",
      wallKicker: "Ils nous soutiennent",
      wallIntro:
        "De la commune à nos sponsors locaux, chaque partenaire contribue à faire vivre le volleyball à Marseillan. Merci à eux.",
      becomeKicker: "Rejoignez-nous",
      packs: DEFAULT_PACKS,
      tiers: [
        {
          label: "Partenaire Principal",
          description:
            "Notre partenaire majeur, présent à nos côtés sur l'ensemble des événements du club.",
        },
        {
          label: "Partenaires Officiels",
          description:
            "Des acteurs locaux engagés qui contribuent au développement du volleyball à Marseillan.",
        },
        {
          label: "Institutions",
          description:
            "Les collectivités et fédérations qui nous accompagnent dans notre mission sportive.",
        },
      ],
      becomeCtaTitle: "Construisons votre partenariat ensemble",
      contactCta: "Contactez-nous",
      benefits: [
        {
          title: "Visibilité locale",
          text: "Logo sur le site officiel du club, les réseaux sociaux et les supports de communication diffusés à Marseillan et autour de l'étang de Thau.",
        },
        {
          title: "Présence événementielle",
          text: "Mise en avant lors des tournois Beach Volley, des remises de prix et des événements communautaires organisés par le VCM.",
        },
        {
          title: "Audience qualifiée",
          text: "Accès à une communauté de licenciés, familles et supporters - un public local, familial et engagé, fidèle à son club.",
        },
        {
          title: "Logo sur les équipements",
          text: "Association de votre marque aux maillots et équipements du club, visibles lors de tous les matchs et entraînements.",
        },
        {
          title: "Rayonnement territorial",
          text: "Soutien à un projet sportif ancré dans le territoire de Marseillan, reconnu pour ses valeurs de convivialité, jeunesse et santé.",
        },
        {
          title: "Partenariat sur-mesure",
          text: "Formules adaptées à votre budget et à vos objectifs. Contactez-nous pour construire ensemble un partenariat qui vous ressemble.",
        },
      ],
    },
    galerie: {
      heroKicker: "Le club",
      heroTitle: "Galerie",
      heroSubtitle:
        "Matchs disputés, entraînements, tournois de beach volley et moments de partage : revivez en images les temps forts du Volley Club Marseillanais.",
      sectionKicker: "En images",
      sectionTitle: "Le VCM en mouvement",
      sectionBody:
        "Filtrez par catégorie et cliquez sur une photo pour l'agrandir. Toute l'énergie du club, du gymnase à la plage.",
    },
    actualites: {
      heroKicker: "Le club",
      heroTitle: "Actualités",
      heroSubtitle:
        "Les dernières nouvelles du Volley Club Marseillanais : résultats, événements, inscriptions et vie du club.",
      latestLabel: "Dernière actualité",
      allLabel: "Toutes les actualités",
      relatedHeading: "À lire aussi",
      backLabel: "Retour aux actualités",
      articleCta: "Rejoindre le club",
      notFoundKicker: "Oups",
      notFoundTitle: "Article introuvable",
      notFoundBody:
        "L'article que vous recherchez n'existe pas ou n'est plus disponible. Retrouvez toutes nos actualités sur la page dédiée.",
    },
    contact: {
      heroKicker: "Le club",
      heroTitle: "Contact",
      heroSubtitle:
        "Une question sur les inscriptions, les entraînements ou la vie du club ? L'équipe du Volley Club Marseillanais est là pour vous répondre.",
      infoHeading: "Trouvez-nous à Marseillan",
      formHeading: "Écrivez-nous",
      mapHeading: "Gymnase Louis Boudou",
      contactsHeading: "Nos coordonnées",
      contactPersonLabel: "Contact",
      scheduleLabel: "Entraînements",
      socialsHeading: "Suivez-nous",
      mapKicker: "Localisation",
    },
  },
};

/* ──────────────────────────────────────────────────────────────────────────
 * SEO — reprise à l'identique des métadonnées jusqu'ici figées dans
 * `src/app/layout.tsx` et dans chaque `page.tsx`. Le rendu Google et l'onglet
 * du navigateur sont donc inchangés tant que rien n'est modifié dans /admin.
 * ────────────────────────────────────────────────────────────────────────── */

const seo: SeoSettings = {
  siteName: club.name,
  defaultTitle: "Volley Club Marseillanais - Club de volley à Marseillan",
  titleTemplate: "%s · Volley Club Marseillanais",
  description:
    "Club de volley-ball convivial et compétitif à Marseillan, au bord de l'étang de Thau. Baby volley dès 3 ans, jeunes, loisir, compétition, beach volley et sport santé - toutes les pratiques, tous les âges.",
  keywords: [
    "volley club Marseillan",
    "VCM volleyball",
    "Volley Club Marseillanais",
    "volleyball Hérault",
    "baby volley Marseillan",
    "beach volley Marseillan",
    "sport santé volley",
    "volley étang de Thau",
    "club sportif Marseillan",
    "inscription volley Hérault",
  ],
  ogImage: "/og-image.jpg",
  favicon: "/icon.png",
  appleIcon: "/apple-icon.png",
  pages: {
    home: {
      title: "Volley Club Marseillanais - Club de volley à Marseillan",
      description:
        "Le Volley Club Marseillanais réunit passionnés et compétiteurs à Marseillan. Découvrez nos équipes, nos événements, notre galerie et rejoignez le club.",
    },
    histoire: {
      title: "Notre Histoire",
      description:
        "Découvrez l'histoire du Volley Club Marseillanais : des origines du club au bord de l'étang de Thau jusqu'à aujourd'hui, en passant par le développement des sections jeunes, beach volley et sport santé.",
    },
    equipes: {
      title: "Nos Équipes",
      description:
        "Découvrez toutes les équipes et pratiques du Volley Club Marseillanais : Baby Volley, Pôle Jeunes, Loisir, Compétition, Soft Volley, Sport Santé et Beach Volley. Une place pour chaque âge et chaque niveau à Marseillan.",
    },
    sportSante: {
      title: "Sport Santé & Soft Volley",
      description:
        "Le programme Sport Santé et Soft Volley du VCM : une pratique ludique, conviviale et accessible à tous, particulièrement adaptée aux personnes non sportives, en reprise d'activité ou souhaitant prendre soin de leur santé dans un cadre bienveillant à Marseillan.",
    },
    inscriptions: {
      title: "Inscriptions",
      description:
        "Comment rejoindre le Volley Club Marseillanais : étapes d'inscription, documents nécessaires (certificat médical, licence FFVolley), tarifs et FAQ. Contactez-nous pour une séance d'essai gratuite à Marseillan.",
    },
    partenaires: {
      title: "Nos Partenaires",
      description:
        "Découvrez les partenaires et sponsors qui soutiennent le Volley Club Marseillanais à Marseillan. Rejoignez notre communauté de partenaires engagés pour le sport, la jeunesse et les valeurs du volley-ball.",
    },
    galerie: {
      title: "Galerie",
      description:
        "Plongez dans la vie du Volley Club Marseillanais en images : matchs, entraînements, beach volley, jeunes et événements du club à Marseillan, au bord de l'étang de Thau.",
    },
    actualites: {
      title: "Actualités",
      description:
        "Retrouvez toutes les dernières actualités du Volley Club Marseillanais : résultats, événements, vie du club, beach volley, sport santé et bien plus.",
    },
    contact: {
      title: "Contact",
      description:
        "Contactez le Volley Club Marseillanais à Marseillan (Hérault). Retrouvez nos coordonnées, l'adresse du Gymnase Louis Boudou, nos horaires d'entraînement et écrivez-nous directement depuis cette page.",
    },
  },
};

/**
 * Contenu de base — composé des collections `@/data` et de l'arbre `text`.
 * C'est le socle : il porte TOUTES les clés du modèle, y compris celles que le
 * site publié ne connaît pas encore.
 */
const baseContent: SiteContent = {
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
  seo,
};

/**
 * Le contenu par défaut du site.
 *
 * `baseContent` fournit la structure complète ; `liveSnapshot` — l'export du
 * contenu réellement publié sur volleymarseillan.com — fournit les vraies
 * valeurs (textes relus par le club, photos hébergées sur le blob public).
 *
 * L'ordre compte : le snapshot gagne sur le socle, mais toute clé ajoutée au
 * modèle et absente du snapshot garde sa valeur de base au lieu de partir
 * `undefined`. Les tableaux (équipes, actus, galerie…) sont remplacés en bloc,
 * comme partout ailleurs dans le modèle.
 *
 * Cela ne touche pas au contenu publié : en production, le blob est fusionné
 * PAR-DESSUS ces valeurs (`readContent`), donc les modifications faites depuis
 * /admin restent prioritaires.
 */
const mergedContent: SiteContent = deepMerge(
  baseContent,
  liveSnapshot as unknown as DeepPartial<SiteContent>,
);

export const defaultContent: SiteContent = {
  ...mergedContent,
  // Les tableaux sont remplacés en bloc par la fusion, donc le contenu publié
  // — qui ignore encore les sous-équipes — écrase `teams` sans elles. On les
  // réapplique ici, uniquement là où la clé n'a jamais été renseignée.
  teams: mergedContent.teams.map((team) =>
    team.subTeams === undefined && defaultSubTeams[team.slug]
      ? { ...team, subTeams: defaultSubTeams[team.slug] }
      : team,
  ),
};
