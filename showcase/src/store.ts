/** Mutable state shared between the DOM overlay and the 3D world. Read inside useFrame, so no re-renders. */
export const world = {
  /** Fractional station index: 2.4 means 40% of the way from station 2 to station 3. */
  f: 0,
  /** Tonnes chosen on the container slider. */
  tonnes: 26,
  /** Horizontal drag offset in radians, springs back to zero. */
  drag: 0,
  /**
   * Ambient motion (swaying, bobbing, spinning, camera drift) is switched off for everyone: continuous
   * movement made some visitors feel unwell. Only motion the visitor triggers, or that explains the
   * product (the sorter belt, the bag filling), remains.
   */
  reduced: true,
  /** The visitor's own OS setting. Explanatory motion also stops when this is on. */
  osReduced: typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
};

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (t: number) => t * t * (3 - 2 * t);
