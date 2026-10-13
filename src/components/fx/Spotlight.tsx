import React, { useRef } from 'react';

/**
 * A soft gold light that follows the cursor across a dark section. Children with the `spot-border` class
 * get a glowing edge where the light passes. Mouse only; nothing moves on touch or with reduced motion.
 */
export const Spotlight: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = '', children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--sx', `${e.clientX - r.left}px`);
    el.style.setProperty('--sy', `${e.clientY - r.top}px`);
    el.style.setProperty('--so', '1');
    // Each bordered card needs the position relative to itself.
    el.querySelectorAll<HTMLElement>('.spot-border').forEach((card) => {
      const c = card.getBoundingClientRect();
      card.style.setProperty('--cx', `${e.clientX - c.left}px`);
      card.style.setProperty('--cy', `${e.clientY - c.top}px`);
    });
  };
  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={() => ref.current?.style.setProperty('--so', '0')} className={`spotlight relative ${className}`}>
      {children}
    </div>
  );
};
