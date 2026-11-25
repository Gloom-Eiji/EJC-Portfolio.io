// Draws the knight in a 200 × 260 design space. The ASCII renderer samples
// this drawing every frame, so anything animated here (plume, cape, gleam,
// breathing) shows up as moving glyphs.

export const ART_W = 200;
export const ART_H = 260;

const grey = (v: number, a = 1) => {
  const c = Math.max(0, Math.min(255, Math.round(v * 255)));
  return a === 1 ? `rgb(${c},${c},${c})` : `rgba(${c},${c},${c},${a})`;
};

function metal(g: CanvasRenderingContext2D, x0: number, x1: number, dark = 0) {
  const grad = g.createLinearGradient(x0, 0, x1, 0);
  grad.addColorStop(0, grey(0.5 - dark));
  grad.addColorStop(0.28, grey(0.97 - dark));
  grad.addColorStop(0.5, grey(0.74 - dark));
  grad.addColorStop(0.8, grey(0.46 - dark));
  grad.addColorStop(0.93, grey(0.34 - dark));
  grad.addColorStop(1, grey(0.7 - dark)); // rim light
  return grad;
}

export function drawKnight(g: CanvasRenderingContext2D, t: number) {
  const sway = Math.sin(t * 0.8);
  const breathe = Math.sin(t * 1.1) * 0.9;

  g.fillStyle = "#000";
  g.fillRect(0, 0, ART_W, ART_H);

  // ---- Cape (behind everything) ----
  const capeGrad = g.createLinearGradient(0, 110, 0, 262);
  capeGrad.addColorStop(0, grey(0.36));
  capeGrad.addColorStop(1, grey(0.1));
  g.fillStyle = capeGrad;
  g.beginPath();
  g.moveTo(62, 120);
  g.bezierCurveTo(42 + sway * 3, 170, 22 + sway * 7, 215, 10 + sway * 10, 262);
  g.lineTo(190 + sway * 10, 262);
  g.bezierCurveTo(178 + sway * 7, 215, 158 + sway * 3, 170, 138, 120);
  g.closePath();
  g.fill();
  g.strokeStyle = "rgba(0,0,0,0.75)";
  g.lineWidth = 3.2;
  for (const fx of [28, 48, 152, 172]) {
    g.beginPath();
    g.moveTo(fx + (100 - fx) * 0.45, 140);
    g.quadraticCurveTo(fx + sway * 5, 200, fx - (100 - fx) * 0.18 + sway * 10, 262);
    g.stroke();
  }

  g.save();
  g.translate(0, breathe);

  // Head group (plume + helm) is scaled slightly around the neck.
  const headScale = (fn: () => void) => {
    g.save();
    g.translate(100, 116);
    g.scale(0.9, 0.9);
    g.translate(-100, -116);
    fn();
    g.restore();
  };

  headScale(() => {
    // ---- Plume: a horsehair crest that falls behind the right shoulder ----
    const plumePt = (k: number) => {
      const wave = Math.sin(t * 1.5 - k * 4.2) * k * 6;
      return {
        x: 100 + 60 * k + wave * 0.5,
        y: 28 - 26 * Math.sin(k * Math.PI * 0.75) + 92 * k * k + wave * 0.6,
      };
    };
    for (let i = 0; i < 40; i++) {
      const k = i / 39;
      const { x, y } = plumePt(k);
      g.fillStyle = grey(0.9 - k * 0.5);
      g.beginPath();
      g.arc(x, y, 12.5 * (1 - k * 0.62), 0, Math.PI * 2);
      g.fill();
    }
    g.strokeStyle = "rgba(0,0,0,0.55)";
    g.lineWidth = 1.1;
    for (const off of [-6, 0, 6]) {
      g.beginPath();
      for (let i = 0; i <= 30; i++) {
        const k = 0.08 + (i / 30) * 0.9;
        const { x, y } = plumePt(k);
        const o = off * (1 - k * 0.6);
        if (i === 0) g.moveTo(x - o * 0.5, y + o);
        else g.lineTo(x - o * 0.5, y + o);
      }
      g.stroke();
    }

  });

  // ---- Breastplate ----
  g.fillStyle = metal(g, 66, 134, 0.12);
  g.beginPath();
  g.moveTo(64, 124);
  g.quadraticCurveTo(100, 114, 136, 124);
  g.lineTo(131, 172);
  g.quadraticCurveTo(100, 186, 69, 172);
  g.closePath();
  g.fill();
  g.strokeStyle = grey(1);
  g.lineWidth = 1.6;
  g.beginPath();
  g.moveTo(100, 120);
  g.lineTo(100, 178);
  g.stroke();
  // plate lames
  g.strokeStyle = "rgba(0,0,0,0.8)";
  g.lineWidth = 1.4;
  for (const y of [150, 162]) {
    g.beginPath();
    g.moveTo(70, y);
    g.quadraticCurveTo(100, y + 9, 130, y);
    g.stroke();
  }

  // ---- Tabard / skirt ----
  const tab = g.createLinearGradient(0, 172, 0, 262);
  tab.addColorStop(0, grey(0.24));
  tab.addColorStop(1, grey(0.06));
  g.fillStyle = tab;
  g.beginPath();
  g.moveTo(70, 172);
  g.lineTo(130, 172);
  g.lineTo(136 + sway * 1.5, 262);
  g.lineTo(64 + sway * 1.5, 262);
  g.closePath();
  g.fill();
  g.fillStyle = grey(0.5);
  g.fillRect(68, 168, 64, 6);
  g.fillStyle = grey(0.95);
  g.fillRect(96, 167, 8, 8);
  g.fillStyle = "#000";
  g.fillRect(98.5, 169.5, 3, 3);

  // ---- Pauldrons ----
  for (const side of [-1, 1]) {
    const cx = 100 + side * 39;
    const lit = side < 0 ? 0 : 0.16;
    for (let l = 2; l >= 0; l--) {
      const cy = 126 + l * 8;
      const rx = 27 - l * 2.5;
      const ry = 14 - l * 1.6;
      const grad = g.createLinearGradient(cx - rx, cy - ry, cx + rx, cy + ry);
      grad.addColorStop(0, grey(0.95 - lit - l * 0.08));
      grad.addColorStop(0.6, grey(0.55 - lit - l * 0.08));
      grad.addColorStop(1, grey(0.2 - l * 0.04));
      g.fillStyle = grad;
      g.beginPath();
      g.ellipse(cx, cy, rx, ry, side * 0.18, Math.PI, Math.PI * 2);
      g.ellipse(cx, cy, rx, ry * 0.55, side * 0.18, 0, Math.PI);
      g.fill();
      g.strokeStyle = "rgba(0,0,0,0.85)";
      g.lineWidth = 1.2;
      g.stroke();
    }
  }

  // ---- Arms ----
  g.lineCap = "round";
  for (const side of [-1, 1]) {
    g.strokeStyle = side < 0 ? grey(0.62) : grey(0.36);
    g.lineWidth = 15;
    g.beginPath();
    g.moveTo(100 + side * 40, 142);
    g.quadraticCurveTo(100 + side * 34, 166, 100 + side * 13, 172);
    g.stroke();
    g.strokeStyle = side < 0 ? grey(0.95) : grey(0.55);
    g.lineWidth = 1.6;
    g.beginPath();
    g.moveTo(100 + side * 44, 146);
    g.quadraticCurveTo(100 + side * 38, 162, 100 + side * 22, 168);
    g.stroke();
  }

  // ---- Gorget ----
  g.fillStyle = metal(g, 80, 120, 0.2);
  g.beginPath();
  g.moveTo(78, 108);
  g.lineTo(122, 108);
  g.lineTo(126, 124);
  g.quadraticCurveTo(100, 130, 74, 124);
  g.closePath();
  g.fill();

  headScale(() => {
    // ---- Great helm ----
    g.fillStyle = metal(g, 69, 131);
    g.beginPath();
    g.moveTo(72, 112);
    g.lineTo(69.5, 58);
    g.quadraticCurveTo(70, 33, 100, 31);
    g.quadraticCurveTo(130, 33, 130.5, 58);
    g.lineTo(128, 112);
    g.quadraticCurveTo(100, 121, 72, 112);
    g.closePath();
    g.fill();
    // crown band
    g.strokeStyle = "rgba(0,0,0,0.7)";
    g.lineWidth = 1.4;
    g.beginPath();
    g.moveTo(70, 56);
    g.quadraticCurveTo(100, 50, 130, 56);
    g.stroke();
    // eye slits
    g.fillStyle = "#000";
    g.fillRect(72, 68, 25, 8);
    g.fillRect(103, 68, 25, 8);
    // glint inside the visor — the knight is watching
    const blink = Math.sin(t * 0.7) > 0.985 ? 0 : 1;
    g.fillStyle = grey(0.55 * blink);
    g.fillRect(84, 71, 3, 2.5);
    g.fillRect(113, 71, 3, 2.5);
    // central ridge
    g.fillStyle = grey(1);
    g.fillRect(98.6, 33, 2.8, 82);
    // breaths (cross of holes)
    g.fillStyle = "#000";
    for (const [x, y] of [[116, 90], [121, 90], [111, 90], [116, 85], [116, 95], [116, 100], [84, 90], [79, 90], [89, 90], [84, 85], [84, 95], [84, 100]]) {
      g.beginPath();
      g.arc(x, y, 1.5, 0, Math.PI * 2);
      g.fill();
    }
  });

  g.restore();

  // ---- Sword (planted, hands on the guard) ----
  const blade = g.createLinearGradient(96, 0, 104, 0);
  blade.addColorStop(0, grey(1));
  blade.addColorStop(0.5, grey(0.85));
  blade.addColorStop(0.51, grey(0.45));
  blade.addColorStop(1, grey(0.3));
  g.fillStyle = blade;
  g.beginPath();
  g.moveTo(96.4, 186);
  g.lineTo(103.6, 186);
  g.lineTo(103, 246);
  g.lineTo(100, 259);
  g.lineTo(97, 246);
  g.closePath();
  g.fill();
  // travelling gleam
  const cycle = (t * 0.32) % 1.8;
  if (cycle < 1) {
    const gy = 186 + cycle * 76;
    g.save();
    g.clip();
    const glow = g.createLinearGradient(0, gy - 7, 0, gy + 7);
    glow.addColorStop(0, "rgba(255,255,255,0)");
    glow.addColorStop(0.5, "rgba(255,255,255,1)");
    glow.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = glow;
    g.fillRect(90, gy - 7, 20, 14);
    g.restore();
  }
  // grip + pommel
  g.fillStyle = grey(0.3);
  g.fillRect(97.5, 158, 5, 26);
  g.fillStyle = grey(0.95);
  g.beginPath();
  g.arc(100, 155, 5, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = grey(0.4);
  g.beginPath();
  g.arc(101.5, 156.5, 2, 0, Math.PI * 2);
  g.fill();
  // crossguard
  g.fillStyle = grey(0.98);
  g.fillRect(72, 181, 56, 5);
  g.beginPath();
  g.arc(72, 185, 3.4, 0, Math.PI * 2);
  g.arc(128, 185, 3.4, 0, Math.PI * 2);
  g.fill();
  // gauntlets
  g.fillStyle = grey(0.72);
  g.beginPath();
  g.roundRect(85, 163, 30, 15, 5);
  g.fill();
  g.strokeStyle = "rgba(0,0,0,0.85)";
  g.lineWidth = 1.2;
  for (const x of [92, 100, 108]) {
    g.beginPath();
    g.moveTo(x, 164);
    g.lineTo(x, 177);
    g.stroke();
  }

  // ---- Fade into the dark ----
  const fade = g.createLinearGradient(0, 190, 0, 262);
  fade.addColorStop(0, "rgba(0,0,0,0)");
  fade.addColorStop(1, "rgba(0,0,0,0.92)");
  g.fillStyle = fade;
  g.fillRect(0, 190, ART_W, 72);
}
