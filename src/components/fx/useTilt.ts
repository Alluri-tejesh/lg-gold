import { useRef, type PointerEvent } from 'react';

/**
 * A gentle 3D tilt towards the pointer, with a soft sheen that follows it.
 * Only for mouse and pen (not touch, where it would fight scrolling), and never with reduced motion.
 * Sets CSS variables --rx, --ry (degrees) and --mx, --my (sheen position) on the element.
 */
export function useTilt<T extends HTMLElement>(max = 5) {
  const ref = useRef<T>(null);
  const raf = useRef(0);

  const onPointerMove = (e: PointerEvent<T>) => {
    if (e.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.setProperty('--ry', `${(px - 0.5) * 2 * max}deg`);
      el.style.setProperty('--rx', `${(0.5 - py) * 2 * max}deg`);
      el.style.setProperty('--mx', `${px * 100}%`);
      el.style.setProperty('--my', `${py * 100}%`);
      el.style.setProperty('--glare', '1');
    });
  };

  const onPointerLeave = () => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(raf.current);
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--glare', '0');
  };

  return { ref, onPointerMove, onPointerLeave };
}
