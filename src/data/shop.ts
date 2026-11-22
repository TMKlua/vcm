/* ──────────────────────────────────────────────────────────────────────────
 * Catalogue de la boutique.
 *
 * Articles, descriptions, coloris, tailles et prix repris du catalogue
 * « Boutique officielle » envoyé par le club (commandes jusqu'au 30/11/2026).
 * Photos extraites du même document. Le paiement passera par HelloAsso ;
 * voir src/lib/helloasso.ts (clés dans les variables d'environnement). Sans
 * clés, le bouton de paiement affiche une fenêtre d'aperçu.
 * ────────────────────────────────────────────────────────────────────────── */

export type ProductKind =
  | "tee"
  | "tank"
  | "hoodie"
  | "jacket"
  | "shorts"
  | "socks"
  | "cap"
  | "bob"
  | "mug"
  | "bottle"
  | "tote"
  | "backpack"
  | "towel"
  | "keychain"
  | "stickers"
  | "scarf"
  | "ball"
  | "giftcard"
  | "pack";

export type ShopCategory = "textile" | "accessoires";

export interface ProductColor {
  name: string;
  hex: string;
  accent: string;
  /** Couleur des marquages posés sur l'article. */
  ink: string;
  /** Photo produit dans cette couleur (maquette réaliste, voir scripts/boutique). */
  photo?: string;
  /** Vue de dos, pour l'aperçu du flocage. */
  back?: string;
  /** Seconde photo (portée, sur cintre…), affichée au survol de la carte. */
  alt?: string;
}

export interface Product {
  slug: string;
  name: string;
  tagline: string;
  kind: ProductKind;
  category: ShopCategory;
  /** Prix TTC en euros. */
  price: number;
  /** Ancien prix barré (packs). */
  compareAt?: number;
  badge?: "Best-seller" | "Nouveau" | "Édition limitée" | "Précommande" | "Pack" | "Black Friday";
  colors: ProductColor[];
  sizes?: string[];
  /**
   * Flocage au dos, avec son supplément (0 = inclus dans le prix, l'option
   * est alors cochée d'office). `label` nomme le champ texte (« Nom » par défaut).
   */
  personalization?: { price: number; label?: string };
  description: string;
  details: string[];
  /** Contenu d'un pack : articles du catalogue, dans une couleur donnée. */
  items?: { slug: string; color: string }[];
  featured?: boolean;
}

/* ── Coloris ────────────────────────────────────────────────────────────── */

const C = {
  blanc: { name: "Blanc", hex: "#f5f3ff", accent: "#7c3aed", ink: "#2a1258" },
  noir: { name: "Noir", hex: "#1b1a22", accent: "#a855f7", ink: "#ffffff" },
  beige: { name: "Beige naturel", hex: "#e8dfcc", accent: "#7c3aed", ink: "#2a1258" },
  parme: { name: "Parme", hex: "#c4b5f3", accent: "#7c3aed", ink: "#ffffff" },
  violet: { name: "Violet", hex: "#4a23a3", accent: "#ff4dd2", ink: "#ffffff" },
} satisfies Record<string, ProductColor>;

type ColorKey = keyof typeof C;

/**
 * Couleur + ses photos :
 * /images/boutique/<slug>--<couleur>[--dos|--<vue>].webp
 */
function shot(
  slug: string,
  key: ColorKey,
  { back = false, alt, file = key }: { back?: boolean; alt?: string; file?: string } = {},
): ProductColor {
  const base = `/images/boutique/${slug}--${file}`;
  return {
    ...C[key],
    photo: `${base}.webp`,
    back: back ? `${base}--dos.webp` : undefined,
    alt: alt ? `${base}--${alt}.webp` : undefined,
  };
}

/** « Enfants (5 à 13 ans) et Adultes (S à XXL) » selon le catalogue du club. */
const KIDS = ["5-6 ans", "7-8 ans", "9-11 ans", "12-13 ans"];
const ADULT = ["S", "M", "L", "XL", "XXL"];
const ALL_AGES = [...KIDS, ...ADULT];

export const CATEGORIES: { key: ShopCategory | "all"; label: string }[] = [
  { key: "all", label: "Tout" },
  { key: "textile", label: "Textile" },
  { key: "accessoires", label: "Accessoires" },
];

/** Date limite de commande et contact, d'après le catalogue du club. */
export const ORDER_DEADLINE = "30/11/2026";
/** Engagement du club : commande groupée close le 30/11, articles remis avant Noël. */
export const ORDER_DELIVERY = "Livré avant Noël";
export const ORDER_CONTACT = "Delphine";

/** Catalogue au prix normal. L'offre en cours s'applique plus bas. */
const catalogue: Product[] = [
  {
    slug: "sweat-capuche-vcm",
    name: "Sweat à capuche VCM",
    tagline: "Noir ou parme",
    kind: "hoodie",
    category: "textile",
    price: 35,
    colors: [shot("sweat-capuche-vcm", "noir", { back: true }), shot("sweat-capuche-vcm", "parme", { back: true })],
    sizes: ALL_AGES,
    description:
      "Confort absolu avant et après l'effort ! Écusson VCM côté cœur et marquage dos « VC MARSEILLANAIS » pour afficher fièrement l'esprit d'équipe.",
    details: ["Écusson VCM côté cœur", "Marquage dos « VC MARSEILLANAIS »", "Coloris noir ou parme", "Tailles enfants (5 à 13 ans) et adultes (S à XXL)"],
    featured: true,
  },
  {
    slug: "tee-shirt-personnalisable",
    name: "Tee-shirt personnalisable",
    tagline: "Prénom + numéro au dos",
    kind: "tee",
    category: "textile",
    price: 25,
    colors: [shot("tee-shirt-personnalisable", "noir", { back: true })],
    sizes: ALL_AGES,
    personalization: { price: 0, label: "Prénom" },
    description:
      "Entrez sur le terrain avec votre propre maillot ! Personnalisation incluse au dos avec votre prénom et votre numéro de joueur, et logo du club côté cœur.",
    details: ["Personnalisation incluse : prénom + numéro au dos", "Logo du club côté cœur", "Coloris noir", "Tailles enfants (5 à 13 ans) et adultes (S à XXL)"],
    featured: true,
  },
  {
    slug: "sac-a-dos-vcm",
    name: "Sac à dos léger VCM",
    tagline: "Le compagnon de l'entraînement",
    kind: "backpack",
    category: "accessoires",
    price: 12,
    colors: [shot("sac-a-dos-vcm", "noir")],
    description:
      "Pratique, souple et fonctionnel avec sa poche frontale zippée et ses filets latéraux : le compagnon idéal pour rejoindre l'entraînement en toute liberté.",
    details: ["Poche frontale zippée", "Filets latéraux", "Logo du club sur la poche", "Coloris noir"],
  },
  {
    slug: "gourde-sport-vcm",
    name: "Gourde sport isotherme VCM",
    tagline: "Hydraté entre chaque set",
    kind: "bottle",
    category: "accessoires",
    price: 9,
    colors: [shot("gourde-sport-vcm", "blanc")],
    description:
      "Restez hydraté entre chaque set ! Légère, pratique avec son bouchon sport sécurisé et ornée de l'emblème officiel du club sur fond blanc épuré.",
    details: ["Isotherme", "Bouchon sport sécurisé", "Emblème officiel du club", "Coloris blanc"],
  },
  {
    slug: "tote-bag-vcm",
    name: "Tote bag coton VCM",
    tagline: "Beige ou noir",
    kind: "tote",
    category: "accessoires",
    price: 7,
    colors: [shot("tote-bag-vcm", "beige"), shot("tote-bag-vcm", "noir")],
    description:
      "L'indispensable du quotidien pour transporter vos affaires de sport ou vos effets personnels avec style. Disponible en beige naturel ou noir intense.",
    details: ["Coton", "Logo du club imprimé", "Coloris beige naturel ou noir intense"],
  },
];

/* ── Offre Black Friday ─────────────────────────────────────────────────── */

/**
 * Remise appliquée à tout le catalogue tant que `active` est vrai : le prix
 * normal passe en prix barré, le prix remisé est arrondi aux 50 centimes.
 * Pour arrêter l'offre, passer `active` à false : rien d'autre à toucher.
 */
export const BLACK_FRIDAY = {
  // Désactivée : les prix restent ceux du catalogue du club. Une remise ne
  // peut s'afficher que depuis un prix réellement pratiqué (art. L112-1-1 du
  // Code de la consommation) : jamais de prix barré gonflé.
  active: false,
  percent: 20,
  /** Fin de l'offre, alignée sur la clôture de la commande groupée. */
  until: "30/11/2026",
};

function withOffer(p: Product): Product {
  if (!BLACK_FRIDAY.active) return p;
  const price = Math.round(p.price * (1 - BLACK_FRIDAY.percent / 100) * 2) / 2;
  return { ...p, price, compareAt: p.price, badge: p.badge === "Nouveau" ? p.badge : "Black Friday" };
}

export const products: Product[] = catalogue.map(withOffer);

/**
 * Articles retirés de la vente pour l'instant (photos et rendu conservés).
 * Pour en remettre un en vente, le replacer dans `catalogue`.
 */
export const retiredProducts: Product[] = [
  {
    // Ajouté à la demande du bureau, hors du catalogue PDF : prix à confirmer.
    // Retiré de la vente le 2026-11-22 à la demande du client.
    slug: "porte-cles-decapsuleur-vcm",
    name: "Porte-clés décapsuleur VCM",
    tagline: "Pour la troisième mi-temps",
    kind: "keychain",
    category: "accessoires",
    price: 5,
    badge: "Nouveau",
    colors: [shot("porte-cles-decapsuleur-vcm", "noir"), shot("porte-cles-decapsuleur-vcm", "violet")],
    description:
      "Le porte-clés qui sert aussi de décapsuleur : aluminium recyclé à finition brillante, écusson VCM et « VC MARSEILLANAIS » imprimés sur le dessus. Toujours dans la poche pour les apéros d'après-match.",
    details: ["Aluminium recyclé, finition brillante", "Décapsuleur à crochet", "Écusson VCM et nom du club imprimés", "Anneau porte-clés", "Coloris noir ou violet"],
  },
];

/* ── Retrait et livraison ───────────────────────────────────────────────── */

export const PICKUP_FREE = "Retrait gratuit au gymnase Louis Boudou";

/** Commande groupée du club : remise en main propre, pas d'envoi postal. */
export const DELIVERY_OPTIONS = [
  { key: "gymnase", label: "Retrait au gymnase", detail: "Complexe sportif Louis Boudou, aux heures d'entraînement", price: 0 },
  { key: "entrainement", label: "Remis à l'entraînement", detail: "Pour les licenciés : le coach vous le remet en main propre", price: 0 },
] as const;

/* ── Utilitaires ────────────────────────────────────────────────────────── */

export function findProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

/** Prix unitaire, flocage compris s'il est renseigné. */
export function unitPrice(p: Product, flocage?: { name?: string; number?: string }): number {
  const personalized = Boolean(flocage?.name?.trim() || flocage?.number?.trim());
  return p.price + (personalized && p.personalization ? p.personalization.price : 0);
}

export function formatPrice(value: number): string {
  return value.toLocaleString("fr-FR", { style: "currency", currency: "EUR", minimumFractionDigits: value % 1 ? 2 : 0 });
}

export function colorByName(p: Product, name?: string): ProductColor {
  return p.colors.find((c) => c.name === name) ?? p.colors[0];
}
