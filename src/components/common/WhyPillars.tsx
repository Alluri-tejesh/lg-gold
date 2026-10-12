import React, { useState } from 'react';
import { Sprout, ShieldCheck, Cpu, PackageCheck, Truck, ArrowRight } from 'lucide-react';
import { Reveal } from './motion';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Sprout,
  ShieldCheck,
  Cpu,
  PackageCheck,
  Truck,
};

interface Pillar {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
}

/**
 * Five principles as panels. Hover or tap one and it opens to show the detail while the others narrow.
 * Motion only happens when the visitor interacts, so it never moves on its own.
 */
const LINKS: Record<string, { route: string; label: string }> = {
  'carefully-sourced': { route: 'about', label: 'Meet the mill' },
  'quality-checked': { route: 'quality', label: 'See our quality checks' },
  'processed-with-care': { route: 'quality', label: 'See the milling line' },
  'hygienically-packed': { route: 'products', label: 'See the 26kg bags' },
  'reliable-supply': { route: 'wholesale', label: 'Get wholesale rates' },
};

export const WhyPillars: React.FC<{ pillars: Pillar[]; onNavigate: (route: string) => void }> = ({ pillars, onNavigate }) => {
  const [active, setActive] = useState(0);
  const columns = pillars.map((_, i) => (i === active ? '3.4fr' : '1fr')).join(' ');

  return (
    <div>
      {/* Desktop: panels share one row, the active one is wider */}
      <div
        className="why-grid hidden lg:grid gap-3 h-[26rem]"
        style={{ gridTemplateColumns: columns }}
        role="tablist"
        aria-label="Why LG Gold"
      >
        {pillars.map((p, i) => {
          const Icon = ICONS[p.icon] ?? Sprout;
          const on = i === active;
          return (
            <Reveal key={p.id} delay={i * 90} className="min-w-0 h-full">
              <button
                role="tab"
                aria-selected={on}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className={`relative w-full h-full text-left rounded-sm border overflow-hidden p-6 flex flex-col cursor-pointer transition-colors duration-300 ${
                  on
                    ? 'bg-[#174A32] border-[#174A32] text-[#F8F5EA]'
                    : 'bg-white border-[#C9A227]/25 text-[#174A32] hover:border-[#C9A227]'
                }`}
              >
                <span className="flex items-center justify-between">
                  <span
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
                      on ? 'bg-[#C9A227] text-[#174A32]' : 'bg-[#F8F5EA] text-[#174A32]'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </span>
                  <span className={`font-serif-brand text-2xl font-bold ${on ? 'text-[#C9A227]' : 'text-[#174A32]/40'}`}>
                    0{i + 1}
                  </span>
                </span>

                <span className="mt-auto block">
                  <span className="block font-serif-brand font-bold text-lg xl:text-xl leading-tight break-words">{p.title}</span>
                  <span className={`block text-sm font-semibold mt-1 ${on ? 'text-[#E7D59A]' : 'text-[#8F6A0E]'}`}>
                    {p.subtitle}
                  </span>
                  <span
                    className={`why-detail block text-sm leading-relaxed text-[#F8F5EA]/85 ${
                      on ? 'why-detail-open' : ''
                    }`}
                  >
                    {p.description}
                  </span>
                  {on && LINKS[p.id] && (
                    <span
                      role="link"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate(LINKS[p.id].route);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') onNavigate(LINKS[p.id].route);
                      }}
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#C9A227] hover:text-[#F0D890]"
                    >
                      {LINKS[p.id].label}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </span>
              </button>
            </Reveal>
          );
        })}
      </div>

      {/* Phones and tablets: a simple accordion */}
      <div className="lg:hidden space-y-3">
        {pillars.map((p, i) => {
          const Icon = ICONS[p.icon] ?? Sprout;
          const on = i === active;
          return (
            <Reveal key={p.id} delay={i * 80}>
              <div className={`rounded-sm border overflow-hidden ${on ? 'border-[#174A32]' : 'border-[#C9A227]/25'}`}>
                <button
                  onClick={() => setActive(on ? -1 : i)}
                  aria-expanded={on}
                  className={`w-full flex items-center gap-4 p-4 text-left cursor-pointer transition-colors duration-300 ${
                    on ? 'bg-[#174A32] text-[#F8F5EA]' : 'bg-white text-[#174A32]'
                  }`}
                >
                  <span
                    className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
                      on ? 'bg-[#C9A227] text-[#174A32]' : 'bg-[#F8F5EA]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-serif-brand font-bold text-lg leading-tight">{p.title}</span>
                    <span className={`block text-sm ${on ? 'text-[#E7D59A]' : 'text-[#8F6A0E]'}`}>{p.subtitle}</span>
                  </span>
                  <ArrowRight className={`w-4 h-4 shrink-0 transition-transform duration-300 ${on ? 'rotate-90' : ''}`} />
                </button>
                <div className={`why-acc ${on ? 'why-acc-open' : ''}`}>
                  <div className="overflow-hidden px-4 bg-white">
                    <p className="pt-4 text-sm leading-relaxed text-[#202522]/80">{p.description}</p>
                    {LINKS[p.id] && (
                      <button
                        onClick={() => onNavigate(LINKS[p.id].route)}
                        className="mt-2 mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#174A32]"
                      >
                        {LINKS[p.id].label}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
};
