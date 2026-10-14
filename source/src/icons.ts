import * as THREE from 'three';

type Draw = (ctx: CanvasRenderingContext2D, size: number) => void;

function atom(ctx: CanvasRenderingContext2D, size: number, withPhone: boolean) {
  const r = size * 0.45;
  ctx.lineWidth = size * 0.07;
  for (let i = 0; i < 3; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI) / 3);
    ctx.beginPath();
    ctx.ellipse(0, 0, r, r * 0.38, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.1, 0, Math.PI * 2);
  ctx.fill();
  if (!withPhone) return;
  ctx.lineWidth = size * 0.06;
  const w = size * 0.3;
  const h = size * 0.46;
  ctx.beginPath();
  ctx.roundRect(-w / 2, -h / 2, w, h, size * 0.07);
  ctx.stroke();
}

const icons: Record<string, Draw> = {
  'React Native': (ctx, size) => atom(ctx, size, true),
  React: (ctx, size) => atom(ctx, size, false),
  Swift: (ctx, size) => {
    ctx.beginPath();
    ctx.moveTo(-size * 0.42, -size * 0.3);
    ctx.quadraticCurveTo(size * 0.1, -size * 0.08, size * 0.4, size * 0.36);
    ctx.quadraticCurveTo(-size * 0.05, size * 0.1, -size * 0.3, size * 0.34);
    ctx.quadraticCurveTo(-size * 0.02, -size * 0.02, -size * 0.42, -size * 0.3);
    ctx.closePath();
    ctx.fill();
  },
  Java: (ctx, size) => {
    ctx.lineWidth = size * 0.08;
    ctx.lineCap = 'round';
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(i * size * 0.16, -size * 0.42);
      ctx.quadraticCurveTo(i * size * 0.16 + size * 0.1, -size * 0.3, i * size * 0.16, -size * 0.18);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(-size * 0.3, -size * 0.05);
    ctx.lineTo(size * 0.22, -size * 0.05);
    ctx.lineTo(size * 0.14, size * 0.4);
    ctx.lineTo(-size * 0.22, size * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = size * 0.07;
    ctx.beginPath();
    ctx.arc(size * 0.26, size * 0.1, size * 0.14, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
  },
  Python: (ctx, size) => {
    ctx.lineWidth = size * 0.15;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-size * 0.3, size * 0.36);
    ctx.quadraticCurveTo(size * 0.32, size * 0.3, size * 0.04, -size * 0.02);
    ctx.quadraticCurveTo(-size * 0.3, -size * 0.3, size * 0.3, -size * 0.34);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(size * 0.3, -size * 0.34, size * 0.1, 0, Math.PI * 2);
    ctx.fill();
  },
  AWS: (ctx, size) => {
    ctx.beginPath();
    ctx.arc(-size * 0.18, -size * 0.02, size * 0.2, Math.PI * 0.6, Math.PI * 1.9);
    ctx.arc(size * 0.04, -size * 0.14, size * 0.24, Math.PI * 1.2, Math.PI * 1.9);
    ctx.arc(size * 0.24, -size * 0.02, size * 0.18, Math.PI * 1.4, Math.PI * 0.4);
    ctx.lineTo(-size * 0.3, size * 0.16);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = size * 0.09;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-size * 0.3, size * 0.36);
    ctx.quadraticCurveTo(0, size * 0.52, size * 0.32, size * 0.32);
    ctx.stroke();
  },
  Flutter: (ctx, size) => {
    ctx.beginPath();
    ctx.moveTo(size * 0.36, -size * 0.4);
    ctx.lineTo(-size * 0.04, size * 0.02);
    ctx.lineTo(size * 0.36, size * 0.44);
    ctx.lineTo(size * 0.06, size * 0.44);
    ctx.lineTo(-size * 0.34, size * 0.02);
    ctx.lineTo(size * 0.06, -size * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(size * 0.16, size * 0.04);
    ctx.lineTo(size * 0.36, size * 0.24);
    ctx.lineTo(size * 0.16, size * 0.44);
    ctx.lineTo(-size * 0.04, size * 0.24);
    ctx.closePath();
    ctx.fill();
  },
};

function fallback(name: string): Draw {
  return (ctx, size) => {
    ctx.font = `600 ${size * 0.5}px "DM Sans", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name.slice(0, 2).toUpperCase(), 0, 0);
  };
}

export function createIconTexture(name: string, background: string, ink: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const texture = new THREE.CanvasTexture(canvas);
  if (!ctx) return texture;
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const draw = icons[name] ?? fallback(name);
  for (const x of [256, 768]) {
    ctx.save();
    ctx.translate(x, 256);
    ctx.fillStyle = ink;
    ctx.strokeStyle = ink;
    ctx.lineJoin = 'round';
    draw(ctx, 168);
    ctx.restore();
  }
  texture.anisotropy = 4;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}
