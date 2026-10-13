import React, { useState } from 'react';
import { ShoppingBag, MessageCircle, Zap, ArrowUpRight } from 'lucide-react';
import { Product, PackSize } from '../../types';
import { useCart } from '../../context/CartContext';
import { getProductWhatsAppMessage, createWhatsAppUrl, openWhatsApp } from '../../config/brandConfig';
import { priceInfo, formatPriceDate } from '../../data/prices';
import { getDefaultPack } from '../../data/products';
import { AppLink } from '../ui/AppLink';
import { Badge } from '../ui/Section';
import { Button } from '../ui/Button';
import { RollingNumber } from '../fx/RollingNumber';
import { flyToCart } from '../fx/flyToCart';
import { useTilt } from '../fx/useTilt';
import { navigate } from '../../router';

interface ProductCardProps {
  product: Product;
  /** Kept for callers that still pass it; the card links to the product page itself. */
  onViewDetails?: (slug: string) => void;
  onSelectExportQuote?: (productName: string) => void;
}

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

/** Price per kg, so a 5kg bag and a 26kg bag can be compared at a glance. */
export const perKg = (price: number, kg: number) => (kg > 0 ? `₹${(price / kg).toFixed(price / kg < 100 ? 1 : 0)}/kg` : '');

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const tilt = useTilt<HTMLElement>(4);
  const [selectedPackSize, setSelectedPackSize] = useState<PackSize>(getDefaultPack(product).size);

  const pack = product.packOptions.find((p) => p.size === selectedPackSize) || getDefaultPack(product);
  const priceDate = formatPriceDate(priceInfo.updated);
  const outOfStock = !pack.inStock;
  const allOut = product.packOptions.every((p) => !p.inStock);
  const discount = pack.mrp > pack.retailPrice ? Math.round(((pack.mrp - pack.retailPrice) / pack.mrp) * 100) : 0;
  const contain = product.images.primaryFit === 'contain';

  const buyNow = () => {
    addToCart(product, selectedPackSize, 1, { quiet: true });
    navigate('checkout');
  };

  const whatsapp = () =>
    openWhatsApp(
      createWhatsAppUrl(
        outOfStock
          ? `Hi LG Gold Team, ${product.name} (${selectedPackSize}) shows as out of stock on your website. Please let me know when it will be available again.`
          : getProductWhatsAppMessage(product.name, selectedPackSize),
      ),
    );

  return (
    <article
      ref={tilt.ref}
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
      className="tilt group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-line shadow-soft transition-shadow duration-300 hover:shadow-lift has-[a:focus-visible]:outline-3 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-gold-500">
      <span className="tilt-sheen" aria-hidden="true" />
      {/* Photo */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[radial-gradient(ellipse_at_center,_#fffdf8_0%,_#f0e9d5_100%)]">
        <img
          src={product.images.primary}
          alt={product.name}
          loading="lazy"
          className={`tilt-depth h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04] ${
            contain ? 'object-contain p-6 pt-12 drop-shadow-[0_18px_22px_rgb(23_74_50/0.25)]' : 'object-cover'
          }`}
          referrerPolicy="no-referrer"
        />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {product.grainSpecs.aging && <Badge tone="forest">{product.grainSpecs.aging.replace(/ Naturally Aged| Controlled Aging/, ' aged')}</Badge>}
          {allOut && <Badge tone="danger">Out of stock</Badge>}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-gold-700">{product.grainSpecs.variety.split(' (')[0]} rice</p>
        <h3 className="mt-1.5 font-display text-[1.75rem] leading-tight text-forest-800">
          {/* The title link covers the whole card, so a tap anywhere opens the product. Buttons sit above it. */}
          <AppLink to="product-detail" param={product.slug} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {product.name}
          </AppLink>
        </h3>
        {product.subTitle && <p className="mt-1.5 line-clamp-2 text-[15px] leading-relaxed text-muted">{product.subTitle}</p>}

        {/* Pack sizes */}
        <fieldset className="relative z-10 mt-5">
          <legend className="mb-2 text-sm font-semibold text-forest-800">Pack size</legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {product.packOptions.map((o) => {
              const on = o.size === selectedPackSize;
              return (
                <label
                  key={o.size}
                  className={`relative flex min-h-14 cursor-pointer flex-col justify-center rounded-xl px-3 py-2 text-left ring-1 ring-inset transition-all has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold-500 ${
                    on ? 'bg-forest-800 text-white ring-forest-800 shadow-soft' : 'bg-cream/70 text-forest-800 ring-line hover:ring-forest-700'
                  } ${!o.inStock ? 'opacity-60' : ''}`}
                >
                  <input
                    type="radio"
                    name={`pack-${product.slug}`}
                    value={o.size}
                    checked={on}
                    onChange={() => setSelectedPackSize(o.size)}
                    className="sr-only"
                  />
                  <span className="text-[13px] font-semibold leading-tight">{o.size}</span>
                  <span className={`text-[13px] tabular ${on ? 'text-gold-300' : 'text-muted'}`}>
                    {o.inStock ? inr(o.retailPrice) : 'Out of stock'}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* Price */}
        <div className="mt-5 flex flex-wrap items-end justify-between gap-2 border-t border-line pt-4">
          <div>
            <div className="flex items-baseline gap-2">
              <RollingNumber value={pack.retailPrice} className="font-display text-[2rem] leading-none text-forest-800" />
              {discount > 0 && <span className="text-sm text-muted line-through tabular">{inr(pack.mrp)}</span>}
              {discount > 0 && <span className="rounded-full bg-forest-100 px-2 py-0.5 text-xs font-bold text-forest-700">{discount}% off</span>}
            </div>
            <p className="mt-1 text-[13px] text-muted">
              {perKg(pack.retailPrice, pack.weightKg)}
              {priceDate ? ` · today's rate, ${priceDate}` : ''}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="relative z-10 mt-4 grid grid-cols-2 gap-2">
          <Button
            onClick={(e) => {
              addToCart(product, selectedPackSize, 1);
              flyToCart(e.currentTarget);
            }}
            disabled={outOfStock}
            icon={<ShoppingBag className="h-4 w-4 text-gold-400" />}
          >
            Add to Cart
          </Button>
          <Button variant="gold" onClick={buyNow} disabled={outOfStock} icon={<Zap className="h-4 w-4" />}>
            Buy Now
          </Button>
          <button
            type="button"
            onClick={whatsapp}
            className="col-span-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-full text-[15px] font-semibold text-whatsapp-ink hover:bg-whatsapp/10 cursor-pointer"
          >
            <MessageCircle className="h-4 w-4" />
            {outOfStock ? 'Ask on WhatsApp when it is back' : 'Ask the mill about this rice'}
          </button>
        </div>

        <p className="mt-auto flex items-center justify-between pt-3 text-sm font-semibold text-forest-800">
          Specs, cooking guide &amp; recipes
          <ArrowUpRight className="h-4 w-4 text-gold-600 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
        </p>
      </div>
    </article>
  );
};
