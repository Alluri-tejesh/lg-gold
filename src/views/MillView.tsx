import React, { useEffect } from 'react';
import { Sprout, Wind, Thermometer, ScanEye, Hourglass, PackageCheck, HeartHandshake, ShieldCheck, Globe2, FileCheck2, MessageCircle, ArrowRight } from 'lucide-react';
import { BRAND_CONFIG, createWhatsAppUrl, fssaiLabel } from '../config/brandConfig';
import { millPlantImage, millPlantSrcSet } from '../assets';
import { Reveal, CountUp, useInView } from '../components/common/motion';
import { PageHero } from '../components/ui/PageHero';
import { Container, Section, SectionHeader, Eyebrow } from '../components/ui/Section';
import { Button, buttonClass } from '../components/ui/Button';
import { AppLink } from '../components/ui/AppLink';
import { scrollToId } from '../router';

interface MillViewProps {
  onNavigate: (route: string, param?: string) => void;
  /** "process" when arriving from an old Quality link. */
  section?: string;
}

const STEPS = [
  { icon: Sprout, title: 'Paddy selection', body: 'Only mature, unbroken harvest lots from Telangana’s canal-fed paddy belt, checked for test weight and moisture before they are accepted.' },
  { icon: Wind, title: 'Cleaning & de-husking', body: 'Multi-stage aspiration and vibrating sieves remove stones, dust and husk before the grain ever reaches the milling cylinder.' },
  { icon: Thermometer, title: 'Gentle polishing', body: 'Chilled-water polishers give the grain its silky finish without heat cracks, keeping it whole.' },
  { icon: ScanEye, title: 'Sortex optical sorting', body: 'CCD cameras inspect every grain and air jets remove discoloured, chalky or broken ones in a fraction of a second.' },
  { icon: Hourglass, title: '12+ months of ageing', body: 'Rice rests in aerated godowns for a year or more until moisture is under 13%, so it cooks separate, long and non-sticky.' },
  { icon: PackageCheck, title: 'Hygienic packing', body: 'Weighed and machine-stitched into 26kg food-grade bags without hand contact, then sealed tamper-evident.' },
];

const VALUES = [
  { icon: HeartHandshake, title: 'Fair to farmers', body: 'We buy directly from Telangana paddy farmers and pay fair market prices.' },
  { icon: ShieldCheck, title: 'Checked, every lot', body: 'Optical sorting and moisture checks on every lot, so the 100th bag matches the first.' },
  { icon: Globe2, title: 'Village to world', body: 'The same grain goes to homes in Telangana and containers abroad.' },
];

/** Steps alternate left and right along a line that draws itself as the visitor scrolls. */
const ProcessTimeline: React.FC = () => {
  const [ref, seen] = useInView<HTMLOListElement>(0.1);
  return (
    <ol ref={ref} className="relative space-y-10 lg:space-y-0">
      <span aria-hidden="true" className="absolute bottom-0 left-6 top-0 w-0.5 bg-gold-300/50 lg:left-1/2 lg:-translate-x-1/2" />
      <span
        aria-hidden="true"
        className={`absolute bottom-0 left-6 top-0 w-0.5 origin-top bg-gold-500 transition-transform duration-[2200ms] ease-out lg:left-1/2 lg:-translate-x-1/2 ${seen ? 'scale-y-100' : 'scale-y-0'}`}
      />
      {STEPS.map((s, i) => {
        const right = i % 2 === 1;
        return (
          <li key={s.title} className="relative grid grid-cols-[3rem_1fr] gap-5 lg:grid-cols-2 lg:gap-16 lg:py-6">
            <span className="relative z-10 grid h-12 w-12 place-items-center rounded-full bg-forest-800 text-gold-400 ring-4 ring-cream lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
              <s.icon className="h-5 w-5" />
            </span>
            <Reveal delay={i * 60} className={right ? 'lg:col-start-2' : 'lg:col-start-1 lg:text-right'}>
              <div className="rounded-3xl bg-white p-6 ring-1 ring-line shadow-soft">
                <p className="font-display text-4xl leading-none text-gold-600">0{i + 1}</p>
                <h3 className="mt-2 font-display text-2xl text-forest-800">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{s.body}</p>
              </div>
            </Reveal>
          </li>
        );
      })}
    </ol>
  );
};

export const MillView: React.FC<MillViewProps> = ({ onNavigate, section }) => {
  useEffect(() => {
    if (!section) return;
    const t = setTimeout(() => scrollToId(section), 150);
    return () => clearTimeout(t);
  }, [section]);

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Our mill' }]}
        onNavigate={onNavigate}
        eyebrow={`${BRAND_CONFIG.location.city}, Telangana`}
        title="The mill behind every grain"
        intro={`${BRAND_CONFIG.parentCompany} mills, ages and packs LG Gold rice in the heart of Telangana's paddy country, with modern machines and old-fashioned patience.`}
        actions={
          <>
            <Button variant="gold" size="lg" onClick={() => scrollToId('process')}>
              See how we mill
            </Button>
            <AppLink to="contact" className={buttonClass('outline-light', 'lg')}>
              Visit the mill
            </AppLink>
          </>
        }
        aside={
          <figure className="overflow-hidden rounded-3xl ring-1 ring-white/15 shadow-lift">
            <img src={millPlantImage} srcSet={millPlantSrcSet} sizes="(min-width: 1024px) 40vw, 100vw" alt="Milltec milling machinery at the Sri Lakshmi Ganapathi mill" className="aspect-[4/3] w-full object-cover" />
          </figure>
        }
      />

      {/* Story */}
      <Section tone="paper">
        <Container className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <Eyebrow>Our story</Eyebrow>
            <h2 className="mt-3 font-display text-4xl leading-tight text-forest-800 sm:text-5xl">Rooted in the soil of Telangana</h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-soft">
              <p>
                Our mill sits in Venkatadri Palem, in one of India&apos;s richest paddy-growing regions. We buy straight from the farmers around
                us, so we know where every lot comes from.
              </p>
              <p>
                Under the <strong className="text-forest-800">LG Gold</strong> name we mill, age, optically sort and pack two rices:{' '}
                <AppLink to="product-detail" param="hmt-rice" className="font-semibold text-forest-800 underline underline-offset-4">
                  HMT
                </AppLink>{' '}
                for biryani and pulao, and{' '}
                <AppLink to="product-detail" param="jsr-rice" className="font-semibold text-forest-800 underline underline-offset-4">
                  JSR
                </AppLink>{' '}
                for everyday meals. No middlemen: what leaves the mill is what reaches your kitchen.
              </p>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-3 lg:col-span-5">
            {[
              { label: 'Company', value: BRAND_CONFIG.parentCompany },
              { label: 'Brand', value: 'LG Gold' },
              { label: 'Mill', value: `${BRAND_CONFIG.location.city}, ${BRAND_CONFIG.location.state}` },
              { label: 'Food safety', value: fssaiLabel() },
            ].map((f) => (
              <div key={f.label} className="rounded-2xl bg-cream p-4 ring-1 ring-line">
                <dt className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">{f.label}</dt>
                <dd className="mt-1 font-semibold leading-snug text-forest-800">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      {/* Process */}
      <Section tone="cream" grain id="process">
        <Container>
          <SectionHeader eyebrow="Quality process" title="Six steps from paddy to sealed bag" align="center" />
          <ProcessTimeline />
        </Container>
      </Section>

      {/* Standards */}
      <Section tone="forest" grain tight>
        <Container>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            {[
              { to: 12, suffix: '+', label: 'months aged before packing' },
              { to: 100, suffix: '%', label: 'of grain optically sorted' },
              { to: 13, prefix: '< ', suffix: '%', label: 'moisture in every lot' },
              { to: 2, prefix: '< ', suffix: '%', label: 'broken grains' },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 100}>
                <p className="font-display text-5xl text-gold-400 tabular sm:text-6xl">
                  {s.prefix}
                  <CountUp to={s.to} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-cream/80">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Values */}
      <Section tone="paper">
        <Container>
          <SectionHeader eyebrow="What we stand for" title="Three promises" />
          <div className="grid gap-6 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 100} className="h-full">
                <div className="h-full rounded-3xl bg-white p-7 ring-1 ring-line shadow-soft">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gold-100 text-gold-700">
                    <v.icon className="h-7 w-7" />
                  </span>
                  <h3 className="mt-5 font-display text-2xl text-forest-800">{v.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink-soft">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-3xl bg-cream p-8 ring-1 ring-line sm:p-10 lg:flex-row lg:items-center">
            <div className="flex gap-4">
              <FileCheck2 className="h-10 w-10 shrink-0 text-gold-600" aria-hidden="true" />
              <div>
                <p className="font-display text-2xl text-forest-800">Need a certificate of analysis?</p>
                <p className="mt-1 text-muted">Moisture, broken-grain and lab reports for tenders and export shipments, on request.</p>
              </div>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button
                href={createWhatsAppUrl('Hello LG Gold, we need a certificate of analysis / lab report for HMT and JSR rice.')}
                variant="whatsapp"
                icon={<MessageCircle className="h-5 w-5" />}
              >
                Ask on WhatsApp
              </Button>
              <AppLink to="export" className={buttonClass('outline', 'md')}>
                Export enquiries <ArrowRight className="h-4 w-4" />
              </AppLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
};
