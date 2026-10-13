import React, { useState } from 'react';
import { Minus, Plus, Calculator, Droplets, Scale, CalendarDays } from 'lucide-react';
import { ChoiceChips } from '../ui/Field';

/**
 * How much rice and water to cook, and how long a 26kg bag lasts a household.
 * Uses the cooking ratios from the product pages: HMT 1 : 2, JSR 1 : 2.25.
 */
const RICE = {
  hmt: { label: 'HMT', water: 2, minutes: '12–14' },
  jsr: { label: 'JSR', water: 2.25, minutes: '10–12' },
};

// Raw rice per person for one meal. Biryani and feasts use more rice per plate.
const PORTION = { everyday: 75, generous: 100 };
const GRAMS_PER_CUP = 185; // one standard 240 ml cup of raw rice

const fmtCups = (cups: number) => {
  const q = Math.round(cups * 4) / 4;
  const whole = Math.floor(q);
  const frac = { 0: '', 0.25: '¼', 0.5: '½', 0.75: '¾' }[q - whole as 0 | 0.25 | 0.5 | 0.75];
  return `${whole || (frac ? '' : '0')}${frac}`;
};

const Stat: React.FC<{ icon: React.ReactNode; value: string; label: string }> = ({ icon, value, label }) => (
  <div className="rounded-2xl bg-white p-4 ring-1 ring-line">
    <span className="text-gold-600">{icon}</span>
    <p className="mt-2 font-display text-3xl text-forest-800 tabular" aria-live="polite">
      {value}
    </p>
    <p className="text-sm text-muted">{label}</p>
  </div>
);


export const CookingCalculator: React.FC<{ defaultRice?: 'hmt' | 'jsr' }> = ({ defaultRice = 'hmt' }) => {
  const [people, setPeople] = useState(4);
  const [rice, setRice] = useState<'hmt' | 'jsr'>(defaultRice);
  const [style, setStyle] = useState<'everyday' | 'generous'>('everyday');

  const grams = people * PORTION[style];
  const cups = grams / GRAMS_PER_CUP;
  const water = cups * RICE[rice].water;
  // Two rice meals a day for the household.
  const bagDays = Math.round(26000 / (people * PORTION.everyday * 2));

  return (
    <div className="rounded-3xl bg-cream p-6 ring-1 ring-line sm:p-8">
      <p className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.16em] text-gold-700">
        <Calculator className="h-4 w-4" aria-hidden="true" /> Cooking calculator
      </p>
      <h3 className="mt-2 font-display text-3xl text-forest-800">How much rice should I cook?</h3>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-5">
          <div>
            <p className="mb-2 text-sm font-semibold text-forest-800" id="calc-people">
              People eating
            </p>
            <div className="inline-flex items-center rounded-full bg-white ring-1 ring-line-strong" role="group" aria-labelledby="calc-people">
              <button type="button" aria-label="Fewer people" onClick={() => setPeople(Math.max(1, people - 1))} className="grid h-12 w-12 place-items-center rounded-full text-forest-800 hover:bg-cream cursor-pointer">
                <Minus className="h-5 w-5" />
              </button>
              <span className="w-14 text-center font-display text-2xl text-forest-800 tabular" aria-live="polite">
                {people}
              </span>
              <button type="button" aria-label="More people" onClick={() => setPeople(Math.min(60, people + 1))} className="grid h-12 w-12 place-items-center rounded-full text-forest-800 hover:bg-cream cursor-pointer">
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-forest-800">Rice</p>
            <ChoiceChips
              label="Rice"
              value={rice}
              onChange={setRice}
              options={[
                { value: 'hmt', label: 'HMT', hint: 'Biryani, pulao' },
                { value: 'jsr', label: 'JSR', hint: 'Daily meals' },
              ]}
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-forest-800">Appetite</p>
            <ChoiceChips
              label="Appetite"
              value={style}
              onChange={setStyle}
              options={[
                { value: 'everyday', label: 'Everyday meal' },
                { value: 'generous', label: 'Biryani or feast' },
              ]}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 self-start">
          <Stat icon={<Scale className="h-5 w-5" />} value={`${fmtCups(cups)} cups`} label={`${grams.toLocaleString('en-IN')} g raw rice`} />
          <Stat icon={<Droplets className="h-5 w-5" />} value={`${fmtCups(water)} cups`} label={`water (1 : ${RICE[rice].water})`} />
          <div className="col-span-2 rounded-2xl bg-forest-800 p-4 text-cream">
            <p className="flex items-center gap-2 text-sm text-gold-300">
              <CalendarDays className="h-4 w-4" aria-hidden="true" /> A 26kg bag lasts
            </p>
            <p className="mt-1 font-display text-3xl text-white tabular">about {bagDays} days</p>
            <p className="text-sm text-cream/70">
              for {people} {people === 1 ? 'person' : 'people'} eating rice twice a day. Cooks in {RICE[rice].minutes} minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
