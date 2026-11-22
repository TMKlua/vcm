/* ──────────────────────────────────────────────────────────────────────────
 * Photos produits « studio » de la boutique.
 *
 * Reproduit les articles du catalogue envoyé par le club (PDF « Boutique
 * officielle ») sur de vraies photos d'articles vierges (licence Unsplash) :
 *   1. isole l'article (détourage rembg, dossier `masks/`) ;
 *   2. le recolore dans le coloris du catalogue en gardant ombres et plis ;
 *   3. imprime le logo du VCM et les textes du club dessus : déformés par
 *      les plis, éclairés par la photo, cintrés sur la gourde ;
 *   4. recadre au carré et exporte en WebP dans public/images/boutique/.
 *
 * Usage :
 *   node scripts/boutique/studio.mjs <dossier des photos> <logo.png> [--download]
 * Le dossier contient <nom>.jpg pour chaque entrée de SOURCES,
 * masks/<nom>.png (masques rembg birefnet-general, `only_mask=True`) et
 * text/<marquage>.png : les textes du club rendus en PNG transparent avec
 * leur vraie police (Impact, Arial), la version de sharp utilisée ici ne
 * chargeant pas les fichiers de police.
 * ────────────────────────────────────────────────────────────────────────── */

import { execFileSync } from "node:child_process";
import { mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const [, , SRC_DIR = "./boutique-src", LOGO = "./logo.png", ...flags] = process.argv;
const OUT = path.resolve("public/images/boutique");
/** Côté des photos exportées : net sur écran Retina à la taille de la fiche produit. */
const SIZE = 1400;
/**
 * Les sources sont téléchargées en 3200 px de large, deux fois la base
 * (1600 px) dans laquelle les positions ci-dessous ont été relevées.
 */
const K = 2;

/** Photos Unsplash utilisées (licence Unsplash : usage commercial libre). */
export const SOURCES = {
  tee_dos: "r39LjPOTBFg", // tee-shirt noir uni porté, de dos, fond blanc
  tee_porte: "SeeiNC9snZg", // tee-shirt noir uni porté (fond remplacé par le studio)
  sweat: "ssjtw8mOJd0", // sweat à capuche violet porté, fond clair
  sweat_dos: "XN6M-7brjEg", // sweat à capuche kaki porté, de dos (recadré, fond remplacé)
  sac: "K6Ea5LNOdbg", // sac à dos noir, studio
  gourde_sport: "5juxThkBbZM", // gourde sport à bouchon clapet (turquoise, passée en blanc)
  tote: "1574365569389-a10d488ca3fb", // tote bag en coton naturel (identifiant CDN)
};

if (flags.includes("--download")) {
  mkdirSync(SRC_DIR, { recursive: true });
  for (const [name, id] of Object.entries(SOURCES)) {
    // La gourde a été relevée sur une photo de 1200 px, le dos du sweat sur
    // la photo originale recadrée (voir plus bas) : chacun garde sa base.
    const w = name === "gourde_sport" ? 2400 : 3200;
    const url = /^\d/.test(id)
      ? `https://images.unsplash.com/photo-${id}?w=${w}&q=90&fm=jpg`
      : `https://unsplash.com/photos/${id}/download${name === "sweat_dos" ? "" : `?w=${w}`}`;
    execFileSync("curl", ["-sL", "-o", path.join(SRC_DIR, `${name}.jpg`), url]);
    // Dos du sweat : la personne seule, dans la photo de paysage d'origine.
    if (name === "sweat_dos") {
      const f = path.join(SRC_DIR, "sweat_dos.jpg");
      const buf = await sharp(f).extract({ left: 2750, top: 1150, width: 2700, height: 2819 }).jpeg({ quality: 95 }).toBuffer();
      await sharp(buf).toFile(f);
    }
  }
}

/* ── Image brute ────────────────────────────────────────────────────────── */

async function load(file) {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  return { d: new Float32Array(data), w: info.width, h: info.height };
}

const clone = (im) => ({ d: new Float32Array(im.d), w: im.w, h: im.h });

function lum(im) {
  const L = new Float32Array(im.w * im.h);
  for (let i = 0; i < L.length; i++) L[i] = (0.299 * im.d[i * 3] + 0.587 * im.d[i * 3 + 1] + 0.114 * im.d[i * 3 + 2]) / 255;
  return L;
}

function sat(im) {
  const S = new Float32Array(im.w * im.h);
  for (let i = 0; i < S.length; i++) {
    const r = im.d[i * 3] / 255, g = im.d[i * 3 + 1] / 255, b = im.d[i * 3 + 2] / 255;
    // Chroma plutôt que saturation HSL : celle-ci explose près du blanc et
    // confondait un sweat blanc légèrement bleuté avec de la peau.
    S[i] = Math.max(r, g, b) - Math.min(r, g, b);
  }
  return S;
}

/** Flou boîte séparable (rayon r), sur un canal. */
function blur(ch, w, h, r) {
  if (r < 1) return ch;
  const tmp = new Float32Array(ch.length), out = new Float32Array(ch.length);
  for (let y = 0; y < h; y++) {
    let acc = 0;
    for (let x = -r; x <= r; x++) acc += ch[y * w + Math.min(w - 1, Math.max(0, x))];
    for (let x = 0; x < w; x++) {
      tmp[y * w + x] = acc / (2 * r + 1);
      acc += ch[y * w + Math.min(w - 1, x + r + 1)] - ch[y * w + Math.max(0, x - r)];
    }
  }
  for (let x = 0; x < w; x++) {
    let acc = 0;
    for (let y = -r; y <= r; y++) acc += tmp[Math.min(h - 1, Math.max(0, y)) * w + x];
    for (let y = 0; y < h; y++) {
      out[y * w + x] = acc / (2 * r + 1);
      acc += tmp[Math.min(h - 1, y + r + 1) * w + x] - tmp[Math.max(0, y - r) * w + x];
    }
  }
  return out;
}

function percentile(values, p) {
  const s = Float32Array.from(values).sort();
  return s[Math.min(s.length - 1, Math.floor(p * s.length))] ?? 1;
}

/* ── Masque du vêtement ─────────────────────────────────────────────────── */

/**
 * Isole l'article à l'intérieur du cadre `box`.
 *
 * Le fond d'un studio est un dégradé lent : on le modélise en interpolant les
 * bords du cadre, puis on garde ce qui s'en écarte de plus de `delta`
 * (`sign` +1 : article plus clair que le fond, −1 : plus foncé, 0 : ignorer).
 * Le contour est refermé (`close`), les trous bouchés, puis `keep` retire ce
 * qui n'est pas du tissu (peau, jean…) et `cut` / `add` corrigent à la main.
 */
function garmentMask(im, { box, delta = 0.04, sign = 1, keep, close = 6, cut = [], add = [] }) {
  const { w, h } = im;
  const L = blur(lum(im), w, h, 2);
  const S = sat(im);
  const [x0, y0, x1, y1] = box.map((v, k) => Math.round(Math.max(1, Math.min((k % 2 ? h : w) - 2, v))));
  const band = 6;
  const avg = (xa, xb, ya, yb) => {
    let t = 0, n = 0;
    for (let y = ya; y <= yb; y++) for (let x = xa; x <= xb; x++) { t += L[y * w + x]; n++; }
    return t / n;
  };
  const left = [], right = [], top = [], bottom = [];
  for (let y = y0; y <= y1; y++) { left[y] = avg(x0, x0 + band, y, y); right[y] = avg(x1 - band, x1, y, y); }
  for (let x = x0; x <= x1; x++) { top[x] = avg(x, x, y0, y0 + band); bottom[x] = avg(x, x, y1 - band, y1); }
  const bw = x1 - x0, bh = y1 - y0;

  let m = new Float32Array(w * h);
  for (let y = y0; y <= y1; y++) {
    const fy = (y - y0) / bh;
    for (let x = x0; x <= x1; x++) {
      const fx = (x - x0) / bw;
      const i = y * w + x;
      if (sign === 0) { m[i] = 1; continue; }
      const bg = 0.5 * (left[y] * (1 - fx) + right[y] * fx) + 0.5 * (top[x] * (1 - fy) + bottom[x] * fy);
      if (sign * (L[i] - bg) > delta) m[i] = 1;
    }
  }
  // Fermeture : dilatation puis érosion (par flou + seuil).
  if (close) {
    const d1 = blur(m, w, h, close);
    for (let i = 0; i < m.length; i++) d1[i] = d1[i] > 0.02 ? 1 : 0;
    const e1 = blur(d1, w, h, close);
    for (let i = 0; i < m.length; i++) m[i] = e1[i] > 0.98 ? 1 : 0;
  }
  // Bouchage : tout ce qui n'est pas relié au bord du cadre fait partie de l'article.
  const out = new Uint8Array(w * h);
  const q = new Int32Array(w * h);
  let qh = 0, qt = 0;
  const push = (x, y) => { const i = y * w + x; if (!out[i] && !m[i]) { out[i] = 1; q[qt++] = i; } };
  for (let x = x0; x <= x1; x++) { push(x, y0); push(x, y1); }
  for (let y = y0; y <= y1; y++) { push(x0, y); push(x1, y); }
  while (qh < qt) {
    const i = q[qh++], x = i % w, y = (i / w) | 0;
    if (x > x0) push(x - 1, y);
    if (x < x1) push(x + 1, y);
    if (y > y0) push(x, y - 1);
    if (y < y1) push(x, y + 1);
  }
  const res = new Float32Array(w * h);
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const i = y * w + x;
    if (out[i]) continue;
    if (keep && !keep(L[i], S[i], x, y)) continue;
    res[i] = 1;
  }
  for (const c of cut) fillShape(res, w, h, c, 0);
  for (const c of add) fillShape(res, w, h, c, 1);
  return blur(res, w, h, 2);
}

/**
 * Masque issu d'un détourage (rembg, dossier `masks/` à côté des photos),
 * restreint au cadre `box` et filtré par `keep` (exclure la peau, les cheveux…).
 */
async function cutoutMask(name, im, { box, keep, cut = [] } = {}) {
  const { w, h } = im;
  const { data } = await sharp(path.join(SRC_DIR, "masks", `${name}.png`)).greyscale().resize(w, h).raw().toBuffer({ resolveWithObject: true });
  const L = lum(im), S = sat(im);
  const [x0, y0, x1, y1] = box ? box.map(Math.round) : [0, 0, w - 1, h - 1];
  const m = new Float32Array(w * h);
  for (let y = Math.max(0, y0); y <= Math.min(h - 1, y1); y++)
    for (let x = Math.max(0, x0); x <= Math.min(w - 1, x1); x++) {
      const i = y * w + x;
      const a = data[i] / 255;
      if (a < 0.05) continue;
      if (keep && !keep(L[i], S[i], x, y)) continue;
      m[i] = a;
    }
  for (const c of cut) fillShape(m, w, h, c, 0);
  return keep ? blur(m, w, h, 1) : m;
}

function fillShape(m, w, h, s, v) {
  if (s.r) {
    for (let y = Math.max(0, s.cy - s.r | 0); y < Math.min(h, s.cy + s.r); y++)
      for (let x = Math.max(0, s.cx - s.r | 0); x < Math.min(w, s.cx + s.r); x++)
        if ((x - s.cx) ** 2 + (y - s.cy) ** 2 < s.r * s.r) m[y * w + x] = v;
  } else {
    const [a, b, c, d] = s.box.map(Math.round);
    for (let y = Math.max(0, b); y < Math.min(h, d); y++) for (let x = Math.max(0, a); x < Math.min(w, c); x++) m[y * w + x] = v;
  }
}

/* ── Recoloration ───────────────────────────────────────────────────────── */

const hex = (h) => [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16));

/**
 * Remplace la couleur de l'article en gardant son modelé : la luminosité de
 * chaque pixel, rapportée à celle du tissu en pleine lumière, module la
 * couleur cible. `contrast` creuse les plis sur les teintes sombres.
 */
function recolor(im, mask, target, { contrast = 1.25, lift = 0, refP = 0.92 } = {}) {
  const out = clone(im);
  const L = lum(im);
  const inside = [];
  for (let i = 0; i < L.length; i++) if (mask[i] > 0.9) inside.push(L[i]);
  const ref = percentile(inside, refP);
  const [tr, tg, tb] = hex(target);
  for (let i = 0; i < L.length; i++) {
    const a = mask[i];
    if (a <= 0) continue;
    let s = L[i] / ref;
    s = Math.pow(Math.max(0, s), contrast);
    const hl = Math.max(0, s - 1) * 255 * 0.6; // reflets au-delà du blanc
    const nr = Math.min(255, tr * Math.min(s, 1) + hl + lift);
    const ng = Math.min(255, tg * Math.min(s, 1) + hl + lift);
    const nb = Math.min(255, tb * Math.min(s, 1) + hl + lift);
    out.d[i * 3] = im.d[i * 3] * (1 - a) + nr * a;
    out.d[i * 3 + 1] = im.d[i * 3 + 1] * (1 - a) + ng * a;
    out.d[i * 3 + 2] = im.d[i * 3 + 2] * (1 - a) + nb * a;
  }
  return out;
}

/* ── Impression du logo ─────────────────────────────────────────────────── */

let LOGO_RGBA;
async function logoRaster() {
  if (!LOGO_RGBA) {
    const S = 1200;
    const { data } = await sharp(LOGO).resize(S, S, { kernel: "lanczos3" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    // Disque : le logo est un écusson rond ; on ne garde que l'intérieur.
    const a = new Float32Array(S * S);
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const r = Math.hypot(x - S / 2 + 0.5, y - S / 2 + 0.5) / (S / 2);
      a[y * S + x] = Math.max(0, Math.min(1, (0.985 - r) * 120));
    }
    LOGO_RGBA = { d: data, a, S };
  }
  return LOGO_RGBA;
}

/** Raster RGBA arbitraire (sticker, texte) rendu depuis du SVG. */
async function svgRaster(svg, S = 800) {
  const { data } = await sharp(Buffer.from(svg)).resize(S, S).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const d = new Uint8Array(S * S * 3), a = new Float32Array(S * S);
  for (let i = 0; i < S * S; i++) {
    d[i * 3] = data[i * 4]; d[i * 3 + 1] = data[i * 4 + 1]; d[i * 3 + 2] = data[i * 4 + 2];
    a[i] = data[i * 4 + 3] / 255;
  }
  return { d, a, S };
}

function sample(art, u, v) {
  // u, v dans [0,1] ; bilinéaire.
  const { S } = art;
  const x = u * (S - 1), y = v * (S - 1);
  const x0 = Math.floor(x), y0 = Math.floor(y);
  if (x0 < 0 || y0 < 0 || x0 >= S - 1 || y0 >= S - 1) return null;
  const fx = x - x0, fy = y - y0;
  const res = [0, 0, 0, 0];
  for (const [dx, dy, wgt] of [[0, 0, (1 - fx) * (1 - fy)], [1, 0, fx * (1 - fy)], [0, 1, (1 - fx) * fy], [1, 1, fx * fy]]) {
    const i = (y0 + dy) * S + x0 + dx;
    res[0] += art.d[i * 3] * wgt; res[1] += art.d[i * 3 + 1] * wgt; res[2] += art.d[i * 3 + 2] * wgt; res[3] += art.a[i] * wgt;
  }
  return res;
}

/**
 * Pose `art` centré en (cx, cy), diamètre d.
 *  mode "ink"   : encre sur tissu clair (multiplication, le blanc disparaît)
 *  mode "patch" : écusson / sticker opaque, ombré par la photo
 *  cyl          : rayon du cylindre (mug, gourde) en px, 0 = plat
 *  disp         : force de la déformation par les plis
 *  rot, sx, sy  : rotation (degrés) et écrasement de perspective
 *  shadow       : ombre portée (stickers)
 */
function stamp(im, art, { cx, cy, d, mode = "ink", cyl = 0, disp = 6, rot = 0, sx = 1, sy = 1, opacity = 0.95, shadow = 0, shade = true, dispR = 6, shadeR = 0 }) {
  const { w, h } = im;
  const L = lum(im);
  // dispR : échelle des plis suivis (petite = grain du tissu, grande = grands
  // plis). shadeR : flou de l'éclairage reporté sur un écusson (0 = auto).
  const Lb = blur(L, w, h, dispR);
  const Lsoft = mode === "ink" ? L : blur(L, w, h, shadeR || Math.max(6, Math.round(d / 5)));
  const R = d / 2;
  const ext = Math.ceil(R * Math.max(sx, sy) * 1.5) + 4;
  const xa = Math.max(1, Math.floor(cx - ext)), xb = Math.min(w - 2, Math.ceil(cx + ext));
  const ya = Math.max(1, Math.floor(cy - ext)), yb = Math.min(h - 2, Math.ceil(cy + ext));
  const local = [];
  for (let y = ya; y <= yb; y++) for (let x = xa; x <= xb; x++) local.push(L[y * w + x]);
  const ref = percentile(local, 0.9);
  const mean = local.reduce((s, v) => s + v, 0) / local.length;
  // Écusson : l'éclairage se mesure sous le disque seulement, pas sur le
  // fond autour (sinon un écusson sur une gourde sombre devenait gris).
  let discSum = 0, discN = 0;
  for (let y = ya; y <= yb; y++) for (let x = xa; x <= xb; x++)
    if ((x - cx) ** 2 + (y - cy) ** 2 < (R * 0.9) ** 2) { discSum += Lsoft[y * w + x]; discN++; }
  const discRef = discN ? discSum / discN : 1;
  const cr = Math.cos((-rot * Math.PI) / 180), sr = Math.sin((-rot * Math.PI) / 180);
  const out = clone(im);
  const alphaAt = new Float32Array((xb - xa + 1) * (yb - ya + 1));

  for (let y = ya; y <= yb; y++) {
    for (let x = xa; x <= xb; x++) {
      const i = y * w + x;
      // Les plis décalent l'impression : gradient de luminosité locale.
      const gx = (Lb[i + 1] - Lb[i - 1]) * disp * 20;
      const gy = (Lb[i + w] - Lb[i - w]) * disp * 20;
      let px = x - cx + gx, py = y - cy + gy;
      let u = (px * cr - py * sr) / sx, v = (px * sr + py * cr) / sy;
      if (cyl) {
        const t = u / cyl;
        if (Math.abs(t) >= 1) continue;
        u = Math.asin(t) * cyl;
      }
      const s = sample(art, u / d + 0.5, v / d + 0.5);
      if (!s || s[3] <= 0) continue;
      const a = s[3] * opacity;
      alphaAt[(y - ya) * (xb - xa + 1) + (x - xa)] = a;
      // Encre : suit chaque pli. Écusson : n'hérite que de l'éclairage global
      // (sinon le motif d'origine transparaît à travers).
      const k = !shade
        ? 1
        : mode === "ink"
          ? Math.min(1.08, Math.max(0.35, (L[i] / ref) * 0.85 + 0.15 + (L[i] - mean) * 0.2))
          : Math.min(1.08, Math.max(shadeR ? 0.55 : 0.7, Math.pow(Lsoft[i] / discRef, shadeR ? 0.75 : 0.6)));
      for (let c = 0; c < 3; c++) {
        const base = im.d[i * 3 + c];
        const ink = s[c];
        const val = mode === "ink" ? base * (ink / 255) : ink * k;
        out.d[i * 3 + c] = base * (1 - a) + val * a;
      }
    }
  }

  if (shadow) {
    // Ombre douce décalée vers le bas, sous le sticker.
    const W = xb - xa + 1, H = yb - ya + 1;
    const sh = blur(alphaAt, W, H, Math.max(2, Math.round(d * 0.03)));
    const off = Math.round(d * 0.03);
    for (let y = ya; y <= yb; y++) for (let x = xa; x <= xb; x++) {
      const j = (y - ya - off) * W + (x - xa);
      if (j < 0 || j >= sh.length) continue;
      const a0 = alphaAt[(y - ya) * W + (x - xa)];
      const k = 1 - shadow * sh[j] * (1 - a0);
      const i = y * w + x;
      for (let c = 0; c < 3; c++) out.d[i * 3 + c] *= k;
    }
  }
  return out;
}

/** Efface une petite marque existante en recopiant le tissu voisin. */
function cloneOver(im, { cx, cy, r, dx, dy }) {
  const out = clone(im);
  cx = Math.round(cx); cy = Math.round(cy); dx = Math.round(dx); dy = Math.round(dy);
  for (let y = Math.floor(cy - r * 1.5); y < cy + r * 1.5; y++)
    for (let x = Math.floor(cx - r * 1.5); x < cx + r * 1.5; x++) {
      const dist = Math.hypot(x - cx, y - cy) / r;
      const a = Math.max(0, Math.min(1, (1.4 - dist) * 2.5));
      if (!a) continue;
      const i = y * im.w + x, j = (y + dy) * im.w + (x + dx);
      for (let c = 0; c < 3; c++) out.d[i * 3 + c] = im.d[i * 3 + c] * (1 - a) + im.d[j * 3 + c] * a;
    }
  return out;
}

async function save(im, crop, name, { flop = false } = {}) {
  const [cx, cy, side] = crop;
  let left = Math.round(cx - side / 2), top = Math.round(cy - side / 2), s = Math.round(side);
  left = Math.max(0, Math.min(im.w - s, left));
  top = Math.max(0, Math.min(im.h - s, top));
  s = Math.min(s, im.w, im.h);
  const buf = Buffer.from(Uint8ClampedArray.from(im.d));
  let p = sharp(buf, { raw: { width: im.w, height: im.h, channels: 3 } }).extract({ left, top, width: s, height: s }).resize(SIZE, SIZE);
  if (flop) p = p.flop();
  await p.webp({ quality: 90 }).toFile(path.join(OUT, `${name}.webp`));
  console.log("✓", name);
}

/** Version détourée (fond transparent), pour les visuels flottants. */
async function saveCutout(im, alpha, crop, name) {
  const [cx, cy, side] = crop;
  const s = Math.round(Math.min(side, im.w, im.h));
  const left = Math.max(0, Math.min(im.w - s, Math.round(cx - side / 2)));
  const top = Math.max(0, Math.min(im.h - s, Math.round(cy - side / 2)));
  const rgba = Buffer.alloc(im.w * im.h * 4);
  for (let i = 0; i < im.w * im.h; i++) {
    // Borné : un Buffer reboucle au-delà de 255 (le blanc devenait noir).
    for (let c = 0; c < 3; c++) rgba[i * 4 + c] = Math.max(0, Math.min(255, Math.round(im.d[i * 3 + c])));
    rgba[i * 4 + 3] = Math.round(Math.min(1, alpha[i]) * 255);
  }
  await sharp(rgba, { raw: { width: im.w, height: im.h, channels: 4 } })
    .extract({ left, top, width: s, height: s }).resize(800, 800)
    .webp({ quality: 86, alphaQuality: 90 }).toFile(path.join(OUT, `${name}.webp`));
  console.log("✓", name);
}

/* ── Marquages texte ───────────────────────────────────────────────────── */

/**
 * Marquage texte (text/<nom>.png) posé au centre d'un carré : `fill` est la
 * part de la largeur occupée. Le résultat se pose avec `stamp` comme le logo.
 */
async function textArt(name, { fill = 0.98 } = {}) {
  const S = 2000;
  const fitted = await sharp(path.join(SRC_DIR, "text", `${name}.png`)).resize({ width: Math.round(S * fill), height: S, fit: "inside" }).toBuffer();
  const { data } = await sharp({ create: { width: S, height: S, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: fitted, gravity: "centre" }]).raw().toBuffer({ resolveWithObject: true });
  const d = new Uint8Array(S * S * 3), al = new Float32Array(S * S);
  for (let i = 0; i < S * S; i++) {
    d[i * 3] = data[i * 4]; d[i * 3 + 1] = data[i * 4 + 1]; d[i * 3 + 2] = data[i * 4 + 2];
    al[i] = data[i * 4 + 3] / 255;
  }
  return { d, a: al, S };
}

/**
 * Prolonge le bas d'une photo de `rows` lignes, en recopiant en miroir une
 * bande de tissu (le sweat de dos est coupé juste sous la capuche).
 */
function extendDown(im, rows, band) {
  const h = im.h + rows, d = new Float32Array(im.w * h * 3);
  d.set(im.d);
  for (let y = im.h; y < h; y++) {
    const k = y - im.h, period = 2 * band;
    const m = k % period, off = m < band ? m : period - 1 - m;
    const sy = im.h - 1 - off;
    // Léger assombrissement vers le bas, comme le tissu qui s'éloigne de la lumière.
    const shade = 1 - 0.12 * (k / rows);
    for (let x = 0; x < im.w; x++) for (let c = 0; c < 3; c++) d[(y * im.w + x) * 3 + c] = im.d[(sy * im.w + x) * 3 + c] * shade;
  }
  // Raccord adouci sur quelques lignes.
  return { d, w: im.w, h };
}

/**
 * Pose l'article détouré sur un fond studio : cyclo gris clair, plus
 * lumineux en haut, et ombre de contact douce sous la base (centrée en
 * `cx`, à la hauteur `base`, demi-largeur `rx`).
 */
function onStudio(im, alpha, { cx, base, rx, drop = null }) {
  const out = clone(im);
  const top = [246, 245, 243], bottom = [226, 224, 221];
  for (let y = 0; y < im.h; y++) {
    const t = Math.min(1, y / im.h);
    for (let x = 0; x < im.w; x++) {
      const i = y * im.w + x;
      // Ombre : un noyau serré au contact, un halo large et léger.
      const dx = (x - cx) / rx, dy = (y - base) / (rx * 0.16);
      const dx2 = (x - cx) / (rx * 1.9), dy2 = (y - base) / (rx * 0.45);
      // `drop` : ombre portée d'un article posé à plat (masque flouté et décalé).
      const sh = 0.32 * Math.exp(-(dx * dx + dy * dy) * 1.6) + 0.12 * Math.exp(-(dx2 * dx2 + dy2 * dy2)) + (drop ? drop[i] : 0);
      const a = Math.min(1, alpha[i]);
      for (let c = 0; c < 3; c++) {
        const bg = (top[c] * (1 - t) + bottom[c] * t) * (1 - sh);
        out.d[i * 3 + c] = im.d[i * 3 + c] * a + bg * (1 - a);
      }
    }
  }
  return out;
}

/* ── Les articles ───────────────────────────────────────────────────────── */

const PARME = "#c3b1ec";
const NOIR = "#1d1c22";

/**
 * Efface les peluches : sur le tissu, un pixel nettement plus clair que son
 * voisinage reprend la couleur moyenne alentour. Indispensable avant de
 * passer un tissu en noir, où chaque fibre claire ressort.
 */
function despeckle(im, mask, r = 5, thr = 0.05) {
  const out = clone(im);
  const L = lum(im), Lb = blur(L, im.w, im.h, r);
  const ch = [0, 1, 2].map((c) => blur(Float32Array.from({ length: im.w * im.h }, (_, i) => im.d[i * 3 + c]), im.w, im.h, r));
  for (let i = 0; i < L.length; i++) {
    if (mask[i] < 0.5 || L[i] - Lb[i] < thr) continue;
    for (let c = 0; c < 3; c++) out.d[i * 3 + c] = ch[c][i];
  }
  return out;
}

/** Met à l'échelle de la source les positions relevées sur la base 1600 px. */
function sc(o, k = K) {
  const r = { ...o };
  for (const key of ["cx", "cy", "d", "cyl", "r", "dx", "dy", "rx", "base"]) if (typeof r[key] === "number") r[key] *= k;
  if (r.disp) r.disp *= k;
  return r;
}
const box = (a, k = K) => a.map((v) => v * k);

/**
 * Masque de recoloration élargi de quelques pixels aux bords teintés : sans
 * cela, le contour mêlé au fond garde la couleur d'origine (liseré violet
 * autour du sweat noir).
 */
function widen(im, mask, tinted, r = 4) {
  const near = blur(mask, im.w, im.h, r);
  const out = new Float32Array(mask.length);
  for (let i = 0; i < mask.length; i++) out[i] = Math.max(mask[i], near[i] > 0.02 ? tinted(i) : 0);
  return out;
}


/**
 * Porte-clés décapsuleur en aluminium anodisé (modèle « barre » à crochet,
 * comme ceux des fournisseurs d'objets publicitaires). Pas de photo vierge
 * exploitable : rendu « 3D studio » en SVG. La barre est extrudée en
 * empilant sa silhouette (épaisseur), le crochet plonge au bout, l'anneau
 * passe dans l'œillet ; logo et nom du club imprimés sur le dessus.
 */
async function keychainRender() {
  const S = 2800;
  const logoB64 = (await sharp(LOGO).resize(600, 600, { kernel: "lanczos3" }).png().toBuffer()).toString("base64");
  const vc = path.join(SRC_DIR, "text", "vc-marseillanais.png");
  const vcB64 = (await sharp(vc).png().toBuffer()).toString("base64");
  const vm = await sharp(vc).metadata();
  const tw = 620, th = Math.round((tw * vm.height) / vm.width);
  const COLORS = {
    noir: { dark: "#141418", mid: "#2b2b31", light: "#6a6b74", side: "#0c0c0f", hook: "#1e1e23" },
    violet: { dark: "#1f0d47", mid: "#4a23a3", light: "#9c78ee", side: "#170936", hook: "#341783" },
  };
  // Dessus de la barre : long rectangle arrondi, œillet à gauche.
  const top =
    "M -640,-120 L 560,-120 Q 680,-120 690,-30 L 700,40 Q 705,120 600,120 L -640,120 Q -760,120 -760,0 Q -760,-120 -640,-120 Z " +
    "M -650,0 m -46,0 a 46,46 0 1,0 92,0 a 46,46 0 1,0 -92,0 Z";
  // Crochet : le bout de la barre qui plonge (vu en trois quarts).
  // Anneau : cercle qui passe par le centre de l'œillet (-650, 0).
  const RR = Math.hypot(-650 + 850, 0 - 70).toFixed(1);
  const hook = "M 560,-120 Q 690,-120 700,10 L 715,250 Q 718,330 650,330 L 600,330 Q 560,330 562,280 L 560,150 Z";
  for (const [key, c] of Object.entries(COLORS)) {
    const layers = Array.from({ length: 14 }, (_, i) => `<path d="${top}" fill-rule="evenodd" fill="${c.side}" transform="translate(0 ${42 - i * 3})"/>`).join("");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6f5f3"/><stop offset="1" stop-color="#e2e0dd"/></linearGradient>
    <linearGradient id="face" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${c.mid}"/><stop offset="0.22" stop-color="${c.light}"/><stop offset="0.34" stop-color="${c.mid}"/>
      <stop offset="0.75" stop-color="${c.dark}"/><stop offset="1" stop-color="${c.mid}"/>
    </linearGradient>
    <linearGradient id="hookG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${c.dark}"/><stop offset="0.45" stop-color="${c.light}"/><stop offset="0.6" stop-color="${c.hook}"/><stop offset="1" stop-color="${c.dark}"/></linearGradient>
    <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4f5f6"/><stop offset="0.3" stop-color="#959aa1"/><stop offset="0.5" stop-color="#ffffff"/><stop offset="0.75" stop-color="#7d828a"/><stop offset="1" stop-color="#c7cad0"/></linearGradient>
    <filter id="soft" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="34"/></filter>
    <clipPath id="disc"><circle cx="-430" cy="0" r="92"/></clipPath>
    <!-- Devant de la barre, au-dessus du centre de l'œillet -->
    <clipPath id="ringFront"><rect x="-780" y="-140" width="140" height="140"/></clipPath>
  </defs>
  <rect width="${S}" height="${S}" fill="url(#bg)"/>
  <g transform="translate(${S / 2 + 300} ${S / 2 - 60}) rotate(-24) scale(1.35)">
    <!-- Ombres -->
    <path d="${top}" fill-rule="evenodd" fill="#2a2830" opacity="0.26" filter="url(#soft)" transform="translate(40 150)"/>
    <path d="${hook}" fill="#2a2830" opacity="0.2" filter="url(#soft)" transform="translate(30 110)"/>
    <!-- Anneau double spire passé dans l'œillet : la moitié basse passe
         derrière la barre (vue à travers le trou), la moitié haute devant. -->
    <circle cx="-850" cy="70" r="${RR}" fill="none" stroke="url(#ring)" stroke-width="26"/>
    <circle cx="-842" cy="78" r="${RR}" fill="none" stroke="url(#ring)" stroke-width="18" opacity="0.85"/>
    <!-- Crochet, puis épaisseur, puis dessus -->
    <path d="${hook}" fill="url(#hookG)"/>
    ${layers}
    <path d="${top}" fill-rule="evenodd" fill="url(#face)"/>
    <path d="${top}" fill-rule="evenodd" fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="5"/>
    <!-- Partie de l'anneau qui ressort devant la barre, côté haut de l'œillet -->
    <g clip-path="url(#ringFront)">
      <circle cx="-850" cy="70" r="${RR}" fill="none" stroke="#000" stroke-opacity="0.35" stroke-width="30" transform="translate(4 10)" filter="url(#soft)"/>
      <circle cx="-850" cy="70" r="${RR}" fill="none" stroke="url(#ring)" stroke-width="26"/>
      <circle cx="-842" cy="78" r="${RR}" fill="none" stroke="url(#ring)" stroke-width="18" opacity="0.85"/>
    </g>
    <!-- Impression : écusson en couleur et nom du club -->
    <circle cx="-430" cy="0" r="98" fill="#ffffff"/>
    <image href="data:image/png;base64,${logoB64}" x="-522" y="-92" width="184" height="184" clip-path="url(#disc)"/>
    <image href="data:image/png;base64,${vcB64}" x="${80 - tw / 2}" y="${-th / 2}" width="${tw}" height="${th}"/>
    <!-- Reflet du studio sur l'anodisation brillante -->
    <path d="M -700,-92 L 600,-92 Q 650,-92 660,-70 L -720,-70 Q -716,-92 -700,-92 Z" fill="#ffffff" opacity="0.18"/>
  </g>
</svg>`;
    await sharp(Buffer.from(svg)).resize(SIZE, SIZE).webp({ quality: 90 }).toFile(path.join(OUT, `porte-cles-decapsuleur-vcm--${key}.webp`));
    console.log(`✓ porte-cles-decapsuleur-vcm--${key}`);
  }
}

async function main() {
  if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });
  const logo = await logoRaster();
  const src = (n) => path.join(SRC_DIR, `${n}.jpg`);
  const clubLine = await textArt("club");
  const clubLineDark = await textArt("club-fonce");

  /* Sweat à capuche porté : violet d'origine → parme et noir, écusson côté cœur */
  {
    const im = await load(src("sweat"));
    const px = (i) => [im.d[i * 3], im.d[i * 3 + 1], im.d[i * 3 + 2]];
    const purple = (x, y) => {
      const [r, g, b] = px(y * im.w + x);
      return b > g + 12 && r > g && (Math.max(r, g, b) - Math.min(r, g, b)) / 255 > 0.1;
    };
    const base = await cutoutMask("sweat", im, { keep: (l, s, x, y) => purple(x, y) });
    const mask = widen(im, base, (i) => { const [r, g, b] = px(i); return Math.max(0, Math.min(1, (b - g) / 30)); });
    for (const [key, col, contrast] of [["parme", PARME, 1.15], ["noir", NOIR, 1.6]]) {
      const printed = stamp(recolor(im, mask, col, { contrast }), logo, { ...sc({ cx: 748, cy: 992, d: 140, mode: "patch", disp: 3, sx: 0.94, rot: -3 }), dispR: 30 });
      await save(printed, box([711, 1200, 1300]), `sweat-capuche-vcm--${key}`);
    }
  }

  /* Sweat de dos, porté : kaki d'origine → noir et parme, « VC MARSEILLANAIS »
     sous la capuche, fond remplacé par le studio. Positions dans la photo
     recadrée (2700 × 2819). */
  {
    const raw = await load(src("sweat_dos"));
    const person = await cutoutMask("sweat_dos", raw);
    const im = despeckle(raw, person);
    const px = (i) => [im.d[i * 3], im.d[i * 3 + 1], im.d[i * 3 + 2]];
    // Tissu kaki : rapport bleu/vert ≥ 0,86 et pas de dominante rouge. Les
    // cheveux (bleu/vert 0,72 à 0,85, rouge > vert) et la peau sont exclus ;
    // là où les cheveux recouvrent la capuche, le critère est plus strict.
    // Le pantalon, sous l'ourlet, est exclu aussi.
    const fabric = (i) => {
      const [r, g, b] = px(i);
      const x = i % im.w, y = (i / im.w) | 0;
      // Rien au-dessus du haut de la capuche (cheveux) ni sous l'ourlet (pantalon).
      // (à droite, pas de cheveux : l'intérieur de la capuche monte plus haut).
      if (y > 2590 || y < (x > 1500 ? 520 : 620)) return 0;
      const gg = Math.max(1, g), bg = b / gg, rg = r / gg;
      // Au-dessus de la capuche (haut gauche), les mèches sombres se
      // rapprochent du kaki : seul le critère bleu/vert les en distingue.
      const hairZone = y < 900 && x < 1250;
      return bg >= (hairZone ? 0.87 : 0.84) && rg <= 1.07 ? 1 : 0;
    };
    const raw0 = new Float32Array(person.length);
    for (let i = 0; i < raw0.length; i++) raw0[i] = person[i] > 0.5 ? fabric(i) : 0;
    // Nettoyage : on supprime les îlots isolés (mèches) et on bouche les
    // petits trous du tissu (ouverture puis fermeture par flou + seuil).
    const open = blur(raw0, im.w, im.h, 6).map((v) => (v > 0.6 ? 1 : 0));
    const grown = blur(open, im.w, im.h, 22).map((v) => (v > 0.05 ? 1 : 0));
    const closed = blur(grown, im.w, im.h, 22).map((v) => (v > 0.95 ? 1 : 0));
    const cloth = closed.map((v, i) => v * person[i]);
    if (process.env.DEBUG_MASK) await sharp(Buffer.from(cloth.map((v) => v * 255)), { raw: { width: im.w, height: im.h, channels: 1 } }).resize(900).png().toFile(process.env.DEBUG_MASK);
    const mask = blur(cloth, im.w, im.h, 2);
    const back = await textArt("vc-marseillanais");
    // Contour resserré pour le détourage : sans liseré clair du fond d'origine.
    const tight = blur(person, im.w, im.h, 2).map((a) => Math.max(0, Math.min(1, (a - 0.45) / 0.4)));
    // Noir : référence sur les reflets les plus forts, pour ne pas les pousser
    // au blanc. Parme : référence plus basse, pour le même éclat que la face.
    for (const [key, col, contrast, refP] of [["noir", NOIR, 1.5, 0.995], ["parme", PARME, 0.95, 0.85]]) {
      let out = recolor(im, mask, col, { contrast, refP });
      // Sous la capuche, centré sur la colonne ; cintré sur le dos, décalé par
      // les grands plis et ombré par eux, comme une vraie sérigraphie.
      out = stamp(out, back, { cx: 1690, cy: 1475, d: 940, mode: "patch", rot: 1.5, cyl: 760, disp: 30, dispR: 48, shadeR: 14 });
      await save(onStudio(out, tight, { cx: 1500, base: 1e6, rx: 1 }), [1500, 1440, 2400], `sweat-capuche-vcm--${key}--dos`);
    }
  }

  /* Tee-shirt noir porté, face et dos, sur le fond studio (comme le sweat) */
  {
    const worn = await load(src("tee_porte"));
    const front = onStudio(worn, await cutoutMask("tee_porte", worn), sc({ cx: 845, base: 1e6, rx: 1 }));
    await save(stamp(front, logo, sc({ cx: 1020, cy: 1215, d: 135, mode: "patch", disp: 6, sx: 0.95 })), box([840, 1420, 1160]), "tee-shirt-personnalisable--noir");
    // Dos vierge : le site y incruste en direct le prénom et le numéro saisis
    // (zone réglée dans BACK_PRINT, components/shop/ProductVisual.tsx).
    const back = await load(src("tee_dos"));
    await save(onStudio(back, await cutoutMask("tee_dos", back), sc({ cx: 815, base: 1e6, rx: 1 })), box([820, 1230, 1300]), "tee-shirt-personnalisable--noir--dos");
  }

  /* Sac à dos noir : logo + nom du club au centre de la poche avant,
     sous sa fermeture éclair, comme sur le catalogue du club */
  {
    const im = await load(src("sac"));
    let out = stamp(im, logo, sc({ cx: 852, cy: 1782, d: 238, mode: "patch", disp: 3, sy: 0.97 }));
    out = stamp(out, clubLine, sc({ cx: 852, cy: 1918, d: 300, mode: "patch", disp: 2 }));
    await save(out, box([800, 1360, 1500]), "sac-a-dos-vcm--noir");
  }

  /* Gourde sport à bouchon clapet : turquoise → blanc, logo et « VCM » cintrés.
     Positions relevées sur une photo de 1200 px de large. */
  {
    const im = await load(src("gourde_sport"));
    const L = lum(im), S = sat(im);
    const mask = await cutoutMask("gourde_sport", im);
    const teal = mask.map((a, i) => (S[i] > 0.12 ? a : 0));
    const white = recolor(im, blur(teal, im.w, im.h, 2), "#f3f3f1", { contrast: 0.55, lift: 8 });
    // Pièces sombres du bouchon : plastique blanc lui aussi, comme sur le catalogue.
    const soft = blur(mask, im.w, im.h, 4);
    for (let y = 230 * K; y < 530 * K; y++) for (let x = 0; x < im.w; x++) {
      const i = y * im.w + x;
      const a = soft[i] * Math.max(0, Math.min(1, (0.14 - S[i]) / 0.06));
      if (a <= 0) continue;
      const v = 175 + 75 * Math.min(1, L[i] * 1.6);
      for (let c = 0; c < 3; c++) white.d[i * 3 + c] = white.d[i * 3 + c] * (1 - a) + v * a;
    }
    // Grand écusson et « VCM » en gros dessous (la devise a été retirée).
    let out = stamp(white, logo, sc({ cx: 617, cy: 790, d: 330, mode: "ink", cyl: 163, disp: 0 }));
    out = stamp(out, await textArt("vcm"), sc({ cx: 617, cy: 1075, d: 240, mode: "ink", cyl: 163, disp: 0 }));
    // Le fond est généré : on agrandit la toile pour cadrer large, sans couper le bouchon.
    const pad = 300 * K;
    const big = { d: new Float32Array((im.w + 2 * pad) * (im.h + pad) * 3), w: im.w + 2 * pad, h: im.h + pad };
    const bigMask = new Float32Array(big.w * big.h);
    const edge = blur(mask, im.w, im.h, 1);
    for (let y = 0; y < im.h; y++) for (let x = 0; x < im.w; x++) {
      const i = y * im.w + x, j = y * big.w + x + pad;
      bigMask[j] = edge[i];
      for (let c = 0; c < 3; c++) big.d[j * 3 + c] = out.d[i * 3 + c];
    }
    await save(onStudio(big, bigMask, { cx: 617 * K + pad, base: 1418 * K, rx: 175 * K }), [617 * K + pad, 860 * K, 1450 * K], "gourde-sport-vcm--blanc");
  }

  await keychainRender();

  /* Tote bag : coton naturel et noir, grand logo + nom du club */
  {
    let im = await load(src("tote"));
    im = cloneOver(im, sc({ cx: 1054, cy: 937, r: 26, dx: -80, dy: 0 }));
    const mask = await cutoutMask("tote", im);
    // Fond studio commun à tout le catalogue à la place du gris d'origine,
    // avec l'ombre douce d'un sac posé à plat.
    const edge = blur(mask, im.w, im.h, 1);
    const off = 10 * K, shifted = new Float32Array(mask.length);
    for (let y = off; y < im.h; y++) for (let x = 0; x < im.w; x++) shifted[y * im.w + x] = mask[(y - off) * im.w + x];
    const drop = blur(shifted, im.w, im.h, 18 * K).map((v) => v * 0.22);
    for (const [key, col] of [["beige", null], ["noir", NOIR]]) {
      const base = col ? recolor(im, mask, col, { contrast: 1.3 }) : im;
      let out = stamp(base, logo, sc({ cx: 807, cy: 600, d: 390, mode: col ? "patch" : "ink", disp: 5 }));
      out = stamp(out, col ? clubLine : clubLineDark, sc({ cx: 807, cy: 840, d: 470, mode: col ? "patch" : "ink", disp: 5 }));
      await save(onStudio(out, edge, { cx: 0, base: 1e6, rx: 1, drop }), box([807, 540, 1000]), `tote-bag-vcm--${key}`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
