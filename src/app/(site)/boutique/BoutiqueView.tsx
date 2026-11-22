"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  CalendarClock,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  CreditCard,
  PackageCheck,
} from "lucide-react";

import AnimatedGradient from "@/components/motion/AnimatedGradient";
import CourtLines from "@/components/motion/CourtLines";
import Marquee from "@/components/motion/Marquee";
import Reveal from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import TextReveal from "@/components/motion/TextReveal";
import Section from "@/components/layout/Section";
import BlackFridayBanner from "@/components/shop/BlackFridayBanner";
import ProductCard from "@/components/shop/ProductCard";
import { useContent } from "@/content/ContentContext";
import { useNavLabel } from "@/data/useNavLinks";
import { CATEGORIES, ORDER_CONTACT, ORDER_DEADLINE, products, type ShopCategory } from "@/data/shop";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Vrai sur ordinateur (souris), faux sur téléphone et tablette. Les effets
 * continus du hero (lévitation, halo qui pulse, parallaxe) ne tournent que
 * sur ordinateur : sur iPhone ils saturaient l'affichage.
 */
const FINE = "(hover: hover) and (pointer: fine)";
function useFinePointer(): boolean {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(FINE);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(FINE).matches,
    () => false,
  );
}

type Sort = "featured" | "asc" | "desc";

/** Kicker maison : trait dégradé + petites capitales fuchsia. */
function Kicker({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  return (
    <div className={`mb-5 flex items-center gap-3 ${center ? "justify-center" : ""}`}>
      <span aria-hidden className="h-px w-8 bg-gradient-to-r from-violet-700 to-fuchsia-vcm" />
      <span className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-fuchsia-vcm">{children}</span>
      {center && <span aria-hidden className="h-px w-8 bg-gradient-to-r from-fuchsia-vcm to-violet-700" />}
    </div>
  );
}

/* ── Hero : photos d'articles en lévitation, parallaxe à la souris ──────── */

/** Photos du catalogue du club, posées comme des tirages qui flottent. */
const HERO_ITEMS = [
  { slug: "sweat-capuche-vcm", src: "/images/boutique/sweat-capuche-vcm--parme--dos.webp", className: "left-[22%] top-[6%] w-[52%] z-20", depth: 28, delay: 0 },
  { slug: "tee-shirt-personnalisable", src: "/images/boutique/tee-shirt-personnalisable--noir.webp", className: "left-[-2%] top-[46%] w-[38%] z-30", depth: 46, delay: 0.8 },
  { slug: "tote-bag-vcm", src: "/images/boutique/tote-bag-vcm--noir.webp", className: "right-[0%] top-[50%] w-[36%] z-30", depth: 38, delay: 1.6 },
  { slug: "gourde-sport-vcm", src: "/images/boutique/gourde-sport-vcm--blanc.webp", className: "right-[4%] top-[2%] w-[26%] z-10", depth: 18, delay: 2.4 },
];

function FloatingItem({
  item,
  mx,
  my,
}: {
  item: (typeof HERO_ITEMS)[number];
  mx: ReturnType<typeof useSpring>;
  my: ReturnType<typeof useSpring>;
}) {
  const fine = useFinePointer();
  const reducedMotion = useReducedMotion();
  const reduce = !fine || Boolean(reducedMotion);
  const x = useTransform(mx, (v) => v * item.depth);
  const y = useTransform(my, (v) => v * item.depth);
  return (
    <motion.div className={`absolute ${item.className}`} style={reduce ? undefined : { x, y }}>
      <motion.div
        initial={{ opacity: 0, y: 60, rotate: -6 }}
        animate={
          reduce
            ? { opacity: 1, y: 0, rotate: 0 }
            : { opacity: 1, y: [0, -14, 0], rotate: [-2, 2, -2] }
        }
        transition={
          reduce
            ? { duration: 0.4 }
            : {
                opacity: { duration: 0.8, delay: 0.3 + item.delay * 0.2 },
                y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: item.delay },
                rotate: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: item.delay },
              }
        }
      >
        {/* Ombre en box-shadow (dessinée une fois) et non en filtre drop-shadow,
            que le navigateur recalculait à chaque image de l'animation. */}
        <Link href={`/boutique/${item.slug}`} tabIndex={-1} aria-hidden className="block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.src} alt="" decoding="async" className="aspect-[4/5] w-full rounded-2xl border-4 border-white/90 object-cover shadow-[0_30px_40px_-10px_rgba(0,0,0,0.6)]" />
        </Link>
      </motion.div>
    </motion.div>
  );
}

function ShopHero({ breadcrumbLabel, homeLabel }: { breadcrumbLabel: string; homeLabel: string }) {
  const fine = useFinePointer();
  const reducedMotion = useReducedMotion();
  const reduce = !fine || Boolean(reducedMotion);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 60, damping: 18 });
  const my = useSpring(rawY, { stiffness: 60, damping: 18 });

  function onMove(e: React.MouseEvent<HTMLElement>) {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width - 0.5);
    rawY.set((e.clientY - r.top) / r.height - 0.5);
  }

  return (
    <section
      aria-label="Boutique officielle du VCM"
      onMouseMove={onMove}
      className="relative isolate overflow-hidden bg-ink pb-16 pt-32 sm:pt-40 lg:pb-24"
    >
      <AnimatedGradient className="opacity-70" />
      <CourtLines className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden h-full w-[55%] text-fuchsia-vcm opacity-40 md:block" />
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

      <div className="relative z-10 mx-auto grid max-w-[88rem] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:px-12">
        <div>
          <Reveal>
            <nav aria-label="Fil d'Ariane" className="mb-8">
              <ol className="flex items-center gap-1 text-xs font-medium text-white/60">
                <li>
                  <Link href="/" className="transition-colors hover:text-white/70 focus-visible:underline focus-visible:outline-none">
                    {homeLabel}
                  </Link>
                </li>
                <li className="flex items-center gap-1">
                  <ChevronRight className="size-3 text-white/25" aria-hidden />
                  <span aria-current="page" className="text-white/70">{breadcrumbLabel}</span>
                </li>
              </ol>
            </nav>
          </Reveal>
          <Reveal delay={0.05}>
            <Kicker>Boutique officielle</Kicker>
          </Reveal>
          <h1 aria-label="Portez le VCM" className="font-display text-[clamp(3rem,9vw,8rem)] leading-[0.9] tracking-tight text-white">
            <span aria-hidden>
              <TextReveal text="Portez" className="block" />
              <TextReveal text="le VCM" className="block" wordClassName="text-gradient" />
            </span>
          </h1>
          <Reveal delay={0.3}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              Soutenez votre club au quotidien et sur les terrains avec la collection officielle du Volley Club
              Marseillanais : sweats, tee-shirt personnalisé, sac, gourde et tote bag aux couleurs du VCM.
            </p>
          </Reveal>
          <Reveal delay={0.4}>
            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="#collection"
                className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-violet-700 via-magenta to-fuchsia-vcm px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white shadow-xl shadow-magenta/35 outline-none transition-shadow hover:shadow-magenta/55 focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                Voir la collection
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.5}>
            <ul className="mt-10 grid max-w-xl grid-cols-1 gap-3 text-sm text-white/70 sm:grid-cols-3">
              {[
                { Icon: ShieldCheck, text: "Paiement en ligne sécurisé" },
                { Icon: MapPin, text: "Retrait gratuit au gymnase" },
                { Icon: CalendarClock, text: `Commandes jusqu'au ${ORDER_DEADLINE}` },
              ].map(({ Icon, text }) => (
                <li key={text} className="flex items-center gap-2">
                  <Icon className="size-4 shrink-0 text-fuchsia-vcm" aria-hidden />
                  {text}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Scène flottante */}
        <div className="relative mx-auto aspect-square w-full max-w-[34rem]">
          <motion.div
            aria-hidden
            className="absolute inset-[8%] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(192,38,211,0.45), rgba(124,58,237,0.15) 55%, transparent 72%)" }}
            animate={reduce ? undefined : { scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <div aria-hidden className="absolute inset-[14%] rounded-full border border-white/10" />
          <div aria-hidden className="absolute inset-[2%] rounded-full border border-dashed border-white/[0.06]" />
          {HERO_ITEMS.map((item) => (
            <FloatingItem key={item.slug} item={item} mx={mx} my={my} />
          ))}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.6, ease: EASE }}
            className="absolute right-[4%] top-[6%] z-40 rotate-6 rounded-2xl border border-white/15 bg-night/95 px-4 py-3 text-center"
          >
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-fuchsia-vcm">Commandes avant le</p>
            <p className="font-display text-2xl text-white">{ORDER_DEADLINE}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── Catalogue filtrable ───────────────────────────────────────────────── */

function Catalogue() {
  const [cat, setCat] = useState<ShopCategory | "all">("all");
  const [sort, setSort] = useState<Sort>("featured");

  const list = useMemo(() => {
    const filtered = products.filter((p) => cat === "all" || p.category === cat);
    if (sort === "asc") return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === "desc") return [...filtered].sort((a, b) => b.price - a.price);
    // Mis en avant : best-sellers et nouveautés d'abord, ordre du catalogue ensuite.
    const weight = (b?: string) => (b === "Best-seller" ? 0 : b === "Nouveau" || b === "Édition limitée" || b === "Black Friday" ? 1 : 2);
    return [...filtered].sort((a, b) => weight(a.badge) - weight(b.badge));
  }, [cat, sort]);

  return (
    <Section id="collection" className="!pt-10">
      <Reveal>
        <BlackFridayBanner className="mb-12" />
      </Reveal>
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Reveal>
            <Kicker>La collection</Kicker>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="font-display text-[clamp(2rem,5vw,4rem)] leading-[0.95] tracking-tight text-white">
              Tout le vestiaire du club
            </h2>
          </Reveal>
        </div>
      </div>

      {/* Barre de filtres collante */}
      <div className="sticky top-[7.25rem] z-20 -mx-2 mb-10 rounded-full border border-white/10 bg-night/95 p-1.5 sm:mx-0 lg:bg-night/80 lg:backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="flex flex-1 gap-1 overflow-x-auto [scrollbar-width:none]" role="tablist" aria-label="Rayons de la boutique">
            {CATEGORIES.map((c) => {
              const active = c.key === cat;
              const n = c.key === "all" ? products.length : products.filter((p) => p.category === c.key).length;
              return (
                <button
                  key={c.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setCat(c.key)}
                  className={`relative shrink-0 rounded-full px-4 py-2.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 ${
                    active ? "text-white" : "text-white/70 hover:text-white"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="shop-filter"
                      className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-violet-700 to-fuchsia-vcm"
                      transition={{ duration: 0.4, ease: EASE }}
                    />
                  )}
                  {c.label}
                  <span className="ml-1.5 text-xs opacity-60">{n}</span>
                </button>
              );
            })}
          </div>
          <label className="hidden shrink-0 items-center gap-2 pr-3 text-xs text-white/60 md:flex">
            Trier
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="rounded-full border border-white/15 bg-ink px-3 py-2 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70"
            >
              <option value="featured">Mis en avant</option>
              <option value="asc">Prix croissant</option>
              <option value="desc">Prix décroissant</option>
            </select>
          </label>
        </div>
      </div>

      <motion.ul layout className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => (
            <motion.li
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.45, ease: EASE, delay: Math.min(i, 8) * 0.03 }}
            >
              <ProductCard product={p} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </Section>
  );
}

/* ── Comment ça marche ──────────────────────────────────────────────────── */

const STEPS = [
  { Icon: ShoppingBag, title: "Je commande", text: `Je choisis mes articles, ma taille et mon prénom + numéro, avant le ${ORDER_DEADLINE}.` },
  { Icon: CreditCard, title: "Je paie en ligne", text: "Paiement sécurisé directement sur le site du club. Reçu par e-mail." },
  { Icon: PackageCheck, title: "Je récupère", text: "Au gymnase Louis Boudou ou à l'entraînement, une fois la commande groupée livrée au club." },
];

function HowItWorks() {
  return (
    <section aria-labelledby="etapes-titre" className="relative isolate overflow-hidden bg-night py-20 sm:py-28">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-12">
        <Reveal>
          <Kicker>Comment ça marche</Kicker>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 id="etapes-titre" className="mb-14 font-display text-[clamp(2rem,5vw,4rem)] leading-[0.95] tracking-tight text-white">
            Trois étapes, zéro prise de tête
          </h2>
        </Reveal>
        <StaggerGroup className="relative grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Fil qui relie les étapes */}
          <motion.span
            aria-hidden
            className="absolute left-[16%] right-[16%] top-11 hidden h-px origin-left bg-gradient-to-r from-violet-700 via-fuchsia-vcm to-violet-700 md:block"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}
          />
          {STEPS.map(({ Icon, title, text }, i) => (
            <StaggerItem key={title} className="relative text-center">
              <div className="relative mx-auto grid size-22 place-items-center rounded-full border border-white/10 bg-ink">
                <div className="grid size-16 place-items-center rounded-full bg-gradient-to-br from-violet-700 to-fuchsia-vcm shadow-lg shadow-magenta/30">
                  <Icon className="size-7 text-white" aria-hidden />
                </div>
                <span className="absolute -right-1 -top-1 grid size-7 place-items-center rounded-full bg-white font-display text-sm text-encre">{i + 1}</span>
              </div>
              <h3 className="mt-6 font-display text-xl text-white">{title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-white/70">{text}</p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

/* ── Page ───────────────────────────────────────────────────────────────── */

export default function BoutiqueView() {
  const { content } = useContent();
  const breadcrumbLabel = useNavLabel("boutique", "Boutique");

  return (
    <>
      <ShopHero breadcrumbLabel={breadcrumbLabel} homeLabel={content.text.ui?.breadcrumbHome ?? "Accueil"} />
      <Marquee items={["Boutique officielle", "Depuis 1992", "Étang de Thau", "Allez le VCM"]} className="bg-ink" />
      <Catalogue />
      <HowItWorks />
      <Section>
        <Reveal>
          <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-700/15 to-fuchsia-vcm/5 p-8 text-center sm:p-12">
            <HeartHandshake className="mx-auto size-10 text-fuchsia-vcm" aria-hidden />
            <h2 className="mt-5 font-display text-[clamp(1.6rem,4vw,2.6rem)] leading-[0.95] text-white">
              Chaque achat fait jouer le club
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/70">
              Porter la collection officielle, c&apos;est soutenir le Volley Club Marseillanais sur les terrains et en
              dehors. Une question sur une commande ? Renseignements auprès de {ORDER_CONTACT}.
            </p>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
