import React, { useEffect, useRef, useState } from 'react';

/**
 * Gentle, one-time motion helpers. Nothing loops, nothing moves more than a few pixels,
 * and everything shows its final state straight away when the visitor prefers reduced motion.
 */
export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Returns [ref, seen]: seen turns true the first time the element scrolls into view. */
export function useInView<T extends Element>(threshold = 0.2): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -6% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, seen];
}

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

/** Fades and lifts its content by a few pixels the first time it scrolls into view. */
export const Reveal: React.FC<RevealProps> = ({ children, delay = 0, className = '' }) => {
  const [ref, seen] = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`reveal ${seen ? 'is-in' : ''} ${className}`}
      style={{ ['--d' as string]: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

interface CountUpProps {
  to: number;
  suffix?: string;
  duration?: number;
  format?: (n: number) => string;
}

/** Counts from zero to a number once, when it first scrolls into view. */
export const CountUp: React.FC<CountUpProps> = ({ to, suffix = '', duration = 1100, format }) => {
  const [ref, seen] = useInView<HTMLSpanElement>(0.5);
  const [value, setValue] = useState(prefersReducedMotion() ? to : 0);

  useEffect(() => {
    if (!seen || prefersReducedMotion()) {
      if (seen) setValue(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setValue(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, to, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {format ? format(value) : value}
      {suffix}
    </span>
  );
};

/** A thin gold bar under the header showing how far down the page you are. */
export const ScrollProgress: React.FC = () => {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div className="fixed top-0 inset-x-0 z-[60] h-[3px] pointer-events-none" aria-hidden="true">
      <div ref={bar} className="h-full w-full bg-gradient-to-r from-gold-500 to-gold-400 origin-left" style={{ transform: 'scaleX(0)' }} />
    </div>
  );
};
