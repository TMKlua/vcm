/* ──────────────────────────────────────────────────────────────────────────
 * Packs partenaires, d'après la plaquette du club (novembre 2026).
 *
 * Intitulés et légendes éditables depuis /admin › Partenaires, stockés dans
 * text.pages.partenaires.packs. Les anciens niveaux (principal, officiel,
 * institutionnel) restent valides : les partenaires déjà publiés qui les
 * portent continuent de s'afficher.
 * ────────────────────────────────────────────────────────────────────────── */

export type PackTier = "digital" | "gymnase" | "evenement" | "match";

export type PackText = { label: string; description: string };

/** Ordre d'affichage, celui de la plaquette. */
export const PACK_TIERS: PackTier[] = ["digital", "gymnase", "evenement", "match"];

export const DEFAULT_PACKS: Record<PackTier, PackText> = {
  digital: {
    label: "Pack Digital",
    description: "Logo sur le site internet, logo et présentation sur les réseaux sociaux.",
  },
  gymnase: {
    label: "Pack Gymnase",
    description: "Pack digital inclus, plus une banderole plastifiée installée dans le gymnase.",
  },
  evenement: {
    label: "Pack Événement",
    description:
      "Pack digital inclus, plus une série de 50 tee-shirts avec le logo du club et le logo du partenaire (12 × 6 cm maximum), en tailles enfants et adultes.",
  },
  match: {
    label: "Pack Match",
    description: "Pack digital inclus, plus votre logo sur le devant ou le dos du maillot de match.",
  },
};

export function isPackTier(tier: string): tier is PackTier {
  return (PACK_TIERS as string[]).includes(tier);
}

/** Intitulé et légende d'un pack, avec repli sur la plaquette si le champ est vide. */
export function packText(packs: Partial<Record<PackTier, Partial<PackText>>> | undefined, tier: PackTier): PackText {
  return {
    label: packs?.[tier]?.label?.trim() || DEFAULT_PACKS[tier].label,
    description: packs?.[tier]?.description?.trim() || DEFAULT_PACKS[tier].description,
  };
}
