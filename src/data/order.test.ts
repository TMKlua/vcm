import { describe, expect, it } from "vitest";

import { orderLabel, priceOrder } from "./order";

const tee = { slug: "tee-shirt-personnalisable", color: "Noir", size: "M", flocage: { name: "Léa", number: "7" }, qty: 2 };

describe("priceOrder", () => {
  it("recalcule le total à partir du catalogue", () => {
    const r = priceOrder([tee, { slug: "tote-bag-vcm", color: "Beige naturel", qty: 1 }], "gymnase", 2);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.order.subtotal).toBe(25 * 2 + 7);
    expect(r.order.total).toBe(25 * 2 + 7 + 2);
  });

  it("refuse un article, une taille, un coloris ou un don inconnus", () => {
    expect(priceOrder([{ ...tee, slug: "inconnu" }], "gymnase", 0).ok).toBe(false);
    expect(priceOrder([{ ...tee, size: "XXXL" }], "gymnase", 0).ok).toBe(false);
    expect(priceOrder([{ ...tee, color: "Rose" }], "gymnase", 0).ok).toBe(false);
    expect(priceOrder([tee], "gymnase", 3).ok).toBe(false);
    expect(priceOrder([{ ...tee, qty: 0 }], "gymnase", 0).ok).toBe(false);
    expect(priceOrder([], "gymnase", 0).ok).toBe(false);
  });

  it("produit un libellé de 250 caractères au plus", () => {
    const r = priceOrder(Array.from({ length: 30 }, (_, i) => ({ ...tee, flocage: { name: `Joueuse${i}`, number: "1" } })), "gymnase", 0);
    if (!r.ok) throw new Error(r.error);
    expect(orderLabel(r.order).length).toBeLessThanOrEqual(250);
  });
});
