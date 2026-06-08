/**
 * gen-placeholders.mjs
 * Generates premium, on-brand placeholder images for VCM website.
 * Run: node scripts/gen-placeholders.mjs
 */

import sharp from 'sharp';
import { createWriteStream } from 'fs';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// ─── Brand palette ────────────────────────────────────────────────────────────
// Gradient stops: deep navy → dark purple → violet → magenta
const STOPS = ['#0a0418', '#2a0e6b', '#7c3aed', '#c026d3'];
const ACCENT = '#ff4dd2';
const WHITE = '#ffffff';

// ─── SVG builder helpers ───────────────────────────────────────────────────────

/** Hex to rgb {r,g,b} */
function hexRgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

/** Generate diagonal gradient def */
function gradientDef(id, angle, seed) {
  // Vary the gradient stops slightly per seed to keep variety
  const offsets = [0, 0.28 + (seed % 5) * 0.04, 0.62 + (seed % 3) * 0.04, 1];
  const colors = [...STOPS];
  // Slightly rotate stop colors for variety
  if (seed % 2 === 0) {
    [colors[1], colors[2]] = [colors[2], colors[1]];
  }
  const rad = (angle * Math.PI) / 180;
  const x2 = Math.round((0.5 + 0.5 * Math.cos(rad)) * 100) / 100;
  const y2 = Math.round((0.5 + 0.5 * Math.sin(rad)) * 100) / 100;
  const x1 = Math.round((0.5 - 0.5 * Math.cos(rad)) * 100) / 100;
  const y1 = Math.round((0.5 - 0.5 * Math.sin(rad)) * 100) / 100;
  return `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" gradientUnits="objectBoundingBox">
    ${colors.map((c, i) => `<stop offset="${offsets[i]}" stop-color="${c}"/>`).join('\n    ')}
  </linearGradient>`;
}

/** Court lines SVG (thin, low opacity) */
function courtLines(w, h) {
  const inset = Math.round(w * 0.04);
  const insetY = Math.round(h * 0.06);
  const cx = Math.round(w / 2);
  const attackDist = Math.round(h * 0.3);
  return `
  <!-- court lines -->
  <rect x="${inset}" y="${insetY}" width="${w - inset * 2}" height="${h - insetY * 2}" fill="none" stroke="white" stroke-width="1.5" stroke-opacity="0.08" rx="2"/>
  <line x1="${cx}" y1="${insetY}" x2="${cx}" y2="${h - insetY}" stroke="white" stroke-width="1.5" stroke-opacity="0.08"/>
  <line x1="${inset}" y1="${h / 2 - attackDist}" x2="${w - inset}" y2="${h / 2 - attackDist}" stroke="white" stroke-width="1" stroke-opacity="0.06"/>
  <line x1="${inset}" y1="${h / 2 + attackDist}" x2="${w - inset}" y2="${h / 2 + attackDist}" stroke="white" stroke-width="1" stroke-opacity="0.06"/>
  `;
}

/** Volleyball circle with seam lines */
function volleyball(cx, cy, r, opacity = 0.85) {
  // Three seam curves
  const r1 = Math.round(r * 1.05);
  return `
  <!-- volleyball glow -->
  <radialGradient id="vball-glow-${cx}" cx="50%" cy="50%" r="60%">
    <stop offset="0%" stop-color="#a855f7" stop-opacity="0.35"/>
    <stop offset="100%" stop-color="#a855f7" stop-opacity="0"/>
  </radialGradient>
  <circle cx="${cx}" cy="${cy}" r="${Math.round(r * 1.6)}" fill="url(#vball-glow-${cx})"/>
  <!-- ball body -->
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="${WHITE}" fill-opacity="${opacity}" stroke="${WHITE}" stroke-width="1" stroke-opacity="0.3"/>
  <!-- seam lines -->
  <path d="M ${cx - r} ${cy} Q ${cx} ${cy - r1 * 0.7} ${cx + r} ${cy}" fill="none" stroke="#7c3aed" stroke-width="${Math.round(r * 0.09)}" stroke-opacity="0.7" stroke-linecap="round"/>
  <path d="M ${cx} ${cy - r} Q ${cx + r1 * 0.7} ${cy} ${cx} ${cy + r}" fill="none" stroke="#7c3aed" stroke-width="${Math.round(r * 0.09)}" stroke-opacity="0.7" stroke-linecap="round"/>
  <path d="M ${cx - r * 0.7} ${cy - r * 0.7} Q ${cx + r * 0.5} ${cy} ${cx - r * 0.7} ${cy + r * 0.7}" fill="none" stroke="#c026d3" stroke-width="${Math.round(r * 0.07)}" stroke-opacity="0.55" stroke-linecap="round"/>
  `;
}

/** WCM watermark */
function watermark(w, h) {
  const fontSize = Math.round(Math.min(w, h) * 0.35);
  return `<text x="${Math.round(w / 2)}" y="${Math.round(h * 0.62)}" font-family="'Arial Black', Helvetica, sans-serif" font-weight="900" font-size="${fontSize}" fill="white" fill-opacity="0.07" text-anchor="middle" dominant-baseline="middle" letter-spacing="-0.05em">VCM</text>`;
}

/** Label block: kicker + main label */
function labelBlock(w, h, kicker, label) {
  const padding = Math.round(w * 0.03);
  const labelSize = Math.round(Math.min(w * 0.042, h * 0.065, 48));
  const kickerSize = Math.round(labelSize * 0.42);
  const labelY = h - Math.round(h * 0.1);
  const kickerY = labelY - labelSize - Math.round(kickerSize * 0.5);
  const maxLabelWidth = Math.round(w * 0.7);
  return `
  <!-- label shadow gradient -->
  <linearGradient id="label-grad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="black" stop-opacity="0"/>
    <stop offset="100%" stop-color="black" stop-opacity="0.65"/>
  </linearGradient>
  <rect x="0" y="${Math.round(h * 0.6)}" width="${w}" height="${Math.round(h * 0.4)}" fill="url(#label-grad)"/>
  <!-- kicker -->
  <text x="${padding}" y="${kickerY}" font-family="'Arial', Helvetica, sans-serif" font-weight="700" font-size="${kickerSize}" fill="${ACCENT}" letter-spacing="0.15em" dominant-baseline="auto">${escapeXml(kicker)}</text>
  <!-- main label -->
  <text x="${padding}" y="${labelY}" font-family="'Arial', Helvetica, sans-serif" font-weight="600" font-size="${labelSize}" fill="white" fill-opacity="0.95" dominant-baseline="auto" textLength="${Math.min(label.length * labelSize * 0.58, maxLabelWidth)}" lengthAdjust="spacingAndGlyphs">${escapeXml(label)}</text>
  `;
}

/** Vignette overlay */
function vignette(w, h) {
  return `
  <radialGradient id="vignette" cx="50%" cy="50%" r="75%">
    <stop offset="0%" stop-color="black" stop-opacity="0"/>
    <stop offset="100%" stop-color="black" stop-opacity="0.55"/>
  </radialGradient>
  <rect x="0" y="0" width="${w}" height="${h}" fill="url(#vignette)"/>
  `;
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ─── Main SVG builder ──────────────────────────────────────────────────────────

function buildSvg(w, h, kicker, label, seed = 0) {
  // Angle varies by seed: 115°, 135°, 150°, 125°, 105°...
  const angles = [115, 135, 150, 125, 105, 140, 120, 160, 110, 130, 145, 118, 138, 155];
  const angle = angles[seed % angles.length];

  // Ball position varies: top-right, bottom-left, top-left, center-right...
  const ballPositions = [
    { xFrac: 0.82, yFrac: 0.28 },
    { xFrac: 0.12, yFrac: 0.72 },
    { xFrac: 0.75, yFrac: 0.65 },
    { xFrac: 0.2, yFrac: 0.25 },
    { xFrac: 0.88, yFrac: 0.5 },
    { xFrac: 0.15, yFrac: 0.45 },
    { xFrac: 0.7, yFrac: 0.2 },
    { xFrac: 0.85, yFrac: 0.75 },
    { xFrac: 0.3, yFrac: 0.8 },
    { xFrac: 0.78, yFrac: 0.38 },
    { xFrac: 0.25, yFrac: 0.6 },
    { xFrac: 0.9, yFrac: 0.3 },
    { xFrac: 0.6, yFrac: 0.78 },
    { xFrac: 0.08, yFrac: 0.35 },
  ];
  const bp = ballPositions[seed % ballPositions.length];
  const ballR = Math.round(Math.min(w, h) * 0.18);
  const ballCx = Math.round(w * bp.xFrac);
  const ballCy = Math.round(h * bp.yFrac);

  const gradId = `grad-${seed}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    ${gradientDef(gradId, angle, seed)}
  </defs>
  <!-- Background gradient -->
  <rect width="${w}" height="${h}" fill="url(#${gradId})"/>
  ${courtLines(w, h)}
  ${volleyball(ballCx, ballCy, ballR)}
  ${watermark(w, h)}
  ${vignette(w, h)}
  ${labelBlock(w, h, kicker, label)}
</svg>`;
}

// ─── JPEG renderer ─────────────────────────────────────────────────────────────

async function renderJpeg(svgString, outPath, quality = 82) {
  await mkdir(path.dirname(outPath), { recursive: true });
  const buf = Buffer.from(svgString);
  await sharp(buf)
    .jpeg({ quality, mozjpeg: false })
    .toFile(outPath);
}

// ─── SVG logo builder for partners ────────────────────────────────────────────

function buildPartnerSvg(name) {
  const w = 400;
  const h = 120;
  const fontSize = 22;
  const glyphR = 16;
  const glyphX = 42;
  const glyphCY = h / 2;
  const textX = glyphX + glyphR + 16;
  const textY = h / 2;
  const nameUpper = name.toUpperCase();

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <!-- transparent background -->
  <!-- volleyball glyph -->
  <circle cx="${glyphX}" cy="${glyphCY}" r="${glyphR}" fill="#a855f7" fill-opacity="0.12" stroke="#a855f7" stroke-width="2"/>
  <path d="M ${glyphX - glyphR} ${glyphCY} Q ${glyphX} ${glyphCY - glyphR * 0.8} ${glyphX + glyphR} ${glyphCY}" fill="none" stroke="#a855f7" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M ${glyphX} ${glyphCY - glyphR} Q ${glyphX + glyphR * 0.8} ${glyphCY} ${glyphX} ${glyphCY + glyphR}" fill="none" stroke="#a855f7" stroke-width="1.5" stroke-linecap="round"/>
  <!-- partner name -->
  <text x="${textX}" y="${textY}" font-family="'Arial Black', 'Arial Bold', Helvetica, sans-serif" font-weight="700" font-size="${fontSize}" fill="#a855f7" dominant-baseline="middle" letter-spacing="0.04em">${escapeXml(nameUpper)}</text>
</svg>`;
}

// ─── Image definitions ─────────────────────────────────────────────────────────

const IMAGES = [];
let seed = 0;

// Hero
IMAGES.push({
  path: 'public/images/hero/hero-1.jpg',
  w: 2400, h: 1350,
  kicker: 'MARSEILLAN · ÉTANG DE THAU',
  label: 'Volley Club Marseillanais',
  seed: seed++,
});

// Teams
const teams = [
  { file: 'baby-volley', label: 'Baby Volley' },
  { file: 'jeunes', label: 'Jeunes' },
  { file: 'loisir', label: 'Loisir' },
  { file: 'competition', label: 'Compétition' },
  { file: 'soft-volley', label: 'Soft Volley' },
  { file: 'sport-sante', label: 'Sport Santé' },
  { file: 'beach-volley', label: 'Beach Volley' },
];
for (const t of teams) {
  IMAGES.push({
    path: `public/images/teams/${t.file}.jpg`,
    w: 1600, h: 1000,
    kicker: 'ÉQUIPE',
    label: t.label,
    seed: seed++,
  });
}

// News
const newsItems = [
  { slug: 'finale-championnat-beach-volley-herault-2026', label: 'Finale Beach Volley Hérault' },
  { slug: 'reprise-saison-2025-2026', label: 'Reprise Saison 2025-2026' },
  { slug: 'tournoi-herault-beach-volley-jeunes-2025', label: 'Hérault Beach Volley Jeunes' },
  { slug: 'sport-sante-nouveau-programme-2025', label: 'Sport Santé – Nouveau Programme' },
  { slug: 'victoire-minimes-filles-championnat-herault', label: 'Victoire Minimes Filles' },
];
for (const n of newsItems) {
  IMAGES.push({
    path: `public/images/news/${n.slug}.jpg`,
    w: 1600, h: 1000,
    kicker: 'ACTUALITÉ',
    label: n.label,
    seed: seed++,
  });
}

// Events
const eventItems = [
  { id: 'herault-beach-volley-jeunes-2026', label: 'Hérault Beach Volley Jeunes 2026' },
  { id: 'finale-championnat-beach-volley-2026', label: 'Finale Championnat Beach Volley' },
  { id: 'journee-portes-ouvertes-2026', label: 'Journée Portes Ouvertes' },
  { id: 'tournoi-noel-vcm-2026', label: 'Tournoi de Noël VCM' },
];
for (const e of eventItems) {
  IMAGES.push({
    path: `public/images/events/${e.id}.jpg`,
    w: 1600, h: 1000,
    kicker: 'ÉVÉNEMENT',
    label: e.label,
    seed: seed++,
  });
}

// Gallery (exact dimensions from gallery.ts)
const galleryItems = [
  { n: 1, w: 1200, h: 800,  cat: 'Matchs',        label: 'Attaque en puissance' },
  { n: 2, w: 800,  h: 1200, cat: 'Entraînements',  label: 'Séance Minimes' },
  { n: 3, w: 1200, h: 800,  cat: 'Matchs',        label: 'Duel au filet' },
  { n: 4, w: 1000, h: 1000, cat: 'Jeunes',         label: 'Baby Volley' },
  { n: 5, w: 800,  h: 1200, cat: 'Beach',          label: 'Smash Beach Marseillan' },
  { n: 6, w: 1200, h: 800,  cat: 'Entraînements',  label: 'Exercice de passe' },
  { n: 7, w: 1000, h: 800,  cat: 'Matchs',        label: 'Réception manchette' },
  { n: 8, w: 1200, h: 900,  cat: 'Événements',    label: 'Tournoi Hérault Beach' },
  { n: 9, w: 800,  h: 1000, cat: 'Matchs',        label: 'Joie après victoire' },
  { n: 10, w: 1000, h: 1200, cat: 'Jeunes',        label: 'Benjamines – Service' },
  { n: 11, w: 1200, h: 800,  cat: 'Beach',         label: 'Finale Beach Départ.' },
  { n: 12, w: 800,  h: 1200, cat: 'Événements',    label: 'Portes Ouvertes' },
  { n: 13, w: 1200, h: 800,  cat: 'Entraînements', label: 'Échauffement collectif' },
  { n: 14, w: 1000, h: 1000, cat: 'Événements',    label: 'Tournoi de Noël' },
];
for (const g of galleryItems) {
  IMAGES.push({
    path: `public/images/gallery/${g.n}.jpg`,
    w: g.w, h: g.h,
    kicker: g.cat.toUpperCase(),
    label: 'VCM',
    seed: seed++,
  });
}

// Partners (SVG logos)
const partnerItems = [
  { slug: 'ville-de-marseillan', name: 'Ville de Marseillan' },
  { slug: 'comite-herault-volley', name: 'Comité Hérault Volley' },
  { slug: 'region-occitanie', name: 'Région Occitanie' },
  { slug: 'brasserie-du-soleil', name: 'Brasserie du Soleil' },
  { slug: 'plomberie-meridionale', name: 'Plomberie Méridionale' },
  { slug: 'thau-patrimoine', name: 'Thau Patrimoine' },
  { slug: 'pharmacie-marseillan', name: 'Pharmacie de Marseillan' },
];

// ─── Runner ────────────────────────────────────────────────────────────────────

async function main() {
  let ok = 0;
  let fail = 0;
  const failures = [];

  console.log(`\nGenerating ${IMAGES.length} raster images…\n`);

  for (const img of IMAGES) {
    const outPath = path.join(ROOT, img.path);
    try {
      const svg = buildSvg(img.w, img.h, img.kicker, img.label, img.seed);
      await renderJpeg(svg, outPath);
      process.stdout.write(`  ✓ ${img.path}\n`);
      ok++;
    } catch (err) {
      process.stdout.write(`  ✗ ${img.path} — ${err.message}\n`);
      fail++;
      failures.push(img.path);
    }
  }

  console.log(`\nGenerating ${partnerItems.length} SVG logos…\n`);

  for (const p of partnerItems) {
    const outPath = path.join(ROOT, 'public/logos', `${p.slug}.svg`);
    try {
      const svg = buildPartnerSvg(p.name);
      await writeFile(outPath, svg, 'utf8');
      process.stdout.write(`  ✓ public/logos/${p.slug}.svg\n`);
      ok++;
    } catch (err) {
      process.stdout.write(`  ✗ public/logos/${p.slug}.svg — ${err.message}\n`);
      fail++;
      failures.push(`public/logos/${p.slug}.svg`);
    }
  }

  console.log(`\n─────────────────────────────`);
  console.log(`Total: ${ok} generated, ${fail} failed`);
  if (failures.length) {
    console.log(`\nFailed:\n${failures.map(f => `  - ${f}`).join('\n')}`);
    process.exit(1);
  } else {
    console.log('All images generated successfully!');
  }
}

main().catch(err => {
  console.error('\nFATAL:', err);
  process.exit(1);
});
