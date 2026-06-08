/**
 * gen-og-favicon.mjs
 * Generates OG image (public/og-image.jpg) and app icons for VCM.
 * Run: node scripts/gen-og-favicon.mjs
 */

import sharp from 'sharp';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

/* ── Helpers ─────────────────────────────────────────────────────────────────── */

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function renderPng(svgString, outPath) {
  await mkdir(path.dirname(outPath), { recursive: true });
  await sharp(Buffer.from(svgString)).png({ compressionLevel: 9 }).toFile(outPath);
}

async function renderJpeg(svgString, outPath, quality = 88) {
  await mkdir(path.dirname(outPath), { recursive: true });
  await sharp(Buffer.from(svgString)).jpeg({ quality, mozjpeg: false }).toFile(outPath);
}

/* ── OG Image SVG (1200×630) ─────────────────────────────────────────────────── */

function buildOgSvg() {
  const W = 1200;
  const H = 630;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <!-- Violet → magenta diagonal gradient -->
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"   stop-color="#0a0418"/>
      <stop offset="30%"  stop-color="#2d0b6b"/>
      <stop offset="65%"  stop-color="#7c3aed"/>
      <stop offset="100%" stop-color="#c026d3"/>
    </linearGradient>
    <!-- Accent glow for ball -->
    <radialGradient id="ball-glow" cx="50%" cy="50%" r="60%">
      <stop offset="0%"   stop-color="#a855f7" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#a855f7" stop-opacity="0"/>
    </radialGradient>
    <!-- Vignette -->
    <radialGradient id="vignette" cx="50%" cy="50%" r="75%">
      <stop offset="0%"   stop-color="black" stop-opacity="0"/>
      <stop offset="100%" stop-color="black" stop-opacity="0.55"/>
    </radialGradient>
    <!-- Bottom scrim for text legibility -->
    <linearGradient id="scrim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="black" stop-opacity="0"/>
      <stop offset="100%" stop-color="black" stop-opacity="0.72"/>
    </linearGradient>
    <!-- Subtle noise (inline base64 not needed; use opacity layers) -->
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- Court lines (low opacity) -->
  <rect x="48" y="38" width="${W - 96}" height="${H - 76}" fill="none" stroke="white" stroke-width="1.5" stroke-opacity="0.07" rx="3"/>
  <line x1="${W / 2}" y1="38" x2="${W / 2}" y2="${H - 38}" stroke="white" stroke-width="1.5" stroke-opacity="0.07"/>
  <line x1="48" y1="${H / 2 - 155}" x2="${W - 48}" y2="${H / 2 - 155}" stroke="white" stroke-width="1" stroke-opacity="0.05"/>
  <line x1="48" y1="${H / 2 + 155}" x2="${W - 48}" y2="${H / 2 + 155}" stroke="white" stroke-width="1" stroke-opacity="0.05"/>

  <!-- Volleyball motif (top-right) -->
  <circle cx="980" cy="155" r="220" fill="url(#ball-glow)"/>
  <circle cx="980" cy="155" r="130" fill="white" fill-opacity="0.10" stroke="white" stroke-width="1.5" stroke-opacity="0.18"/>
  <path d="M 850 155 Q 980 70 1110 155"  fill="none" stroke="#a855f7" stroke-width="11" stroke-opacity="0.65" stroke-linecap="round"/>
  <path d="M 980 25  Q 1074 155 980 285" fill="none" stroke="#a855f7" stroke-width="11" stroke-opacity="0.65" stroke-linecap="round"/>
  <path d="M 876 61  Q 1030 155 876 249" fill="none" stroke="#c026d3" stroke-width="8"  stroke-opacity="0.45" stroke-linecap="round"/>

  <!-- Ghost VCM watermark -->
  <text x="600" y="390" font-family="'Arial Black', Helvetica, sans-serif" font-weight="900" font-size="320" fill="white" fill-opacity="0.04" text-anchor="middle" dominant-baseline="middle" letter-spacing="-0.05em">VCM</text>

  <!-- Vignette -->
  <rect width="${W}" height="${H}" fill="url(#vignette)"/>

  <!-- Bottom scrim -->
  <rect x="0" y="${H * 0.45}" width="${W}" height="${H * 0.55}" fill="url(#scrim)"/>

  <!-- Top accent line -->
  <rect x="0" y="0" width="${W}" height="4" fill="url(#bg)"/>
  <rect x="0" y="0" width="${W}" height="4">
    <animate attributeName="opacity" values="0;1" dur="0s" fill="freeze"/>
  </rect>
  <line x1="0" y1="4" x2="${W}" y2="4" stroke="#a855f7" stroke-width="2" stroke-opacity="0.6"/>

  <!-- Left accent bar -->
  <rect x="56" y="295" width="4" height="72" rx="2" fill="#ff4dd2" fill-opacity="0.9"/>

  <!-- "VCM" large display text -->
  <text x="76" y="368" font-family="'Arial Black', 'Impact', Helvetica, sans-serif" font-weight="900" font-size="88" fill="white" fill-opacity="0.97" dominant-baseline="auto" letter-spacing="-0.02em">VCM</text>

  <!-- Club name -->
  <text x="76" y="418" font-family="'Arial', Helvetica, sans-serif" font-weight="700" font-size="30" fill="white" fill-opacity="0.82" dominant-baseline="auto" letter-spacing="0.03em">Volley Club Marseillanais</text>

  <!-- Tagline -->
  <text x="76" y="462" font-family="'Arial', Helvetica, sans-serif" font-weight="600" font-size="20" fill="#ff4dd2" fill-opacity="0.9" dominant-baseline="auto" letter-spacing="0.12em">JOUE. SMASH. GAGNE.</text>

  <!-- Location line -->
  <text x="76" y="510" font-family="'Arial', Helvetica, sans-serif" font-weight="400" font-size="16" fill="white" fill-opacity="0.48" dominant-baseline="auto" letter-spacing="0.18em">MARSEILLAN · ÉTANG DE THAU</text>

  <!-- Subtle dot separator -->
  <circle cx="56" cy="292" r="3" fill="#ff4dd2" fill-opacity="0.8"/>
  <circle cx="56" cy="513" r="2" fill="white"   fill-opacity="0.3"/>
</svg>`;
}

/* ── App Icon SVG (square, used at 512×512 and 180×180) ─────────────────────── */

function buildIconSvg(size) {
  const S = size;
  const radius = Math.round(S * 0.22);
  const cx = S / 2;
  const cy = S / 2;
  const ballR = Math.round(S * 0.26);
  const fontSize = Math.round(S * 0.28);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
  <defs>
    <linearGradient id="icon-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"   stop-color="#2d0b6b"/>
      <stop offset="50%"  stop-color="#7c3aed"/>
      <stop offset="100%" stop-color="#c026d3"/>
    </linearGradient>
    <radialGradient id="icon-glow" cx="60%" cy="35%" r="55%">
      <stop offset="0%"   stop-color="#a855f7" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#a855f7" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="round">
      <rect width="${S}" height="${S}" rx="${radius}" ry="${radius}"/>
    </clipPath>
  </defs>

  <!-- Rounded square background -->
  <rect width="${S}" height="${S}" rx="${radius}" ry="${radius}" fill="url(#icon-bg)"/>

  <!-- Glow overlay -->
  <rect width="${S}" height="${S}" rx="${radius}" ry="${radius}" fill="url(#icon-glow)"/>

  <!-- Ghost volleyball circle (decorative, clipped) -->
  <g clip-path="url(#round)">
    <circle cx="${Math.round(S * 0.72)}" cy="${Math.round(S * 0.28)}" r="${Math.round(S * 0.38)}" fill="white" fill-opacity="0.06" stroke="white" stroke-width="1.5" stroke-opacity="0.12"/>
    <!-- Seam lines on ghost ball -->
    <path d="M ${Math.round(S * 0.34)} ${Math.round(S * 0.28)} Q ${Math.round(S * 0.72)} ${Math.round(S * 0.05)} ${Math.round(S * 1.1)} ${Math.round(S * 0.28)}"
          fill="none" stroke="#a855f7" stroke-width="${Math.round(S * 0.022)}" stroke-opacity="0.5" stroke-linecap="round"/>
    <path d="M ${Math.round(S * 0.72)} ${Math.round(S * -0.1)} Q ${Math.round(S * 1.0)} ${Math.round(S * 0.28)} ${Math.round(S * 0.72)} ${Math.round(S * 0.66)}"
          fill="none" stroke="#a855f7" stroke-width="${Math.round(S * 0.022)}" stroke-opacity="0.5" stroke-linecap="round"/>
  </g>

  <!-- "VCM" wordmark centered -->
  <text
    x="${cx}"
    y="${Math.round(cy + fontSize * 0.35)}"
    font-family="'Arial Black', 'Impact', Helvetica, sans-serif"
    font-weight="900"
    font-size="${fontSize}"
    fill="white"
    fill-opacity="0.97"
    text-anchor="middle"
    dominant-baseline="auto"
    letter-spacing="-0.03em"
  >VCM</text>
</svg>`;
}

/* ── Runner ──────────────────────────────────────────────────────────────────── */

async function main() {
  const tasks = [
    {
      label: 'public/og-image.jpg (1200×630)',
      fn: async () => {
        const out = path.join(ROOT, 'public/og-image.jpg');
        await renderJpeg(buildOgSvg(), out, 88);
      },
    },
    {
      label: 'src/app/icon.png (512×512)',
      fn: async () => {
        const out = path.join(ROOT, 'src/app/icon.png');
        await renderPng(buildIconSvg(512), out);
      },
    },
    {
      label: 'src/app/apple-icon.png (180×180)',
      fn: async () => {
        const out = path.join(ROOT, 'src/app/apple-icon.png');
        await renderPng(buildIconSvg(180), out);
      },
    },
  ];

  console.log('\nGenerating OG image + favicons…\n');
  let ok = 0;
  let fail = 0;

  for (const t of tasks) {
    try {
      await t.fn();
      console.log(`  ✓ ${t.label}`);
      ok++;
    } catch (err) {
      console.error(`  ✗ ${t.label} — ${err.message}`);
      fail++;
    }
  }

  console.log(`\n──────────────────────────────────`);
  console.log(`Done: ${ok} generated, ${fail} failed`);
  if (fail) process.exit(1);
}

main().catch((err) => {
  console.error('\nFATAL:', err);
  process.exit(1);
});
