import React from 'react';
import { Truck, TrendingUp } from 'lucide-react';
import { BRAND_CONFIG } from '../../config/brandConfig';
import { getProductBySlug } from '../../data/products';
import { priceInfo, formatPriceDate } from '../../data/prices';
import { AppLink } from '../ui/AppLink';

/** A thin bar above the header with today's mill rates and the free-delivery rule. */
export const AnnouncementBar: React.FC = () => {
  const rate = (slug: string) => getProductBySlug(slug)?.packOptions.find((o) => o.size === '26kg Bag');
  const hmt = rate('hmt-rice');
  const jsr = rate('jsr-rice');
  const date = formatPriceDate(priceInfo.updated);
  const free = BRAND_CONFIG.delivery.freeFromOrderValue.toLocaleString('en-IN');

  return (
    <aside aria-label="Today’s rates and delivery" className="bg-forest-950 text-cream text-[13px] sm:text-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-x-6 px-4 py-2 sm:justify-between sm:px-6 lg:px-8">
        <AppLink to="products" className="hidden sm:inline-flex items-center gap-2 font-medium hover:text-gold-300">
          <TrendingUp className="h-4 w-4 text-gold-400" aria-hidden="true" />
          <span className="text-cream/70">Today&apos;s mill rate{date ? `, ${date}` : ''}:</span>
          {hmt && (
            <span className="tabular">
              HMT <strong className="text-gold-300">₹{hmt.retailPrice.toLocaleString('en-IN')}</strong>
            </span>
          )}
          {jsr && (
            <span className="tabular">
              · JSR <strong className="text-gold-300">₹{jsr.retailPrice.toLocaleString('en-IN')}</strong>
            </span>
          )}
          <span className="text-cream/60">per 26kg bag</span>
        </AppLink>
        <p className="inline-flex items-center gap-2 font-medium">
          <Truck className="h-4 w-4 text-gold-400" aria-hidden="true" />
          Free doorstep delivery on orders over ₹{free}
        </p>
      </div>
    </aside>
  );
};
