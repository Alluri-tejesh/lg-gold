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

/** Six steps on a line. When it scrolls into view the line draws left to right and each step pops in as it is reached. */
export const JourneyTimeline: React.FC<{ steps: Step[] }> = ({ steps }) => {
  const [ref, seen] = useInView<HTMLOListElement>(0.25);
  const total = steps.length;
  const stagger = 1600 / total; // matches the 1.6s line draw

  return (
    <ol ref={ref} className="relative grid grid-cols-1 lg:grid-cols-6 gap-x-6 gap-y-10">
      {/* desktop: horizontal track, vertical on small screens */}
      <span aria-hidden="true" className="hidden lg:block absolute left-7 right-7 top-7 h-0.5 bg-[#C9A227]/25" />
      <span
        aria-hidden="true"
        className={`hidden lg:block absolute left-7 right-7 top-7 h-0.5 bg-[#C9A227] line-grow ${seen ? 'is-in' : ''}`}
      />
      <span aria-hidden="true" className="lg:hidden absolute left-7 top-7 bottom-7 w-0.5 bg-[#C9A227]/25" />
      <span
        aria-hidden="true"
        className={`lg:hidden absolute left-7 top-7 bottom-7 w-0.5 bg-[#C9A227] line-grow-y ${seen ? 'is-in' : ''}`}
      />

      {steps.map((s, i) => {
        const Icon = ICONS[s.icon] ?? Wheat;
        return (
          <li key={s.step} className="relative flex lg:block gap-5">
            <span
              className={`node-pop ${seen ? 'is-in' : ''} relative z-10 shrink-0 w-14 h-14 rounded-full bg-[#174A32] text-[#C9A227] border-4 border-[#F8F5EA] flex items-center justify-center`}
              style={{ ['--d' as string]: `${i * stagger}ms` }}
            >
              <Icon className="w-6 h-6" />
            </span>
            <div
              className={`reveal ${seen ? 'is-in' : ''} lg:mt-5`}
              style={{ ['--d' as string]: `${i * stagger + 150}ms` }}
            >
              <p className="text-sm font-semibold text-[#5F806D]">Step {s.step}</p>
              <h3 className="mt-1 font-serif-brand font-bold text-lg text-[#174A32]">{s.title}</h3>
              <p className="mt-1.5 text-sm text-[#202522]/80 leading-relaxed">{s.desc}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
};
