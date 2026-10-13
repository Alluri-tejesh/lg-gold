import React from 'react';
import { ArrowRight, Truck, ShieldCheck, MessageCircle } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { priceInfo, formatPriceDate } from '../data/prices';
import { BRAND_CONFIG, fssaiLabel } from '../config/brandConfig';
import { ProductCard } from '../components/common/ProductCard';
import { GrainComparison } from '../components/common/GrainComparison';
import { CookingCalculator } from '../components/common/CookingCalculator';
import { RiceFinder } from '../components/common/RiceFinder';
import { Reveal } from '../components/common/motion';
import { PageHero } from '../components/ui/PageHero';
import { Container, Section, SectionHeader } from '../components/ui/Section';
import { AppLink } from '../components/ui/AppLink';
import { buttonClass } from '../components/ui/Button';

interface ProductsViewProps {
  onNavigate: (route: string, param?: string) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({ onNavigate }) => {
  const date = formatPriceDate(priceInfo.updated);
  return (
    <>
      <PageHero
        crumbs={[{ label: 'Shop' }]}
        onNavigate={onNavigate}
        eyebrow={date ? `Today’s mill rates · ${date}` : 'Mill-direct prices'}
        title="Shop LG Gold rice"
        intro="Choose your rice and pack, place your order, and follow its journey from our mill to your door in your account."
      />

      {/* Quick reassurance row */}
      <div className="border-b border-line bg-paper">
        <Container className="flex flex-wrap gap-x-8 gap-y-2 py-4 text-[15px] text-ink-soft">
          <span className="inline-flex items-center gap-2">
            <Truck className="h-5 w-5 text-gold-600" aria-hidden="true" /> Free delivery over ₹{BRAND_CONFIG.delivery.freeFromOrderValue.toLocaleString('en-IN')}
          </span>
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-gold-600" aria-hidden="true" /> {fssaiLabel()}
          </span>
          <span className="inline-flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-gold-600" aria-hidden="true" /> Orders saved to your account
          </span>
        </Container>
      </div>

      <Section tone="cream" tight>
        <Container>
          <h2 className="sr-only">Our rice</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
            {PRODUCTS.map((product, i) => (
              <Reveal key={product.id} delay={i * 100} className="h-full">
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="paper">
        <Container>
          <SectionHeader eyebrow="Side by side" title="HMT or JSR?" intro="Same mill, same care. The difference is the grain, and the dishes each one is made for." />
          <Reveal>
            <GrainComparison />
          </Reveal>
          <Reveal className="mt-10">
            <RiceFinder />
          </Reveal>
        </Container>
      </Section>

      <Section tone="cream" tight>
        <Container>
          <Reveal>
            <CookingCalculator />
          </Reveal>
        </Container>
      </Section>

      <Section tone="forest" grain tight>
        <Container className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="font-display text-3xl text-white sm:text-4xl">Buying for a shop, hotel or container?</p>
            <p className="mt-3 text-cream/75">Trade rates from about 500kg, full truckloads, and export containers with private-label bags.</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <AppLink to="wholesale" className={buttonClass('gold', 'lg')}>
              Wholesale rates <ArrowRight className="h-5 w-5" />
            </AppLink>
            <AppLink to="export" className={buttonClass('outline-light', 'lg')}>
              Export quote
            </AppLink>
          </div>
        </Container>
      </Section>
    </>
  );
};
