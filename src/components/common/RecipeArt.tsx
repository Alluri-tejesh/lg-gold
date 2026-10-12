import React from 'react';
import type { Recipe, RecipeArtSpec } from '../../types';

/**
 * Flat illustrations of a dish, drawn in SVG so the picture always matches the recipe.
 * A real photo can still be set on a recipe (`photo`), and RecipeImage prefers it.
 */

const RICE: Record<RecipeArtSpec['rice'], { base: string; light: string; bg: [string, string] }> = {
  white: { base: '#F6EFD8', light: '#FFFDF4', bg: ['#EFF3E6', '#D9E6D2'] },
  cream: { base: '#F8F1DF', light: '#FFFBEE', bg: ['#F7F1E1', '#EBDDBC'] },
  turmeric: { base: '#F2C94C', light: '#F9E08A', bg: ['#FBF1CB', '#F0D88A'] },
  golden: { base: '#E8B964', light: '#F3D497', bg: ['#F8EAD0', '#E8C98E'] },
  tomato: { base: '#E5754A', light: '#F0A07C', bg: ['#FBE3D6', '#F0B598'] },
  green: { base: '#98C867', light: '#BFE08C', bg: ['#E6F2D7', '#C5DDA6'] },
  brown: { base: '#C28744', light: '#DDAE74', bg: ['#F1E2CE', '#D9B78A'] },
  beet: { base: '#C8527E', light: '#E08AA9', bg: ['#F8DDE6', '#E4A8BE'] },
  orange: { base: '#F2994A', light: '#F8BE86', bg: ['#FCE6CF', '#F3C195'] },
};

const hash = (s: string): number => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const rng = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

type Garnish = 'egg' | 'meat' | 'prawn' | 'paneer' | 'mushroom' | 'fish' | 'potato' | 'chunk' | 'lemon';

/** Which ingredient to show on the rice, guessed from the recipe id so no per-recipe data is needed. */
const inferGarnish = (id: string): Garnish | undefined => {
  if (/prawn/.test(id)) return 'prawn';
  if (/fish|chepala/.test(id)) return 'fish';
  if (/egg/.test(id)) return 'egg';
  if (/chicken|mutton|keema/.test(id)) return 'meat';
  if (/paneer/.test(id)) return 'paneer';
  if (/mushroom/.test(id)) return 'mushroom';
  if (/aloo|potato/.test(id)) return 'potato';
  if (/soya/.test(id)) return 'chunk';
  if (/lemon/.test(id)) return 'lemon';
  return undefined;
};

const GarnishShape: React.FC<{ kind: Garnish; x: number; y: number; s: number; flip?: boolean }> = ({ kind, x, y, s, flip }) => {
  const t = `translate(${x} ${y}) scale(${flip ? -s : s} ${s})`;
  switch (kind) {
    case 'egg':
      return (
        <g transform={t}>
          <ellipse rx="15" ry="10" fill="#FFFFFF" stroke="#E8E2D0" strokeWidth="1.5" />
          <ellipse cy="1" rx="6" ry="4.5" fill="#F2B632" />
        </g>
      );
    case 'meat':
      return (
        <g transform={t}>
          <ellipse rx="14" ry="9.5" fill="#7A3E22" />
          <ellipse cx="-3" cy="-2.5" rx="7" ry="3.8" fill="#A5602F" />
          <rect x="11" y="-2.5" width="9" height="5" rx="2.5" fill="#F1E6D2" />
        </g>
      );
    case 'prawn':
      return (
        <g transform={t}>
          <path d="M -13 6 C -15 -11 9 -15 13 1 C 9 -6 -4 -6 -8 6 Z" fill="#F08A5D" stroke="#C85A33" strokeWidth="1.5" />
          <path d="M 13 1 L 19 -5 L 18 5 Z" fill="#E0663A" />
        </g>
      );
    case 'paneer':
      return <rect transform={t} x="-8" y="-8" width="16" height="16" rx="3" fill="#FFF8E1" stroke="#EAD9A8" strokeWidth="1.5" />;
    case 'mushroom':
      return (
        <g transform={t}>
          <rect x="-3.5" y="1" width="7" height="9" rx="2" fill="#EBDCC5" />
          <path d="M -13 3 A 13 12 0 0 1 13 3 Z" fill="#B98C5F" />
        </g>
      );
    case 'fish':
      return (
        <g transform={t}>
          <ellipse rx="15" ry="7.5" fill="#9DB7C4" />
          <path d="M 13 0 L 23 -8 L 23 8 Z" fill="#7C9AA9" />
          <circle cx="-8" cy="-1.5" r="1.6" fill="#2B3A42" />
        </g>
      );
    case 'potato':
      return <rect transform={t} x="-8" y="-7" width="16" height="14" rx="5" fill="#E2B04A" stroke="#C48E2E" strokeWidth="1.5" />;
    case 'chunk':
      return <path transform={t} d="M -10 -4 L -3 -9 L 8 -6 L 11 3 L 2 9 L -8 6 Z" fill="#B07A45" stroke="#8A5B2E" strokeWidth="1.5" />;
    case 'lemon':
      return (
        <g transform={t}>
          <circle r="10" fill="#F4D03F" stroke="#D9B220" strokeWidth="1.5" />
          <path d="M 0 -8 V 8 M -8 0 H 8 M -5.6 -5.6 L 5.6 5.6 M 5.6 -5.6 L -5.6 5.6" stroke="#FBE98A" strokeWidth="1.2" />
        </g>
      );
  }
};

interface MoundProps {
  cx: number;
  cy: number; // base line of the mound
  rx: number;
  h: number;
  rice: (typeof RICE)[keyof typeof RICE];
  top: string[];
  rand: () => number;
  grains?: number;
  bits?: number;
  garnish?: Garnish;
}

/** A heap of rice with grain texture and scattered toppings. */
const Mound: React.FC<MoundProps> = ({ cx, cy, rx, h, rice, top, rand, grains = 70, bits = 16, garnish }) => {
  const els: React.ReactNode[] = [];
  const pick = (): [number, number] => {
    const a = Math.PI + rand() * Math.PI;
    const r = Math.sqrt(rand());
    return [cx + Math.cos(a) * rx * 0.92 * r, cy + Math.sin(a) * h * 0.9 * r];
  };
  for (let i = 0; i < grains; i++) {
    const [x, y] = pick();
    els.push(
      <ellipse
        key={`g${i}`}
        cx={x}
        cy={y}
        rx={5.5}
        ry={1.9}
        fill={rice.light}
        opacity={0.7}
        transform={`rotate(${Math.round(rand() * 180)} ${x} ${y})`}
      />,
    );
  }
  for (let i = 0; i < bits; i++) {
    const [x, y] = pick();
    els.push(
      <ellipse
        key={`b${i}`}
        cx={x}
        cy={y}
        rx={3 + rand() * 3}
        ry={2.4 + rand() * 2}
        fill={top[i % top.length]}
        transform={`rotate(${Math.round(rand() * 180)} ${x} ${y})`}
      />,
    );
  }
  return (
    <g>
      <path d={`M ${cx - rx} ${cy} C ${cx - rx} ${cy - h * 1.35} ${cx + rx} ${cy - h * 1.35} ${cx + rx} ${cy} Z`} fill={rice.base} />
      {els}
      {garnish &&
        [-0.5, 0.02, 0.5].map((k, i) => (
          <GarnishShape
            key={i}
            kind={garnish}
            x={cx + k * rx}
            y={cy - h * (i === 1 ? 0.78 : 0.5)}
            s={rx / 95}
            flip={i === 2}
          />
        ))}
    </g>
  );
};

const Steam: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g fill="none" stroke="#FFFFFF" strokeOpacity="0.7" strokeWidth="4" strokeLinecap="round">
    <path d={`M ${x - 28} ${y} q -10 -14 0 -26 q 10 -12 0 -24`} />
    <path d={`M ${x} ${y + 6} q -10 -14 0 -26 q 10 -12 0 -24`} />
    <path d={`M ${x + 28} ${y} q -10 -14 0 -26 q 10 -12 0 -24`} />
  </g>
);

const Shadow: React.FC<{ cx: number; cy: number; rx: number }> = ({ cx, cy, rx }) => (
  <ellipse cx={cx} cy={cy} rx={rx} ry={14} fill="#000" opacity={0.14} />
);

export const RecipeArt: React.FC<{ art: RecipeArtSpec; seed: string; className?: string; label?: string }> = ({
  art,
  seed,
  className = '',
  label,
}) => {
  const rice = RICE[art.rice];
  const top = art.top ?? ['#2F7D4F', '#E0A21A'];
  const rand = rng(hash(seed));
  const id = `bg-${hash(seed)}`;
  const garnish = inferGarnish(seed);
  const potColors = [['#B5582F', '#8A3F20'], ['#8F9AA0', '#68747A'], ['#C9962B', '#9C7218']][hash(seed) % 3];

  let scene: React.ReactNode;

  switch (art.kind) {
    case 'pot': {
      scene = (
        <g>
          <Shadow cx={200} cy={262} rx={125} />
          <ellipse cx={200} cy={150} rx={118} ry={30} fill="#7A3E22" />
          <Mound cx={200} cy={152} rx={104} h={52} rice={rice} top={top} rand={rand} grains={80} bits={22} garnish={garnish} />
          <path d="M 80 152 C 80 250 130 262 200 262 C 270 262 320 250 320 152 Z" fill={potColors[0]} />
          <path d="M 80 152 C 80 190 110 205 200 205 C 290 205 320 190 320 152 Z" fill="#9C4825" opacity="0.5" />
          <ellipse cx={200} cy={152} rx={120} ry={22} fill="none" stroke={potColors[1]} strokeWidth="8" />
          <rect x="52" y="140" width="30" height="14" rx="7" fill={potColors[1]} />
          <rect x="318" y="140" width="30" height="14" rx="7" fill={potColors[1]} />
          <Steam x={200} y={78} />
        </g>
      );
      break;
    }
    case 'plate': {
      scene = (
        <g>
          <Shadow cx={200} cy={258} rx={160} />
          <ellipse cx={200} cy={205} rx={165} ry={58} fill="#F4F6F7" />
          <ellipse cx={200} cy={205} rx={140} ry={46} fill="#E6EAEC" />
          <Mound cx={160} cy={210} rx={78} h={50} rice={rice} top={top} rand={rand} grains={64} bits={14} garnish={garnish} />
          <ellipse cx={278} cy={205} rx={34} ry={16} fill="#F4F6F7" stroke="#CDD3D6" strokeWidth="2" />
          <ellipse cx={278} cy={204} rx={27} ry={11} fill={top[0]} />
          <ellipse cx={262} cy={238} rx={26} ry={12} fill="#F4F6F7" stroke="#CDD3D6" strokeWidth="2" />
          <ellipse cx={262} cy={237} rx={20} ry={8} fill={top[1] ?? top[0]} />
        </g>
      );
      break;
    }
    case 'leaf': {
      scene = (
        <g>
          <Shadow cx={200} cy={262} rx={150} />
          <path d="M 40 190 C 70 100 330 100 360 190 C 330 270 70 270 40 190 Z" fill="#3E8E4D" />
          <path d="M 40 190 L 360 190" stroke="#2D6E3B" strokeWidth="3" />
          <path d="M 60 205 C 110 150 290 150 340 205" fill="none" stroke="#5CAA66" strokeWidth="2" opacity="0.7" />
          <Mound cx={200} cy={200} rx={72} h={46} rice={rice} top={top} rand={rand} grains={56} bits={10} garnish={garnish} />
          {[100, 145, 255, 300].map((x, i) => (
            <circle key={x} cx={x} cy={i % 2 ? 222 : 208} r={14} fill={top[i % top.length]} stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="2" />
          ))}
        </g>
      );
      break;
    }
    case 'wok': {
      scene = (
        <g>
          <Shadow cx={200} cy={262} rx={130} />
          <rect x="318" y="166" width="62" height="12" rx="6" fill="#3A3A3E" transform="rotate(-8 318 172)" />
          <ellipse cx={200} cy={156} rx={124} ry={34} fill="#2B2B2F" />
          <Mound cx={200} cy={158} rx={108} h={50} rice={rice} top={top} rand={rand} grains={70} bits={30} garnish={garnish} />
          <path d="M 76 158 C 80 245 140 262 200 262 C 260 262 320 245 324 158 Z" fill="#3A3A3E" />
          <ellipse cx={200} cy={158} rx={126} ry={26} fill="none" stroke="#4A4A50" strokeWidth="6" />
        </g>
      );
      break;
    }
    case 'curd': {
      scene = (
        <g>
          <Shadow cx={200} cy={262} rx={115} />
          <ellipse cx={200} cy={150} rx={106} ry={26} fill="#E9EEF0" />
          <Mound cx={200} cy={152} rx={96} h={48} rice={{ ...rice, base: '#FFFBF0' }} top={top} rand={rand} grains={50} bits={20} />
          <path d="M 92 150 C 92 240 140 258 200 258 C 260 258 308 240 308 150 Z" fill="#FFFFFF" stroke="#D8DEE1" strokeWidth="3" />
          <ellipse cx={200} cy={150} rx={108} ry={22} fill="none" stroke="#D8DEE1" strokeWidth="5" />
        </g>
      );
      break;
    }
    case 'sweet': {
      scene = (
        <g>
          <Shadow cx={200} cy={262} rx={120} />
          <path d="M 84 138 C 84 232 134 258 200 258 C 266 258 316 232 316 138 Z" fill="#C9962B" />
          <path d="M 84 138 C 84 175 110 190 200 190 C 290 190 316 175 316 138 Z" fill="#B07F1E" opacity="0.5" />
          <ellipse cx={200} cy={138} rx={116} ry={30} fill="#E7BC52" />
          <ellipse cx={200} cy={139} rx={104} ry={24} fill={rice.base} />
          {Array.from({ length: 22 }).map((_, i) => {
            const a = rand() * Math.PI * 2;
            const r = Math.sqrt(rand());
            const x = 200 + Math.cos(a) * 90 * r;
            const y = 139 + Math.sin(a) * 18 * r;
            return <ellipse key={i} cx={x} cy={y} rx={6} ry={2.4} fill={top[i % top.length]} transform={`rotate(${Math.round(rand() * 180)} ${x} ${y})`} />;
          })}
          <Steam x={200} y={96} />
        </g>
      );
      break;
    }
    case 'porridge': {
      scene = (
        <g>
          <Shadow cx={200} cy={262} rx={125} />
          <path d="M 80 150 C 80 232 130 256 200 256 C 270 256 320 232 320 150 Z" fill="#E4E8EA" stroke="#CDD3D6" strokeWidth="3" />
          <ellipse cx={200} cy={150} rx={120} ry={30} fill="#F2F4F5" stroke="#CDD3D6" strokeWidth="4" />
          <ellipse cx={200} cy={152} rx={104} ry={22} fill={rice.base} />
          {Array.from({ length: 30 }).map((_, i) => {
            const a = rand() * Math.PI * 2;
            const r = Math.sqrt(rand());
            const x = 200 + Math.cos(a) * 92 * r;
            const y = 152 + Math.sin(a) * 15 * r;
            return <ellipse key={i} cx={x} cy={y} rx={i % 4 === 0 ? 4 : 5.5} ry={i % 4 === 0 ? 3.2 : 1.9} fill={i % 4 === 0 ? top[0] : rice.light} opacity={0.85} transform={`rotate(${Math.round(rand() * 180)} ${x} ${y})`} />;
          })}
          <rect x="296" y="96" width="9" height="86" rx="4" fill="#B98A4E" transform="rotate(28 300 140)" />
          <Steam x={190} y={96} />
        </g>
      );
      break;
    }
    case 'bowl':
    default: {
      scene = (
        <g>
          <Shadow cx={200} cy={262} rx={118} />
          <ellipse cx={200} cy={150} rx={112} ry={28} fill="#2F5D50" />
          <Mound cx={200} cy={152} rx={100} h={52} rice={rice} top={top} rand={rand} grains={76} bits={18} garnish={garnish} />
          <path d="M 88 150 C 88 240 138 258 200 258 C 262 258 312 240 312 150 Z" fill="#1F6B57" />
          <path d="M 88 150 C 88 190 120 204 200 204 C 280 204 312 190 312 150 Z" fill="#17594A" opacity="0.55" />
          <ellipse cx={200} cy={150} rx={113} ry={22} fill="none" stroke="#C9A227" strokeWidth="5" />
          {art.steam !== false && <Steam x={200} y={78} />}
        </g>
      );
    }
  }

  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label={label ?? 'Illustration of the dish'}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={rice.bg[0]} />
          <stop offset="1" stopColor={rice.bg[1]} />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#${id})`} />
      {scene}
    </svg>
  );
};

/** A recipe's real photo when it has one, otherwise its illustration. */
export const RecipeImage: React.FC<{ recipe: Recipe; className?: string }> = ({ recipe, className = '' }) => {
  if (recipe.photo) {
    return <img src={recipe.photo} alt={recipe.title} loading="lazy" className={className} referrerPolicy="no-referrer" />;
  }
  return <RecipeArt art={recipe.art} seed={recipe.id} className={className} label={`Illustration of ${recipe.title}`} />;
};
