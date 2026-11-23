/* Photo studio des chaussettes VCM (public/images/boutique/chaussettes-vcm--blanc.webp).
 * Source : maquette envoyée par le club (WhatsApp, 2026-11-23) + masque rembg
 * birefnet-general (`only_mask=True`). Pas de photo vierge : les chaussettes
 * remplissent la photo, les bords sont donc fondus dans le fond studio.
 * Usage : node scripts/boutique/chaussettes-studio.mjs <photo.jpg> <masque.png> <sortie.webp> [aperçu.png]
 */
import sharp from "sharp";
const [, , SRC, MASK, OUT, PREVIEW] = process.argv;
const { data: px, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { data: mk } = await sharp(MASK).greyscale().resize(info.width, info.height).raw().toBuffer({ resolveWithObject: true });
const w = info.width, h = info.height;
/*
 * Logo de la chaussette de gauche, coupé par le cadre : il deviendrait un
 * logo « fantôme » dans le fondu. On le recouvre du tricot blanc pris 230 px
 * plus bas sur la même chaussette (cercle relevé sur la photo 634 × 1031).
 */
{
  const [lx, ly, lr, edge, shift] = [80, 286, 124, 165, 240];
  for (let y = ly - lr; y <= ly + lr; y++) for (let x = 0; x < edge; x++) {
    const d = Math.hypot(x - lx, y - ly);
    if (d > lr) continue;
    const k = Math.min(1, (lr - d) / 22); // raccord doux, net contre la chaussette voisine
    const i = (y * w + x) * 3, j = ((y + shift) * w + x) * 3;
    for (let c = 0; c < 3; c++) px[i + c] = px[i + c] * (1 - k) + px[j + c] * k;
  }
}
// Toile carrée : chaussettes centrées, un peu d'air au-dessus et en dessous.
const side = Math.round(h * 1.22), ox = Math.round((side - w) / 2), oy = Math.round((side - h) / 2) - 10;
const out = new Float32Array(side * side * 3);
const top = [246, 245, 243], bottom = [226, 224, 221];
const smooth = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
const fade = 150, base = oy + h - 14, cx = side / 2, rx = w * 0.55;
for (let y = 0; y < side; y++) {
  const t = y / side;
  for (let x = 0; x < side; x++) {
    const dx = (x - cx) / rx, dy = (y - base) / (rx * 0.07);
    const dx2 = (x - cx) / (rx * 1.3), dy2 = (y - base) / (rx * 0.25);
    const sh = 0.22 * Math.exp(-(dx * dx + dy * dy) * 1.4) + 0.08 * Math.exp(-(dx2 * dx2 + dy2 * dy2));
    let a = 0, sx = x - ox, sy = y - oy, src = null;
    if (sx >= 0 && sx < w && sy >= 0 && sy < h) {
      const i = sy * w + sx;
      // Bords gauche/droit (chaussettes coupées par le cadre) fondus dans le fond.
      // Bords gauche/droit (chaussettes coupées par le cadre) fondus dans le fond.
      a = (mk[i] / 255) * smooth(Math.min(sx, w - 1 - sx) / fade);
      src = i;
    }
    for (let c = 0; c < 3; c++) {
      const bg = (top[c] * (1 - t) + bottom[c] * t) * (1 - sh);
      out[(y * side + x) * 3 + c] = src === null ? bg : px[src * 3 + c] * a + bg * (1 - a);
    }
  }
}
const buf = Buffer.from(Uint8ClampedArray.from(out));
const img = sharp(buf, { raw: { width: side, height: side, channels: 3 } }).resize(1400, 1400, { kernel: "lanczos3" }).sharpen({ sigma: 0.5 });
await img.clone().webp({ quality: 88 }).toFile(OUT);
if (PREVIEW) await img.clone().png().toFile(PREVIEW);
console.log("ok", side);
