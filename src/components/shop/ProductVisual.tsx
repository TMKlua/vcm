"use client";

import ProductArt from "./ProductArt";
import { colorByName, findProduct, type Product, type ProductColor } from "@/data/shop";

/**
 * Visuel d'un article.
 *
 * Photo de la couleur choisie (maquettes réalistes générées par
 * scripts/boutique/mockups.mjs, à remplacer par les vraies photos du club).
 * Vue de dos : photo de dos + flocage incrusté en direct, ou, faute de photo
 * de dos, un aperçu du marquage sur l'étoffe de la couleur. Les packs sont un
 * montage des photos de leurs articles. Sans photo du tout, on retombe sur la
 * maquette vectorielle.
 */

/** Zone d'impression du dos, en fraction de la photo (centre et taille du numéro). */
const BACK_PRINT: Partial<Record<Product["kind"], { x: number; name: number; number: number; size: number }>> = {
  tee: { x: 0.5, name: 0.21, number: 0.27, size: 0.18 },
  tank: { x: 0.5, name: 0.22, number: 0.38, size: 0.17 },
};

const display = { fontFamily: "var(--font-display)" };

function Flocage({
  name,
  number,
  ink,
  spot,
  dark,
}: {
  name?: string;
  number?: string;
  ink: string;
  spot: { x: number; name: number; number: number; size: number };
  dark: boolean;
}) {
  // Encre foncée sur tissu clair : multiplication, elle prend le grain du
  // tissu. Encre claire sur tissu foncé : légèrement transparente.
  const blend: React.CSSProperties = dark ? { opacity: 0.92 } : { mixBlendMode: "multiply", opacity: 0.9 };
  return (
    <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 size-full" aria-hidden style={blend}>
      {name ? (
        <text x={spot.x * 100} y={spot.name * 100} textAnchor="middle" fontSize={spot.size * 28} letterSpacing={0.8} fill={ink} style={display}>
          {name.toUpperCase()}
        </text>
      ) : null}
      <text x={spot.x * 100} y={spot.number * 100 + spot.size * 70} textAnchor="middle" fontSize={spot.size * 100} fill={ink} style={display}>
        {number || "92"}
      </text>
    </svg>
  );
}

function isDark(hex: string): boolean {
  const n = parseInt(hex.slice(1), 16);
  const l = 0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
  return l < 140;
}

export default function ProductVisual({
  product,
  color,
  view = "front",
  flocage,
  className,
  shadow,
  hover = false,
}: {
  product: Product;
  color: ProductColor;
  view?: "front" | "back";
  flocage?: { name?: string; number?: string };
  className?: string;
  shadow?: boolean;
  /** Carte de catalogue : la seconde photo apparaît au survol du groupe. */
  hover?: boolean;
}) {
  /* Pack : montage des photos des articles */
  if (product.kind === "pack" && product.items?.length) {
    const shots = product.items
      .map((it) => {
        const p = findProduct(it.slug);
        return p ? colorByName(p, it.color).photo : undefined;
      })
      .filter((s): s is string => Boolean(s));
    if (shots.length >= 3) {
      return (
        <div className={`grid grid-cols-2 grid-rows-2 gap-1 overflow-hidden ${className ?? ""}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={shots[0]} alt="" loading="lazy" className="row-span-2 size-full object-cover" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={shots[1]} alt="" loading="lazy" className="size-full object-cover" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={shots[2]} alt="" loading="lazy" className="size-full object-cover" />
        </div>
      );
    }
  }

  if (!color.photo) {
    return (
      <ProductArt
        kind={product.kind}
        color={color.hex}
        accent={color.accent}
        ink={color.ink}
        view={view}
        flocage={flocage}
        className={className}
        shadow={shadow}
      />
    );
  }

  /* Dos */
  if (view === "back") {
    const spot = BACK_PRINT[product.kind] ?? { x: 0.5, name: 0.3, number: 0.45, size: 0.22 };
    if (color.back) {
      return (
        <div className={`relative overflow-hidden ${className ?? ""}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={color.back} alt="" className="size-full object-cover" />
          {product.personalization && <Flocage name={flocage?.name} number={flocage?.number} ink={color.ink} spot={spot} dark={isDark(color.hex)} />}
        </div>
      );
    }
    // Pas de photo de dos : aperçu du marquage sur l'étoffe.
    return (
      <div
        className={`relative overflow-hidden ${className ?? ""}`}
        style={{
          backgroundColor: color.hex,
          backgroundImage:
            "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.18), transparent 55%), radial-gradient(circle at 80% 90%, rgba(0,0,0,0.35), transparent 60%), url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.18'/%3E%3C/svg%3E\")",
        }}
      >
        <Flocage name={flocage?.name} number={flocage?.number} ink={color.ink} spot={spot} dark={isDark(color.hex)} />
        <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/30 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
          Aperçu du marquage au dos
        </span>
      </div>
    );
  }

  /* Face (+ seconde photo au survol) */
  const second = hover ? (color.alt ?? color.back) : undefined;
  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={color.photo} alt="" loading="lazy" className="size-full object-cover" />
      {second && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={second}
          alt=""
          loading="lazy"
          className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      )}
    </div>
  );
}
