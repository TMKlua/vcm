"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";

import TiltCard from "@/components/ui/TiltCard";
import { useCart } from "./CartContext";
import ProductVisual from "./ProductVisual";
import { formatPrice, type Product } from "@/data/shop";

const BADGE_STYLES: Record<NonNullable<Product["badge"]>, string> = {
  "Best-seller": "bg-fuchsia-vcm text-white",
  Nouveau: "bg-white text-encre",
  "Édition limitée": "bg-[#ffd166] text-encre",
  Précommande: "bg-violet-500 text-white",
  Pack: "bg-gradient-to-r from-violet-700 to-fuchsia-vcm text-white",
  "Black Friday": "bg-black text-white ring-1 ring-fuchsia-vcm",
};

/**
 * Carte d'un article du catalogue.
 *
 * Les pastilles repeignent la maquette en direct ; l'ajout rapide n'est
 * proposé que pour les articles sans taille à choisir — les autres renvoient
 * vers leur fiche, pour ne jamais ajouter une taille au hasard.
 */
export default function ProductCard({ product }: { product: Product }) {
  const [colorIdx, setColorIdx] = useState(0);
  const color = product.colors[colorIdx] ?? product.colors[0];
  const { add, fly, setOpen } = useCart();
  const reduce = useReducedMotion();
  const artRef = useRef<HTMLDivElement>(null);
  const needsChoice = Boolean(product.sizes && product.sizes.length > 1);

  function quickAdd() {
    fly(artRef.current, product.slug, color.name);
    add({ slug: product.slug, color: color.name, size: product.sizes?.[0] });
    setTimeout(() => setOpen(true), reduce ? 0 : 900);
  }

  return (
    <TiltCard className="h-full">
      <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] transition-colors duration-300 hover:border-violet-500/40">
        {/* Scène : fond teinté par la couleur active */}
        <div className="relative aspect-square overflow-hidden">
          <motion.div
            aria-hidden
            className="absolute inset-0"
            animate={{
              background: `radial-gradient(circle at 50% 42%, ${color.hex}55 0%, ${color.hex}14 45%, transparent 72%)`,
            }}
            transition={{ duration: 0.5 }}
          />
          {/* Reflet qui balaie la carte au survol */}
          <span
            aria-hidden
            className="pointer-events-none absolute -inset-y-10 -left-1/2 z-[2] w-1/3 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100"
          />

          {product.badge && (
            <span className={`absolute left-4 top-4 z-10 rounded-full px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.15em] ${BADGE_STYLES[product.badge]}`}>
              {product.badge}
            </span>
          )}

          <Link
            href={`/boutique/${product.slug}`}
            className="absolute inset-0 z-[1] rounded-t-3xl outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-fuchsia-vcm/70"
            aria-label={`${product.name}, ${formatPrice(product.price)}`}
          />

          {/* Photo pleine carte, léger zoom au survol (la seconde vue apparaît en fondu) */}
          <div ref={artRef} className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={color.name}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.04 }}
                transition={{ duration: 0.35 }}
              >
                <ProductVisual product={product} color={color} className="size-full" hover />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Ajout rapide : monte au survol, toujours visible au tactile */}
          <div className="absolute inset-x-4 bottom-4 z-10 translate-y-0 opacity-100 transition-all duration-300 [@media(hover:hover)]:translate-y-3 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-focus-within:translate-y-0 [@media(hover:hover)]:group-focus-within:opacity-100 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100">
            {needsChoice ? (
              <Link
                href={`/boutique/${product.slug}`}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-white/90 px-4 py-3 text-xs font-bold uppercase tracking-wide text-encre backdrop-blur outline-none transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70"
              >
                Choisir ma taille
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            ) : (
              <button
                type="button"
                onClick={quickAdd}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-700 via-magenta to-fuchsia-vcm px-4 py-3 text-xs font-bold uppercase tracking-wide text-white shadow-lg shadow-magenta/30 outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              >
                <Plus className="size-4" aria-hidden />
                Ajout rapide
              </button>
            )}
          </div>
        </div>

        {/* Infos */}
        <div className="flex flex-1 flex-col gap-3 p-3.5 sm:p-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
            <div className="min-w-0">
              <h3 className="font-display text-base leading-tight text-white sm:text-lg">{product.name}</h3>
              <p className="mt-1 hidden text-xs text-white/60 sm:block">{product.tagline}</p>
            </div>
            <div className="flex shrink-0 items-baseline gap-2 sm:block sm:text-right">
              <p className="font-display text-xl text-white">{formatPrice(product.price)}</p>
              {product.compareAt && (
                <p className="text-xs text-white/60 line-through">{formatPrice(product.compareAt)}</p>
              )}
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5" role="radiogroup" aria-label={`Couleur de ${product.name}`}>
              {product.colors.length > 1 &&
                product.colors.map((c, i) => (
                  <button
                    key={c.name}
                    type="button"
                    role="radio"
                    aria-checked={i === colorIdx}
                    aria-label={c.name}
                    title={c.name}
                    onClick={() => setColorIdx(i)}
                    className={`relative z-[2] size-6 rounded-full border border-white/25 outline-none transition-transform after:absolute after:-inset-2.5 after:content-[''] hover:scale-110 focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 ${
                      i === colorIdx ? "ring-2 ring-white ring-offset-2 ring-offset-night" : ""
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
            </div>
            {product.personalization && (
              <span className="hidden rounded-full sm:inline border border-fuchsia-vcm/30 bg-fuchsia-vcm/10 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wider text-fuchsia-vcm">
                {product.personalization.price === 0 ? "Flocage inclus" : "Flocage dispo"}
              </span>
            )}
          </div>
        </div>
      </article>
    </TiltCard>
  );
}
