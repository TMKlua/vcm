import sharp from "sharp";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = "public/images";
const MAX = 1600; // longest side
const Q = 72;

function walk(dir) {
  let out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out = out.concat(walk(p));
    else if (/\.jpe?g$/i.test(name)) out.push(p);
  }
  return out;
}

const files = walk(ROOT);
let before = 0, after = 0;
for (const f of files) {
  before += statSync(f).size;
  const buf = await sharp(f)
    .rotate()
    .resize({ width: MAX, height: MAX, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: Q, mozjpeg: true })
    .toBuffer();
  await sharp(buf).toFile(f);
  after += statSync(f).size;
}
console.log(
  `Compressed ${files.length} images: ${(before / 1e6).toFixed(2)}MB -> ${(after / 1e6).toFixed(2)}MB`
);
