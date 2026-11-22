"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";

import { useCart } from "./CartContext";
import ProductVisual from "./ProductVisual";
import { colorByName, findProduct, formatPrice, unitPrice } from "@/data/shop";


const EASE = [0.16, 1, 0.3, 1] as const;

/* ── Bouton panier flottant ─────────────────────────────────────────────── */

export function CartButton() {
  const { count, bump, setOpen, open } = useCart();
  const controls = useAnimationControls();
  const reduce = useReducedMotion();

  // Rebond à chaque ajout (après l'atterrissage de la vignette).
  useEffect(() => {
    if (bump === 0 || reduce) return;
    const t = setTimeout(() => {
      controls.start({ scale: [1, 1.25, 0.92, 1.06, 1], rotate: [0, -10, 8, -4, 0], transition: { duration: 0.6 } });
    }, 650);
    return () => clearTimeout(t);
  }, [bump, controls, reduce]);

  return (
    <motion.button
      id="vcm-cart-button"
      type="button"
      onClick={() => setOpen(true)}
      animate={controls}
      aria-label={`Ouvrir le panier, ${count} article${count > 1 ? "s" : ""}`}
      aria-expanded={open}
      className="fixed bottom-5 right-5 z-40 grid size-16 place-items-center rounded-full bg-gradient-to-br from-violet-700 via-magenta to-fuchsia-vcm text-white shadow-2xl shadow-magenta/40 outline-none ring-1 ring-white/20 transition-shadow hover:shadow-magenta/60 focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink sm:bottom-8 sm:right-8"
    >
      <ShoppingBag className="size-6" aria-hidden />
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -right-1 -top-1 grid min-w-6 place-items-center rounded-full bg-white px-1.5 text-xs font-bold text-encre shadow"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
      <span aria-live="polite" className="sr-only">
        {count} article{count > 1 ? "s" : ""} dans le panier
      </span>
    </motion.button>
  );
}

/* ── Vignettes en vol ───────────────────────────────────────────────────── */

export function FlyLayer() {
  const { flights, land } = useCart();
  const reduce = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[60]">
      {flights.map((f) => {
        const product = findProduct(f.slug);
        const target = typeof document !== "undefined" ? document.getElementById("vcm-cart-button") : null;
        const t = target?.getBoundingClientRect();
        if (!product || !t || reduce) {
          // Pas d'animation : on retire la vignette immédiatement.
          queueMicrotask(() => land(f.key));
          return null;
        }
        const size = f.from.size;
        const tx = t.left + t.width / 2;
        const ty = t.top + t.height / 2;
        return (
          <motion.div
            key={f.key}
            className="absolute"
            style={{ width: size, height: size, left: 0, top: 0 }}
            initial={{ x: f.from.x - size / 2, y: f.from.y - size / 2, scale: 1, opacity: 1, rotate: 0 }}
            animate={{
              x: [f.from.x - size / 2, (f.from.x + tx) / 2 - size / 2, tx - size / 2],
              y: [f.from.y - size / 2, Math.min(f.from.y, ty) - 160 - size / 2, ty - size / 2],
              scale: [1, 0.6, 0.12],
              rotate: [0, -12, 20],
              opacity: [1, 1, 0.4],
            }}
            transition={{ duration: 0.75, ease: EASE, times: [0, 0.45, 1] }}
            onAnimationComplete={() => land(f.key)}
          >
            <ProductVisual product={product} color={colorByName(product, f.color)} className="size-full drop-shadow-2xl" shadow={false} />
          </motion.div>
        );
      })}
    </div>
  );
}

/* ── Tiroir panier ──────────────────────────────────────────────────────── */

export function CartDrawer() {
  const { lines, open, setOpen, setQty, remove, subtotal, count } = useCart();
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Échap pour fermer, focus piégé dans le tiroir, focus rendu au bouton.
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input");
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [open, setOpen]);


  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50" data-lenis-prevent>
          <motion.div
            className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="panier-titre"
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-white/10 bg-night shadow-2xl"
            initial={reduce ? { opacity: 0 } : { x: "100%" }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <h2 id="panier-titre" className="font-display text-2xl text-white">
                Mon panier <span className="text-white/70">({count})</span>
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fermer le panier"
                className="grid size-11 place-items-center rounded-full border border-white/10 bg-white/5 text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>


            <div className="flex-1 overflow-y-auto px-6 py-4">
              {lines.length === 0 ? (
                <div className="grid h-full place-items-center text-center">
                  <div>
                    <ShoppingBag className="mx-auto size-12 text-white/20" aria-hidden />
                    <p className="mt-4 font-display text-xl text-white">Votre panier est vide</p>
                    <p className="mt-2 text-sm text-white/70">Le sweat à capuche n&apos;attend que vous.</p>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="mt-6 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70"
                    >
                      Continuer mes achats
                    </button>
                  </div>
                </div>
              ) : (
                <ul className="flex flex-col gap-3">
                  <AnimatePresence initial={false}>
                    {lines.map((l) => {
                      const p = findProduct(l.slug);
                      if (!p) return null;
                      const color = colorByName(p, l.color);
                      return (
                        <motion.li
                          key={l.id}
                          layout
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 60, height: 0, marginBottom: -12 }}
                          transition={{ duration: 0.35, ease: EASE }}
                          className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3"
                        >
                          <Link
                            href={`/boutique/${p.slug}`}
                            onClick={() => setOpen(false)}
                            className="grid size-20 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-700/30 to-fuchsia-vcm/10"
                          >
                            <ProductVisual product={p} color={color} className="size-16" shadow={false} />
                          </Link>
                          <div className="flex min-w-0 flex-1 flex-col">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-semibold text-white">{p.name}</p>
                              <p className="shrink-0 font-semibold text-white">{formatPrice(unitPrice(p, l.flocage) * l.qty)}</p>
                            </div>
                            <p className="text-xs text-white/70">
                              {color.name}
                              {l.size ? ` · ${l.size}` : ""}
                              {l.flocage?.name || l.flocage?.number
                                ? ` · Flocage ${[l.flocage.name, l.flocage.number].filter(Boolean).join(" ")}`
                                : ""}
                            </p>
                            <div className="mt-auto flex items-center justify-between pt-2">
                              <div className="flex items-center rounded-full border border-white/15">
                                <button type="button" onClick={() => setQty(l.id, l.qty - 1)} aria-label={`Retirer un ${p.name}`} className="grid size-9 place-items-center rounded-full text-white/80 outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70">
                                  <Minus className="size-3.5" aria-hidden />
                                </button>
                                <span className="w-6 text-center text-sm text-white">{l.qty}</span>
                                <button type="button" onClick={() => setQty(l.id, l.qty + 1)} aria-label={`Ajouter un ${p.name}`} className="grid size-9 place-items-center rounded-full text-white/80 outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70">
                                  <Plus className="size-3.5" aria-hidden />
                                </button>
                              </div>
                              <button type="button" onClick={() => remove(l.id)} aria-label={`Supprimer ${p.name} du panier`} className="grid size-9 place-items-center rounded-full text-white/60 outline-none hover:text-fuchsia-vcm focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70">
                                <Trash2 className="size-4" aria-hidden />
                              </button>
                            </div>
                          </div>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-white/10 px-6 py-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-white/70">Sous-total</span>
                  <span className="font-display text-3xl text-white">{formatPrice(subtotal)}</span>
                </div>
                <p className="mt-1 text-xs text-white/60">Retrait gratuit au gymnase. Paiement sécurisé HelloAsso.</p>
                <Link
                  href="/boutique/commande"
                  onClick={() => setOpen(false)}
                  className="mt-4 flex w-full items-center justify-center rounded-full bg-gradient-to-r from-violet-700 via-magenta to-fuchsia-vcm px-6 py-4 text-sm font-semibold uppercase tracking-wide text-white shadow-xl shadow-magenta/35 outline-none transition-shadow hover:shadow-magenta/55 focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 focus-visible:ring-offset-2 focus-visible:ring-offset-night"
                >
                  Commander
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
