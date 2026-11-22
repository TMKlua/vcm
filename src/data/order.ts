import { colorByName, DELIVERY_OPTIONS, findProduct, unitPrice } from "@/data/shop";

/* ──────────────────────────────────────────────────────────────────────────
 * Chiffrage d'une commande à partir du catalogue.
 *
 * Utilisé par le serveur avant de demander le paiement à HelloAsso : seuls le
 * produit, la couleur, la taille, le flocage et la quantité viennent du
 * navigateur ; les prix sont toujours ceux du catalogue.
 * ────────────────────────────────────────────────────────────────────────── */

export const DONATIONS = [0, 1, 2, 5] as const;
const MAX_QTY = 20;

export interface OrderLineInput {
  slug: string;
  color: string;
  size?: string;
  flocage?: { name?: string; number?: string };
  qty: number;
}

export interface PricedLine {
  slug: string;
  name: string;
  color: string;
  size?: string;
  flocage?: { name?: string; number?: string };
  qty: number;
  unit: number;
}

export interface PricedOrder {
  lines: PricedLine[];
  subtotal: number;
  shipping: number;
  donation: number;
  total: number;
  delivery: string;
}

type Result = { ok: true; order: PricedOrder } | { ok: false; error: string };

const clean = (s: unknown, max: number) => (typeof s === "string" ? s.trim().slice(0, max) : "");

export function priceOrder(rawLines: unknown, delivery: unknown, donation: unknown): Result {
  if (!Array.isArray(rawLines) || rawLines.length === 0 || rawLines.length > 50) return { ok: false, error: "Panier vide ou invalide." };
  const opt = DELIVERY_OPTIONS.find((d) => d.key === delivery);
  if (!opt) return { ok: false, error: "Mode de remise inconnu." };
  if (!DONATIONS.includes(donation as (typeof DONATIONS)[number])) return { ok: false, error: "Montant de don invalide." };

  const lines: PricedLine[] = [];
  for (const raw of rawLines as Partial<OrderLineInput>[]) {
    const p = typeof raw?.slug === "string" ? findProduct(raw.slug) : undefined;
    if (!p) return { ok: false, error: "Un article du panier n'existe plus." };
    const qty = Number(raw.qty);
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) return { ok: false, error: "Quantité invalide." };
    const color = colorByName(p, clean(raw.color, 40)).name;
    if (color !== raw.color) return { ok: false, error: `Coloris indisponible pour ${p.name}.` };
    const size = clean(raw.size, 20) || undefined;
    if (p.sizes?.length ? !size || !p.sizes.includes(size) : size) return { ok: false, error: `Taille invalide pour ${p.name}.` };
    const flocage = p.personalization
      ? { name: clean(raw.flocage?.name, 20) || undefined, number: clean(raw.flocage?.number, 3) || undefined }
      : undefined;
    lines.push({ slug: p.slug, name: p.name, color, size, flocage, qty, unit: unitPrice(p, flocage) });
  }

  const subtotal = lines.reduce((s, l) => s + l.unit * l.qty, 0);
  const shipping = opt.price;
  const don = donation as number;
  return { ok: true, order: { lines, subtotal, shipping, donation: don, total: subtotal + shipping + don, delivery: opt.label } };
}

/** Libellé court affiché sur HelloAsso et dans son back-office (250 caractères max). */
export function orderLabel(order: PricedOrder): string {
  const parts = order.lines.map((l) => {
    const floc = [l.flocage?.name, l.flocage?.number].filter(Boolean).join(" ");
    return `${l.qty}× ${l.name} ${l.color}${l.size ? ` ${l.size}` : ""}${floc ? ` «${floc}»` : ""}`;
  });
  const label = `Boutique VCM : ${parts.join(", ")}`;
  return label.length > 250 ? `${label.slice(0, 247)}…` : label;
}
