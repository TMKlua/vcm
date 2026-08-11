import type { NavLink } from "@/types";

/**
 * Structure de la navigation.
 *
 * Les `href` sont des routes : elles restent en code. Les `label` ci-dessous ne
 * servent que de repli — l'intitulé réellement affiché vient de `text.nav`,
 * éditable depuis /admin, via le hook `useNavLinks`.
 */
export const navLinks: NavLink[] = [
  { key: "home", label: "Accueil", href: "/" },
  {
    key: "club",
    label: "Le Club",
    href: "/histoire",
    children: [
      { key: "histoire", label: "Histoire", href: "/histoire" },
      { key: "sportSante", label: "Sport Santé", href: "/sport-sante" },
    ],
  },
  { key: "equipes", label: "Équipes", href: "/equipes" },
  { key: "actualites", label: "Actualités", href: "/actualites" },
  { key: "galerie", label: "Galerie", href: "/galerie" },
  { key: "partenaires", label: "Partenaires", href: "/partenaires" },
  { key: "inscriptions", label: "Inscriptions", href: "/inscriptions" },
  { key: "contact", label: "Contact", href: "/contact" },
];
