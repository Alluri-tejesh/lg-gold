import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { getProductBySlug } from '../../data/products';
import { AppLink } from '../ui/AppLink';
import { buttonClass } from '../ui/Button';

interface GrainComparisonProps {
  onNavigate?: (route: string, param?: string) => void;
}

const BEST_FOR: { dish: string; hmt: 'best' | 'good'; jsr: 'best' | 'good' }[] = [
  { dish: 'Biryani & pulao', hmt: 'best', jsr: 'good' },
  { dish: 'Fried & lemon rice', hmt: 'best', jsr: 'good' },
  { dish: 'Daily rice, sambar & dal', hmt: 'good', jsr: 'best' },
  { dish: 'Curd rice & rasam', hmt: 'good', jsr: 'best' },
];

const Rating: React.FC<{ v: 'best' | 'good' }> = ({ v }) =>
  v === 'best' ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-forest-800 px-2.5 py-1 text-[13px] font-semibold text-gold-300">
      <Check className="h-3.5 w-3.5" aria-hidden="true" /> Best
    </span>
  ) : (
    <span className="text-[15px] text-muted">Good</span>
  );

/** HMT vs JSR side by side. Every number comes from the product data, so prices follow the daily price file. */
export const GrainComparison: React.FC<GrainComparisonProps> = () => {
  const hmt = getProductBySlug('hmt-rice');
  const jsr = getProductBySlug('jsr-rice');
  if (!hmt || !jsr) return null;

  const bag = (p: typeof hmt) => p.packOptions.find((o) => o.size === '26kg Bag');
  const short = (s: string) => s.split(' (')[0];

  const rows: { label: string; hint?: string; hmt: React.ReactNode; jsr: React.ReactNode }[] = [
    { label: 'Grain', hmt: short(hmt.grainSpecs.grainLength), jsr: short(jsr.grainSpecs.grainLength), hint: 'Length before cooking' },
    { label: 'Cooked texture', hmt: 'Firm and separate', jsr: 'Soft and tender' },
    { label: 'Ageing', hmt: short(hmt.grainSpecs.aging), jsr: short(jsr.grainSpecs.aging) },
    { label: 'Moisture', hmt: short(hmt.grainSpecs.moistureContent), jsr: short(jsr.grainSpecs.moistureContent) },
    { label: 'Broken grains', hmt: short(hmt.grainSpecs.brokenGrainPercentage), jsr: short(jsr.grainSpecs.brokenGrainPercentage) },
    { label: 'Rice : water', hmt: short(hmt.cookingGuide.waterRatio), jsr: short(jsr.cookingGuide.waterRatio) },
    { label: 'Cooking time', hmt: hmt.cookingGuide.cookingTime.replace(/ on medium flame/, ''), jsr: jsr.cookingGuide.cookingTime },
    ...BEST_FOR.map((b) => ({ label: b.dish, hmt: <Rating v={b.hmt} />, jsr: <Rating v={b.jsr} /> })),
    {
      label: 'Price, 26kg bag',
      hint: 'Today’s rate',
      hmt: <span className="text-2xl font-bold tracking-tight text-forest-800 tabular">₹{bag(hmt)?.retailPrice.toLocaleString('en-IN')}</span>,
      jsr: <span className="text-2xl font-bold tracking-tight text-forest-800 tabular">₹{bag(jsr)?.retailPrice.toLocaleString('en-IN')}</span>,
    },
  ];

  return (
    <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-line shadow-soft">
      <table className="w-full table-fixed border-collapse text-left">
        <caption className="sr-only">HMT rice compared with JSR rice</caption>
        <colgroup>
          <col className="w-[40%] sm:w-[34%]" />
          <col />
          <col />
        </colgroup>
        <thead>
          <tr className="bg-cream">
            <th scope="col" className="p-4 align-bottom text-[13px] font-semibold uppercase tracking-[0.14em] text-muted sm:p-6">
              Compare
            </th>
            {[hmt, jsr].map((p) => (
              <th key={p.slug} scope="col" className="p-4 align-bottom sm:p-6">
                <img
                  src={p.images.primary}
                  alt=""
                  className={`mb-3 h-16 w-16 rounded-2xl bg-white ring-1 ring-line sm:h-20 sm:w-20 ${p.images.primaryFit === 'contain' ? 'object-contain p-1' : 'object-cover'}`}
                  referrerPolicy="no-referrer"
                />
                <span className="block font-display text-xl font-medium text-forest-800 sm:text-2xl">{p.shortName}</span>
                <span className="block text-sm font-normal text-muted">{p.subTitle.split(' with ')[0]}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-t border-line">
              <th scope="row" className="p-4 align-top font-semibold text-forest-800 sm:px-6">
                {r.label}
                {r.hint && <span className="block text-sm font-normal text-muted">{r.hint}</span>}
              </th>
              <td className="p-4 align-top text-[15px] text-ink-soft sm:px-6">{r.hmt}</td>
              <td className="p-4 align-top text-[15px] text-ink-soft sm:px-6">{r.jsr}</td>
            </tr>
          ))}
          <tr className="border-t border-line bg-cream/60">
            <td className="p-4 text-sm text-muted sm:px-6">
              <span className="hidden sm:inline">Specs, cooking guide and recipes</span>
            </td>
            {[hmt, jsr].map((p) => (
              <td key={p.slug} className="p-3 sm:px-6 sm:py-4">
                <AppLink to="product-detail" param={p.slug} className={buttonClass(p.slug === 'hmt-rice' ? 'primary' : 'gold', 'sm', true)}>
                  View {p.shortName.replace(' Rice', '')} <ArrowRight className="h-4 w-4" />
                </AppLink>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
