import React, { useEffect, useRef, useState } from 'react';
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  MessageCircle,
  Share2,
  Zap,
  Minus,
  Plus,
  Clock,
  Droplets,
  Timer,
  Ruler,
  Sparkles,
  Package,
  ChevronLeft,
  ChevronRight,
  Expand,
  ArrowRight,
  Boxes,
} from 'lucide-react';
import { PackSize } from '../types';
import { PRODUCTS, getProductBySlug, getDefaultPack } from '../data/products';
import { RECIPES } from '../data/recipes';
import { useCart } from '../context/CartContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { RecipeCard } from '../components/common/RecipeCard';
import { GrainComparison } from '../components/common/GrainComparison';
import { CookingCalculator } from '../components/common/CookingCalculator';
import { perKg } from '../components/common/ProductCard';
import { Reveal } from '../components/common/motion';
import { BRAND_CONFIG, createWhatsAppUrl, fssaiLabel, getProductWhatsAppMessage, openWhatsApp } from '../config/brandConfig';
import { priceInfo, formatPriceDate } from '../data/prices';
import { navigate, setPageMeta } from '../router';
import { Container, Section, SectionHeader, Badge } from '../components/ui/Section';
import { Button, buttonClass } from '../components/ui/Button';
import { Dialog } from '../components/ui/Dialog';
import { AppLink } from '../components/ui/AppLink';
import { toast } from '../components/ui/Toast';
import { NotFoundView } from './NotFoundView';
import { RollingNumber } from '../components/fx/RollingNumber';
import { flyToCart } from '../components/fx/flyToCart';

interface ProductDetailViewProps {
  productSlug: string;
  onNavigate: (route: string, param?: string) => void;
}

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ productSlug, onNavigate }) => {
  const product = getProductBySlug(productSlug);
  if (!product) return <NotFoundView />;
  return <ProductPage key={product.slug} productSlug={product.slug} onNavigate={onNavigate} />;
};

const ProductPage: React.FC<ProductDetailViewProps> = ({ productSlug, onNavigate }) => {
  const product = getProductBySlug(productSlug)!;
  const { addToCart, totalAmount } = useCart();

  const [packSize, setPackSize] = useState<PackSize>(getDefaultPack(product).size);
  const [quantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const buyRef = useRef<HTMLDivElement>(null);

  const pack = product.packOptions.find((p) => p.size === packSize) || getDefaultPack(product);
  const outOfStock = !pack.inStock;
  const detailed = product.detailed !== false; // false for products added from the catalog
  const priceDate = formatPriceDate(priceInfo.updated);
  const discount = pack.mrp > pack.retailPrice ? Math.round(((pack.mrp - pack.retailPrice) / pack.mrp) * 100) : 0;
  const lineTotal = pack.retailPrice * quantity;
  const freeAt = BRAND_CONFIG.delivery.freeFromOrderValue;
  const willBeFree = totalAmount + lineTotal >= freeAt;
  const gallery = product.images.gallery.length ? product.images.gallery : [product.images.primary];
  const linkedRecipes = RECIPES.filter((r) => r.recommendedProductId === product.id).slice(0, 3);
  const rice = product.slug === 'jsr-rice' ? 'jsr' : 'hmt';
  const step = (d: number) => setImageIndex((imageIndex + d + gallery.length) % gallery.length);

  // Browser tab title, share text, and product details for search engines (price, stock, brand).
  useEffect(() => {
    setPageMeta({ route: 'product-detail', param: product.slug }, { title: `${product.name}, 26kg bags`, description: product.description });
    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      brand: { '@type': 'Brand', name: 'LG Gold' },
      image: new URL(product.images.primary, window.location.href).href,
      offers: product.packOptions.map((o) => ({
        '@type': 'Offer',
        name: o.size,
        price: o.retailPrice,
        priceCurrency: 'INR',
        availability: o.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      })),
    });
    document.head.appendChild(ld);
    return () => ld.remove();
  }, [product.slug]);

  // On phones the buy bar is up whenever the main buy buttons are off screen: before scrolling down to them
  // (they sit below the photo) and after scrolling past them. So buying is always one tap away.
  useEffect(() => {
    const el = buyRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => setShowSticky(!e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const add = (e?: React.MouseEvent<HTMLElement>) => {
    addToCart(product, packSize, quantity);
    if (e) flyToCart(e.currentTarget);
  };
  const buyNow = () => {
    addToCart(product, packSize, quantity, { quiet: true });
    navigate('checkout');
  };
  const whatsapp = () =>
    openWhatsApp(
      createWhatsAppUrl(
        outOfStock
          ? `Hi LG Gold Team, ${product.name} (${packSize}) shows as out of stock on your website. Please let me know when it will be available again.`
          : getProductWhatsAppMessage(product.name, `${quantity} x ${packSize}`),
      ),
    );
  const share = async () => {
    const data = { title: product.name, text: `${product.name}, ${pack.size} for ${inr(pack.retailPrice)}`, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else {
        await navigator.clipboard.writeText(window.location.href);
        toast({ message: 'Link copied. Paste it anywhere to share.' });
      }
    } catch {
      /* the visitor closed the share sheet */
    }
  };

  const specs = [
    { icon: Ruler, label: 'Grain length', value: product.grainSpecs.grainLength },
    { icon: Clock, label: 'Ageing', value: product.grainSpecs.aging },
    { icon: Droplets, label: 'Moisture', value: product.grainSpecs.moistureContent },
    { icon: ShieldCheck, label: 'Broken grains', value: product.grainSpecs.brokenGrainPercentage },
    { icon: Sparkles, label: 'Finish', value: product.grainSpecs.polish },
    { icon: Package, label: 'Colour', value: product.grainSpecs.color },
  ];

  return (
    <>
      <div className="border-b border-line bg-paper">
        <Container className="py-3">
          <Breadcrumbs items={[{ label: 'Shop', route: 'products' }, { label: product.name }]} onNavigate={onNavigate} />
        </Container>
      </div>

      <section className="bg-paper">
        <Container className="grid gap-10 py-8 lg:grid-cols-12 lg:gap-14 lg:py-12">
          {/* Gallery */}
          <div className="lg:col-span-7">
            <div className="lg:sticky lg:top-24">
              <button
                type="button"
                onClick={() => setLightbox(true)}
                aria-label="View photo full size"
                className="group relative block aspect-square w-full overflow-hidden rounded-3xl bg-[radial-gradient(ellipse_at_center,_#fffdf8_0%,_#f0e9d5_100%)] ring-1 ring-line cursor-zoom-in sm:aspect-[5/4]"
              >
                <img
                  key={imageIndex}
                  src={gallery[imageIndex]}
                  alt={`${product.name}, photo ${imageIndex + 1}`}
                  fetchPriority="high"
                  className={`h-full w-full animate-fade-in transition-transform duration-700 group-hover:scale-[1.03] ${
                    imageIndex === 0 && product.images.primaryFit === 'contain' ? 'object-contain p-8 drop-shadow-[0_24px_30px_rgb(23_74_50/0.3)]' : 'object-cover'
                  }`}
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-4 right-4 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-forest-800 shadow-soft opacity-0 transition-opacity group-hover:opacity-100">
                  <Expand className="h-5 w-5" />
                </span>
              </button>
              {gallery.length > 1 && (
                <div className="mt-3 grid grid-cols-4 gap-3" role="tablist" aria-label="Photos">
                  {gallery.map((img, i) => (
                    <button
                      key={img + i}
                      type="button"
                      role="tab"
                      aria-selected={i === imageIndex}
                      aria-label={`Photo ${i + 1}`}
                      onClick={() => setImageIndex(i)}
                      className={`aspect-square overflow-hidden rounded-2xl bg-cream ring-2 transition-all cursor-pointer ${
                        i === imageIndex ? 'ring-forest-800' : 'ring-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt=""
                        loading="lazy"
                        className={`h-full w-full ${i === 0 && product.images.primaryFit === 'contain' ? 'object-contain p-1.5' : 'object-cover'}`}
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Buy box */}
          <div className="lg:col-span-5">
            <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-gold-700">{product.grainSpecs.variety.split(' (')[0]} rice</p>
            <div className="mt-2 flex items-start justify-between gap-4">
              <h1 className="font-display text-4xl font-medium leading-[1.08] text-forest-800 sm:text-5xl">{product.name}</h1>
              <button
                type="button"
                onClick={share}
                aria-label="Share this product"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-forest-800 ring-1 ring-line hover:bg-cream cursor-pointer"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
            {product.subTitle && <p className="mt-3 text-lg text-muted">{product.subTitle}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge tone="gold" icon={<ShieldCheck className="h-3.5 w-3.5" />}>
                {fssaiLabel()}
              </Badge>
              {detailed && <Badge tone="cream">100% Sortex cleaned</Badge>}
              {product.grainSpecs.aging && <Badge tone="cream">{product.grainSpecs.aging}</Badge>}
            </div>

            {/* Price, pack and quantity */}
            <div className="mt-6 rounded-3xl bg-cream p-5 ring-1 ring-line">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <RollingNumber value={pack.retailPrice} className="font-display text-5xl text-forest-800" />
                {discount > 0 && (
                  <>
                    <span className="text-lg text-muted line-through tabular">{inr(pack.mrp)}</span>
                    <span className="rounded-full bg-forest-800 px-2.5 py-1 text-sm font-bold text-gold-300">{discount}% off MRP</span>
                  </>
                )}
              </div>
              <p className="mt-1.5 text-sm text-muted">
                {pack.size} · {perKg(pack.retailPrice, pack.weightKg)}
                {priceDate ? ` · today's mill rate, ${priceDate}` : ''}
              </p>

              <fieldset className="mt-5">
                <legend className="mb-2 text-sm font-semibold text-forest-800">Pack size</legend>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {product.packOptions.map((o) => {
                    const on = o.size === packSize;
                    return (
                      <label
                        key={o.size}
                        className={`flex min-h-16 cursor-pointer flex-col justify-center rounded-2xl px-3 py-2 ring-1 ring-inset transition-all has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold-500 ${
                          on ? 'bg-forest-800 text-white ring-forest-800 shadow-soft' : 'bg-white text-forest-800 ring-line hover:ring-forest-700'
                        } ${!o.inStock ? 'opacity-60' : ''}`}
                      >
                        <input type="radio" name="pack" value={o.size} checked={on} onChange={() => setPackSize(o.size)} className="sr-only" />
                        <span className="text-sm font-semibold leading-tight">{o.size}</span>
                        <span className={`text-sm tabular ${on ? 'text-gold-300' : 'text-muted'}`}>{o.inStock ? inr(o.retailPrice) : 'Out of stock'}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div className="mt-5 flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-forest-800" id="qty-label">
                  Quantity
                </span>
                <div className="flex items-center rounded-full bg-white ring-1 ring-line-strong" role="group" aria-labelledby="qty-label">
                  <button type="button" aria-label="One less" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="grid h-12 w-12 place-items-center rounded-full text-forest-800 hover:bg-cream cursor-pointer">
                    <Minus className="h-5 w-5" />
                  </button>
                  <span className="w-10 text-center text-lg font-semibold tabular" aria-live="polite">
                    {quantity}
                  </span>
                  <button type="button" aria-label="One more" onClick={() => setQuantity(Math.min(99, quantity + 1))} className="grid h-12 w-12 place-items-center rounded-full text-forest-800 hover:bg-cream cursor-pointer">
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
              {quantity > 1 && <p className="mt-2 text-right text-sm text-muted tabular">Total {inr(lineTotal)}</p>}
            </div>

            {outOfStock && (
              <p className="mt-4 rounded-2xl bg-danger-50 p-4 text-[15px] text-danger ring-1 ring-danger/20">
                This pack is out of stock right now. Message the mill on WhatsApp to hear when it is back, or choose another pack.
              </p>
            )}

            <div ref={buyRef} className="mt-5 grid grid-cols-2 gap-3">
              <Button size="lg" onClick={add} disabled={outOfStock} icon={<ShoppingBag className="h-5 w-5 text-gold-400" />}>
                Add to Cart
              </Button>
              <Button size="lg" variant="gold" onClick={buyNow} disabled={outOfStock} icon={<Zap className="h-5 w-5" />}>
                Buy Now
              </Button>
              <Button variant="whatsapp" size="lg" block className="col-span-2" onClick={whatsapp} icon={<MessageCircle className="h-5 w-5" />}>
                {outOfStock ? 'Ask on WhatsApp when it is back' : 'Ask the mill about this rice'}
              </Button>
            </div>

            <ul className="mt-5 space-y-2.5 text-[15px] text-ink-soft">
              <li className="flex items-start gap-3">
                <Truck className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" aria-hidden="true" />
                {willBeFree ? (
                  <span>
                    <strong className="text-forest-800">Free doorstep delivery</strong> on this order.
                  </span>
                ) : (
                  <span>
                    Free doorstep delivery on orders over {inr(freeAt)}. Otherwise {inr(BRAND_CONFIG.delivery.charge)}.
                  </span>
                )}
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" aria-hidden="true" />
                Your checkout order is saved to your account. Track payment and dispatch updates in My orders.
              </li>
              <li className="flex items-start gap-3">
                <Boxes className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" aria-hidden="true" />
                <span>
                  Buying more?{' '}
                  <AppLink to="wholesale" className="font-semibold text-forest-800 underline underline-offset-4">
                    Wholesale rates
                  </AppLink>{' '}
                  or{' '}
                  <AppLink to="export" className="font-semibold text-forest-800 underline underline-offset-4">
                    export quote
                  </AppLink>
                  .
                </span>
              </li>
            </ul>
          </div>
        </Container>
      </section>

      {/* About the rice */}
      <Section tone="cream">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeader eyebrow="About this rice" title={`Why families choose ${product.shortName}`} className="!mb-6" />
              <p className="text-lg leading-relaxed text-ink-soft">{product.longDescription}</p>
            </div>
            {detailed && (
              <dl className="grid grid-cols-2 gap-3 self-start sm:grid-cols-3 lg:col-span-7">
                {specs.map((s) => (
                  // dt and dd sit directly in the wrapper div, as description lists require
                  <Reveal key={s.label} className="h-full rounded-2xl bg-white p-4 ring-1 ring-line">
                    <dt className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">
                      <s.icon className="mb-2 block h-5 w-5 text-gold-600" aria-hidden="true" />
                      {s.label}
                    </dt>
                    <dd className="mt-1 font-semibold leading-snug text-forest-800">{s.value}</dd>
                  </Reveal>
                ))}
              </dl>
            )}
          </div>
        </Container>
      </Section>

      {detailed && (
        <Section tone="paper">
          <Container>
            <SectionHeader eyebrow="Cooking guide" title={`How to cook ${product.shortName} perfectly`} />
            <div className="grid gap-6 lg:grid-cols-12">
              <div className="space-y-4 lg:col-span-5">
                {[
                  { icon: Droplets, label: 'Rice to water', value: product.cookingGuide.waterRatio },
                  { icon: Timer, label: 'Soak', value: product.cookingGuide.soakingTime },
                  { icon: Clock, label: 'Cook', value: product.cookingGuide.cookingTime },
                ].map((c) => (
                  <div key={c.label} className="flex items-start gap-4 rounded-2xl bg-white p-4 ring-1 ring-line">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold-100 text-gold-700">
                      <c.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">{c.label}</p>
                      <p className="font-semibold text-forest-800">{c.value}</p>
                    </div>
                  </div>
                ))}
                <blockquote className="rounded-2xl bg-forest-800 p-5 text-cream">
                  <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-gold-400">Mill tip</p>
                  <p className="mt-2 leading-relaxed">{product.cookingGuide.tips}</p>
                </blockquote>
              </div>
              <div className="lg:col-span-7">
                <CookingCalculator defaultRice={rice} />
              </div>
            </div>

            <div className="mt-10">
              <h3 className="font-display text-2xl text-forest-800">Nutrition per 100g (uncooked)</h3>
              <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {Object.entries(product.nutritionalInfo).map(([k, v]) => (
                  <div key={k} className="rounded-2xl bg-white p-4 text-center ring-1 ring-line">
                    <dt className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">{k}</dt>
                    <dd className="mt-1 font-display text-xl text-forest-800 tabular">{v.replace(' / 100g', '')}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Container>
        </Section>
      )}

      {detailed && (
        <Section tone="cream">
          <Container>
            <SectionHeader eyebrow="Side by side" title="HMT or JSR?" />
            <GrainComparison />
          </Container>
        </Section>
      )}

      {linkedRecipes.length > 0 && (
        <Section tone="paper">
          <Container>
            <SectionHeader
              eyebrow="Cook with it"
              title={`Recipes made with ${product.shortName}`}
              action={
                <AppLink to="recipes" className={buttonClass('outline', 'md')}>
                  All recipes <ArrowRight className="h-4 w-4" />
                </AppLink>
              }
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {linkedRecipes.map((r) => (
                <RecipeCard key={r.id} recipe={r} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {PRODUCTS.length > 1 && (
        <Section tone="cream" tight>
          <Container>
            <h2 className="font-display text-2xl text-forest-800">Also from the mill</h2>
            <div className="mt-5 flex gap-4 overflow-x-auto pb-2 scrollbar-none">
              {PRODUCTS.filter((p) => p.slug !== product.slug).map((p) => (
                <AppLink key={p.slug} to="product-detail" param={p.slug} className="flex min-w-[17rem] items-center gap-4 rounded-2xl bg-white p-3 ring-1 ring-line hover:ring-forest-700">
                  <img src={p.images.primary} alt="" className={`h-16 w-16 rounded-xl bg-cream ${p.images.primaryFit === 'contain' ? 'object-contain p-1' : 'object-cover'}`} referrerPolicy="no-referrer" />
                  <span>
                    <span className="block font-semibold text-forest-800">{p.name}</span>
                    <span className="text-sm text-muted tabular">from {inr(Math.min(...p.packOptions.map((o) => o.retailPrice)))}</span>
                  </span>
                </AppLink>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Phone buy bar, above the bottom navigation */}
      <div
        aria-hidden={!showSticky}
        className={`no-print fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-30 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur-xl transition-transform duration-300 lg:hidden ${
          showSticky ? 'translate-y-0' : 'pointer-events-none translate-y-[150%]'
        }`}
      >
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-muted">
              {quantity > 1 ? `${quantity} × ` : ''}
              {pack.size}
            </p>
            <p className="font-display text-2xl leading-none text-forest-800">
              <RollingNumber value={lineTotal} />
            </p>
          </div>
          <Button onClick={add} disabled={outOfStock} tabIndex={showSticky ? 0 : -1} aria-label="Add to cart" className="!px-4">
            <ShoppingBag className="h-5 w-5 text-gold-400" />
          </Button>
          <Button variant="gold" onClick={buyNow} disabled={outOfStock} tabIndex={showSticky ? 0 : -1}>
            Buy Now
          </Button>
        </div>
      </div>

      {/* Full-size photos */}
      <Dialog open={lightbox} onClose={() => setLightbox(false)} label={`${product.name} photos`} wide dark className="!bg-forest-950 sm:!max-w-5xl">
        <div
          className="relative flex h-[80dvh] items-center justify-center p-4"
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') step(1);
            if (e.key === 'ArrowLeft') step(-1);
          }}
        >
          <img
            key={imageIndex}
            src={gallery[imageIndex]}
            alt={`${product.name}, photo ${imageIndex + 1}`}
            className="max-h-full max-w-full animate-fade-in rounded-2xl object-contain"
            referrerPolicy="no-referrer"
          />
          {gallery.length > 1 && (
            <>
              <button type="button" aria-label="Previous photo" onClick={() => step(-1)} className="absolute left-3 grid h-12 w-12 place-items-center rounded-full bg-white/90 text-forest-800 cursor-pointer">
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button type="button" aria-label="Next photo" onClick={() => step(1)} className="absolute right-3 grid h-12 w-12 place-items-center rounded-full bg-white/90 text-forest-800 cursor-pointer">
                <ChevronRight className="h-6 w-6" />
              </button>
              <p className="absolute bottom-4 rounded-full bg-black/50 px-3 py-1 text-sm text-white tabular">
                {imageIndex + 1} / {gallery.length}
              </p>
            </>
          )}
        </div>
      </Dialog>
    </>
  );
};
