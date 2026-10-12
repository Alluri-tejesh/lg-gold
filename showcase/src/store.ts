/** Mutable state shared between the DOM overlay and the 3D world. Read inside useFrame, so no re-renders. */
export const world = {
  /** Fractional station index: 2.4 means 40% of the way from station 2 to station 3. */
  f: 0,
  /** Tonnes chosen on the container slider. */
  tonnes: 26,
  /** Horizontal drag offset in radians, springs back to zero. */
  drag: 0,
  reduced: typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
};

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (t: number) => t * t * (3 - 2 * t);
