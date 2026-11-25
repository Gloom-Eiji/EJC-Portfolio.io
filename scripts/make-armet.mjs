// Builds the hero's ASCII source image from the armet painting:
// removes the soft beige background, crops away the signature, boosts
// engraving contrast, and writes a grayscale PNG with alpha.
// Run: node scripts/make-armet.mjs
import sharp from "sharp";

const SRC = "assets/armet-reference.png";
const OUT = "public/images/armet.png";
const crop = { left: 30, top: 60, width: 700, height: 900 }; // signature sits below y≈980
const W = 420;

const base = sharp(SRC).extract(crop).resize(W);
const { data: rgb, info } = await base.clone().blur(1.2).raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;
const N = width * height;

// 1) Region-grow the background from the borders across smooth, bright pixels.
const lum = new Float32Array(N);
for (let i = 0; i < N; i++) lum[i] = 0.3 * rgb[i * 3] + 0.59 * rgb[i * 3 + 1] + 0.11 * rgb[i * 3 + 2];
const bg = new Uint8Array(N);
const queue = [];
const seed = (x, y) => {
  const i = y * width + x;
  if (!bg[i] && lum[i] > 150) { bg[i] = 1; queue.push(i); }
};
for (let x = 0; x < width; x++) { seed(x, 0); seed(x, height - 1); }
for (let y = 0; y < height; y++) { seed(0, y); seed(width - 1, y); }
while (queue.length) {
  const i = queue.pop();
  const x = i % width, y = (i / width) | 0;
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const nx = x + dx, ny = y + dy;
    if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
    const j = ny * width + nx;
    if (bg[j]) continue;
    if (lum[j] > 140 && Math.abs(lum[j] - lum[i]) < 5.5) { bg[j] = 1; queue.push(j); }
  }
}

// 2) Keep only the largest foreground component (drops the blurred pole/props).
const comp = new Int32Array(N).fill(-1);
let best = -1, bestSize = 0, id = 0;
for (let s = 0; s < N; s++) {
  if (bg[s] || comp[s] >= 0) continue;
  let size = 0;
  const st = [s];
  comp[s] = id;
  while (st.length) {
    const i = st.pop();
    size++;
    const x = i % width, y = (i / width) | 0;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      const j = ny * width + nx;
      if (!bg[j] && comp[j] < 0) { comp[j] = id; st.push(j); }
    }
  }
  if (size > bestSize) { bestSize = size; best = id; }
  id++;
}
const mask = Buffer.alloc(N);
for (let i = 0; i < N; i++) mask[i] = comp[i] === best ? 255 : 0;
const softMask = await sharp(mask, { raw: { width, height, channels: 1 } }).blur(1.1).extractChannel(0).raw().toBuffer();

// 3) Tone the armor: grayscale, stretch, sharpen the engraving.
const gray = await base
  .clone()
  .grayscale()
  .normalise({ lower: 1, upper: 99.5 })
  .linear(1.15, 12)
  .sharpen({ sigma: 1, m1: 0.5, m2: 1.6 })
  .extractChannel(0)
  .raw()
  .toBuffer();

if (softMask.length !== N || gray.length !== N) throw new Error("expected single-channel buffers");
const out = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) {
  out[i * 4] = out[i * 4 + 1] = out[i * 4 + 2] = gray[i];
  out[i * 4 + 3] = softMask[i];
}
await sharp(out, { raw: { width, height, channels: 4 } }).png().toFile(OUT);
console.log(`wrote ${OUT} ${width}x${height}, foreground ${(100 * bestSize / N).toFixed(1)}%`);
