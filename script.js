const canvas = document.getElementById('city');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
addEventListener('resize', resize);
resize();

const seedBuildings = Array.from({ length: 220 }, (_, i) => ({
  a: (i * 2.399963 + Math.random() * 0.2) % (Math.PI * 2),
  r: 35 + Math.pow(Math.random(), 0.45) * 430,
  h: 50 + Math.random() * 260 + (Math.random() < 0.12 ? Math.random() * 280 : 0),
  w: 18 + Math.random() * 45,
  d: 16 + Math.random() * 42
}));

function ellipse(cx, cy, rx, ry, stroke, width = 1) {
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.strokeStyle = stroke;
  ctx.lineWidth = width;
  ctx.stroke();
}

function frame(time) {
  const W = innerWidth;
  const H = innerHeight;
  ctx.clearRect(0, 0, W, H);

  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#030817');
  sky.addColorStop(0.58, '#07101f');
  sky.addColorStop(1, '#150b02');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = 'rgba(220,235,255,.9)';
  for (let i = 0; i < 360; i++) {
    const x = (i * 97 + Math.sin(time * 0.0002 + i) * 8) % W;
    const y = (i * 53) % (H * 0.5);
    ctx.fillRect(x, y, i % 9 === 0 ? 2 : 1, i % 9 === 0 ? 2 : 1);
  }

  const ox = W / 2;
  const oy = H * 0.72;
  const horizon = H * 0.45;

  ctx.strokeStyle = 'rgba(255,203,78,.23)';
  ctx.lineWidth = 1;
  for (let i = -38; i <= 38; i++) {
    ctx.beginPath();
    ctx.moveTo(ox + i * 35, horizon);
    ctx.lineTo(ox + i * 145, H);
    ctx.stroke();
  }
  for (let j = 0; j < 24; j++) {
    const y = horizon + j * 22 + j * j * 2.6;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  ctx.shadowBlur = 28;
  ctx.shadowColor = '#ffbf2e';
  ellipse(ox, oy - 92, 310, 70, 'rgba(255,215,77,.82)', 7);
  ellipse(ox, oy - 92, 365, 83, 'rgba(255,205,55,.55)', 4);
  ellipse(ox, oy - 92, 425, 97, 'rgba(255,205,55,.33)', 2);

  const rot = time * 0.00008;
  const projected = seedBuildings.map(b => {
    const a = b.a + rot;
    const x = Math.cos(a) * b.r;
    const y = Math.sin(a) * b.r * 0.62;
    return { ...b, x, y, px: ox + (x - y) * 0.82, py: oy + (x + y) * 0.30 };
  }).sort((p, q) => p.py - q.py);

  for (const b of projected) {
    if (((b.px - ox) / 490) ** 2 + ((b.py - (oy - 95)) / 165) ** 2 > 1.35) continue;
    const w = b.w;
    const h = b.h;
    ctx.shadowBlur = 14;
    ctx.fillStyle = '#b66a14';
    ctx.strokeStyle = '#ffd968';
    ctx.lineWidth = 1;
    ctx.fillRect(b.px - w / 2, b.py - h, w, h);
    ctx.strokeRect(b.px - w / 2, b.py - h, w, h);
    ctx.fillStyle = '#ffd34c';
    ctx.fillRect(b.px - w / 2, b.py - h, w, 7);
    ctx.strokeStyle = 'rgba(255,245,165,.35)';
    for (let y = b.py - h + 18; y < b.py - 10; y += 18) {
      ctx.beginPath();
      ctx.moveTo(b.px - w * 0.38, y);
      ctx.lineTo(b.px + w * 0.38, y);
      ctx.stroke();
    }
  }

  ctx.shadowBlur = 30;
  ctx.strokeStyle = 'rgba(255,220,75,.65)';
  ctx.lineWidth = 1.5;
  for (let k = 0; k < 10; k++) {
    const rx = 270 + k * 34;
    const ry = 78 + k * 7;
    ctx.setLineDash([2, 10]);
    ctx.beginPath();
    ctx.ellipse(ox, oy - 190, rx, ry, Math.sin(time * 0.0002 + k) * 0.35, Math.PI, Math.PI * 2);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  ctx.shadowBlur = 0;

  ctx.fillStyle = 'rgba(255,255,255,.94)';
  ctx.font = '700 34px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Golden City Animation', ox, H - 52);

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
