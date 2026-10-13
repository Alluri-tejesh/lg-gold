import React, { useState } from 'react';
import { ArrowRight, Sparkles, CookingPot, Flame, Utensils, Soup, Citrus, Baby } from 'lucide-react';
import { getProductBySlug, getDefaultPack } from '../../data/products';
import { AppLink } from '../ui/AppLink';
import { buttonClass } from '../ui/Button';

/** Dishes people cook most, and which LG Gold rice suits each best (from the HMT vs JSR cooking notes). */
const DISHES: { id: string; label: string; icon: React.ComponentType<{ className?: string }>; slug: 'hmt-rice' | 'jsr-rice'; why: string }[] = [
  { id: 'biryani', label: 'Biryani', icon: CookingPot, slug: 'hmt-rice', why: 'Firm, long grains stay separate through dum cooking and soak up the masala without breaking.' },
  { id: 'pulao', label: 'Pulao & fried rice', icon: Flame, slug: 'hmt-rice', why: 'Aged HMT cooks fluffy and non-sticky, so every grain stays coated, not clumped.' },
  { id: 'daily', label: 'Daily rice with sambar', icon: Utensils, slug: 'jsr-rice', why: 'JSR is soft, light and quick to cook, made for everyday meals with dal, sambar and rasam.' },
  { id: 'curd', label: 'Curd rice & rasam', icon: Soup, slug: 'jsr-rice', why: 'Fine JSR grains turn tender and creamy, exactly what curd rice and rasam rice need.' },
  { id: 'variety', label: 'Lemon / tamarind rice', icon: Citrus, slug: 'hmt-rice', why: 'Separate HMT grains take the tempering evenly and stay fresh in a lunchbox.' },
  { id: 'kids', label: 'Kids & elders', icon: Baby, slug: 'jsr-rice', why: 'JSR is gentle on the stomach and easy to chew, which is why families pick it for children and elders.' },
];

/** "What are you cooking?" A one-tap way to choose between HMT and JSR. */
export const RiceFinder: React.FC = () => {
  const [dish, setDish] = useState(DISHES[0].id);
  const pick = DISHES.find((d) => d.id === dish)!;
  const product = getProductBySlug(pick.slug);
  const pack = product ? getDefaultPack(product) : undefined;

  return (
    <div className="overflow-hidden rounded-3xl bg-forest-800 text-cream ring-1 ring-forest-700 bg-grain-light">
      <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7">
          <p className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.16em] text-gold-400">
            <Sparkles className="h-4 w-4" aria-hidden="true" /> Rice finder
          </p>
          <h3 className="mt-3 font-display text-3xl text-white sm:text-4xl">What are you cooking?</h3>
          <div role="radiogroup" aria-label="Dish" className="mt-6 flex flex-wrap gap-2">
            {DISHES.map((d) => (
              <button
                key={d.id}
                type="button"
                role="radio"
                aria-checked={dish === d.id}
                onClick={() => setDish(d.id)}
                className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-[15px] font-semibold transition-all cursor-pointer ${
                  dish === d.id ? 'bg-gold-500 text-forest-900 shadow-glow' : 'bg-white/8 text-cream ring-1 ring-inset ring-white/20 hover:ring-white/50'
                }`}
              >
                <d.icon className="h-4 w-4" />
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {product && (
          <div key={dish} className="animate-pop-in rounded-2xl bg-paper p-5 text-ink shadow-lift lg:col-span-5">
            <div className="flex items-center gap-4">
              <img
                src={product.images.primary}
                alt=""
                className={`h-20 w-20 shrink-0 rounded-xl bg-cream ${product.images.primaryFit === 'contain' ? 'object-contain p-1' : 'object-cover'}`}
                referrerPolicy="no-referrer"
              />
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-gold-700">Best for {pick.label.toLowerCase()}</p>
                <p className="font-display text-2xl text-forest-800">{product.name}</p>
                {pack && (
                  <p className="text-sm text-muted tabular">
                    {pack.size}, ₹{pack.retailPrice.toLocaleString('en-IN')}
                  </p>
                )}
              </div>
            </div>
            <p className="mt-4 leading-relaxed text-ink-soft">{pick.why}</p>
            <AppLink to="product-detail" param={product.slug} className={`mt-5 ${buttonClass('primary', 'md', true)}`}>
              See {product.shortName} <ArrowRight className="h-4 w-4 text-gold-400" />
            </AppLink>
          </div>
        )}
      </div>
    </div>
  );
};
