import React, { useEffect, useState } from 'react';
import { Store, Building2, ChefHat, ShoppingCart, Truck, MessageCircle, Calculator, CheckCircle2, Boxes, ShieldCheck, CalendarClock } from 'lucide-react';
import { WholesaleEnquiryForm } from '../types';
import { createEnquiryWhatsAppUrl, openWhatsApp } from '../config/brandConfig';
import { getProductBySlug } from '../data/products';
import { priceInfo, formatPriceDate } from '../data/prices';
import { FAQS } from '../data/trustPoints';
import { QuoteSuccessModal } from '../components/common/QuoteSuccessModal';
import { Reveal } from '../components/common/motion';
import { OpenNowBadge } from '../components/common/OpenNow';
import { PageHero } from '../components/ui/PageHero';
import { Container, Section, SectionHeader } from '../components/ui/Section';
import { Button } from '../components/ui/Button';
import { ChoiceChips, SelectField, TextAreaField, TextField } from '../components/ui/Field';
import { Faq } from '../components/ui/Faq';
import { AppLink } from '../components/ui/AppLink';
import { scrollToId } from '../router';
import { RollingNumber } from '../components/fx/RollingNumber';
import { Spotlight } from '../components/fx/Spotlight';

interface WholesaleViewProps {
  onNavigate: (route: string, param?: string) => void;
  /** Section to scroll to on arrival, e.g. "truckloads" for old #bulk links. */
  section?: string;
}

const BAG_KG = 26;
const TRUCK_KG = 26000; // a full 10-wheel lorry, 1,000 bags
const PRESETS = [5, 10, 40, 200, 1000];

/** The best listed per-kg rate today: the 10-bag lot, read from the live price file. */
const lotRate = (slug: 'hmt-rice' | 'jsr-rice') => {
  const packs = getProductBySlug(slug)?.packOptions ?? [];
  const lot = packs.filter((p) => p.weightKg > 0).sort((a, b) => b.weightKg - a.weightKg)[0];
  return lot ? lot.retailPrice / lot.weightKg : 0;
};

// Truckload supply: this used to be its own Bulk page.
const TRUCKLOAD = [
  { icon: Truck, title: 'Full truckloads', body: 'Lorries of 10 to 26 tonnes, with weighbridge slips and tarpaulin strapping.' },
  { icon: Boxes, title: '26kg mill bags', body: 'Easy to lift, stack in a godown and count. Machine-stitched and tamper-evident.' },
  { icon: ShieldCheck, title: 'Same grain every load', body: 'Every truck is Sortex checked, with the same grain length, polish and moisture under 13%.' },
  { icon: CalendarClock, title: 'Scheduled supply', body: 'Weekly or monthly loads for distributors, chains and institutions.' },
];

const BUYERS = [
  { icon: Store, title: 'Kirana & retail stores', body: 'Steady 26kg stock at mill-direct rates.' },
  { icon: ShoppingCart, title: 'Supermarkets & chains', body: 'Scheduled supply across your outlets.' },
  { icon: ChefHat, title: 'Hotels, caterers & cloud kitchens', body: 'Biryani-grade HMT that holds up in bulk cooking.' },
  { icon: Building2, title: 'Hostels & canteens', body: 'Soft, economical JSR for daily meals at scale.' },
];

export const WholesaleView: React.FC<WholesaleViewProps> = ({ onNavigate, section }) => {
  useEffect(() => {
    if (!section) return;
    const t = setTimeout(() => scrollToId(section), 150);
    return () => clearTimeout(t);
  }, [section]);

  const [form, setForm] = useState<WholesaleEnquiryForm>({
    businessName: '',
    contactPerson: '',
    businessType: 'Supermarket',
    cityState: '',
    phoneWhatsapp: '',
    email: '',
    riceVariety: 'LG Gold HMT Rice',
    // Must match an <option> value below.
    monthlyRequirement: '1 to 5 Tons (Regular Supermarket / Catering)',
    message: '',
  });
  const set = (k: keyof WholesaleEnquiryForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const [variety, setVariety] = useState<'hmt-rice' | 'jsr-rice'>('hmt-rice');
  const [bags, setBags] = useState(40);
  const [whatsappUrl, setWhatsappUrl] = useState('');

  const rate = lotRate(variety);
  const kg = bags * BAG_KG;
  const estimate = Math.round(kg * rate);
  const date = formatPriceDate(priceInfo.updated);

  // The browser checks the required fields before this runs.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = createEnquiryWhatsAppUrl(
      'I would like a wholesale quote for LG Gold rice.',
      [
        ['Business', form.businessName],
        ['Contact person', form.contactPerson],
        ['Business type', form.businessType],
        ['City & state', form.cityState],
        ['Phone / WhatsApp', form.phoneWhatsapp],
        ['Email', form.email],
        ['Variety', form.riceVariety],
        ['Monthly requirement', form.monthlyRequirement],
        ['Notes', form.message],
      ],
      'Please share your current trade price list.',
    );
    openWhatsApp(url);
    setWhatsappUrl(url);
  };

  // Sends what the visitor worked out in the estimator, so the desk can confirm the live rate for that order.
  const handleCalculatorQuote = () => {
    openWhatsApp(
      createEnquiryWhatsAppUrl(
        'please confirm today’s trade rate for this order.',
        [
          ['Variety', variety === 'hmt-rice' ? 'LG Gold HMT Rice' : 'LG Gold JSR Rice'],
          ['Quantity', `${bags} bags of 26kg (${kg.toLocaleString('en-IN')} kg)`],
          ['Website estimate', `₹${estimate.toLocaleString('en-IN')} (₹${rate.toFixed(1)}/kg listed lot rate)`],
        ],
        "Please confirm today's trade price and delivery charges.",
      ),
    );
  };

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Wholesale' }]}
        onNavigate={onNavigate}
        eyebrow="Wholesale & trade"
        title="Mill-direct rice for your business"
        intro="Aged HMT and JSR rice in 26kg bags for shops, supermarkets, hotels and caterers, up to full truckloads for distributors and institutions. No middlemen between our mill and your godown."
        actions={
          <>
            {/* Buttons, not #anchors: the # part of the address is used for page routing */}
            <Button variant="gold" size="lg" icon={<Calculator className="h-5 w-5" />} onClick={() => scrollToId('estimator')}>
              Estimate my order
            </Button>
            <Button variant="outline-light" size="lg" onClick={() => scrollToId('wholesale-form')}>
              Request a quote
            </Button>
          </>
        }
        aside={
          <div className="rounded-3xl bg-white/8 p-6 ring-1 ring-white/15 backdrop-blur">
            <OpenNowBadge dark />
            <ul className="mt-5 space-y-3 text-cream/90">
              {['From about 500kg (20 bags)', 'Truckloads of 10 to 26 tonnes', 'Same grain, batch after batch', 'Rates confirmed on WhatsApp'].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-gold-400" aria-hidden="true" /> {t}
                </li>
              ))}
            </ul>
          </div>
        }
      />

      {/* Who we supply */}
      <Section tone="paper" tight>
        <Container>
          <h2 className="sr-only">Who we supply</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BUYERS.map((b, i) => (
              <Reveal key={b.title} delay={i * 80} className="h-full">
                <div className="h-full rounded-3xl bg-white p-6 ring-1 ring-line">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-100 text-gold-700">
                    <b.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-display text-xl text-forest-800">{b.title}</h3>
                  <p className="mt-1.5 text-[15px] text-muted">{b.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Estimator */}
      <Section tone="cream" id="estimator">
        <Container>
          <SectionHeader
            eyebrow="Order estimator"
            title="What will my order cost?"
            intro={`A quick estimate at today's listed lot rate${date ? ` (${date})` : ''}. The desk confirms the final rate on WhatsApp.`}
          />
          <div className="grid gap-6 rounded-3xl bg-white p-6 ring-1 ring-line shadow-soft sm:p-8 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-7">
              <div>
                <p className="mb-2 text-sm font-semibold text-forest-800">Rice</p>
                <ChoiceChips
                  label="Rice"
                  value={variety}
                  onChange={setVariety}
                  options={[
                    { value: 'hmt-rice', label: 'HMT', hint: 'Biryani, hotels' },
                    { value: 'jsr-rice', label: 'JSR', hint: 'Daily meals, canteens' },
                  ]}
                />
              </div>
              <div>
                <div className="mb-2 flex items-baseline justify-between gap-3">
                  <label htmlFor="bags" className="text-sm font-semibold text-forest-800">
                    Number of 26kg bags
                  </label>
                  <span className="font-display text-2xl text-forest-800 tabular" aria-live="polite">
                    {bags} bags · {(kg / 1000).toFixed(2)} tonnes
                  </span>
                </div>
                <input
                  id="bags"
                  type="range"
                  min={5}
                  max={1000}
                  step={5}
                  value={bags}
                  onChange={(e) => setBags(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer accent-forest-800"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {PRESETS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setBags(p)}
                      aria-pressed={bags === p}
                      className={`min-h-10 rounded-full px-4 text-sm font-semibold transition-colors cursor-pointer ${
                        bags === p ? 'bg-forest-800 text-white' : 'bg-cream text-forest-800 ring-1 ring-inset ring-line hover:ring-forest-700'
                      }`}
                    >
                      {p === 1000 ? 'Full truck' : `${p} bags`}
                    </button>
                  ))}
                </div>
              </div>

              {/* How much of a lorry this order fills: helps buyers see when a full truck makes sense */}
              <div className="rounded-2xl bg-cream p-4 ring-1 ring-line">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="inline-flex items-center gap-2 font-semibold text-forest-800">
                    <Truck className="h-5 w-5 text-gold-600" aria-hidden="true" />
                    {kg >= TRUCK_KG ? `${Math.floor(kg / TRUCK_KG)} full truck${kg >= TRUCK_KG * 2 ? 's' : ''}${kg % TRUCK_KG ? ' + part load' : ''}` : 'Fills a 26-tonne truck'}
                  </span>
                  <span className="text-muted tabular">{Math.round(((kg % TRUCK_KG || TRUCK_KG) / TRUCK_KG) * 100)}%</span>
                </div>
                <div className="mt-3 flex gap-1" aria-hidden="true">
                  {Array.from({ length: 20 }, (_, i) => {
                    const filled = (kg % TRUCK_KG || (kg ? TRUCK_KG : 0)) / TRUCK_KG > i / 20;
                    return <span key={i} className={`h-3 flex-1 rounded-sm transition-colors duration-300 ${filled ? 'bg-forest-700' : 'bg-cream-deep'}`} />;
                  })}
                </div>
                <p className="mt-2 text-sm text-muted">
                  {kg < TRUCK_KG
                    ? `Room for ${Math.floor((TRUCK_KG - kg) / BAG_KG)} more bags in the same truck.`
                    : 'Ask the desk about a scheduled truckload supply.'}
                </p>
              </div>
            </div>
            <div className="rounded-2xl bg-forest-800 p-6 text-cream bg-grain-light lg:col-span-5">
              <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-gold-400">Estimated value</p>
              <p className="mt-2 font-display text-5xl text-white" aria-live="polite">
                <RollingNumber value={estimate} />
              </p>
              <dl className="mt-4 space-y-1.5 text-[15px]">
                <div className="flex justify-between">
                  <dt className="text-cream/70">Quantity</dt>
                  <dd className="tabular">{kg.toLocaleString('en-IN')} kg</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-cream/70">Listed lot rate</dt>
                  <dd className="tabular">₹{rate.toFixed(1)}/kg</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-cream/70">From</dt>
                  <dd>Venkatadri Palem mill</dd>
                </div>
              </dl>
              <Button variant="whatsapp" size="lg" block className="mt-6" icon={<MessageCircle className="h-5 w-5" />} onClick={handleCalculatorQuote}>
                Confirm today&apos;s trade rate
              </Button>
              <p className="mt-3 text-center text-sm text-cream/60">Taxes and freight depend on your delivery location.</p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Truckloads (formerly the Bulk page; old #bulk links land here) */}
      <Section tone="forest-deep" grain id="truckloads">
        <Spotlight>
        <Container>
          <SectionHeader
            dark
            eyebrow="Tonnes & truckloads"
            title="Bulk rice, straight off the mill floor"
            intro="For distributors, institutions and large kitchens: HMT and JSR by the tonne, packed in 26kg bags and loaded at Venkatadri Palem."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TRUCKLOAD.map((p, i) => (
              <Reveal key={p.title} delay={i * 80} className="h-full">
                <div className="spot-border h-full rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-500 text-forest-900">
                    <p.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-display text-xl text-white">{p.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-cream/75">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-8">
            <Button variant="gold" size="lg" icon={<Truck className="h-5 w-5" />} onClick={() => scrollToId('wholesale-form')}>
              Ask for a truckload rate
            </Button>
          </div>
        </Container>
        </Spotlight>
      </Section>

      {/* Form */}
      <Section tone="paper" id="wholesale-form">
        <Container narrow>
          <SectionHeader eyebrow="Request a quote" title="Tell us what you need" intro="Your enquiry opens in WhatsApp, already written. Press Send and the trade desk replies with current rates." />
          <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-6 ring-1 ring-line shadow-soft sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="Business / firm name" required placeholder="e.g. Sri Sai Kirana" value={form.businessName} onChange={set('businessName')} autoComplete="organization" />
              <TextField label="Contact person" required value={form.contactPerson} onChange={set('contactPerson')} autoComplete="name" />
              <SelectField
                label="Business type"
                value={form.businessType}
                onChange={set('businessType')}
                options={[
                  { value: 'Supermarket', label: 'Supermarket / grocery chain' },
                  { value: 'Retailer', label: 'Kirana / retail store' },
                  { value: 'Distributor', label: 'Stockist / distributor' },
                  { value: 'Hotel / Restaurant', label: 'Hotel / restaurant / cloud kitchen' },
                  { value: 'Catering', label: 'Wedding & event catering' },
                  { value: 'Institutional Buyer', label: 'Hostel / corporate canteen' },
                  { value: 'Other', label: 'Other' },
                ]}
              />
              <TextField label="City & state" required placeholder="e.g. Warangal, Telangana" value={form.cityState} onChange={set('cityState')} autoComplete="address-level2" />
              <TextField label="Phone / WhatsApp" required type="tel" inputMode="tel" placeholder="98765 43210" value={form.phoneWhatsapp} onChange={set('phoneWhatsapp')} autoComplete="tel" />
              <TextField label="Email" type="email" placeholder="purchase@business.com" value={form.email} onChange={set('email')} autoComplete="email" />
              <SelectField
                label="Rice"
                value={form.riceVariety}
                onChange={set('riceVariety')}
                options={[
                  { value: 'LG Gold HMT Rice', label: 'LG Gold HMT Rice' },
                  { value: 'LG Gold JSR Rice', label: 'LG Gold JSR Rice' },
                  { value: 'Both HMT & JSR Varieties', label: 'Both HMT and JSR' },
                ]}
              />
              <SelectField
                label="Monthly requirement"
                value={form.monthlyRequirement}
                onChange={set('monthlyRequirement')}
                options={[
                  { value: '500kg to 1 Ton (Trial Order)', label: '500kg to 1 tonne (trial order)' },
                  { value: '1 to 5 Tons (Regular Supermarket / Catering)', label: '1 to 5 tonnes a month' },
                  { value: '5 to 20 Tons (Distributor / Chain)', label: '5 to 20 tonnes a month' },
                  { value: '20+ Tons (Truckloads)', label: '20+ tonnes (truckloads)' },
                  { value: '50+ Tons (Regular truckload supply)', label: '50+ tonnes (regular truckloads)' },
                ]}
              />
              <TextAreaField
                label="Anything else?"
                rows={3}
                placeholder="Samples, delivery schedule, packaging…"
                value={form.message}
                onChange={set('message')}
                wrapperClassName="sm:col-span-2"
              />
            </div>
            <div className="mt-6 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
              <Button type="submit" variant="whatsapp" size="lg" icon={<MessageCircle className="h-5 w-5" />}>
                Send Wholesale Enquiry on WhatsApp
              </Button>
              <p className="text-sm text-muted">Opens WhatsApp with your details filled in. Press Send there.</p>
            </div>
          </form>
        </Container>
      </Section>

      <Section tone="cream" tight>
        <Container narrow>
          <SectionHeader eyebrow="Questions" title="Good to know" />
          <Faq
            items={[
              ...FAQS.filter((f) => /Wholesale|Storage|Products/.test(f.category)),
              {
                question: 'Do you deliver?',
                answer: 'Yes. Trade orders and truckloads are dispatched from the mill; the desk confirms freight for your location before loading.',
              },
              {
                question: 'Exporting abroad?',
                answer: (
                  <>
                    Container orders have their own{' '}
                    <AppLink to="export" className="font-semibold text-forest-800 underline underline-offset-4">
                      export page
                    </AppLink>{' '}
                    with FOB and CIF quotes.
                  </>
                ),
              },
            ]}
          />
        </Container>
      </Section>

      <QuoteSuccessModal isOpen={whatsappUrl !== ''} onClose={() => setWhatsappUrl('')} quoteType="Wholesale" whatsappUrl={whatsappUrl} />
    </>
  );
};
