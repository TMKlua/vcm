"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

import { CHRISTMAS } from "@/data/seasonal";

/* ── Neige en profondeur ────────────────────────────────────────────────── */

/** Flocon pré-dessiné (cœur lumineux, bord estompé), réutilisé à chaque image. */
function flakeSprite(px: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = c.height = Math.max(2, Math.ceil(px * 2));
  const g = c.getContext("2d")!;
  const r = c.width / 2;
  const grad = g.createRadialGradient(r * 0.7, r * 0.7, 0, r, r, r);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.6, "rgba(240,236,255,0.7)");
  grad.addColorStop(1, "rgba(230,224,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, c.width, c.height);
  return c;
}

/**
 * Flocons sur trois plans : loin (petits, lents, pâles), milieu, près (gros,
 * rapides). Le vent suit doucement la souris, plus fort sur les plans proches.
 *
 * Pensé pour les téléphones : flocons pré-dessinés (aucun dégradé recalculé
 * par image), moins de flocons et une résolution plafonnée sur écran tactile,
 * vitesse indexée sur le temps (identique à 60 et 120 Hz), et la barre
 * d'adresse de Safari qui se replie ne relance plus la neige.
 */
function Snow() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const touch = window.matchMedia("(pointer: coarse)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, touch ? 1.5 : 2);
    let w = 0, h = 0, raf = 0, last = 0, wind = 0, windTarget = 0;
    type Flake = { x: number; y: number; z: number; r: number; vy: number; phase: number; a: number; sprite: HTMLCanvasElement };
    let flakes: Flake[] = [];
    // Quelques tailles de flocons, dessinées une fois pour toutes.
    const SIZES = [1, 1.6, 2.4, 3.4, 4.6, 6.2];
    const sprites = SIZES.map((r) => flakeSprite(r * dpr));

    const make = (anywhere: boolean): Flake => {
      const z = Math.random(); // 0 = loin, 1 = près
      const r = (0.7 + z * z * 3.4) * (z > 0.85 ? 1.6 : 1);
      const k = SIZES.findIndex((s) => s >= r);
      return {
        x: Math.random() * w,
        y: anywhere ? Math.random() * h : -12,
        z,
        r: SIZES[k === -1 ? SIZES.length - 1 : k],
        vy: 0.2 + z * 1.1,
        phase: Math.random() * Math.PI * 2,
        a: 0.25 + z * 0.6,
        sprite: sprites[k === -1 ? sprites.length - 1 : k],
      };
    };

    const fit = () => {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const resize = () => {
      const nw = window.innerWidth, nh = window.innerHeight;
      if (nw === w) {
        // Seule la hauteur change (barre d'adresse mobile) : on garde les flocons.
        if (nh !== h) { h = nh; fit(); }
        return;
      }
      w = nw;
      h = nh;
      fit();
      const n = Math.min(touch ? 45 : 110, Math.round((w * h) / (touch ? 16000 : 12000)));
      flakes = Array.from({ length: n }, () => make(true)).sort((a, b) => a.z - b.z);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse") windTarget = (e.clientX / w - 0.5) * 1.6;
    };

    const tick = (t: number) => {
      // Pas de temps en images à 60 Hz, borné après une pause.
      const dt = last ? Math.min(3, (t - last) / 16.67) : 1;
      last = t;
      wind += (windTarget - wind) * 0.02 * dt;
      ctx.clearRect(0, 0, w, h);
      for (const f of flakes) {
        f.phase += (0.008 + f.z * 0.01) * dt;
        f.y += f.vy * dt;
        f.x += (Math.sin(f.phase) * (0.2 + f.z * 0.4) + wind * (0.3 + f.z)) * dt;
        if (f.y > h + 12) Object.assign(f, make(false));
        if (f.x < -12) f.x = w + 12;
        if (f.x > w + 12) f.x = -12;
        ctx.globalAlpha = f.a;
        ctx.drawImage(f.sprite, f.x - f.r, f.y - f.r, f.r * 2, f.r * 2);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      last = 0;
      if (!document.hidden) raf = requestAnimationFrame(tick);
    };

    resize();
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-[45] size-full" />;
}

/* ── Guirlande ──────────────────────────────────────────────────────────── */

const BULBS = ["#ff4dd2", "#ffd166", "#a78bfa", "#ffffff", "#ff5a6e", "#5eead4"];
const BAUBLES = [
  { color: "#7c3aed", light: "#c4b5fd" },
  { color: "#c026d3", light: "#f5a3ff" },
  { color: "#d4a017", light: "#ffe9a3" },
  { color: "#e8e6f0", light: "#ffffff" },
];
const SCALLOPS = 9;
const COUNT = 44;
/** Accroche du fil (px depuis le haut) et profondeur des festons. */
const TOP = 62;
const DIP = 40;

/** Hauteur du fil (0 à 1) à l'abscisse u : festons entre les points d'accroche. */
const sag = (u: number) => Math.sin(Math.PI * ((u * SCALLOPS) % 1));

/** Ampoule en verre : reflet, culot métallique, halo qui scintille. */
function Bulb({ u, color, i, still }: { u: number; color: string; i: number; still: boolean }) {
  return (
    <span
      className="absolute -translate-x-1/2"
      style={{ left: `${u * 100}%`, top: `${2 + sag(u) * DIP}px`, transform: `translateX(-50%) rotate(${(u * SCALLOPS) % 1 < 0.5 ? -12 : 12}deg)` }}
    >
      <span className="block h-1.5 w-2 rounded-sm bg-gradient-to-b from-[#d9d4c7] to-[#7b7566]" />
      <span
        className="vcm-bulb -mt-px block h-3.5 w-2.5 rounded-b-full rounded-t-[40%]"
        style={{
          background: `radial-gradient(circle at 35% 30%, #ffffff 0%, ${color} 38%, ${color} 70%, rgba(0,0,0,0.35) 100%)`,
          boxShadow: `0 0 10px 3px ${color}88`,
          animationDelay: still ? undefined : `${(i % 6) * 0.35}s`,
          animationPlayState: still ? "paused" : undefined,
        }}
      />
    </span>
  );
}

/** Boule de Noël en verre, suspendue à la guirlande, qui se balance. */
function Bauble({ u, i, still, drop }: { u: number; i: number; still: boolean; drop: number }) {
  const b = BAUBLES[i % BAUBLES.length];
  const size = 28 + (i % 2) * 6;
  return (
    <span
      className="vcm-swing absolute flex flex-col items-center"
      style={{
        left: `${u * 100}%`,
        top: `${4 + sag(u) * DIP}px`,
        transform: "translateX(-50%)",
        transformOrigin: "50% 0",
        animationDuration: `${3.2 + (i % 3) * 0.7}s`,
        animationDelay: `${-(i % 5) * 0.6}s`,
        animationPlayState: still ? "paused" : undefined,
      }}
    >
      <span className="block w-px bg-[#b8b0c8]" style={{ height: drop }} />
      <span className="block h-1.5 w-2.5 rounded-sm bg-gradient-to-r from-[#8a8270] via-[#f1ead6] to-[#8a8270]" />
      <span
        className="relative block rounded-full"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle at 32% 28%, ${b.light} 0%, ${b.color} 45%, rgba(10,4,30,0.85) 100%)`,
          boxShadow: `0 8px 14px -4px rgba(0,0,0,0.5), inset -3px -4px 8px rgba(0,0,0,0.35)`,
        }}
      >
        {/* Reflet de fenêtre sur le verre */}
        <span className="absolute left-[22%] top-[18%] h-[22%] w-[16%] rotate-[-30deg] rounded-full bg-white/80 blur-[0.5px]" />
        {/* Bande décorative */}
        <span className="absolute inset-x-0 top-1/2 h-[14%] -translate-y-1/2 bg-white/25" />
      </span>
    </span>
  );
}

/** Guirlande lumineuse sur toute la largeur, accrochée derrière la barre de navigation : les festons pendent dessous. */
function Garland({ still }: { still: boolean }) {
  // Fil sur toute la largeur ; son haut passe derrière la barre de navigation.
  const wire = Array.from({ length: 181 }, (_, i) => i / 180)
    .map((u) => `${(u * 1000).toFixed(1)},${(4 + sag(u) * DIP).toFixed(1)}`)
    .join(" ");
  // Boules sur les deux bords de l'écran : la barre de navigation occupe
  // tout le reste de la largeur.
  const baubles = [
    { u: 0.011, drop: 34 },
    { u: 0.989, drop: 40 },
  ];

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 z-30 h-40" style={{ top: TOP }}>
      <svg viewBox={`0 0 1000 ${DIP + 8}`} preserveAspectRatio="none" className="absolute inset-x-0 top-0 w-full" style={{ height: DIP + 8 }}>
        <polyline points={wire} fill="none" stroke="#2c2340" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        <polyline points={wire} fill="none" stroke="#6b5f86" strokeWidth="0.8" vectorEffect="non-scaling-stroke" transform="translate(0 -0.6)" />
      </svg>
      {baubles.map(({ u, drop }, k) => (
        <Bauble key={`b${k}`} u={u} drop={drop} i={k} still={still} />
      ))}
      {Array.from({ length: COUNT }, (_, i) => (
        <Bulb key={i} u={(i + 0.5) / COUNT} color={BULBS[i % BULBS.length]} i={i} still={still} />
      ))}
    </div>
  );
}

/**
 * ChristmasTheme — habillage de Noël posé par-dessus le site (neige en
 * profondeur, guirlande, boules). Rien n'est rendu côté serveur, pour ne
 * pas décaler l'hydratation ; rien du tout si `CHRISTMAS` est désactivé.
 */
export default function ChristmasTheme() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- montage client uniquement
  useEffect(() => setMounted(true), []);
  if (!CHRISTMAS || !mounted) return null;
  return (
    <>
      <Garland still={Boolean(reduce)} />
      {!reduce && <Snow />}
    </>
  );
}

/**
 * Bonnet de Noël en volume posé de biais sur le logo rond (parent
 * `relative`, logo de `size` px). Le bonnet est fixe : son bord en fourrure
 * épouse l'arc du cercle du logo et y projette son ombre. Seule la pointe,
 * avec le pompon, se balance en pivotant au pli.
 */
export function SantaHat({ size = 64 }: { size?: number }) {
  // Animation native du SVG (centre de rotation en coordonnées du dessin),
  // coupée si l'utilisateur a demandé moins de mouvement.
  const still = Boolean(useReducedMotion());
  if (!CHRISTMAS) return null;
  // Repère : centre du logo en (0, 0), rayon 32 (bord du disque blanc).
  // Le dessin reste sous y = -44, pour ne jamais sortir par le haut de l'écran.
  const R = 32;
  const a1 = (-168 * Math.PI) / 180, a2 = (-38 * Math.PI) / 180;
  const at = (a: number, r: number) => [r * Math.cos(a), r * Math.sin(a)].map((v) => v.toFixed(2)).join(" ");
  const brim = `M ${at(a1, R + 1)} A ${R + 1} ${R + 1} 0 0 1 ${at(a2, R + 1)}`;
  const fluff = Array.from({ length: 10 }, (_, i) => a1 + ((a2 - a1) * i) / 9);
  const k = size / 64;
  return (
    <svg
      aria-hidden
      viewBox="-52 -70 130 110"
      className="pointer-events-none absolute overflow-visible"
      style={{ left: -20 * k, top: -38 * k, width: 130 * k, height: 110 * k }}
    >
      <defs>
        <radialGradient id="hat-velvet" cx="30%" cy="25%" r="85%">
          <stop offset="0" stopColor="#ff6b78" />
          <stop offset="0.45" stopColor="#d62839" />
          <stop offset="1" stopColor="#6e0c18" />
        </radialGradient>
        <linearGradient id="hat-tip" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e23446" />
          <stop offset="1" stopColor="#7a0f1c" />
        </linearGradient>
        <linearGradient id="hat-fur" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.6" stopColor="#f0edf6" />
          <stop offset="1" stopColor="#bdb6cc" />
        </linearGradient>
        <radialGradient id="hat-pompom" cx="35%" cy="30%" r="70%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.6" stopColor="#eeeaf5" />
          <stop offset="1" stopColor="#aaa2bd" />
        </radialGradient>
        <clipPath id="hat-logo"><circle cx="0" cy="0" r={R} /></clipPath>
        {/* Zones de filtre fixes (unités du dessin) : une zone relative à la
            boîte du dessin rognait la pointe quand elle se balançait. */}
        <filter id="hat-soft" filterUnits="userSpaceOnUse" x="-60" y="-80" width="150" height="130"><feGaussianBlur stdDeviation="2.4" /></filter>
        <filter id="hat-drop" filterUnits="userSpaceOnUse" x="-60" y="-80" width="150" height="130">
          <feDropShadow dx="0.8" dy="2.2" stdDeviation="1.6" floodColor="#000" floodOpacity="0.45" />
        </filter>
      </defs>

      {/* Ombre du bonnet sur le logo */}
      <g clipPath="url(#hat-logo)">
        <path d={brim} fill="none" stroke="#1a0b3a" strokeOpacity="0.45" strokeWidth="12" filter="url(#hat-soft)" transform="translate(1.5 5)" />
      </g>

      {/* Pointe qui retombe sur le côté, avec le pompon : seule partie animée,
          elle pivote au pli (14, -36). Dessinée sous le dôme pour cacher la
          jointure. Pas de filtre sur cette partie (recalculé à chaque image,
          trop coûteux sur mobile) : son ombre est une copie sombre décalée. */}
      <g>
          {!still && (
            <animateTransform attributeName="transform" type="rotate" values="-4 14 -36; 7 14 -36; -4 14 -36" dur="2.2s" repeatCount="indefinite" calcMode="spline" keyTimes="0; 0.5; 1" keySplines="0.45 0 0.55 1; 0.45 0 0.55 1" />
          )}
          {/* Base large, glissée sous le dôme : aucune coupure quand la pointe pivote en (14, -36). */}
          <path d="M -4 -41 C 12 -47, 32 -45, 43 -31 C 46 -26, 47.5 -20, 47 -15 L 40 -13 C 38 -24, 30 -31, 18 -31 C 10 -31, 2 -29, -6 -26 Z" fill="#000" opacity="0.28" transform="translate(0.8 2)" />
          <circle cx="44.8" cy="-8" r="7" fill="#000" opacity="0.25" />
          <path d="M -4 -41 C 12 -47, 32 -45, 43 -31 C 46 -26, 47.5 -20, 47 -15 L 40 -13 C 38 -24, 30 -31, 18 -31 C 10 -31, 2 -29, -6 -26 Z" fill="url(#hat-tip)" />
          <path d="M 18 -42 C 30 -42, 40 -34, 45 -20 C 38 -30, 30 -36, 20 -38 Z" fill="#ffffff" opacity="0.18" />
          {/* Pompon : balancement propre, accroché au bout de la pointe (44, -16) */}
          <g>
            {!still && (
              <animateTransform attributeName="transform" type="rotate" values="-20 44 -16; 22 44 -16; -20 44 -16" dur="1.3s" repeatCount="indefinite" calcMode="spline" keyTimes="0; 0.5; 1" keySplines="0.45 0 0.55 1; 0.45 0 0.55 1" />
            )}
            <circle cx="44" cy="-10" r="7" fill="url(#hat-pompom)" />
            <circle cx="41.5" cy="-13" r="2.2" fill="#ffffff" opacity="0.95" />
          </g>
      </g>
      <g filter="url(#hat-drop)">
        {/* Corps du bonnet, fixe : dôme en velours posé sur le logo */}
        {/* Le bas du dôme suit l'arc du logo (sous la fourrure) : aucun rouge ne dépasse dessous. */}
        <path
          d={`M ${at(a1 + 0.08, R + 2)} C -24 -34, -6 -44, 12 -43 C 20 -42, 26 -34, ${at(a2 - 0.04, R + 2)} A ${R + 2} ${R + 2} 0 0 0 ${at(a1 + 0.08, R + 2)} Z`}
          fill="url(#hat-velvet)"
        />
        <path d="M -20 -26 C -12 -36, 0 -41, 10 -40 C 0 -38, -10 -32, -16 -22 Z" fill="#ffffff" opacity="0.22" />
        {/* Bord en fourrure, collé à l'arc du logo */}
        <path d={brim} fill="none" stroke="url(#hat-fur)" strokeWidth="11" strokeLinecap="round" />
        {fluff.map((a, i) => {
          const r = R + 1 + (i % 2 ? 3.5 : -3);
          return <circle key={i} cx={(r * Math.cos(a)).toFixed(2)} cy={(r * Math.sin(a)).toFixed(2)} r="2.4" fill="#ffffff" opacity="0.9" />;
        })}
      </g>
    </svg>
  );
}
