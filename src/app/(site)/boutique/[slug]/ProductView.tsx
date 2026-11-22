"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronDown, ChevronRight, Minus, Plus, RotateCcw, Ruler, ShoppingBag, X } from "lucide-react";

import AnimatedGradient from "@/components/motion/AnimatedGradient";
import Reveal from "@/components/motion/Reveal";
import Section from "@/components/layout/Section";
import { useCart } from "@/components/shop/CartContext";
import ProductCard from "@/components/shop/ProductCard";
import Portal from "@/components/shop/Portal";
import ProductVisual from "@/components/shop/ProductVisual";
import { useContent } from "@/content/ContentContext";
import { useNavLabel } from "@/data/useNavLinks";
import { findProduct, formatPrice, ORDER_CONTACT, ORDER_DEADLINE, products, unitPrice } from "@/data/shop";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Articles dont le dos peut porter un flocage. */
const HAS_BACK = new Set(["tee", "tank", "hoodie", "jacket"]);

const SIZE_GUIDE = [
  ["S", "90-96", "72-78"],
  ["M", "96-102", "78-84"],
  ["L", "102-108", "84-90"],
  ["XL", "108-114", "90-96"],
  ["XXL", "114-120", "96-102"],
];

function Disclosure({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/10">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold uppercase tracking-wider text-white outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70"
      >
        {title}
        <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="pb-5 text-sm leading-relaxed text-white/70">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductView({ slug }: { slug: string }) {
  const product = findProduct(slug)!;
  const { content } = useContent();
  const reduce = useReducedMotion();
  const { add, fly, setOpen } = useCart();
  const shopLabel = useNavLabel("boutique", "Boutique");

  const [colorIdx, setColorIdx] = useState(0);
  const [size, setSize] = useState<string | undefined>(product.sizes?.length === 1 ? product.sizes[0] : undefined);
  const [qty, setQty] = useState(1);
  // Flocage inclus dans le prix : l'option est cochée d'office.
  const included = product.personalization?.price === 0;
  const fieldLabel = product.personalization?.label ?? "Nom";
  const [personalize, setPersonalize] = useState(included);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [view, setView] = useState<"front" | "back">("front");
  const [sizeError, setSizeError] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const [altOn, setAltOn] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  const color = product.colors[colorIdx] ?? product.colors[0];
  const canFlip = HAS_BACK.has(product.kind);
  const flocage = personalize ? { name: name.trim(), number: number.trim() } : undefined;
  const price = unitPrice(product, flocage?.name || flocage?.number ? flocage : undefined);
  const related = products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4);

  function togglePersonalize(on: boolean) {
    setPersonalize(on);
    if (canFlip) setView(on ? "back" : "front");
  }

  function addToCart() {
    if (product.sizes && product.sizes.length > 1 && !size) {
      setSizeError(true);
      document.getElementById("tailles")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
      return;
    }
    fly(stageRef.current, product.slug, color.name);
    add(
      {
        slug: product.slug,
        color: color.name,
        size,
        flocage: flocage?.name || flocage?.number ? flocage : undefined,
      },
      qty,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
    setTimeout(() => setOpen(true), reduce ? 0 : 950);
  }

  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink pb-16 pt-28 sm:pt-36">
        <AnimatedGradient className="opacity-50" />
        <div className="relative z-10 mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-12">
          <nav aria-label="Fil d'Ariane" className="mb-8">
            <ol className="flex flex-wrap items-center gap-1 text-xs font-medium text-white/60">
              <li><Link href="/" className="hover:text-white/70">{content.text.ui?.breadcrumbHome ?? "Accueil"}</Link></li>
              <li className="flex items-center gap-1"><ChevronRight className="size-3 text-white/25" aria-hidden /><Link href="/boutique" className="hover:text-white/70">{shopLabel}</Link></li>
              <li className="flex items-center gap-1"><ChevronRight className="size-3 text-white/25" aria-hidden /><span aria-current="page" className="text-white/70">{product.name}</span></li>
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            {/* ── Scène ─────────────────────────────────────────────── */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-white/10 bg-night">
                <motion.div
                  aria-hidden
                  className="absolute inset-0"
                  animate={{ background: `radial-gradient(circle at 50% 45%, ${color.hex}66 0%, ${color.hex}1a 45%, transparent 75%)` }}
                  transition={{ duration: 0.6 }}
                />
                <div ref={stageRef} className="absolute inset-0" style={{ perspective: 1400 }}>
                  {reduce ? (
                    // Mouvement réduit : pas de rotation 3D, la vue change directement.
                    <ProductVisual product={product} color={color} view={view} flocage={{ name, number }} className="size-full" />
                  ) : (
                  <motion.div
                    className="size-full"
                    animate={{ rotateY: view === "back" ? 180 : 0 }}
                    transition={{ duration: 0.8, ease: EASE }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
                      {altOn && color.alt ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={color.alt} alt="" className="size-full object-cover" />
                      ) : (
                        <ProductVisual product={product} color={color} className="size-full" />
                      )}
                    </div>
                    {canFlip && (
                      <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                        <ProductVisual product={product} color={color} view="back" flocage={{ name, number }} className="size-full" />
                      </div>
                    )}
                  </motion.div>
                  )}
                </div>

                {product.badge && (
                  <span className="absolute left-5 top-5 rounded-full bg-fuchsia-vcm px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-white">
                    {product.badge}
                  </span>
                )}
                {canFlip && (
                  <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 rounded-full border border-white/15 bg-ink/90 p-1" role="group" aria-label="Vue de l'article">
                    {(["front", "back"] as const).map((v) => (
                      <button
                        key={v}
                        type="button"
                        aria-pressed={view === v}
                        onClick={() => setView(v)}
                        className={`relative rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 ${view === v ? "text-white" : "text-white/60"}`}
                      >
                        {view === v && <motion.span layoutId="view-pill" className="absolute inset-0 -z-10 rounded-full bg-white/15" />}
                        {v === "front" ? "Face" : "Dos"}
                      </button>
                    ))}
                    <RotateCcw className="mx-2 my-auto size-3.5 text-white/40" aria-hidden />
                  </div>
                )}
              </div>

              {/* Vignettes : face, photo portée, dos */}
              {(color.alt || color.back) && (
                <div className="mt-4 flex gap-3" role="group" aria-label="Photos de l'article">
                  {[
                    { key: "front", src: color.photo, label: "Face" },
                    ...(color.alt ? [{ key: "alt", src: color.alt, label: "Porté" }] : []),
                    ...(color.back ? [{ key: "back", src: color.back, label: "Dos" }] : []),
                  ].map((t) => {
                    const active = t.key === "back" ? view === "back" : view === "front" && (t.key === "alt") === altOn;
                    return (
                      <button
                        key={t.key}
                        type="button"
                        aria-pressed={active}
                        aria-label={t.label}
                        onClick={() => {
                          setView(t.key === "back" ? "back" : "front");
                          setAltOn(t.key === "alt");
                        }}
                        className={`relative size-20 overflow-hidden rounded-xl border-2 outline-none transition-all focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 ${active ? "border-fuchsia-vcm" : "border-white/10 opacity-70 hover:opacity-100"}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={t.src} alt="" className="size-full object-cover" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Configuration ─────────────────────────────────────── */}
            <div>
              <Reveal>
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-fuchsia-vcm">{product.tagline}</p>
                <h1 className="mt-3 font-display text-[clamp(2.4rem,5vw,4.5rem)] leading-[0.92] tracking-tight text-white">{product.name}</h1>
                <div className="mt-5 flex items-baseline gap-3">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={price}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="font-display text-4xl text-white"
                    >
                      {formatPrice(price)}
                    </motion.span>
                  </AnimatePresence>
                  {product.compareAt && <span className="text-lg text-white/60 line-through">{formatPrice(product.compareAt)}</span>}
                  <span className="text-xs text-white/60">TTC</span>
                </div>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75">{product.description}</p>
              </Reveal>

              {/* Couleur */}
              {product.colors.length > 1 && (
                <fieldset className="mt-8">
                  <legend className="mb-3 text-sm text-white/70">
                    Couleur : <span className="font-semibold text-white">{color.name}</span>
                  </legend>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((c, i) => (
                      <button
                        key={c.name}
                        type="button"
                        aria-pressed={i === colorIdx}
                        aria-label={c.name}
                        onClick={() => {
                          setColorIdx(i);
                          setAltOn(false);
                        }}
                        className={`grid size-11 place-items-center rounded-full border-2 outline-none transition-all focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 ${i === colorIdx ? "scale-110 border-white" : "border-transparent hover:scale-105"}`}
                      >
                        <span className="size-8 rounded-full border border-white/20" style={{ backgroundColor: c.hex }} />
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}

              {/* Taille */}
              {product.sizes && product.sizes.length > 1 && (
                <fieldset id="tailles" className="mt-8">
                  <div className="mb-3 flex items-center justify-between">
                    <legend className="text-sm text-white/70">
                      Taille : <span className="font-semibold text-white">{size ?? "à choisir"}</span>
                    </legend>
                    {product.category === "textile" && (
                      <button type="button" onClick={() => setGuideOpen(true)} className="flex items-center gap-1.5 text-xs text-white/70 underline-offset-4 hover:text-white hover:underline">
                        <Ruler className="size-3.5" aria-hidden /> Guide des tailles
                      </button>
                    )}
                  </div>
                  <motion.div
                    className="flex flex-wrap gap-2"
                    animate={sizeError && !reduce ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }}
                    transition={{ duration: 0.4 }}
                    onAnimationComplete={() => setSizeError(false)}
                  >
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        aria-pressed={size === s}
                        onClick={() => setSize(s)}
                        className={`relative min-h-11 min-w-14 rounded-xl border px-3 text-sm font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 ${
                          size === s ? "border-transparent text-white" : "border-white/15 text-white/80 hover:border-white/40"
                        }`}
                      >
                        {size === s && <motion.span layoutId="size-pill" className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-violet-700 to-fuchsia-vcm" transition={{ duration: 0.3, ease: EASE }} />}
                        {s}
                      </button>
                    ))}
                  </motion.div>
                  {sizeError && <p role="alert" className="mt-2 text-sm text-fuchsia-vcm">Choisissez une taille.</p>}
                </fieldset>
              )}

              {/* Flocage */}
              {product.personalization && (
                <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <label className="flex cursor-pointer items-center justify-between gap-4">
                    <span>
                      <span className="block font-semibold text-white">Flocage {fieldLabel.toLowerCase()} + numéro</span>
                      <span className="text-sm text-white/60">
                        Au dos, en lettres du club · {included ? "inclus dans le prix" : `+${formatPrice(product.personalization.price)}`}
                      </span>
                    </span>
                    <span className="relative inline-flex">
                      <input type="checkbox" className="peer sr-only" checked={personalize} onChange={(e) => togglePersonalize(e.target.checked)} />
                      <span className="h-7 w-12 rounded-full bg-white/15 transition-colors peer-checked:bg-gradient-to-r peer-checked:from-violet-700 peer-checked:to-fuchsia-vcm peer-focus-visible:ring-2 peer-focus-visible:ring-fuchsia-vcm/70" />
                      <span className="absolute left-1 top-1 size-5 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
                    </span>
                  </label>
                  <AnimatePresence initial={false}>
                    {personalize && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-[1fr_7rem] gap-3 pt-5">
                          <label className="text-xs text-white/70">
                            {fieldLabel}
                            <input
                              value={name}
                              maxLength={12}
                              onChange={(e) => setName(e.target.value.replace(/[^\p{L} '-]/gu, ""))}
                              onFocus={() => canFlip && setView("back")}
                              placeholder={included ? "OLIVIA" : "DUPONT"}
                              className="mt-1.5 w-full rounded-xl border border-white/15 bg-ink px-4 py-3 text-base uppercase text-white outline-none placeholder:text-white/25 focus:border-fuchsia-vcm/60"
                            />
                          </label>
                          <label className="text-xs text-white/70">
                            Numéro
                            <input
                              value={number}
                              inputMode="numeric"
                              maxLength={2}
                              onChange={(e) => setNumber(e.target.value.replace(/\D/g, "").slice(0, 2))}
                              onFocus={() => canFlip && setView("back")}
                              placeholder={included ? "17" : "92"}
                              className="mt-1.5 w-full rounded-xl border border-white/15 bg-ink px-4 py-3 text-center font-display text-xl text-white outline-none placeholder:text-white/25 focus:border-fuchsia-vcm/60"
                            />
                          </label>
                        </div>
                        <p className="mt-3 text-xs text-white/50">12 lettres maximum, numéro de 0 à 99. L&apos;aperçu se met à jour au dos.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Quantité + ajout */}
              <div className="mt-8 flex items-stretch gap-3">
                <div className="flex items-center rounded-full border border-white/15">
                  <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Diminuer la quantité" className="grid size-12 place-items-center rounded-full text-white/80 hover:text-white">
                    <Minus className="size-4" aria-hidden />
                  </button>
                  <span aria-live="polite" className="w-8 text-center font-semibold text-white">{qty}</span>
                  <button type="button" onClick={() => setQty((q) => Math.min(20, q + 1))} aria-label="Augmenter la quantité" className="grid size-12 place-items-center rounded-full text-white/80 hover:text-white">
                    <Plus className="size-4" aria-hidden />
                  </button>
                </div>
                <motion.button
                  type="button"
                  onClick={addToCart}
                  whileTap={reduce ? undefined : { scale: 0.97 }}
                  className="relative flex flex-1 items-center justify-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-violet-700 via-magenta to-fuchsia-vcm px-6 py-4 text-sm font-semibold uppercase tracking-wide text-white shadow-xl shadow-magenta/35 outline-none transition-shadow hover:shadow-magenta/55 focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {added ? (
                      <motion.span key="ok" className="flex items-center gap-2" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
                        <Check className="size-5" aria-hidden /> Ajouté !
                      </motion.span>
                    ) : (
                      <motion.span key="add" className="flex items-center gap-2" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
                        <ShoppingBag className="size-5" aria-hidden /> Ajouter au panier · {formatPrice(price * qty)}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
              <p className="mt-3 text-xs text-white/60">
                Commandes jusqu&apos;au {ORDER_DEADLINE} · Retrait gratuit au gymnase Louis Boudou · Paiement sécurisé en ligne
              </p>

              <div className="mt-10 border-t border-white/10">
                {product.kind === "pack" && product.items && (
                  <Disclosure title="Contenu du pack" defaultOpen>
                    <ul className="list-inside list-disc space-y-1">
                      {product.items.map((it) => {
                        const p = findProduct(it.slug);
                        return p ? (
                          <li key={it.slug}>
                            <Link href={`/boutique/${p.slug}`} className="underline-offset-4 hover:text-white hover:underline">{p.name}</Link> · {it.color}
                          </li>
                        ) : null;
                      })}
                    </ul>
                  </Disclosure>
                )}
                <Disclosure title="Détails" defaultOpen={product.kind !== "pack"}>
                  <ul className="list-inside list-disc space-y-1">
                    {product.details.map((d) => <li key={d}>{d}</li>)}
                  </ul>
                </Disclosure>
                <Disclosure title="Retrait et livraison">
                  Commande groupée du club, ouverte jusqu&apos;au {ORDER_DEADLINE}. Les articles sont remis au complexe
                  sportif Louis Boudou aux heures d&apos;entraînement, ou en main propre par le coach pour les licenciés.
                  Renseignements auprès de {ORDER_CONTACT}.
                </Disclosure>
                <Disclosure title="Entretien">
                  Lavage à 30 °C sur l&apos;envers, pas de sèche-linge pour les articles floqués, repassage doux en évitant le
                  marquage.
                </Disclosure>
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <Section>
          <h2 className="mb-10 font-display text-[clamp(1.8rem,4vw,3rem)] leading-[0.95] text-white">Vous aimerez aussi</h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </Section>
      )}

      {/* Guide des tailles */}
      <Portal>
      <AnimatePresence>
        {guideOpen && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-ink/80 p-5 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setGuideOpen(false)}
            data-lenis-prevent
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="guide-titre"
              className="w-full max-w-md rounded-3xl border border-white/10 bg-night p-6"
              initial={{ y: 30, scale: 0.96 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 20, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.key === "Escape" && setGuideOpen(false)}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 id="guide-titre" className="font-display text-2xl text-white">Guide des tailles</h2>
                <button type="button" autoFocus onClick={() => setGuideOpen(false)} aria-label="Fermer" className="grid size-10 place-items-center rounded-full bg-white/5 text-white hover:bg-white/10">
                  <X className="size-5" aria-hidden />
                </button>
              </div>
              <table className="w-full text-left text-sm text-white/80">
                <thead className="text-xs uppercase tracking-wider text-white/50">
                  <tr><th className="py-2">Taille</th><th>Tour de poitrine (cm)</th><th>Tour de taille (cm)</th></tr>
                </thead>
                <tbody>
                  {SIZE_GUIDE.map(([s, a, b]) => (
                    <tr key={s} className="border-t border-white/10"><td className="py-2 font-semibold text-white">{s}</td><td>{a}</td><td>{b}</td></tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-4 text-xs text-white/60">Entre deux tailles ? Prenez la plus grande. Les tailles enfant correspondent à l&apos;âge.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </Portal>
    </>
  );
}
