import React, { useId } from 'react';

/**
 * The Sri Lakshmi Ganapathi Trading Company mark, redrawn as vectors from the official logo:
 * an open G with an L inside, a small S seal and twin wheat ears, in a double ring with the company name around it.
 * Drawn in code so it is sharp at any size and costs no image download.
 */

const GREEN = '#174A32';
const GOLD = '#C9A227';

/** A wheat ear from its base to its tip: a stem with grains in pairs and one at the tip. */
const Sprig: React.FC<{ from: [number, number]; to: [number, number]; color: string; size?: number; className?: string }> = ({
  from: [x1, y1],
  to: [x2, y2],
  color,
  size = 1,
  className,
}) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const deg = (Math.atan2(dy, dx) * 180) / Math.PI + 90; // grains point along the stem
  const grains: { x: number; y: number; r: number }[] = [];
  // A slender ear: four pairs of small grains up the top two-thirds of the stem, set apart in a herringbone.
  for (const t of [0.34, 0.5, 0.66, 0.82]) {
    for (const side of [-1, 1]) {
      grains.push({ x: x1 + dx * t - uy * side * 1.25 * size, y: y1 + dy * t + ux * side * 1.25 * size, r: deg + side * 42 });
    }
  }
  return (
    <g className={className} style={{ transformOrigin: `${x1}px ${y1}px` }}>
      <path d={`M${x1} ${y1} L${x2 - ux * 1.2 * size} ${y2 - uy * 1.2 * size}`} stroke={color} strokeWidth={0.55 * size} strokeLinecap="round" />
      {grains.map((g, i) => (
        <ellipse key={i} cx={g.x} cy={g.y} rx={0.42 * size} ry={1.15 * size} fill={color} stroke="none" transform={`rotate(${g.r} ${g.x} ${g.y})`} />
      ))}
      <ellipse cx={x2} cy={y2} rx={0.42 * size} ry={1.3 * size} fill={color} stroke="none" transform={`rotate(${deg} ${x2} ${y2})`} />
    </g>
  );
};

/**
 * The monogram on a 100 × 100 grid centred on 50,50. `weight` is the line thickness: the official logo uses
 * fine lines (about 2.4); small sizes such as the header and browser tab need bolder ones (about 6) to stay crisp.
 */
export const Monogram: React.FC<{ weight?: number; color?: string }> = ({ weight = 6, color = GREEN }) => (
  <g fill="none" stroke={color} strokeWidth={weight}>
    {/* G: an open circle from 12 o'clock round to 3 o'clock, then the bar into the centre */}
    <path className="lm-g" pathLength={100} d="M47.3 19.1 A31 31 0 1 0 81 50" strokeLinecap="butt" />
    {/* L, its foot joining the G's spur */}
    <path className="lm-l" pathLength={100} d={`M46.5 35.5 V65.5 H65 V50 H${81 + weight / 2}`} strokeLinejoin="miter" strokeLinecap="butt" />
    {/* S seal */}
    <circle cx="35" cy="34" r={4.4 + weight * 0.12} fill={color} stroke="none" />
    <text x="35" y="34.3" fill="#fff" stroke="none" fontSize={5.4 + weight * 0.15} fontWeight={800} fontFamily="Inter, Arial, sans-serif" textAnchor="middle" dominantBaseline="central">
      S
    </text>
    {/* twin wheat ears */}
    {/* A V of two ears, bases close together just above the G's bar, as on the logo */}
    <Sprig className="lm-wheat lm-wheat-l" from={[56.6, 46.5]} to={[52.4, 33]} color={color} size={0.7 + weight * 0.15} />
    <Sprig className="lm-wheat lm-wheat-r" from={[61.6, 46.5]} to={[67.8, 33.5]} color={color} size={0.7 + weight * 0.15} />
  </g>
);

/** The badge: white disc, double ring and the monogram. Used wherever the logo is small (header, admin, icons). */
export const LogoMark: React.FC<{ className?: string; title?: string }> = ({ className = 'w-10 h-10', title }) => (
  <svg viewBox="0 0 100 100" className={`logo-mark ${className}`} role={title ? 'img' : undefined} aria-hidden={title ? undefined : true}>
    {title && <title>{title}</title>}
    <circle cx="50" cy="50" r="49" fill="#fff" />
    <circle cx="50" cy="50" r="46.6" fill="none" stroke={GREEN} strokeWidth="3.2" />
    <circle cx="50" cy="50" r="41.6" fill="none" stroke={GREEN} strokeWidth="1" />
    <g transform="translate(50 50) scale(0.84) translate(-50 -50)">
      <Monogram weight={6.2} />
    </g>
  </svg>
);

/** A point on a circle around 120,120; angle in degrees, clockwise from 3 o'clock. */
const at = (r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return [120 + r * Math.cos(a), 120 + r * Math.sin(a)].map((n) => +n.toFixed(2));
};

/**
 * The full seal, as on the official logo: the company name running round the ring, the gold wheat sprig on the left,
 * and the fine-line monogram in the centre. For larger places (footer, admin sign-in, share image).
 */
export const LogoSeal: React.FC<{ className?: string; title?: string }> = ({ className = 'w-32 h-32', title = 'Sri Lakshmi Ganapathi Trading Company' }) => {
  const id = useId().replace(/:/g, '');
  const R = 90; // text circle
  const [sx, sy] = at(R, 198);
  const [mx, my] = at(R, 18);
  return (
    <svg viewBox="0 0 240 240" className={`logo-seal ${className}`} role="img" aria-label={title}>
      <defs>
        {/* Clockwise from the left, so the name reads over the top and continues round the bottom, as on the logo. */}
        <path id={`${id}t`} d={`M${sx} ${sy} A${R} ${R} 0 1 1 ${mx} ${my} A${R} ${R} 0 1 1 ${sx} ${sy}`} />
      </defs>
      <circle cx="120" cy="120" r="119" fill="#fff" />
      <circle cx="120" cy="120" r="115" fill="none" stroke={GREEN} strokeWidth="4.2" />
      <circle cx="120" cy="120" r="107.5" fill="none" stroke={GREEN} strokeWidth="1.3" />
      <circle cx="120" cy="120" r="72" fill="none" stroke={GREEN} strokeWidth="1.6" />
      <g className="seal-text">
        <text fill={GREEN} fontSize="15.5" fontWeight={800} fontFamily="Inter, Montserrat, Arial, sans-serif" letterSpacing="1.2">
          <textPath href={`#${id}t`} startOffset="0" textLength={508} lengthAdjust="spacing">
            SRI LAKSHMI GANAPATHI TRADING COMPANY
          </textPath>
        </text>
        {/* the gold sprig between the end and the start of the name */}
        <Sprig from={at(82, 186) as [number, number]} to={at(99, 177) as [number, number]} color={GOLD} size={1.9} />
        <Sprig from={at(82, 186) as [number, number]} to={at(97, 189.5) as [number, number]} color={GOLD} size={1.6} />
      </g>
      <g transform="translate(120 120) scale(1.72) translate(-50 -50)">
        <Monogram weight={2.6} />
      </g>
    </svg>
  );
};

/** Badge + "LG GOLD" wordmark + company line. `dark` is for green backgrounds. */
export const Logo: React.FC<{ dark?: boolean; compact?: boolean; className?: string; taglineOnPhones?: boolean }> = ({
  dark,
  compact,
  className = '',
  taglineOnPhones = true,
}) => (
  <span className={`logo-lockup inline-flex items-center gap-3 ${className}`}>
    <LogoMark className="w-11 h-11 shrink-0 drop-shadow-sm" />
    <span className="flex flex-col leading-none">
      <span className={`font-display font-bold text-[1.55rem] tracking-tight ${dark ? 'text-white' : 'text-forest-800'}`}>
        LG <span className={dark ? 'text-gold-400' : 'text-gold-600'}>GOLD</span>
      </span>
      {!compact && (
        <span
          className={`mt-1 text-[11.5px] font-semibold tracking-[0.12em] uppercase ${taglineOnPhones ? '' : 'hidden sm:block'} ${
            dark ? 'text-cream/70' : 'text-muted'
          }`}
        >
          Sri Lakshmi Ganapathi Trading Co.
        </span>
      )}
    </span>
  </span>
);
