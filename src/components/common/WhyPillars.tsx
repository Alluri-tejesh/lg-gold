import React, { useState } from 'react';
import { Sprout, ShieldCheck, Cpu, PackageCheck, Truck, ArrowRight, Plus } from 'lucide-react';
import { Reveal } from './motion';
import { AppLink } from '../ui/AppLink';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = { Sprout, ShieldCheck, Cpu, PackageCheck, Truck };

interface Pillar {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
}

const LINKS: Record<string, { route: string; label: string }> = {
  'carefully-sourced': { route: 'about', label: 'Meet the mill' },
  'quality-checked': { route: 'quality', label: 'See our quality checks' },
  'processed-with-care': { route: 'quality', label: 'See the milling line' },
  'hygienically-packed': { route: 'products', label: 'See the 26kg bags' },
  'reliable-supply': { route: 'wholesale', label: 'Get wholesale rates' },
};

/**
 * Five principles as panels. Hover, focus or tap one and it widens to show the detail while the others narrow
 * to a slim column with the number and title written sideways, so no word ever gets squeezed and broken.
 * Motion only happens when the visitor interacts, so it never moves on its own.
 */
export const WhyPillars: React.FC<{ pillars: Pillar[]; onNavigate?: (route: string) => void }> = ({ pillars }) => {
  const [active, setActive] = useState(0);
  const columns = pillars.map((_, i) => (i === active ? '4fr' : '1fr')).join(' ');

  return (
    <div>
      {/* Desktop: panels share one row, the active one is wide */}
      <div className="why-grid hidden h-[27rem] gap-3 lg:grid" style={{ gridTemplateColumns: columns }}>
        {pillars.map((p, i) => {
          const Icon = ICONS[p.icon] ?? Sprout;
          const on = i === active;
          const link = LINKS[p.id];
          return (
            <Reveal key={p.id} delay={i * 90} className="h-full min-w-0">
              <div
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className={`relative flex h-full flex-col overflow-hidden rounded-3xl p-6 transition-colors duration-500 ${
                  on ? 'bg-forest-800 text-cream shadow-lift bg-grain-light' : 'bg-white text-forest-800 ring-1 ring-line hover:ring-gold-500'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-expanded={on}
                  aria-label={`${p.title}: ${p.subtitle}`}
                  className="absolute inset-0 z-0 cursor-pointer rounded-3xl"
                />
                <div className="pointer-events-none relative flex items-start justify-between">
                  <span className={`grid h-12 w-12 place-items-center rounded-2xl transition-colors duration-500 ${on ? 'bg-gold-500 text-forest-900' : 'bg-cream text-forest-800'}`}>
                    <Icon className="h-6 w-6" />
                  </span>
                  {on && <span className="font-display text-5xl leading-none text-gold-400/40">0{i + 1}</span>}
                </div>

                {on ? (
                  <div className="pointer-events-none relative mt-auto animate-slide-up">
                    <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-gold-400">{p.subtitle}</p>
                    <h3 className="mt-2 font-display text-3xl text-white">{p.title}</h3>
                    <p className="mt-3 max-w-md leading-relaxed text-cream/80">{p.description}</p>
                    {link && (
                      <AppLink
                        to={link.route}
                        className="pointer-events-auto relative z-10 mt-5 inline-flex items-center gap-2 font-semibold text-gold-300 hover:text-white"
                      >
                        {link.label} <ArrowRight className="h-4 w-4" />
                      </AppLink>
                    )}
                  </div>
                ) : (
                  <div className="pointer-events-none relative mt-auto flex flex-col items-start gap-4">
                    <span className="font-display text-3xl text-gold-600">0{i + 1}</span>
                    {/* Written sideways so long words like "Hygienically" never break inside the slim column */}
                    <span className="font-display text-xl leading-none whitespace-nowrap [writing-mode:vertical-rl] rotate-180">{p.title}</span>
                    <Plus className="h-5 w-5 text-gold-600" aria-hidden="true" />
                  </div>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* Phones and tablets: an accordion */}
      <div className="space-y-3 lg:hidden">
        {pillars.map((p, i) => {
          const Icon = ICONS[p.icon] ?? Sprout;
          const on = i === active;
          const link = LINKS[p.id];
          return (
            <Reveal key={p.id} delay={i * 70}>
              <div className={`overflow-hidden rounded-3xl transition-colors ${on ? 'bg-forest-800 text-cream' : 'bg-white text-forest-800 ring-1 ring-line'}`}>
                <button
                  type="button"
                  onClick={() => setActive(on ? -1 : i)}
                  aria-expanded={on}
                  className="flex w-full items-center gap-4 p-4 text-left cursor-pointer"
                >
                  <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${on ? 'bg-gold-500 text-forest-900' : 'bg-cream'}`}>
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-xl leading-tight">{p.title}</span>
                    <span className={`block text-sm ${on ? 'text-gold-300' : 'text-gold-700'}`}>{p.subtitle}</span>
                  </span>
                  <Plus className={`h-5 w-5 shrink-0 transition-transform duration-300 ${on ? 'rotate-45 text-gold-400' : 'text-gold-600'}`} aria-hidden="true" />
                </button>
                <div className={`why-acc ${on ? 'why-acc-open' : ''}`}>
                  <div className="px-4">
                    <p className="pb-2 leading-relaxed text-cream/85">{p.description}</p>
                    {link && (
                      <AppLink to={link.route} className="mb-4 inline-flex min-h-11 items-center gap-2 font-semibold text-gold-300">
                        {link.label} <ArrowRight className="h-4 w-4" />
                      </AppLink>
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
