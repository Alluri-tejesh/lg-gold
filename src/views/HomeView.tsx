import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Globe, Boxes, CheckCircle2, MessageCircle, Phone, TrendingUp, Factory, Container as ContainerIcon, Store, Truck } from 'lucide-react';
import { PRODUCTS, getProductBySlug } from '../data/products';
import { RECIPES } from '../data/recipes';
import { WHY_LG_GOLD_PILLARS } from '../data/trustPoints';
import { createWhatsAppUrl, fssaiLabel, phoneTelHref, BRAND_CONFIG } from '../config/brandConfig';
import { priceInfo, formatPriceDate } from '../data/prices';
import { ProductCard } from '../components/common/ProductCard';
import { RecipeCard } from '../components/common/RecipeCard';
import { RiceFinder } from '../components/common/RiceFinder';
import { millPlantImage, millPlantSrcSet, jsrBagImage } from '../assets';
import { Reveal, CountUp } from '../components/common/motion';
import { GrainField } from '../components/fx/GrainField';
import { GrainStory } from '../components/fx/GrainStory';
import { Spotlight } from '../components/fx/Spotlight';
import { WhyPillars } from '../components/common/WhyPillars';
import { Container, Section, SectionHeader, Eyebrow } from '../components/ui/Section';
import { AppLink } from '../components/ui/AppLink';
import { buttonClass } from '../components/ui/Button';
import { ChoiceChips } from '../components/ui/Field';

interface HomeViewProps {
  onNavigate: (route: string, param?: string) => void;
}

const RECIPE_FILTERS = ['All', 'Biryani', 'South Indian', 'Everyday Meals', 'Quick & Easy', 'Vegetarian'];

export const HomeView: React.FC<HomeViewProps> = () => {
  const [recipeFilter, setRecipeFilter] = useState('All');

  const featuredRecipes = RECIPES.filter((r) => recipeFilter === 'All' || r.categories.includes(recipeFilter)).slice(0, 4);
  const rateOf = (slug: string) => getProductBySlug(slug)?.packOptions.find((o) => o.size === '26kg Bag');
  const hmt = rateOf('hmt-rice');
  const jsr = rateOf('jsr-rice');
  const priceDate = formatPriceDate(priceInfo.updated);

  return (
    <>
      {/* 1. HERO */}
      <section className="relative overflow-hidden bg-cream bg-grain">
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-10 h-[34rem] w-[34rem] rounded-full bg-gold-300/40 blur-3xl" />
        {/* Rice grains that drift and part around the cursor */}
        <GrainField />
        <Container className="relative grid items-center gap-12 py-12 sm:py-16 lg:grid-cols-12 lg:gap-8 lg:py-20">
          <div className="lg:col-span-7">
            <Eyebrow className="fade-up">Single-origin · Venkatadri Palem, Telangana</Eyebrow>
            <h1
              className="fade-up mt-5 font-display text-[2.9rem] font-medium leading-[1.02] tracking-tight text-forest-800 sm:text-6xl lg:text-[4.6rem]"
              style={{ ['--d' as string]: '80ms' }}
            >
              Pure Telangana rice,{' '}
              <span className="relative whitespace-nowrap italic text-gold-600">
                straight
                <svg aria-hidden="true" viewBox="0 0 200 12" className="absolute -bottom-2 left-0 w-full" preserveAspectRatio="none">
                  <path d="M2 9 C 50 2, 150 2, 198 8" fill="none" stroke="#C9A227" strokeWidth="3" strokeLinecap="round" className="[stroke-dasharray:220] [stroke-dashoffset:220] animate-[draw_1.2s_0.7s_ease-out_forwards]" />
                </svg>
              </span>{' '}
              from our mill.
            </h1>
            <p className="fade-up mt-6 max-w-xl text-lg leading-relaxed text-ink-soft sm:text-xl" style={{ ['--d' as string]: '170ms' }}>
              HMT and JSR rice aged 12 months or more, sorted grain by grain by optical cameras, and packed in 26kg bags for homes,
              wholesalers and export buyers.
            </p>
            <div className="fade-up mt-8 flex flex-col gap-3 sm:flex-row" style={{ ['--d' as string]: '260ms' }}>
              <AppLink to="products" className={buttonClass('primary', 'lg')}>
                Shop 26kg bags <ArrowRight className="h-5 w-5 text-gold-400" />
              </AppLink>
              <AppLink to="wholesale" className={buttonClass('outline', 'lg')}>
                Wholesale &amp; export rates
              </AppLink>
            </div>
            <ul className="fade-up mt-8 grid grid-cols-2 gap-x-6 gap-y-3 text-[15px] font-medium text-ink-soft sm:flex sm:flex-wrap" style={{ ['--d' as string]: '350ms' }}>
              {['FSSAI certified', '12+ months aged', '100% Sortex sorted', 'Direct from the mill'].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-gold-600" aria-hidden="true" /> {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Bag, settling grains and the live rate card */}
          <div className="relative mx-auto w-full max-w-md lg:col-span-5">
            <AppLink to="product-detail" param="jsr-rice" aria-label="View LG Gold JSR rice" className="group relative block">
              <div className="absolute inset-x-6 bottom-2 top-10 rounded-[2.5rem] bg-gradient-to-b from-gold-300/70 to-gold-100/0" aria-hidden="true" />
              <img
                src={jsrBagImage}
                alt="LG Gold JSR Lachkari Kolam rice, 26kg bag"
                width={703}
                height={1405}
                fetchPriority="high"
                className="settle-in relative mx-auto h-[420px] w-auto -rotate-2 drop-shadow-[0_30px_40px_rgb(23_74_50/0.35)] transition-[rotate] duration-500 group-hover:rotate-0 sm:h-[500px]"
              />
            </AppLink>

            {/* Today's rate: live from the daily price file */}
            {(hmt || jsr) && (
              <div className="fade-up absolute -bottom-4 -left-2 w-64 rounded-2xl bg-paper/95 p-4 shadow-lift ring-1 ring-line backdrop-blur sm:-left-10" style={{ ['--d' as string]: '700ms' }}>
                <p className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-gold-700">
                  <TrendingUp className="h-4 w-4" aria-hidden="true" /> Today&apos;s mill rate
                </p>
                <dl className="mt-3 space-y-1.5">
                  {[
                    { label: 'HMT', pack: hmt },
                    { label: 'JSR', pack: jsr },
                  ].map(({ label, pack }) =>
                    pack ? (
                      <div key={label} className="flex items-baseline justify-between">
                        <dt className="font-semibold text-forest-800">{label} · 26kg</dt>
                        <dd className="font-display text-xl text-forest-800 tabular">₹{pack.retailPrice.toLocaleString('en-IN')}</dd>
                      </div>
                    ) : null,
                  )}
                </dl>
                {priceDate && <p className="mt-2 text-xs text-muted">Updated {priceDate}</p>}
              </div>
            )}
          </div>
        </Container>

        {/* 2. Numbers */}
        <div className="relative border-t border-line bg-paper/70">
          <Container className="grid grid-cols-2 gap-x-6 gap-y-8 py-10 lg:grid-cols-4">
            {[
              { to: 12, suffix: '+', label: 'months of natural ageing' },
              { to: 100, suffix: '%', label: 'optically Sortex sorted' },
              { to: 26, suffix: ' kg', label: 'in every standard bag' },
              { to: 1000, suffix: '', label: 'bags in a 20ft container', format: (n: number) => n.toLocaleString('en-IN') },
            ].map((stat, i) => (
              <Reveal key={stat.label} delay={i * 110}>
                <p className="font-display text-4xl text-forest-800 tabular sm:text-5xl">
                  <CountUp to={stat.to} suffix={stat.suffix} format={stat.format} />
                </p>
                <p className="mt-1 text-[15px] text-muted">{stat.label}</p>
              </Reveal>
            ))}
          </Container>
        </div>
      </section>

      {/* 3. PRODUCTS + RICE FINDER */}
      <Section tone="paper">
        <Container>
          <SectionHeader
            eyebrow="Our rice"
            title="Two varieties. One standard."
            intro="Both are aged a year or more and Sortex cleaned. HMT is firm and long for biryani and pulao; JSR is soft and light for everyday meals."
            action={
              <AppLink to="products" className={buttonClass('outline', 'md')}>
                Compare in detail <ArrowRight className="h-4 w-4" />
              </AppLink>
            }
          />
          <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
            {PRODUCTS.map((product, i) => (
              <Reveal key={product.id} delay={i * 120} className="h-full">
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10">
            <RiceFinder />
          </Reveal>
        </Container>
      </Section>

      {/* 4. WHY LG GOLD */}
      <Section tone="cream" grain>
        <Container>
          <SectionHeader
            eyebrow="Why LG Gold"
            title="Five things we never skip"
            intro="Every bag that leaves Venkatadri Palem has been through the same five steps."
            align="center"
          />
          <WhyPillars pillars={WHY_LG_GOLD_PILLARS} />
        </Container>
      </Section>

      {/* 5. WATCH A GRAIN BECOME LG GOLD (scroll story) + THE MILL */}
      <GrainStory />

      <Section tone="white" tight>
        <Container>
          <Reveal>
            <figure className="grid overflow-hidden rounded-3xl bg-forest-900 text-cream lg:grid-cols-2">
              <img
                src={millPlantImage}
                srcSet={millPlantSrcSet}
                sizes="(min-width: 1024px) 50vw, 100vw"
                alt="Milltec rice milling machinery at the Sri Lakshmi Ganapathi mill, Venkatadri Palem"
                loading="lazy"
                className="h-72 w-full object-cover sm:h-96 lg:h-full"
              />
              <figcaption className="flex flex-col justify-center p-8 sm:p-12">
                <Eyebrow dark>
                  <Factory className="h-4 w-4" aria-hidden="true" /> Our mill
                </Eyebrow>
                <p className="mt-4 font-display text-3xl leading-tight text-white sm:text-4xl">A modern Milltec line in the heart of paddy country</p>
                <p className="mt-4 leading-relaxed text-cream/75">
                  Multi-stage de-husking, temperature-controlled polishing and Sortex CCD cameras that check every grain, so broken and
                  discoloured grains never reach your bag.
                </p>
                <AppLink to="quality" className="mt-6 inline-flex items-center gap-2 font-semibold text-gold-300 hover:text-white">
                  See our quality process <ArrowRight className="h-4 w-4" />
                </AppLink>
              </figcaption>
            </figure>
          </Reveal>
        </Container>
      </Section>

      {/* 6. FOR BUSINESS */}
      <Section tone="forest-deep" grain>
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-gold-500/10 blur-3xl" />
        <Spotlight>
        <Container className="relative">
          <SectionHeader
            dark
            eyebrow="For business"
            title="Buy by the bag, the truck or the container"
            intro="Mill-direct rates for shops, caterers and distributors in India, and full containers for importers abroad."
          />
          <div className="grid gap-6 lg:grid-cols-2">
            {[
              {
                icon: Store,
                title: 'Wholesale & bulk',
                body: 'From about 500kg for kirana stores, supermarkets, hotels and caterers, up to full truckloads with scheduled supply.',
                points: ['Live wholesale estimator', 'Truckloads of 10–26 tonnes', 'Delivery across India'],
                to: 'wholesale',
                cta: 'Get wholesale rates',
              },
              {
                icon: ContainerIcon,
                title: 'Export',
                body: '20ft and 40ft containers in 26kg PP, laminated or private-label bags, with phytosanitary and fumigation paperwork.',
                points: ['1,000 bags (26 MT) per 20ft FCL', 'FOB and CIF quotes', 'Private label on request'],
                to: 'export',
                cta: 'Request an export quote',
              },
            ].map((b, i) => (
              <Reveal key={b.to} delay={i * 120} className="h-full">
                <AppLink
                  to={b.to}
                  className="spot-border group flex h-full flex-col rounded-3xl bg-white/5 p-8 ring-1 ring-white/10 transition-all duration-300 hover:bg-white/8 hover:ring-gold-500/60 sm:p-10"
                >
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gold-500 text-forest-900">
                    <b.icon className="h-7 w-7" />
                  </span>
                  <h3 className="mt-6 font-display text-3xl text-white">{b.title}</h3>
                  <p className="mt-3 leading-relaxed text-cream/75">{b.body}</p>
                  <ul className="mt-5 space-y-2">
                    {b.points.map((pt) => (
                      <li key={pt} className="flex items-center gap-2 text-cream/90">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" /> {pt}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-8 inline-flex items-center gap-2 font-semibold text-gold-300 group-hover:text-white">
                    {b.cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </AppLink>
              </Reveal>
            ))}
          </div>
          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-3xl bg-white/5 px-6 py-5 ring-1 ring-white/10 sm:flex-row">
            <p className="text-center text-cream/85 sm:text-left">
              <strong className="text-white">Need today&apos;s trade rate?</strong> Talk to the dispatch desk directly.
            </p>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <a
                href={createWhatsAppUrl('Hi LG Gold, I would like today’s wholesale rates for HMT and JSR rice.')}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass('whatsapp', 'md')}
              >
                <MessageCircle className="h-5 w-5" /> WhatsApp
              </a>
              <a href={phoneTelHref()} className={buttonClass('outline-light', 'md')}>
                <Phone className="h-5 w-5" /> {BRAND_CONFIG.contact.primaryPhone}
              </a>
            </div>
          </div>
        </Container>
        </Spotlight>
      </Section>

      {/* 7. RECIPES */}
      <Section tone="cream">
        <Container>
          <SectionHeader
            eyebrow="From our kitchen"
            title="Cook something delicious tonight"
            intro={`${RECIPES.length} tested recipes, from Hyderabadi dum biryani to five-minute curd rice.`}
            action={
              <AppLink to="recipes" className={buttonClass('outline', 'md')}>
                All {RECIPES.length} recipes <ArrowRight className="h-4 w-4" />
              </AppLink>
            }
          />
          <div className="-mx-4 mb-8 overflow-x-auto px-4 scrollbar-none">
            <ChoiceChips
              label="Recipe category"
              value={recipeFilter}
              onChange={setRecipeFilter}
              options={RECIPE_FILTERS.map((c) => ({ value: c, label: c }))}
              className="flex-nowrap"
            />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredRecipes.map((recipe, i) => (
              <Reveal key={recipe.id} delay={i * 80} className="h-full">
                <RecipeCard recipe={recipe} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Trust strip */}
      <section className="border-t border-line bg-paper">
        <Container className="grid grid-cols-2 gap-6 py-8 text-[15px] text-ink-soft lg:grid-cols-4">
          {[
            { icon: ShieldCheck, text: fssaiLabel() },
            { icon: Truck, text: `Free delivery over ₹${BRAND_CONFIG.delivery.freeFromOrderValue.toLocaleString('en-IN')}` },
            { icon: Boxes, text: 'Wholesale & bulk supply' },
            { icon: Globe, text: 'Export orders accepted' },
          ].map(({ icon: Icon, text }) => (
            <p key={text} className="flex items-center gap-3 font-medium">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold-100 text-gold-700">
                <Icon className="h-5 w-5" />
              </span>
              {text}
            </p>
          ))}
        </Container>
      </section>
    </>
  );
};
