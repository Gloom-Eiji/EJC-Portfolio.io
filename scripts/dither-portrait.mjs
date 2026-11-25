// One-off asset script: turns a photo into a 1-bit Atkinson-dithered PNG in the
// site palette (bone on transparent). Run: node scripts/dither-portrait.mjs
import sharp from "sharp";

const SRC = "legacy/images/ME.jpg";
const OUT = "public/images/portrait-dither.png";
const crop = { left: 200, top: 260, width: 760, height: 772 };
const W = 520;

const { data, info } = await sharp(SRC)
  .extract(crop)
  .resize(W)
  .grayscale()
  .normalise()
  .gamma(1.6)
  .linear(1.05, -6)
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height } = info;
const px = Float32Array.from(data);
const out = Buffer.alloc(width * height * 4);
const bone = [208, 204, 196];

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const i = y * width + x;
    const old = px[i];
    const nv = old > 132 ? 255 : 0;
    const err = (old - nv) / 8;
    for (const [dx, dy] of [[1, 0], [2, 0], [-1, 1], [0, 1], [1, 1], [0, 2]]) {
      const nx = x + dx, ny = y + dy;
      if (nx >= 0 && nx < width && ny < height) px[ny * width + nx] += err;
    }
    const o = i * 4;
    out[o] = bone[0]; out[o + 1] = bone[1]; out[o + 2] = bone[2];
    out[o + 3] = nv ? 255 : 0;
  }
}

await sharp(out, { raw: { width, height, channels: 4 } }).png().toFile(OUT);
console.log(`wrote ${OUT} (${width}x${height})`);
