"use client";

import { useId } from "react";

import { useContent } from "@/content/ContentContext";
import type { ProductKind } from "@/data/shop";

/* ──────────────────────────────────────────────────────────────────────────
 * ProductArt — maquettes vectorielles des articles de la boutique.
 *
 * En attendant les vraies photos produits, chaque article est dessiné en SVG :
 * la couleur choisie par le visiteur repeint le vêtement en direct, et le logo
 * du club (`club.logo`, celui de /admin) est posé dessus comme un écusson.
 * Le flocage (nom + numéro) s'affiche au dos des hauts quand `view="back"`.
 *
 * Tout tient dans un viewBox 400 × 400 : les cartes, la fiche produit et les
 * packs réutilisent le même dessin à n'importe quelle taille.
 * ────────────────────────────────────────────────────────────────────────── */

export interface ProductArtProps {
  kind: ProductKind;
  /** Couleur principale de l'article. */
  color: string;
  /** Couleur d'accent : bandes, coutures, flocage. */
  accent?: string;
  /** Couleur de l'encre sur l'article (textes, flocage). */
  ink?: string;
  view?: "front" | "back";
  flocage?: { name?: string; number?: string };
  /** Pour les packs : les articles à composer. */
  items?: { kind: ProductKind; color: string; accent?: string }[];
  className?: string;
  /** Ombre portée au sol. */
  shadow?: boolean;
}

/* ── Couleur : assombrir / éclaircir un hex ─────────────────────────────── */

function shade(hex: string, amount: number): string {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/(.)/g, "$1$1") : h, 16);
  const mix = (c: number) =>
    Math.round(amount < 0 ? c * (1 + amount) : c + (255 - c) * amount);
  const r = mix((n >> 16) & 255);
  const g = mix((n >> 8) & 255);
  const b = mix(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

/* ── Écusson : le logo du club dans un disque blanc ─────────────────────── */

function Badge({
  cx,
  cy,
  r,
  uid,
  logo,
  ring = "#ffffff",
}: {
  cx: number;
  cy: number;
  r: number;
  uid: string;
  logo: string;
  ring?: string;
}) {
  const clip = `${uid}-badge-${cx}-${cy}`;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 2} fill={ring} opacity={0.95} />
      <clipPath id={clip}>
        <circle cx={cx} cy={cy} r={r} />
      </clipPath>
      {logo ? (
        <image
          href={logo}
          // Le fichier du logo a une marge blanche : on zoome pour remplir l'écusson.
          x={cx - r * 1.12}
          y={cy - r * 1.12}
          width={r * 2.24}
          height={r * 2.24}
          clipPath={`url(#${clip})`}
          preserveAspectRatio="xMidYMid slice"
        />
      ) : (
        <g clipPath={`url(#${clip})`}>
          <circle cx={cx} cy={cy} r={r} fill="#7c3aed" />
          <text
            x={cx}
            y={cy + r * 0.28}
            textAnchor="middle"
            fontSize={r * 0.8}
            fill="#fff"
            style={{ fontFamily: "var(--font-display)" }}
          >
            VCM
          </text>
        </g>
      )}
    </g>
  );
}

/* ── Définitions communes : volume, reflets, ombre ──────────────────────── */

function Defs({ uid }: { uid: string }) {
  return (
    <defs>
      {/* Volume : lumière en haut à gauche, ombre en bas à droite. */}
      <linearGradient id={`${uid}-vol`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
        <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.28" />
      </linearGradient>
      {/* Reflet vertical (mug, gourde) */}
      <linearGradient id={`${uid}-gloss`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#000" stopOpacity="0.25" />
        <stop offset="0.25" stopColor="#fff" stopOpacity="0.35" />
        <stop offset="0.4" stopColor="#fff" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.3" />
      </linearGradient>
      <radialGradient id={`${uid}-floor`}>
        <stop offset="0" stopColor="#000" stopOpacity="0.55" />
        <stop offset="1" stopColor="#000" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

/** Peint une silhouette : couleur + volume + contour. */
function Body({
  d,
  color,
  uid,
  stroke,
}: {
  d: string;
  color: string;
  uid: string;
  stroke?: string;
}) {
  return (
    <>
      <path d={d} fill={color} />
      <path d={d} fill={`url(#${uid}-vol)`} />
      <path
        d={d}
        fill="none"
        stroke={stroke ?? shade(color, -0.35)}
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </>
  );
}

/* ── Flocage au dos ─────────────────────────────────────────────────────── */

function Flocage({
  name,
  number,
  ink,
  y = 150,
}: {
  name?: string;
  number?: string;
  ink: string;
  y?: number;
}) {
  const display = { fontFamily: "var(--font-display)" };
  return (
    <g>
      {name ? (
        <text
          x={200}
          y={y}
          textAnchor="middle"
          fontSize={name.length > 9 ? 22 : 28}
          letterSpacing={2}
          fill={ink}
          style={display}
        >
          {name.toUpperCase()}
        </text>
      ) : null}
      <text
        x={200}
        y={y + 115}
        textAnchor="middle"
        fontSize={118}
        fill={ink}
        style={display}
      >
        {number || "92"}
      </text>
    </g>
  );
}

/* ── Les articles ───────────────────────────────────────────────────────── */

type ArtCtx = {
  uid: string;
  color: string;
  accent: string;
  ink: string;
  logo: string;
  view: "front" | "back";
  flocage?: { name?: string; number?: string };
};

const TEE =
  "M142 70 Q200 98 258 70 L330 98 L372 168 L322 196 L300 166 L300 346 Q200 362 100 346 L100 166 L78 196 L28 168 L70 98 Z";

function Tee({ uid, color, accent, ink, logo, view, flocage }: ArtCtx) {
  return (
    <g>
      <Body d={TEE} color={color} uid={uid} />
      {/* bords de manches */}
      <path d="M322 196 L372 168" stroke={accent} strokeWidth={6} />
      <path d="M78 196 L28 168" stroke={accent} strokeWidth={6} />
      {/* col */}
      <path
        d={view === "front" ? "M150 74 Q200 116 250 74" : "M152 72 Q200 88 248 72"}
        fill="none"
        stroke={shade(color, -0.3)}
        strokeWidth={9}
        strokeLinecap="round"
      />
      <path d="M152 74 Q200 112 248 74" fill="none" stroke={accent} strokeWidth={view === "front" ? 2.5 : 0} />
      {/* plis */}
      <path d="M130 250 Q150 300 128 340" stroke={shade(color, -0.2)} strokeWidth={2} fill="none" opacity={0.5} />
      <path d="M280 220 Q262 280 278 338" stroke={shade(color, -0.2)} strokeWidth={2} fill="none" opacity={0.5} />
      {view === "front" ? (
        <>
          <Badge cx={200} cy={190} r={52} uid={uid} logo={logo} />
          <text x={200} y={278} textAnchor="middle" fontSize={17} letterSpacing={2} fill={ink} style={{ fontFamily: "var(--font-display)" }}>
            MARSEILLAN · 1992
          </text>
        </>
      ) : (
        <Flocage name={flocage?.name} number={flocage?.number} ink={ink} />
      )}
    </g>
  );
}

const TANK =
  "M148 60 L172 60 Q200 112 228 60 L252 60 Q256 122 292 152 L296 346 Q200 362 104 346 L108 152 Q144 122 148 60 Z";

function Tank({ uid, color, accent, ink, logo, view, flocage }: ArtCtx) {
  return (
    <g>
      <Body d={TANK} color={color} uid={uid} />
      <path d="M172 60 Q200 112 228 60" fill="none" stroke={accent} strokeWidth={5} />
      <path d="M148 60 Q144 122 108 152" fill="none" stroke={accent} strokeWidth={5} />
      <path d="M252 60 Q256 122 292 152" fill="none" stroke={accent} strokeWidth={5} />
      {view === "front" ? (
        <>
          <Badge cx={200} cy={200} r={46} uid={uid} logo={logo} />
          <text x={200} y={290} textAnchor="middle" fontSize={26} letterSpacing={3} fill={ink} style={{ fontFamily: "var(--font-display)" }}>
            BEACH VCM
          </text>
        </>
      ) : (
        <Flocage name={flocage?.name} number={flocage?.number} ink={ink} y={170} />
      )}
    </g>
  );
}

const HOODIE =
  "M136 82 Q200 64 264 82 L322 106 Q350 120 356 160 L372 300 L332 308 L312 192 L304 192 L304 350 Q200 364 96 350 L96 192 L88 192 L68 308 L28 300 L44 160 Q50 120 78 106 Z";

function Hoodie({ uid, color, accent, ink, logo, view, flocage }: ArtCtx) {
  const dark = shade(color, -0.25);
  return (
    <g>
      {/* capuche (derrière) */}
      <path d="M138 90 Q146 28 200 26 Q254 28 262 90 Q232 116 200 118 Q168 116 138 90 Z" fill={dark} />
      <Body d={HOODIE} color={color} uid={uid} />
      {view === "front" ? (
        <>
          <path d="M156 88 Q200 132 244 88 Q238 52 200 50 Q162 52 156 88 Z" fill={shade(color, -0.5)} />
          <path d="M150 86 Q200 124 250 86" fill="none" stroke={dark} strokeWidth={8} />
          {/* cordons */}
          <path d="M186 108 L182 170" stroke={accent} strokeWidth={4} strokeLinecap="round" />
          <path d="M214 108 L218 170" stroke={accent} strokeWidth={4} strokeLinecap="round" />
          {/* poche kangourou */}
          <path d="M138 262 L262 262 L284 332 L116 332 Z" fill={shade(color, -0.08)} stroke={dark} strokeWidth={2} />
          <Badge cx={200} cy={196} r={44} uid={uid} logo={logo} />
        </>
      ) : (
        <>
          <path d="M150 86 Q200 100 250 86" fill="none" stroke={dark} strokeWidth={8} />
          <Flocage name={flocage?.name} number={flocage?.number} ink={ink} y={160} />
        </>
      )}
      {/* poignets + ceinture */}
      <path d="M332 308 L372 300 L374 318 L334 326 Z" fill={accent} />
      <path d="M28 300 L68 308 L66 326 L26 318 Z" fill={accent} />
      <path d="M96 336 Q200 350 304 336 L304 352 Q200 366 96 352 Z" fill={dark} />
    </g>
  );
}

function Jacket({ uid, color, accent, ink, logo, view, flocage }: ArtCtx) {
  const dark = shade(color, -0.3);
  return (
    <g>
      <Body d={HOODIE} color={color} uid={uid} />
      {/* col montant */}
      <path d="M148 84 L156 50 L244 50 L252 84 Q200 98 148 84 Z" fill={dark} />
      <path d="M156 50 L244 50" stroke={accent} strokeWidth={3} />
      {/* bandes d'épaules */}
      <path d="M264 84 L322 108 Q350 122 356 162 L372 300" fill="none" stroke={accent} strokeWidth={7} />
      <path d="M136 84 L78 108 Q50 122 44 162 L28 300" fill="none" stroke={accent} strokeWidth={7} />
      {view === "front" ? (
        <>
          {/* zip */}
          <path d="M200 92 L200 352" stroke={shade(color, -0.55)} strokeWidth={4} />
          <path d="M200 92 L200 352" stroke="#d9d9e3" strokeWidth={1.5} strokeDasharray="2 3" />
          <rect x={195} y={110} width={10} height={20} rx={3} fill="#d9d9e3" />
          {/* poches */}
          <path d="M120 270 L160 300" stroke={dark} strokeWidth={3} />
          <path d="M280 270 L240 300" stroke={dark} strokeWidth={3} />
          <Badge cx={252} cy={150} r={24} uid={uid} logo={logo} />
          <text x={140} y={158} textAnchor="middle" fontSize={20} fill={ink} style={{ fontFamily: "var(--font-display)" }}>
            VCM
          </text>
        </>
      ) : (
        <Flocage name={flocage?.name} number={flocage?.number} ink={ink} y={150} />
      )}
      <path d="M96 336 Q200 350 304 336 L304 352 Q200 366 96 352 Z" fill={dark} />
    </g>
  );
}

function Shorts({ uid, color, accent, logo }: ArtCtx) {
  const d = "M108 110 L292 110 L314 318 L214 330 L200 206 L186 330 L86 318 Z";
  return (
    <g>
      <Body d={d} color={color} uid={uid} />
      <path d="M108 110 L292 110 L294 136 L106 136 Z" fill={shade(color, -0.3)} />
      <path d="M150 120 L150 160 M250 120 L250 160" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" opacity={0.8} />
      <path d="M102 150 L88 318" stroke={accent} strokeWidth={9} />
      <path d="M298 150 L312 318" stroke={accent} strokeWidth={9} />
      <Badge cx={150} cy={280} r={22} uid={uid} logo={logo} />
    </g>
  );
}

function Socks({ uid, color, accent, logo }: ArtCtx) {
  const sock = "M150 50 L222 50 L224 232 Q228 286 282 298 Q326 308 322 344 Q318 372 280 372 L184 372 Q146 368 148 326 Z";
  return (
    <g>
      <g transform="translate(46 -8) rotate(6 200 200)" opacity={0.85}>
        <Body d={sock} color={shade(color, -0.12)} uid={uid} />
      </g>
      <Body d={sock} color={color} uid={uid} />
      <path d="M150 64 L222 64 M150 82 L222 82" stroke={accent} strokeWidth={8} />
      <path d="M148 320 Q160 372 196 372" fill="none" stroke={shade(color, -0.3)} strokeWidth={14} opacity={0.5} />
      <Badge cx={186} cy={150} r={24} uid={uid} logo={logo} />
    </g>
  );
}

function Cap({ uid, color, accent, logo }: ArtCtx) {
  return (
    <g>
      <path d="M90 236 Q200 262 330 228 Q372 242 362 266 Q232 296 88 268 Q74 250 90 236 Z" fill={shade(color, -0.25)} />
      <path d="M90 236 Q200 262 330 228" fill="none" stroke={accent} strokeWidth={3} />
      <Body d="M108 236 Q104 118 208 112 Q312 118 306 232 Q200 256 108 236 Z" color={color} uid={uid} />
      <path d="M208 112 Q196 170 200 246 M208 112 Q260 150 268 240 M208 112 Q150 150 146 242" fill="none" stroke={shade(color, -0.2)} strokeWidth={1.5} />
      <circle cx={208} cy={114} r={7} fill={accent} />
      <Badge cx={204} cy={184} r={38} uid={uid} logo={logo} />
    </g>
  );
}

function Bob({ uid, color, accent, logo }: ArtCtx) {
  return (
    <g>
      <Body d="M66 254 Q204 206 338 254 Q352 296 204 306 Q56 296 66 254 Z" color={shade(color, -0.12)} uid={uid} />
      <Body d="M128 240 L148 128 Q204 106 260 128 L280 240 Q204 258 128 240 Z" color={color} uid={uid} />
      <path d="M134 214 Q204 232 274 214" fill="none" stroke={accent} strokeWidth={10} />
      <path d="M90 270 Q204 300 320 270" fill="none" stroke={shade(color, -0.3)} strokeWidth={1.5} strokeDasharray="5 5" />
      <Badge cx={204} cy={170} r={32} uid={uid} logo={logo} />
    </g>
  );
}

function Mug({ uid, color, accent, logo }: ArtCtx) {
  return (
    <g>
      <path d="M278 160 Q346 158 346 222 Q346 288 278 288" fill="none" stroke={shade(color, -0.15)} strokeWidth={24} strokeLinecap="round" />
      <path d="M120 110 L280 110 L280 322 Q280 344 258 344 L142 344 Q120 344 120 322 Z" fill={color} />
      <path d="M120 110 L280 110 L280 322 Q280 344 258 344 L142 344 Q120 344 120 322 Z" fill={`url(#${uid}-gloss)`} />
      <ellipse cx={200} cy={110} rx={80} ry={15} fill={shade(color, -0.2)} />
      <ellipse cx={200} cy={112} rx={70} ry={10} fill={accent} />
      <path d="M120 300 L280 300" stroke={accent} strokeWidth={6} />
      <Badge cx={196} cy={208} r={56} uid={uid} logo={logo} />
    </g>
  );
}

function Bottle({ uid, color, accent, logo }: ArtCtx) {
  const d = "M176 70 L224 70 L224 102 Q262 116 262 156 L262 340 Q262 362 240 362 L160 362 Q138 362 138 340 L138 156 Q138 116 176 102 Z";
  return (
    <g>
      <rect x={168} y={36} width={64} height={40} rx={10} fill={accent} />
      <path d="M232 46 Q262 46 262 64 Q262 80 232 78" fill="none" stroke={accent} strokeWidth={6} />
      <path d={d} fill={color} />
      <path d={d} fill={`url(#${uid}-gloss)`} />
      <Badge cx={200} cy={236} r={46} uid={uid} logo={logo} />
      <text x={200} y={320} textAnchor="middle" fontSize={16} letterSpacing={3} fill="#fff" opacity={0.85} style={{ fontFamily: "var(--font-display)" }}>
        HYDRATE · SMASH
      </text>
    </g>
  );
}

function Tote({ uid, color, ink, logo }: ArtCtx) {
  return (
    <g>
      <path d="M148 156 Q148 56 200 56 Q252 56 252 156" fill="none" stroke={shade(color, -0.25)} strokeWidth={13} />
      <Body d="M98 150 L302 150 L318 362 L82 362 Z" color={color} uid={uid} />
      <Badge cx={200} cy={240} r={62} uid={uid} logo={logo} />
      <text x={200} y={336} textAnchor="middle" fontSize={17} letterSpacing={3} fill={ink} style={{ fontFamily: "var(--font-display)" }}>
        ÉTANG DE THAU
      </text>
    </g>
  );
}

function Towel({ uid, color, accent, logo }: ArtCtx) {
  return (
    <g transform="rotate(-6 200 200)">
      <Body d="M96 58 L304 58 L304 342 L96 342 Z" color={color} uid={uid} />
      {[86, 106, 302, 322].map((y) => (
        <rect key={y} x={96} y={y - 8} width={208} height={10} fill={accent} />
      ))}
      {Array.from({ length: 18 }, (_, i) => (
        <path key={i} d={`M${102 + i * 11.4} 342 L${102 + i * 11.4} 360`} stroke={shade(color, -0.2)} strokeWidth={3} />
      ))}
      <Badge cx={200} cy={200} r={60} uid={uid} logo={logo} />
    </g>
  );
}

function Keychain({ uid, color, accent, logo }: ArtCtx) {
  return (
    <g>
      <circle cx={200} cy={78} r={34} fill="none" stroke="#c9c9d6" strokeWidth={7} />
      <path d="M200 112 L200 146" stroke="#c9c9d6" strokeWidth={6} strokeDasharray="8 4" />
      <circle cx={200} cy={240} r={98} fill={color} />
      <circle cx={200} cy={240} r={98} fill={`url(#${uid}-vol)`} />
      <circle cx={200} cy={240} r={92} fill="none" stroke={accent} strokeWidth={3} />
      <Badge cx={200} cy={240} r={78} uid={uid} logo={logo} />
    </g>
  );
}

function Stickers({ uid, color, accent, logo }: ArtCtx) {
  return (
    <g>
      <g transform="rotate(-12 140 260)">
        <rect x={70} y={210} width={150} height={100} rx={22} fill="#fff" />
        <rect x={78} y={218} width={134} height={84} rx={16} fill={accent} />
        <text x={145} y={274} textAnchor="middle" fontSize={34} fill="#fff" style={{ fontFamily: "var(--font-display)" }}>ALLEZ!</text>
      </g>
      <g transform="rotate(10 280 270)">
        <circle cx={280} cy={270} r={62} fill="#fff" />
        <circle cx={280} cy={270} r={55} fill={color} />
        <text x={280} y={286} textAnchor="middle" fontSize={44} fill="#fff" style={{ fontFamily: "var(--font-display)" }}>VCM</text>
      </g>
      <Badge cx={190} cy={150} r={80} uid={uid} logo={logo} />
    </g>
  );
}

function Scarf({ uid, color, accent }: ArtCtx) {
  return (
    <g transform="rotate(-8 200 200)">
      <Body d="M24 160 L376 160 L376 240 L24 240 Z" color={color} uid={uid} />
      <rect x={24} y={168} width={352} height={6} fill={accent} />
      <rect x={24} y={226} width={352} height={6} fill={accent} />
      <text x={200} y={216} textAnchor="middle" fontSize={34} letterSpacing={2} fill="#fff" style={{ fontFamily: "var(--font-display)" }}>
        ALLEZ LE VCM
      </text>
      {Array.from({ length: 9 }, (_, i) => (
        <g key={i}>
          <path d={`M16 ${164 + i * 9} L24 ${164 + i * 9}`} stroke={accent} strokeWidth={3} />
          <path d={`M376 ${164 + i * 9} L386 ${164 + i * 9}`} stroke={accent} strokeWidth={3} />
        </g>
      ))}
    </g>
  );
}

function Ball({ uid, color, accent }: ArtCtx) {
  return (
    <g>
      <circle cx={200} cy={200} r={140} fill="#f7f4ff" />
      <path d="M200 60 Q120 140 150 330 L200 340 Q170 160 250 70 Z" fill={color} />
      <path d="M340 200 Q250 160 90 250 L72 210 Q250 120 336 160 Z" fill={accent} />
      <path d="M150 330 Q260 300 320 120 L336 160 Q290 300 200 340 Z" fill={shade(color, 0.35)} />
      <circle cx={200} cy={200} r={140} fill={`url(#${uid}-vol)`} />
      <circle cx={200} cy={200} r={140} fill="none" stroke={shade(color, -0.4)} strokeWidth={2} />
    </g>
  );
}

function GiftCard({ uid, color, accent, logo }: ArtCtx) {
  return (
    <g transform="rotate(-6 200 200)">
      <rect x={50} y={110} width={300} height={190} rx={20} fill={color} />
      <rect x={50} y={110} width={300} height={190} rx={20} fill={`url(#${uid}-vol)`} />
      <path d="M50 250 Q200 200 350 260 L350 280 Q350 300 330 300 L70 300 Q50 300 50 280 Z" fill={accent} opacity={0.7} />
      <Badge cx={110} cy={170} r={36} uid={uid} logo={logo} />
      <text x={330} y={168} textAnchor="end" fontSize={24} fill="#fff" style={{ fontFamily: "var(--font-display)" }}>
        CARTE CADEAU
      </text>
      <text x={330} y={196} textAnchor="end" fontSize={14} letterSpacing={2} fill="#fff" opacity={0.8}>
        BOUTIQUE VCM
      </text>
    </g>
  );
}

const ARTS: Record<Exclude<ProductKind, "pack">, (ctx: ArtCtx) => React.ReactElement> = {
  tee: Tee,
  tank: Tank,
  hoodie: Hoodie,
  jacket: Jacket,
  shorts: Shorts,
  socks: Socks,
  cap: Cap,
  bob: Bob,
  mug: Mug,
  bottle: Bottle,
  tote: Tote,
  backpack: Tote,
  towel: Towel,
  keychain: Keychain,
  stickers: Stickers,
  scarf: Scarf,
  ball: Ball,
  giftcard: GiftCard,
};

/** Positions des articles d'un pack, du fond vers l'avant. */
const PACK_SLOTS = [
  { x: 10, y: 0, size: 270 },
  { x: 170, y: 120, size: 220 },
  { x: 0, y: 200, size: 190 },
];

export default function ProductArt({
  kind,
  color,
  accent = "#ff4dd2",
  ink = "#ffffff",
  view = "front",
  flocage,
  items,
  className,
  shadow = true,
}: ProductArtProps) {
  const uid = useId().replace(/:/g, "");
  const logo = useContent().content.club.logo?.trim() ?? "";

  if (kind === "pack") {
    return (
      <svg viewBox="0 0 400 400" className={className} role="img" aria-hidden>
        <Defs uid={uid} />
        {shadow && <ellipse cx={200} cy={372} rx={170} ry={18} fill={`url(#${uid}-floor)`} />}
        {(items ?? []).slice(0, 3).map((it, i) => {
          const slot = PACK_SLOTS[i];
          const Art = it.kind === "pack" ? Tee : ARTS[it.kind];
          return (
            <svg key={i} x={slot.x} y={slot.y} width={slot.size} height={slot.size} viewBox="0 0 400 400">
              <Art uid={`${uid}p${i}`} color={it.color} accent={it.accent ?? accent} ink={ink} logo={logo} view="front" />
            </svg>
          );
        })}
        {/* Les sous-dessins partagent les dégradés du parent sous leur propre préfixe. */}
        {(items ?? []).slice(0, 3).map((_, i) => (
          <Defs key={i} uid={`${uid}p${i}`} />
        ))}
      </svg>
    );
  }

  const Art = ARTS[kind];
  return (
    <svg viewBox="0 0 400 400" className={className} role="img" aria-hidden>
      <Defs uid={uid} />
      {shadow && <ellipse cx={200} cy={376} rx={150} ry={16} fill={`url(#${uid}-floor)`} />}
      <Art uid={uid} color={color} accent={accent} ink={ink} logo={logo} view={view} flocage={flocage} />
    </svg>
  );
}
