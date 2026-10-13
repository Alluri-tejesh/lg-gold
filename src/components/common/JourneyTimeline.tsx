import React from 'react';
import { Wheat, Factory, Eye, Box, Truck, Utensils, ShieldCheck, PackageCheck, Container, Globe } from 'lucide-react';
import { useInView } from './motion';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Wheat, Factory, Eye, Box, Truck, Utensils, ShieldCheck, PackageCheck, Container, Globe,
};

interface Step {
  step: number;
  title: string;
  desc: string;
  icon: string;
}

/** Six steps on a line. When it scrolls into view the line draws itself and each step pops in as it is reached. */
export const JourneyTimeline: React.FC<{ steps: Step[] }> = ({ steps }) => {
  const [ref, seen] = useInView<HTMLOListElement>(0.25);
  const stagger = 1600 / steps.length; // matches the 1.6s line draw

  return (
    <ol ref={ref} className="relative grid grid-cols-1 gap-x-6 gap-y-10 lg:grid-cols-6">
      {/* desktop: horizontal track, vertical on small screens */}
      <span aria-hidden="true" className="absolute left-7 right-7 top-7 hidden h-0.5 bg-gold-300/50 lg:block" />
      <span aria-hidden="true" className={`absolute left-7 right-7 top-7 hidden h-0.5 bg-gold-500 line-grow lg:block ${seen ? 'is-in' : ''}`} />
      <span aria-hidden="true" className="absolute bottom-7 left-7 top-7 w-0.5 bg-gold-300/50 lg:hidden" />
      <span aria-hidden="true" className={`absolute bottom-7 left-7 top-7 w-0.5 bg-gold-500 line-grow-y lg:hidden ${seen ? 'is-in' : ''}`} />

      {steps.map((s, i) => {
        const Icon = ICONS[s.icon] ?? Wheat;
        return (
          <li key={s.step} className="relative flex gap-5 lg:block">
            <span
              className={`node-pop ${seen ? 'is-in' : ''} relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-full bg-forest-800 text-gold-400 ring-4 ring-paper shadow-soft`}
              style={{ ['--d' as string]: `${i * stagger}ms` }}
            >
              <Icon className="h-6 w-6" />
            </span>
            <div className={`reveal ${seen ? 'is-in' : ''} lg:mt-5`} style={{ ['--d' as string]: `${i * stagger + 150}ms` }}>
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-gold-700">Step {s.step}</p>
              <h3 className="mt-1 font-display text-xl text-forest-800">{s.title}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{s.desc}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
};
