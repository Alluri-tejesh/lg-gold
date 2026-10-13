import React, { useEffect, useRef, useState } from 'react';
import { Sprout, Wind, Sparkles, ScanEye, Hourglass, PackageCheck } from 'lucide-react';
import { Container, Eyebrow } from '../ui/Section';

const STAGES = [
  { icon: Sprout, title: 'Paddy is selected', body: 'Only mature, unbroken lots from Telangana’s paddy belt make it into the mill.' },
  { icon: Wind, title: 'The husk comes off', body: 'Gentle rubber rollers split the husk without cracking the grain inside.' },
  { icon: Sparkles, title: 'Polished to a silky white', body: 'Chilled-water polishers lift away the bran, with no heat to crack the grain.' },
  { icon: ScanEye, title: 'Every grain is scanned', body: 'Sortex cameras check each grain; air jets flick away any that are chalky, dark or broken.' },
  { icon: Hourglass, title: 'Aged for 12+ months', body: 'Rest in aerated godowns makes the grain cook long, separate and fluffy.' },
  { icon: PackageCheck, title: 'Packed for your kitchen', body: 'Weighed and machine-stitched into 26kg bags without a hand touching the rice.' },
];

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const mixColor = (c1: [number, number, number], c2: [number, number, number], t: number) =>
  `rgb(${c1.map((v, i) => Math.round(mix(v, c2[i], t))).join(',')})`;

// A rice grain, pointed at both ends, centred on 0,0.
const GRAIN = 'M0,-190 C62,-168 74,120 0,190 C-74,120 -62,-168 0,-190Z';
const HUSK = 'M0,-222 C80,-192 92,140 0,222 C-92,140 -80,-192 0,-222Z';

/** The rice grain at a given point of the story (0 = paddy, 6 = in the bag). */
const GrainScene: React.FC<{ s: number }> = ({ s }) => {
  const at = (i: number) => clamp(s - i);
  const select = at(0);
  const husk = at(1);
  const polish = at(2);
  const scan = at(3);
  const age = at(4);
  const pack = at(5);

  const grainFill = mixColor([176, 120, 64], [250, 246, 234], polish); // brown rice -> polished white
  const scale = mix(0.86, 1, select) * mix(1, 0.3, pack);
  const drop = mix(0, 230, pack);
  const rejectAway = clamp((scan - 0.45) / 0.4);

  return (
    <svg viewBox="-300 -300 600 600" className="h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="gs-glow">
          <stop offset="0" stopColor="#DCBB4F" stopOpacity="0.55" />
          <stop offset="1" stopColor="#DCBB4F" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="gs-husk" x1="0" x2="1">
          <stop offset="0" stopColor="#B88A2E" />
          <stop offset="0.5" stopColor="#D9B25A" />
          <stop offset="1" stopColor="#A87A22" />
        </linearGradient>
        <linearGradient id="gs-shine" x1="0" x2="1">
          <stop offset="0.2" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="0.8" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id="gs-left">
          <rect x="-300" y="-300" width="300" height="600" />
        </clipPath>
        <clipPath id="gs-right">
          <rect x="0" y="-300" width="300" height="600" />
        </clipPath>
        <clipPath id="gs-grain">
          <path d={GRAIN} />
        </clipPath>
      </defs>

      <circle r={260} fill="url(#gs-glow)" opacity={mix(0.4, 1, select) * (1 - pack * 0.6)} />

      {/* Ageing: a ring that fills through the 12 months */}
      <g opacity={clamp(age * 3) * (1 - pack)}>
        <circle r={245} fill="none" stroke="#E7D59A" strokeWidth={6} opacity={0.5} />
        <circle
          r={245}
          fill="none"
          stroke="#C9A227"
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={2 * Math.PI * 245}
          strokeDashoffset={2 * Math.PI * 245 * (1 - age)}
          transform="rotate(-90)"
        />
        {Array.from({ length: 12 }, (_, m) => {
          const a = (m / 12) * Math.PI * 2 - Math.PI / 2;
          const on = age >= (m + 1) / 12 - 0.001;
          return <circle key={m} cx={Math.cos(a) * 245} cy={Math.sin(a) * 245} r={on ? 9 : 6} fill={on ? '#174A32' : '#E7D59A'} />;
        })}
      </g>

      <g transform={`translate(0 ${drop}) scale(${scale})`} opacity={1 - clamp((pack - 0.65) / 0.3)}>
        {/* Husk halves split apart and fall away */}
        <g opacity={1 - clamp(husk * 1.4)}>
          <g clipPath="url(#gs-left)" transform={`translate(${-husk * 120} ${husk * 60}) rotate(${-husk * 28})`}>
            <path d={HUSK} fill="url(#gs-husk)" />
            {[-120, -60, 0, 60, 120].map((y) => (
              <path key={y} d={`M-70,${y} Q-30,${y - 18} 0,${y}`} fill="none" stroke="#8A650C" strokeWidth={3} opacity={0.5} />
            ))}
          </g>
          <g clipPath="url(#gs-right)" transform={`translate(${husk * 120} ${husk * 60}) rotate(${husk * 28})`}>
            <path d={HUSK} fill="url(#gs-husk)" />
            {[-120, -60, 0, 60, 120].map((y) => (
              <path key={y} d={`M0,${y} Q30,${y - 18} 70,${y}`} fill="none" stroke="#8A650C" strokeWidth={3} opacity={0.5} />
            ))}
          </g>
        </g>

        {/* The grain itself: brown rice polishing to white, with a moving shine */}
        <path d={GRAIN} fill={grainFill} stroke="#8A650C" strokeOpacity={0.25} strokeWidth={2} />
        <g clipPath="url(#gs-grain)" opacity={polish}>
          <rect x={-200} y={-220} width={140} height={440} fill="url(#gs-shine)" transform={`translate(${mix(-60, 260, polish)} 0) rotate(14)`} />
        </g>

        {/* Sortex: a laser sweeps the grain */}
        <g opacity={scan > 0 && scan < 1 ? 1 : 0}>
          <rect x={-150} y={mix(-210, 210, scan) - 3} width={300} height={6} rx={3} fill="#2EE6A6" opacity={0.9} />
          <rect x={-150} y={mix(-210, 210, scan) - 22} width={300} height={44} fill="#2EE6A6" opacity={0.12} />
        </g>
      </g>

      {/* The bag, drawn after the grain so the grain drops behind its front and disappears inside */}
      <g opacity={clamp(pack * 2.2)} transform={`translate(0 ${mix(60, 0, clamp(pack * 1.5))})`}>
        <path d="M-120,40 L120,40 L135,250 C135,262 125,270 113,270 L-113,270 C-125,270 -135,262 -135,250 Z" fill="#174A32" />
        <path d="M-120,40 L120,40 L118,62 L-118,62 Z" fill="#0F3322" />
        <circle cy={150} r={46} fill="#C9A227" />
        <circle cy={150} r={38} fill="none" stroke="#174A32" strokeWidth={4} />
        <text y={163} textAnchor="middle" fontFamily="Playfair Display, Georgia, serif" fontWeight={700} fontSize={36} fill="#174A32">
          LG
        </text>
        <text y={232} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={700} fontSize={22} letterSpacing={3} fill="#DCBB4F">
          26 KG
        </text>
      </g>

      {/* Rejected grains (chalky, dark, broken) get flicked out by air jets */}
      <g opacity={clamp(scan * 4) * (1 - clamp(rejectAway * 1.2))}>
        {[
          { x: -175, y: -60, c: '#6B4A2A', r: -30 },
          { x: 185, y: 40, c: '#F1EEE6', r: 25 },
          { x: -165, y: 120, c: '#8C6B45', r: 70 },
        ].map((g, i) => (
          <g key={i} transform={`translate(${g.x + (g.x > 0 ? 1 : -1) * rejectAway * 160} ${g.y - rejectAway * 90}) rotate(${g.r + rejectAway * 200})`}>
            <ellipse rx={30} ry={11} fill={g.c} stroke="#B42318" strokeWidth={3} />
          </g>
        ))}
      </g>
    </svg>
  );
};

/**
 * "Watch a grain become LG Gold": a sticky scene that plays as the visitor scrolls through the section.
 * Visitors who prefer reduced motion get the same six steps as a simple list.
 */
export const GrainStory: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const [s, setS] = useState(0);
  const [reduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = clamp(-r.top / total);
      setS(p * STAGES.length);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  const active = Math.min(STAGES.length - 1, Math.floor(s));

  if (reduced) {
    return (
      <section className="bg-forest-950 py-16 text-cream sm:py-24">
        <Container>
          <Eyebrow dark>From paddy to your plate</Eyebrow>
          <h2 className="mt-3 font-display text-4xl text-white sm:text-5xl">Watch a grain become LG Gold</h2>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {STAGES.map((st, i) => (
              <li key={st.title} className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
                <st.icon className="h-6 w-6 text-gold-400" aria-hidden="true" />
                <p className="mt-3 font-display text-2xl text-white">
                  {i + 1}. {st.title}
                </p>
                <p className="mt-2 text-cream/75">{st.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-[420vh] bg-forest-950 text-cream" aria-label="How a grain becomes LG Gold rice">
      <div className="sticky top-0 flex h-[100dvh] items-center overflow-hidden bg-grain-light">
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/10 blur-3xl" />
        <Container className="relative grid items-center gap-6 lg:grid-cols-12 lg:gap-10">
          {/* Steps */}
          <div className="order-2 lg:order-1 lg:col-span-5">
            <Eyebrow dark>From paddy to your plate</Eyebrow>
            <h2 className="mt-3 font-display text-3xl leading-tight text-white sm:text-5xl">Watch a grain become LG Gold</h2>
            <ol className="mt-6 space-y-1 sm:mt-8">
              {STAGES.map((st, i) => {
                const on = i === active;
                const done = i < active;
                return (
                  <li
                    key={st.title}
                    aria-current={on ? 'step' : undefined}
                    className={`flex gap-4 rounded-2xl px-3 py-2 transition-all duration-500 ${on ? 'bg-white/8' : ''} ${!on ? 'hidden sm:flex' : ''}`}
                  >
                    <span
                      className={`mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full transition-colors duration-500 ${
                        on ? 'bg-gold-500 text-forest-900' : done ? 'bg-forest-700 text-gold-300' : 'bg-white/8 text-cream/50'
                      }`}
                    >
                      <st.icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className={`font-display text-xl transition-colors duration-500 ${on ? 'text-white' : done ? 'text-cream/70' : 'text-cream/40'}`}>{st.title}</p>
                      <div className={`grid transition-[grid-template-rows,opacity] duration-500 ${on ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                        <p className="overflow-hidden text-[15px] leading-relaxed text-cream/75">{st.body}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
            {/* Progress through the story */}
            <div className="mt-6 h-1 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
              <div className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-300" style={{ width: `${(s / STAGES.length) * 100}%` }} />
            </div>
          </div>

          {/* The grain */}
          <div className="order-1 mx-auto h-[38dvh] w-full max-w-md sm:h-[46dvh] lg:order-2 lg:col-span-7 lg:h-[72dvh] lg:max-w-none">
            <GrainScene s={s} />
          </div>
        </Container>
        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs font-semibold uppercase tracking-[0.2em] text-cream/40 transition-opacity duration-500" style={{ opacity: s < 0.3 ? 1 : 0 }}>
          Scroll to mill a grain
        </p>
      </div>
    </section>
  );
};
