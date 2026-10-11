import React, { useState } from 'react';
import { ArrowRight, MessageCircle, Phone, MapPin } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { RECIPES } from '../data/recipes';
import { EXPORT_JOURNEY_STEPS, WHO_WE_SUPPLY_TARGETS, REVIEWS } from '../data/trustPoints';
import { BRAND_CONFIG, createWhatsAppUrl } from '../config/brandConfig';
import { millPlantImage } from '../assets';

interface HomeViewProps {
  onNavigate: (route: string, param?: string) => void;
}

const BAG_KG = 26;
const CONTAINER_TONNES = 26;
const WHOLESALE_MOQ_TONNES = 0.5;

const BUYING_ROUTES = [
  {
    route: 'products',
    name: 'Retail bags',
    minimum: 'From one 26 kg bag',
    detail: 'For homes, small shops and canteens. Order online or on WhatsApp for doorstep delivery.',
    action: 'See bag prices',
  },
  {
    route: 'wholesale',
    name: 'Wholesale lots',
    minimum: 'From 500 kg',
    detail: 'Multi-bag lots for supermarkets, caterers and distributors, at mill-direct rates.',
    action: 'Get wholesale rates',
  },
  {
    route: 'bulk',
    name: 'Bulk tonnage',
    minimum: 'Truck loads',
    detail: 'Scheduled supply in tonnes for institutions, hostels and regional traders.',
    action: 'Plan a bulk order',
  },
  {
    route: 'export',
    name: 'Export containers',
    minimum: '20ft and 40ft FCL',
    detail: 'About 26 MT per 20ft container, in BOPP, laminated PP or your own private-label bags.',
    action: 'Request an export quote',
  },
];

type SpecKey = 'grainLength' | 'brokenGrainPercentage' | 'moistureContent' | 'aging' | 'polish' | 'color';

const SPEC_ROWS: { label: string; key: SpecKey }[] = [
  { label: 'Grain length', key: 'grainLength' },
  { label: 'Broken grains', key: 'brokenGrainPercentage' },
  { label: 'Moisture', key: 'moistureContent' },
  { label: 'Ageing', key: 'aging' },
  { label: 'Polish', key: 'polish' },
  { label: 'Colour', key: 'color' },
];

const formatNumber = (n: number, digits = 0) =>
  n.toLocaleString('en-IN', { maximumFractionDigits: digits, minimumFractionDigits: digits });

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const [varietySlug, setVarietySlug] = useState(PRODUCTS[0].slug);
  const [tonnes, setTonnes] = useState(26);

  const variety = PRODUCTS.find((p) => p.slug === varietySlug) ?? PRODUCTS[0];
  const bags = Math.ceil((tonnes * 1000) / BAG_KG);
  const containers = tonnes / CONTAINER_TONNES;
  const belowMoq = tonnes < WHOLESALE_MOQ_TONNES;

  const setTonnesSafe = (value: number) => {
    if (Number.isNaN(value)) return;
    setTonnes(Math.min(Math.max(value, 0), 2600));
  };

  const quoteMessage = `Hi LG Gold, I would like a quote for ${formatNumber(tonnes, 1)} MT of ${variety.name} (about ${formatNumber(bags)} bags of ${BAG_KG} kg). Please share the rate, packing options and dispatch timeline.`;

  const tradeQuotes = REVIEWS.filter((r) => ['r2', 'r4', 'r1'].includes(r.id));
  const featuredQuote = tradeQuotes[0];
  const otherQuotes = tradeQuotes.slice(1);

  return (
    <div>
      {/* HERO: headline plus a tonnage console that turns a rough quantity into a ready-to-send quote */}
      <section className="bg-[#F3F4EC] pt-10 pb-16 lg:pt-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          <div className="lg:col-span-7 lg:pt-6">
            <h1 className="font-serif-brand font-extrabold text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-[4.25rem] text-[#0B3B2C]">
              Rice by the tonne, straight from our mill.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-[#15231C]/80 leading-relaxed">
              LG Gold mills HMT and JSR rice at Venkatadri Palem in Telangana. Every grain is aged
              12 months or more and sorted by optical cameras before it is stitched into {BAG_KG} kg bags.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#quote-console"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('quote-console')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="inline-flex items-center gap-2 bg-[#0B3B2C] text-[#F3F4EC] px-6 py-3.5 rounded-md font-semibold hover:bg-[#14553F] transition-colors"
              >
                Size your order
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
              <button
                onClick={() => onNavigate('products')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md font-semibold text-[#0B3B2C] border border-[#0B3B2C]/40 hover:bg-[#0B3B2C]/5 transition-colors cursor-pointer"
              >
                Buy a single bag
              </button>
            </div>

            <dl className="mt-12 grid grid-cols-3 max-w-xl border-t border-[#0B3B2C]/20">
              {[
                ['12+ months', 'natural ageing'],
                [`${BAG_KG} kg`, 'stitched PP bags'],
                [`${CONTAINER_TONNES} MT`, 'in a 20ft container'],
              ].map(([figure, caption]) => (
                <div key={caption} className="pt-4 pr-4">
                  <dt className="tnum font-serif-brand font-bold text-xl sm:text-2xl text-[#0B3B2C]">{figure}</dt>
                  <dd className="text-sm text-[#4C6358] mt-1">{caption}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Console */}
          <div id="quote-console" className="lg:col-span-5 scroll-mt-24">
            <div className="bg-[#0B3B2C] bg-grain text-[#F3F4EC] rounded-xl p-6 sm:p-8 shadow-card">
              <h2 className="font-serif-brand text-2xl font-bold">Size your order</h2>
              <p className="text-sm text-[#F3F4EC]/70 mt-1">
                Pick a variety and a quantity. We turn it into bags and containers, and you send it to the mill.
              </p>

              <div role="radiogroup" aria-label="Rice variety" className="mt-6 grid grid-cols-2 gap-2 p-1 bg-[#072A1F] rounded-lg">
                {PRODUCTS.map((p) => {
                  const selected = p.slug === varietySlug;
                  return (
                    <button
                      key={p.id}
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setVarietySlug(p.slug)}
                      className={`py-2.5 rounded-md text-sm font-semibold transition-colors cursor-pointer ${
                        selected ? 'bg-[#E0A21A] text-[#072A1F]' : 'text-[#F3F4EC]/80 hover:text-white'
                      }`}
                    >
                      {p.shortName}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6">
                <label htmlFor="tonnes" className="text-sm font-medium text-[#F3F4EC]/85">
                  Quantity in metric tonnes
                </label>
                <div className="mt-2 flex items-center gap-4">
                  <input
                    id="tonnes"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step={0.5}
                    value={tonnes}
                    onChange={(e) => setTonnesSafe(parseFloat(e.target.value))}
                    className="tnum w-28 bg-[#072A1F] border border-[#F3F4EC]/25 rounded-md px-3 py-2.5 text-xl font-bold text-white"
                  />
                  <input
                    type="range"
                    aria-label="Quantity slider"
                    min={0.5}
                    max={130}
                    step={0.5}
                    value={Math.min(Math.max(tonnes, 0.5), 130)}
                    onChange={(e) => setTonnesSafe(parseFloat(e.target.value))}
                    className="flex-1 accent-[#E0A21A]"
                  />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-px bg-[#F3F4EC]/15 rounded-lg overflow-hidden" aria-live="polite">
                <div className="bg-[#0B3B2C] p-4">
                  <p className="text-sm text-[#F3F4EC]/70">{BAG_KG} kg bags</p>
                  <p className="tnum font-serif-brand text-3xl font-extrabold text-[#E0A21A] mt-1">{formatNumber(bags)}</p>
                </div>
                <div className="bg-[#0B3B2C] p-4">
                  <p className="text-sm text-[#F3F4EC]/70">20ft containers</p>
                  <p className="tnum font-serif-brand text-3xl font-extrabold text-[#E0A21A] mt-1">{formatNumber(containers, 2)}</p>
                </div>
              </div>

              {belowMoq && (
                <p className="mt-3 text-sm text-[#F0D890]">
                  Wholesale rates start at 500 kg. For less, use the retail bags.
                </p>
              )}

              <dl className="mt-6 text-sm divide-y divide-[#F3F4EC]/12 border-y border-[#F3F4EC]/12">
                {SPEC_ROWS.slice(0, 4).map((row) => (
                  <div key={row.key} className="flex justify-between gap-4 py-2.5">
                    <dt className="text-[#F3F4EC]/65">{row.label}</dt>
                    <dd className="text-right font-medium">{variety.grainSpecs[row.key]}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 flex flex-col gap-3">
                <a
                  href={createWhatsAppUrl(quoteMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#E0A21A] text-[#072A1F] py-3.5 rounded-md font-bold hover:bg-[#F0D890] transition-colors"
                >
                  <MessageCircle className="w-5 h-5" aria-hidden="true" />
                  Send this quote request on WhatsApp
                </a>
                <button
                  onClick={() => onNavigate('export')}
                  className="py-3 rounded-md font-semibold border border-[#F3F4EC]/35 hover:bg-[#F3F4EC]/10 transition-colors cursor-pointer"
                >
                  Use the export form instead
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WAYS TO BUY: a price-list style ledger, one row per route */}
      <section className="bg-[#F3F4EC] border-t border-[#0B3B2C]/15 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <h2 className="font-serif-brand font-extrabold text-3xl sm:text-4xl text-[#0B3B2C]">
              Four ways to buy
            </h2>
            <p className="mt-4 text-[#15231C]/75 leading-relaxed max-w-sm">
              The same rice goes into every bag. What changes is the quantity, the packing and who you talk to at the mill.
            </p>
          </div>
          <ul className="lg:col-span-8 border-t border-[#0B3B2C]/25">
            {BUYING_ROUTES.map((r) => (
              <li key={r.route} className="border-b border-[#0B3B2C]/25">
                <button
                  onClick={() => onNavigate(r.route)}
                  className="group w-full grid grid-cols-1 sm:grid-cols-12 gap-x-6 gap-y-2 py-6 text-left cursor-pointer hover:bg-[#E4DEC8]/50 transition-colors px-2 -mx-2"
                >
                  <span className="sm:col-span-4">
                    <span className="block font-serif-brand font-bold text-xl text-[#0B3B2C]">{r.name}</span>
                    <span className="block text-sm font-semibold text-[#8F6A0E] mt-1">{r.minimum}</span>
                  </span>
                  <span className="sm:col-span-5 text-[#15231C]/75 leading-relaxed">{r.detail}</span>
                  <span className="sm:col-span-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0B3B2C] sm:justify-end">
                    {r.action}
                    <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* SPEC SHEET: HMT against JSR, straight from product data */}
      <section className="bg-[#E4DEC8] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-2xl">
            <h2 className="font-serif-brand font-extrabold text-3xl sm:text-4xl text-[#0B3B2C]">
              Two varieties, one spec sheet
            </h2>
            <p className="mt-4 text-[#15231C]/80 leading-relaxed">
              HMT is a medium-slender grain that stays separate in biryani and daily meals. JSR is a finer, softer grain
              that cooks faster. Both are Sortex cleaned.
            </p>
          </div>

          <div className="mt-10 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[640px] text-left border-collapse bg-[#F3F4EC] rounded-lg overflow-hidden">
              <caption className="sr-only">Grain specifications of LG Gold HMT and JSR rice</caption>
              <thead>
                <tr className="align-bottom">
                  <th scope="col" className="w-1/4 p-5">
                    <span className="sr-only">Specification</span>
                  </th>
                  {PRODUCTS.map((p) => (
                    <th key={p.id} scope="col" className="p-5 border-l border-[#0B3B2C]/15">
                      <img
                        src={p.images.rawGrain}
                        alt={`${p.shortName} grains`}
                        loading="lazy"
                        className="w-full h-36 object-cover rounded-md mb-4"
                        referrerPolicy="no-referrer"
                      />
                      <span className="block font-serif-brand text-2xl font-extrabold text-[#0B3B2C]">{p.name}</span>
                      <span className="block text-sm font-normal text-[#4C6358] mt-1">{p.subTitle}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SPEC_ROWS.map((row) => (
                  <tr key={row.key} className="border-t border-[#0B3B2C]/15">
                    <th scope="row" className="p-5 text-sm font-semibold text-[#15231C]/80 align-top">{row.label}</th>
                    {PRODUCTS.map((p) => (
                      <td key={p.id} className="tnum p-5 border-l border-[#0B3B2C]/15 text-[#15231C]">
                        {p.grainSpecs[row.key]}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="border-t border-[#0B3B2C]/15">
                  <th scope="row" className="p-5 text-sm font-semibold text-[#15231C]/80 align-top">Cooking</th>
                  {PRODUCTS.map((p) => (
                    <td key={p.id} className="p-5 border-l border-[#0B3B2C]/15 text-[#15231C]">
                      Water {p.cookingGuide.waterRatio.split(' (')[0]}, {p.cookingGuide.cookingTime.toLowerCase()}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-[#0B3B2C]/15">
                  <td className="p-5" />
                  {PRODUCTS.map((p) => (
                    <td key={p.id} className="p-5 border-l border-[#0B3B2C]/15">
                      <button
                        onClick={() => onNavigate('product-detail', p.slug)}
                        className="inline-flex items-center gap-1.5 font-semibold text-[#0B3B2C] hover:text-[#8F6A0E] cursor-pointer"
                      >
                        Full {p.shortName} details
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* MILL: the sequence is real, so numbering earns its place here */}
      <section className="bg-[#0B3B2C] bg-grain text-[#F3F4EC] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-6">
              <h2 className="font-serif-brand font-extrabold text-3xl sm:text-4xl">
                From paddy to sealed container, all at one mill
              </h2>
              <p className="mt-4 text-[#F3F4EC]/75 leading-relaxed max-w-lg">
                Our Milltec line in Venkatadri Palem de-husks, polishes and sorts every lot. A container is stuffed
                and sealed at the mill dock, so you can check the spec at the source.
              </p>
            </div>
            <figure className="lg:col-span-6">
              <img
                src={millPlantImage}
                alt="Sri Lakshmi Ganapathi Milltec rice processing plant in Venkatadri Palem"
                loading="lazy"
                className="w-full h-56 sm:h-64 object-cover rounded-lg"
              />
            </figure>
          </div>

          <ol className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8 border-t border-[#F3F4EC]/20 pt-8">
            {EXPORT_JOURNEY_STEPS.map((step) => (
              <li key={step.step} className="flex gap-4">
                <span className="tnum font-serif-brand text-3xl font-extrabold text-[#E0A21A] leading-none w-8 shrink-0">
                  {step.step}
                </span>
                <div>
                  <h3 className="font-serif-brand text-lg font-bold">{step.title}</h3>
                  <p className="mt-1.5 text-sm text-[#F3F4EC]/70 leading-relaxed">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>

          <button
            onClick={() => onNavigate('quality')}
            className="mt-12 inline-flex items-center gap-2 font-semibold text-[#E0A21A] hover:text-[#F0D890] cursor-pointer"
          >
            Read our milling and sorting standards
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </section>

      {/* WHO WE SUPPLY */}
      <section className="bg-[#F3F4EC] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <h2 className="lg:col-span-4 font-serif-brand font-extrabold text-3xl sm:text-4xl text-[#0B3B2C]">
            Who buys from the mill
          </h2>
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-x-10">
            {WHO_WE_SUPPLY_TARGETS.map((t) => (
              <div key={t.title} className="border-t border-[#0B3B2C]/25 py-6">
                <h3 className="font-serif-brand text-lg font-bold text-[#0B3B2C]">{t.title}</h3>
                <p className="mt-2 text-sm text-[#15231C]/75 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BUYER VOICES */}
      <section className="bg-[#E4DEC8] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <figure className="lg:col-span-7">
            <blockquote className="font-serif-brand text-2xl sm:text-3xl font-bold leading-snug text-[#0B3B2C]">
              “{featuredQuote.comment}”
            </blockquote>
            <figcaption className="mt-6 text-sm text-[#15231C]/75">
              <span className="font-semibold text-[#15231C]">{featuredQuote.author}</span>, {featuredQuote.role},{' '}
              {featuredQuote.location}
            </figcaption>
          </figure>
          <div className="lg:col-span-5 space-y-8">
            {otherQuotes.map((r) => (
              <figure key={r.id} className="border-t border-[#0B3B2C]/25 pt-6">
                <blockquote className="text-[#15231C]/85 leading-relaxed">“{r.comment}”</blockquote>
                <figcaption className="mt-3 text-sm text-[#15231C]/70">
                  <span className="font-semibold text-[#15231C]">{r.author}</span>, {r.role}, {r.location}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* RECIPES: kept short, this is a trade site first */}
      <section className="bg-[#F3F4EC] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <h2 className="font-serif-brand font-extrabold text-3xl text-[#0B3B2C]">Cooked with LG Gold</h2>
            <p className="mt-3 text-[#15231C]/75 leading-relaxed">Recipes tested on HMT and JSR, handy for menu planning.</p>
            <button
              onClick={() => onNavigate('recipes')}
              className="mt-5 inline-flex items-center gap-2 font-semibold text-[#0B3B2C] hover:text-[#8F6A0E] cursor-pointer"
            >
              All recipes
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
          <ul className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {RECIPES.slice(0, 3).map((recipe) => (
              <li key={recipe.id}>
                <button onClick={() => onNavigate('recipe-detail', recipe.slug)} className="group text-left cursor-pointer w-full">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    loading="lazy"
                    className="w-full aspect-4/3 object-cover rounded-md"
                    referrerPolicy="no-referrer"
                  />
                  <span className="block mt-3 font-serif-brand font-bold text-[#0B3B2C] group-hover:text-[#8F6A0E] transition-colors">
                    {recipe.title}
                  </span>
                  <span className="tnum block text-sm text-[#4C6358] mt-1">
                    {recipe.totalTimeMinutes} min, serves {recipe.servings}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CLOSING CALL */}
      <section className="bg-[#072A1F] bg-grain text-[#F3F4EC] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <h2 className="font-serif-brand font-extrabold text-4xl sm:text-5xl leading-[1.05]">
              Tell us the tonnage. We will quote the rest.
            </h2>
            <p className="mt-5 text-[#F3F4EC]/75 max-w-lg leading-relaxed">
              The mill desk replies with rate, packing and dispatch dates for your quantity.
            </p>
            <p className="mt-6 flex items-start gap-2 text-sm text-[#F3F4EC]/70">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#E0A21A]" aria-hidden="true" />
              {BRAND_CONFIG.location.plusCode}, {BRAND_CONFIG.location.country}
            </p>
          </div>
          <div className="lg:col-span-5 flex flex-col gap-3">
            <a
              href={createWhatsAppUrl('Hi LG Gold, I would like wholesale and export rates for HMT and JSR rice.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#E0A21A] text-[#072A1F] py-4 rounded-md font-bold hover:bg-[#F0D890] transition-colors"
            >
              <MessageCircle className="w-5 h-5" aria-hidden="true" />
              Message the mill desk
            </a>
            <a
              href={`tel:${BRAND_CONFIG.contact.primaryPhone}`}
              className="tnum inline-flex items-center justify-center gap-2 py-4 rounded-md font-semibold border border-[#F3F4EC]/35 hover:bg-[#F3F4EC]/10 transition-colors"
            >
              <Phone className="w-5 h-5" aria-hidden="true" />
              {BRAND_CONFIG.contact.primaryPhone}
            </a>
            <button
              onClick={() => onNavigate('contact')}
              className="py-3 text-sm font-semibold text-[#F3F4EC]/80 hover:text-[#E0A21A] cursor-pointer"
            >
              Directions and visiting hours
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
