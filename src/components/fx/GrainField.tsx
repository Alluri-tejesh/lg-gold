import React, { useEffect, useRef } from 'react';

interface Grain {
  hx: number; // home position (fraction of width/height)
  hy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  a: number; // angle
  va: number;
  s: number; // size
  tone: number; // 0..1 cream -> gold
  phase: number;
}

const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Rice grains drifting behind the hero. They part around the cursor (or a finger) like grains brushed by a hand,
 * then settle back. Drawn on one canvas; stops when off screen or when the tab is hidden; a still picture when the
 * visitor prefers reduced motion.
 */
export const GrainField: React.FC<{ className?: string; density?: number }> = ({ className = '', density = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const host = canvas.parentElement!;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    const pointer = { x: -9999, y: -9999, active: false };
    let grains: Grain[] = [];

    const seed = () => {
      const count = Math.round(Math.min(110, (w * h) / 11000) * density);
      // A few large grains in front, many small ones behind, for depth.
      grains = Array.from({ length: count }, (_, i) => {
        const hx = Math.random();
        const hy = Math.random();
        return {
          hx,
          hy,
          x: hx * w,
          y: hy * h,
          vx: 0,
          vy: 0,
          a: Math.random() * Math.PI,
          va: (Math.random() - 0.5) * 0.004,
          s: i % 9 === 0 ? 1.6 : 0.7 + Math.random() * 0.6,
          tone: Math.random(),
          phase: Math.random() * Math.PI * 2,
        };
      });
    };

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = host.clientWidth;
      h = host.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const drawGrain = (g: Grain) => {
      const len = 9 * g.s;
      const wid = 3.2 * g.s;
      ctx.save();
      ctx.translate(g.x, g.y);
      ctx.rotate(g.a);
      const grad = ctx.createLinearGradient(0, -wid, 0, wid);
      const alpha = 0.35 + g.s * 0.25;
      grad.addColorStop(0, `rgba(255, 253, 244, ${alpha})`);
      grad.addColorStop(1, g.tone > 0.7 ? `rgba(220, 187, 79, ${alpha})` : `rgba(231, 213, 154, ${alpha})`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(0, 0, len, wid, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 0.7;
      ctx.strokeStyle = `rgba(138, 101, 12, ${0.18 + g.s * 0.12})`;
      ctx.stroke();
      ctx.restore();
    };

    let t = 0;
    const frame = () => {
      raf = 0;
      if (!visible) return;
      t += 1;
      ctx.clearRect(0, 0, w, h);
      for (const g of grains) {
        // Gentle drift around the home spot.
        const homeX = g.hx * w + Math.sin(t * 0.004 + g.phase) * 14;
        const homeY = g.hy * h + Math.cos(t * 0.003 + g.phase) * 10;
        g.vx += (homeX - g.x) * 0.012;
        g.vy += (homeY - g.y) * 0.012;
        // Push away from the pointer.
        if (pointer.active) {
          const dx = g.x - pointer.x;
          const dy = g.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          const r = 140;
          if (d2 < r * r) {
            const d = Math.sqrt(d2) || 1;
            const force = (1 - d / r) * 2.4;
            g.vx += (dx / d) * force;
            g.vy += (dy / d) * force;
            g.va += (dx > 0 ? 1 : -1) * 0.002 * force;
          }
        }
        g.vx *= 0.88;
        g.vy *= 0.88;
        g.va *= 0.96;
        g.x += g.vx;
        g.y += g.vy;
        g.a += g.va + 0.0008;
        drawGrain(g);
      }
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (!raf && visible) raf = requestAnimationFrame(frame);
    };

    resize();
    const reduced = prefersReduced();
    if (reduced) {
      for (const g of grains) drawGrain(g);
    } else start();

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.active = pointer.x >= 0 && pointer.y >= 0 && pointer.x <= r.width && pointer.y <= r.height;
    };
    const onLeave = () => (pointer.active = false);
    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) for (const g of grains) drawGrain(g);
    });
    ro.observe(host);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting && document.visibilityState === 'visible';
      if (!reduced) start();
    });
    io.observe(canvas);
    const onVis = () => {
      visible = document.visibilityState === 'visible';
      if (!reduced) start();
    };
    if (!reduced) {
      host.addEventListener('pointermove', onMove);
      host.addEventListener('pointerleave', onLeave);
      document.addEventListener('visibilitychange', onVis);
    }
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [density]);

  return <canvas ref={canvasRef} aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`} />;
};
