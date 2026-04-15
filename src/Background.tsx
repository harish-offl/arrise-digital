import { useEffect, useRef } from 'react';

interface GlitchLine {
  y: number;
  width: number;
  height: number;
  startX: number;
  color: [number, number, number];
  opacity: number;
  speed: number;
  offsetX: number;
  blur: number;
  layer: number;       // 0=back 1=mid 2=front
  phase: number;
}

const PALETTE: [number, number, number][] = [
  [45,  140, 255],   // blue
  [123, 63,  228],   // violet
  [217, 30,  155],   // magenta
];

function randColor(): [number, number, number] {
  return PALETTE[Math.floor(Math.random() * PALETTE.length)];
}

function makeLine(_W: number, H: number): GlitchLine {
  const layer = Math.random() < 0.35 ? 0 : Math.random() < 0.55 ? 1 : 2;
  // Cluster toward vertical center 25%–75%
  const y = (0.25 + Math.random() * 0.50) * H;

  return {
    y,
    width:   0.12 + Math.random() * 0.70,
    height:  layer === 0 ? 1 + Math.random() * 3
           : layer === 1 ? 2 + Math.random() * 7
           :               4 + Math.random() * 14,
    startX:  Math.random() * 0.4,
    color:   randColor(),
    opacity: layer === 0 ? 0.18 + Math.random() * 0.18
           : layer === 1 ? 0.30 + Math.random() * 0.25
           :               0.55 + Math.random() * 0.30,
    speed:   (Math.random() - 0.5) * (layer === 0 ? 0.12 : layer === 1 ? 0.22 : 0.38),
    offsetX: 0,
    blur:    layer === 0 ? 6 + Math.random() * 10
           : layer === 1 ? 3 + Math.random() * 6
           :               0 + Math.random() * 2,
    layer,
    phase:   Math.random() * Math.PI * 2,
  };
}

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    let W = 0, H = 0, frame = 0;
    let lines: GlitchLine[] = [];
    const LINE_COUNT = 60;

    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      lines = Array.from({ length: LINE_COUNT }, () => makeLine(W, H));
    };
    resize();
    window.addEventListener('resize', resize);

    function drawLine(l: GlitchLine, t: number) {
      const [r, g, b] = l.color;
      const flicker = Math.sin(t * 0.07 + l.phase) > 0.93 ? Math.random() * 0.4 : 0;
      const alpha   = Math.max(0, l.opacity - flicker);

      const sx = (l.startX + l.offsetX / W) * W;
      const ex = sx + l.width * W;
      const y  = l.y;
      const h  = l.height;

      // Neon glow passes
      const glows = l.layer === 2
        ? [{ s: 22, a: 0.45 }, { s: 44, a: 0.28 }, { s: 66, a: 0.15 }]
        : l.layer === 1
        ? [{ s: 14, a: 0.30 }, { s: 28, a: 0.18 }]
        : [{ s: 8,  a: 0.18 }];

      for (const gw of glows) {
        ctx.save();
        ctx.shadowColor = `rgba(${r},${g},${b},${gw.a})`;
        ctx.shadowBlur  = gw.s;
        ctx.globalAlpha = alpha * 0.5;
        ctx.fillStyle   = `rgba(${r},${g},${b},0.08)`;
        ctx.fillRect(sx, y - h / 2 - gw.s * 0.4, ex - sx, h + gw.s * 0.8);
        ctx.restore();
      }

      // Motion blur duplicate
      if (l.blur > 0) {
        ctx.save();
        ctx.globalAlpha = alpha * 0.22;
        ctx.filter      = `blur(${l.blur}px)`;
        const bg = ctx.createLinearGradient(sx, 0, ex, 0);
        bg.addColorStop(0,   `rgba(${r},${g},${b},0)`);
        bg.addColorStop(0.15,`rgba(${r},${g},${b},1)`);
        bg.addColorStop(0.85,`rgba(${r},${g},${b},1)`);
        bg.addColorStop(1,   `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = bg;
        ctx.fillRect(sx - l.blur, y - h / 2, ex - sx + l.blur * 2, h);
        ctx.restore();
      }

      // Glitch offset copy
      const gOff = Math.sin(t * 0.045 + l.phase) * 2.5;
      ctx.save();
      ctx.globalAlpha = alpha * 0.28;
      ctx.fillStyle   = `rgba(${r},${g},${b},0.7)`;
      ctx.fillRect(sx + gOff, y - h / 2 + 1, ex - sx, h * 0.55);
      ctx.restore();

      // Main line
      ctx.save();
      ctx.globalAlpha = alpha;
      const mg = ctx.createLinearGradient(sx, 0, ex, 0);
      mg.addColorStop(0,    `rgba(${r},${g},${b},0)`);
      mg.addColorStop(0.08, `rgba(${r},${g},${b},1)`);
      mg.addColorStop(0.92, `rgba(${r},${g},${b},1)`);
      mg.addColorStop(1,    `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = mg;
      ctx.fillRect(sx, y - h / 2, ex - sx, h);
      ctx.restore();
    }

    function drawAmbient() {
      const pts = [
        { cx: 0.28, cy: 0.38, cr: '123,63,228',  a: 0.10, r: 0.52 },
        { cx: 0.72, cy: 0.62, cr: '45,140,255',  a: 0.08, r: 0.46 },
        { cx: 0.50, cy: 0.50, cr: '217,30,155',  a: 0.06, r: 0.38 },
      ];
      for (const p of pts) {
        const grd = ctx.createRadialGradient(
          p.cx * W, p.cy * H, 0,
          p.cx * W, p.cy * H, Math.min(W, H) * p.r
        );
        grd.addColorStop(0, `rgba(${p.cr},${p.a})`);
        grd.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.save();
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }
    }

    // Soft white vignette — only at center, very light, for premium feel
    function drawSoftVignette() {
      // Edges stay dark, center gets a very faint white lift
      const cg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.min(W, H) * 0.6);
      cg.addColorStop(0,   'rgba(255,255,255,0.04)');
      cg.addColorStop(0.5, 'rgba(255,255,255,0.02)');
      cg.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.save();
      ctx.fillStyle = cg;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, W, H);

      // 1. Deep black base
      const base = ctx.createLinearGradient(0, 0, W, H);
      base.addColorStop(0,   '#050507');
      base.addColorStop(0.5, '#0A0A0F');
      base.addColorStop(1,   '#000000');
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, W, H);

      // 2. Ambient color blobs
      drawAmbient();

      // 3. Back layer lines (blurred, faint)
      for (const l of lines) {
        if (l.layer !== 0) continue;
        l.offsetX += l.speed;
        if (Math.abs(l.offsetX) > W * 0.35) l.offsetX *= -1;
        drawLine(l, frame);
      }

      // 4. Mid layer
      for (const l of lines) {
        if (l.layer !== 1) continue;
        l.offsetX += l.speed;
        if (Math.abs(l.offsetX) > W * 0.35) l.offsetX *= -1;
        drawLine(l, frame);
      }

      // 5. Front layer (sharp, bright)
      for (const l of lines) {
        if (l.layer !== 2) continue;
        l.offsetX += l.speed;
        if (Math.abs(l.offsetX) > W * 0.35) l.offsetX *= -1;
        drawLine(l, frame);
      }

      // 6. Subtle center lift
      drawSoftVignette();

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
