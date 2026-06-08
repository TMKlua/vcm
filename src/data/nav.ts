import type { NavLink } from "@/types";

export const navLinks: NavLink[] = [
  { label: "Accueil", href: "/" },
  {
    label: "Le Club",
    href: "/histoire",
    children: [
      { label: "Histoire", href: "/histoire" },
      { label: "Sport Santé", href: "/sport-sante" },
    ],
  },
  { label: "Équipes", href: "/equipes" },
  { label: "Actualités", href: "/actualites" },
  { label: "Galerie", href: "/galerie" },
  { label: "Partenaires", href: "/partenaires" },
  { label: "Inscriptions", href: "/inscriptions" },
  { label: "Contact", href: "/contact" },
];
