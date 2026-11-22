"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { findProduct, unitPrice } from "@/data/shop";

/* ──────────────────────────────────────────────────────────────────────────
 * Panier de la boutique.
 *
 * Vit dans le navigateur (localStorage) ; il n'est envoyé au serveur qu'au
 * paiement, pour créer la commande HelloAsso. Un article du
 * panier est identifié par produit + couleur + taille + flocage, pour que deux
 * maillots floqués différemment restent deux lignes distinctes.
 * ────────────────────────────────────────────────────────────────────────── */

export interface CartLine {
  id: string;
  slug: string;
  color: string;
  size?: string;
  flocage?: { name?: string; number?: string };
  qty: number;
}

/** Vignette qui vole de la fiche produit jusqu'au bouton panier. */
export interface Flight {
  key: number;
  from: { x: number; y: number; size: number };
  slug: string;
  color: string;
}

interface CartState {
  lines: CartLine[];
  count: number;
  subtotal: number;
  open: boolean;
  /** Incrémenté à chaque ajout : déclenche le rebond du bouton panier. */
  bump: number;
  flights: Flight[];
  /** Lance l'animation d'ajout depuis l'élément `from`. */
  fly: (from: Element | null, slug: string, color: string) => void;
  land: (key: number) => void;
  setOpen: (open: boolean) => void;
  add: (line: Omit<CartLine, "id" | "qty">, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const STORAGE_KEY = "vcm-boutique-panier";

const CartContext = createContext<CartState | null>(null);

function lineId(l: Omit<CartLine, "id" | "qty">): string {
  return [l.slug, l.color, l.size ?? "", l.flocage?.name ?? "", l.flocage?.number ?? ""].join("|");
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [bump, setBump] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [flights, setFlights] = useState<Flight[]>([]);

  // Lecture après le montage : le rendu serveur ne connaît pas le panier.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[];
        // Un article retiré du catalogue ne doit pas rester dans le panier.
        setLines(parsed.filter((l) => findProduct(l.slug)));
      }
    } catch {
      /* navigation privée ou stockage bloqué : panier vide */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* idem */
    }
  }, [lines, loaded]);

  const add = useCallback<CartState["add"]>((line, qty = 1) => {
    const id = lineId(line);
    setLines((cur) => {
      const existing = cur.find((l) => l.id === id);
      if (existing) {
        return cur.map((l) => (l.id === id ? { ...l, qty: Math.min(l.qty + qty, 20) } : l));
      }
      return [...cur, { ...line, id, qty }];
    });
    setBump((b) => b + 1);
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setLines((cur) =>
      qty <= 0 ? cur.filter((l) => l.id !== id) : cur.map((l) => (l.id === id ? { ...l, qty: Math.min(qty, 20) } : l)),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setLines((cur) => cur.filter((l) => l.id !== id));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const fly = useCallback((from: Element | null, slug: string, color: string) => {
    if (!from) return;
    const r = from.getBoundingClientRect();
    const size = Math.min(r.width, r.height, 220);
    setFlights((cur) => [
      ...cur,
      { key: Date.now() + Math.random(), slug, color, from: { x: r.left + r.width / 2, y: r.top + r.height / 2, size } },
    ]);
  }, []);

  const land = useCallback((key: number) => {
    setFlights((cur) => cur.filter((f) => f.key !== key));
  }, []);

  const value = useMemo<CartState>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((sum, l) => {
      const p = findProduct(l.slug);
      return p ? sum + unitPrice(p, l.flocage) * l.qty : sum;
    }, 0);
    return { lines, count, subtotal, open, bump, flights, fly, land, setOpen, add, setQty, remove, clear };
  }, [lines, open, bump, flights, fly, land, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart doit être utilisé sous <CartProvider>");
  return ctx;
}
