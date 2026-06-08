import type { Team } from "@/types";

export const teams: Team[] = [
  {
    slug: "baby-volley",
    name: "Baby Volley",
    category: "baby",
    shortDescription: "L'éveil au volley dès 3 ans dans la bonne humeur.",
    description:
      "Le Baby Volley du VCM accueille les tout-petits dès l'âge de 3 ans pour une découverte ludique et colorée du volley-ball. À travers des jeux adaptés et des exercices en petits groupes, les enfants développent leur coordination, leur équilibre et le sens du collectif. Une initiation idéale pour donner le goût du sport dès le plus jeune âge dans une ambiance bienveillante.",
    objectives: [
      "Développer la motricité et la coordination gesturelle",
      "Initier aux fondamentaux du jeu collectif",
      "Créer un environnement ludique et sécurisant",
    ],
    schedule: "Lundis et mercredis (horaires à confirmer)", // [À CONFIRMER]
    image: "/images/teams/baby-volley.jpg",
    ageRange: "3 – 6 ans",
  },
  {
    slug: "jeunes",
    name: "Pôle Jeunes",
    category: "jeunes",
    shortDescription: "Des Poussins aux U18 : la relève du VCM en compétition.",
    description:
      "Le pôle jeunes du Volley Club Marseillanais regroupe toutes les catégories de formation : Poussins (filles et garçons), Benjamines, Minimes (filles), Cadettes (filles) et U18 (filles). Encadrés par des entraîneurs diplômés, les jeunes volleyeurs progressent techniquement et tactiquement tout en participant aux compétitions départementales et régionales. Le club s'attache à former des joueurs complets, autonomes et respectueux de l'esprit sportif.",
    objectives: [
      "Maîtriser les fondamentaux techniques (service, manchette, passe, smash)",
      "Participer aux championnats départementaux et régionaux",
      "Développer l'esprit d'équipe et la rigueur compétitive",
    ],
    schedule: "Lundis et mercredis (créneaux selon catégorie)", // [À CONFIRMER]
    image: "/images/teams/jeunes.jpg",
    ageRange: "7 – 18 ans",
  },
  {
    slug: "loisir",
    name: "Loisir 6×6",
    category: "loisir",
    shortDescription: "Plaisir du jeu et convivialité pour les adultes.",
    description:
      "Les équipes loisir 6×6 masculines (M1 et M2) du VCM permettent aux adultes de pratiquer le volley-ball dans une ambiance détendue et chaleureuse. Que l'on soit débutant ou joueur confirmé, l'accent est mis sur le plaisir du jeu, le partage et la bonne humeur. Les équipes participent aux compétitions de loisir du district de l'Hérault pour pimenter la saison.",
    objectives: [
      "Pratiquer le volley pour le plaisir et l'entretien physique",
      "Favoriser la convivialité et l'intégration des nouveaux membres",
      "Participer aux compétitions de loisir du district", // [À CONFIRMER]
    ],
    schedule: "Mercredis soir", // [À CONFIRMER]
    image: "/images/teams/loisir.jpg",
    ageRange: "18 ans et plus",
  },
  {
    slug: "competition",
    name: "Équipes de Compétition",
    category: "competition",
    shortDescription: "Le haut niveau au service de l'ambition collective.",
    description:
      "Les équipes de compétition adultes du VCM évoluent dans les championnats régionaux et départementaux de volley-ball. Portées par des joueurs investis et un encadrement technique de qualité, elles incarnent les valeurs d'ambition et de rigueur du club. Chaque saison, l'objectif est de progresser au classement tout en renforçant la cohésion de groupe.",
    objectives: [
      "Progresser dans les championnats régionaux et départementaux", // [À CONFIRMER]
      "Renforcer la cohésion et la performance collective",
      "Former de jeunes joueurs issus du pôle jeunes à la compétition adulte",
    ],
    schedule: "Entraînements lundis et mercredis, matchs le week-end", // [À CONFIRMER]
    image: "/images/teams/competition.jpg",
    ageRange: "18 ans et plus",
  },
  {
    slug: "soft-volley",
    name: "Soft Volley",
    category: "soft",
    shortDescription: "Le volley doux et accessible, ouvert à tous.",
    description:
      "Le Soft Volley est une version adaptée du volley-ball, jouée avec un ballon plus léger et des règles simplifiées, idéale pour les personnes souhaitant (re)prendre une activité sportive sans contrainte physique intense. Au VCM, le Soft Volley est ouvert à tous les adultes, notamment ceux qui cherchent une activité conviviale et progressive. Il est souvent proposé en complément du programme Sport Santé.",
    objectives: [
      "Rendre le volley-ball accessible à tous les profils physiques",
      "Favoriser la mixité et l'inclusion au sein du club",
      "Offrir une activité sportive douce et régulière",
    ],
    schedule: "Créneaux à confirmer avec l'équipe dirigeante", // [À CONFIRMER]
    image: "/images/teams/soft-volley.jpg",
    ageRange: "Adultes",
  },
  {
    slug: "sport-sante",
    name: "Sport Santé",
    category: "sante",
    shortDescription: "Volley-ball adapté pour le bien-être et la santé.",
    description:
      "Le programme Sport Santé du Volley Club Marseillanais est conçu pour les personnes souhaitant pratiquer une activité physique adaptée dans un cadre médical ou de prévention. En partenariat avec des professionnels de santé, les séances sont encadrées de manière spécifique pour répondre aux besoins des participants, qu'ils soient en rééducation, atteints d'une maladie chronique ou simplement soucieux de leur santé. Le volley-ball, dans sa version adaptée, est un excellent vecteur de lien social et de bien-être global.",
    objectives: [
      "Proposer une activité physique adaptée aux personnes en situation de fragilité",
      "Lutter contre la sédentarité et améliorer la qualité de vie",
      "Créer du lien social dans un cadre bienveillant et encadré",
    ],
    schedule: "Séances dédiées (jours et horaires à confirmer)", // [À CONFIRMER]
    image: "/images/teams/sport-sante.jpg",
    ageRange: "Adultes (tous âges)",
  },
  {
    slug: "beach-volley",
    name: "Beach Volley",
    category: "beach",
    shortDescription: "Le sable, le soleil et la passion du beach volley.",
    description:
      "Le VCM est un acteur incontournable du beach volley dans l'Hérault, en partenariat avec le Comité Départemental de Volley-Ball de l'Hérault. Le club organise chaque année les étapes du tournoi « Hérault Beach Volley Jeunes » ainsi que des étapes et la finale du Championnat Départemental de Beach Volley. Pratiqué sur les plages de Marseillan et ses alentours, le beach volley attire joueurs locaux et visiteurs dans une ambiance festive et sportive au cœur de la Méditerranée.",
    objectives: [
      "Organiser et accueillir les compétitions officielles du Comité Départemental de l'Hérault",
      "Développer la pratique du beach volley pour les jeunes et les adultes",
      "Profiter du cadre exceptionnel de l'étang de Thau et des plages de Marseillan",
    ],
    schedule: "Saison de beach (printemps-été, mai à septembre)", // [À CONFIRMER]
    image: "/images/teams/beach-volley.jpg",
    ageRange: "Jeunes et adultes",
  },
];
