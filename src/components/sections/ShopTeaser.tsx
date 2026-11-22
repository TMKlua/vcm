"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarClock, Sparkles } from "lucide-react";

import Reveal from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import BlackFridayBanner from "@/components/shop/BlackFridayBanner";
import { useNavLabel } from "@/data/useNavLinks";
import { findProduct, formatPrice, ORDER_DEADLINE } from "@/data/shop";

/** Article du moment : mis en vedette, face et dos au survol. */
const FEATURED = { slug: "sweat-capuche-vcm", color: 1 };

/** Articles en vitrine à côté de la vedette, avec un libellé court. */
const PICKS = [
  { slug: "tee-shirt-personnalisable", color: 0, label: "Tee-shirt floqué" },
  { slug: "sac-a-dos-vcm", color: 0, label: "Sac à dos" },
  { slug: "gourde-sport-vcm", color: 0, label: "Gourde sport" },
];

function Price({ price, compareAt, big = false }: { price: number; compareAt?: number; big?: boolean }) {
  return (
    <span className="flex items-baseline gap-2">
      <span className={`font-display text-white ${big ? "text-4xl" : "text-lg"}`}>{formatPrice(price)}</span>
      {compareAt && <span className={`text-white/50 line-through ${big ? "text-base" : "text-xs"}`}>{formatPrice(compareAt)}</span>}
    </span>
  );
}

/**
 * ShopTeaser — encart boutique de l'accueil : l'offre en cours, l'article du
 * moment en grand (photo face, dos au survol) et trois autres articles.
 */
export default function ShopTeaser() {
  const shopLabel = useNavLabel("boutique", "Boutique");
  const [back, setBack] = useState(false);
  const star = findProduct(FEATURED.slug);
  const starColor = star ? star.colors[FEATURED.color] ?? star.colors[0] : undefined;
  const items = PICKS.map(({ slug, color, label }) => {
    const p = findProduct(slug);
    return p ? { p, label, c: p.colors[color] ?? p.colors[0] } : null;
  }).filter((x): x is NonNullable<typeof x> => x !== null);

  return (
    <section aria-labelledby="shop-teaser-titre" className="relative isolate overflow-hidden bg-night py-20 sm:py-28">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/3 -z-10 size-[40rem] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(192,38,211,0.4), transparent 65%)" }}
      />

      <div className="mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-12">
        <Reveal>
          <BlackFridayBanner href="/boutique" className="mb-12" />
        </Reveal>

        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
          {/* Texte */}
          <div>
            <Reveal>
              <div className="mb-5 flex items-center gap-3">
                <span aria-hidden className="h-px w-8 bg-gradient-to-r from-violet-700 to-fuchsia-vcm" />
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-fuchsia-vcm">Boutique officielle</span>
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 id="shop-teaser-titre" className="font-display text-[clamp(2.2rem,5vw,4.2rem)] leading-[0.93] tracking-tight text-white">
                Portez les couleurs du club
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-5 max-w-md text-base leading-relaxed text-white/70">
                Sweats, tee-shirt floqué à votre prénom, sac, gourde et accessoires : la collection officielle du VCM, à
                commander en ligne et à récupérer au gymnase.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-fuchsia-vcm/30 bg-fuchsia-vcm/10 px-4 py-2 text-sm font-medium text-white">
                <CalendarClock className="size-4 text-fuchsia-vcm" aria-hidden />
                Commandes jusqu&apos;au {ORDER_DEADLINE}
              </p>
            </Reveal>

            {/* Les autres articles */}
            <StaggerGroup className="mt-8 grid grid-cols-3 gap-3">
              {items.map(({ p, c, label }) => (
                <StaggerItem key={p.slug}>
                  <Link
                    href={`/boutique/${p.slug}`}
                    className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] outline-none transition-colors hover:border-fuchsia-vcm/40 focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70"
                  >
                    <div className="aspect-square overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={c.photo} alt={`${p.name} · ${c.name}`} loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div className="px-3 py-2.5">
                      <p className="truncate text-xs font-medium text-white/80">{label}</p>
                      <Price price={p.price} compareAt={p.compareAt} />
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerGroup>

            <Reveal delay={0.1}>
              <Link
                href="/boutique"
                className="group mt-8 inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-violet-700 via-magenta to-fuchsia-vcm px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white shadow-xl shadow-magenta/30 outline-none transition-shadow hover:shadow-magenta/50 focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 focus-visible:ring-offset-2 focus-visible:ring-offset-night"
              >
                Voir toute la {shopLabel.toLowerCase()}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            </Reveal>
          </div>

          {/* Article du moment */}
          {star && starColor && (
            <Reveal delay={0.1}>
              <Link
                href={`/boutique/${star.slug}`}
                onMouseEnter={() => setBack(true)}
                onMouseLeave={() => setBack(false)}
                onFocus={() => setBack(true)}
                onBlur={() => setBack(false)}
                className="group relative block overflow-hidden rounded-[2rem] border border-white/10 bg-ink outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70"
              >
                <div className="relative aspect-[4/5] overflow-hidden sm:aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={starColor.photo}
                    alt={`${star.name} · ${starColor.name}, de face`}
                    className={`absolute inset-0 size-full object-cover transition-all duration-700 ${back && starColor.back ? "scale-105 opacity-0" : "opacity-100"}`}
                  />
                  {starColor.back && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={starColor.back}
                      alt=""
                      loading="lazy"
                      className={`absolute inset-0 size-full object-cover transition-all duration-700 ${back ? "opacity-100" : "scale-105 opacity-0"}`}
                    />
                  )}
                  <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.15em] text-encre">
                    <Sparkles className="size-3.5 text-fuchsia-vcm" aria-hidden />
                    Article du moment
                  </span>
                  {star.compareAt && (
                    <span className="absolute right-5 top-5 grid size-16 place-items-center rounded-full bg-fuchsia-vcm font-display text-lg text-white shadow-lg shadow-fuchsia-vcm/40">
                      −{Math.round((1 - star.price / star.compareAt) * 100)}%
                    </span>
                  )}
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/85">{star.tagline}</p>
                      <h3 className="mt-1 font-display text-3xl text-white sm:text-4xl">{star.name}</h3>
                      <div className="mt-2">
                        <Price price={star.price} compareAt={star.compareAt} big />
                      </div>
                    </div>
                    <span className="grid size-14 shrink-0 place-items-center rounded-full bg-white text-encre transition-transform group-hover:-translate-y-1 group-hover:translate-x-1">
                      <ArrowUpRight className="size-6" aria-hidden />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
