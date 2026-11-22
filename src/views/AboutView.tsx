import React from 'react';
import { MessageCircle, ArrowRight, HeartHandshake, ShieldCheck, Globe2 } from 'lucide-react';
import { BRAND_CONFIG, createWhatsAppUrl } from '../config/brandConfig';
import { millPlantImage, millPlantSrcSet, ramMohanRaoPhoto, kasiRamaRaoPhoto } from '../assets';
import { Reveal, CountUp, useInView } from '../components/common/motion';
import { PageHero } from '../components/ui/PageHero';
import { Container, Section, SectionHeader, Eyebrow } from '../components/ui/Section';
import { Button, buttonClass } from '../components/ui/Button';
import { AppLink } from '../components/ui/AppLink';
import { scrollToId } from '../router';

interface AboutViewProps {
  onNavigate: (route: string, param?: string) => void;
}

const MILESTONES = [
  { year: '1996', title: 'A small-scale rava mill', body: 'Sri Lakshmi Ganapathi Trading Company begins in Miryalaguda as a small-scale rava mill.' },
  { year: '2002', title: 'Our first rice mill', body: 'A milestone year: we start milling rice, the grain that would become our name.' },
  { year: '2004', title: 'Parboiled rice mill', body: 'A 2-ton parboiled rice mill is added, widening what we can offer our buyers.' },
  { year: '2008', title: 'Stronger machinery', body: 'Enhanced machinery is installed for cleaner, more consistent milling.' },
  { year: '2014', title: 'Production grows', body: 'Production is increased to meet growing demand from traders and families.' },
  { year: '2018', title: 'Storage and production doubled', body: 'Storage and production capacity are doubled, so more rice can rest and age before it is packed.' },
  { year: '2022', title: 'A complete revamp', body: 'The whole rice mill is renewed with high-tech machinery, the plant that mills LG Gold today.' },
];

/** `focus` (their area, e.g. "Operations & quality") and `quote` show on the page only once filled in. */
const DIRECTORS: { name: string; role: string; photo: string; bio: string; focus?: string; quote?: string }[] = [
  {
    name: 'Venna Venkata Kasi Rama Rao',
    role: 'Managing Director',
    photo: kasiRamaRaoPhoto,
    bio: 'Managing Director of Sri Lakshmi Ganapathi Trading Company, which has grown from a small rava mill in 1996 into the rice mill that now produces LG Gold.',
  },
  {
    name: 'Venna Venkata Ram Mohan Rao',
    role: 'Managing Director',
    photo: ramMohanRaoPhoto,
    bio: 'Managing Director of Sri Lakshmi Ganapathi Trading Company, which buys paddy from Telangana farmers and brings aged, Sortex-cleaned rice from Miryalaguda to homes, traders and exporters.',
  },
];

const VALUES = [
  { icon: HeartHandshake, title: 'Fair to farmers', body: 'We buy directly from Telangana paddy farmers and pay fair market prices.' },
  { icon: ShieldCheck, title: 'Checked, every lot', body: 'Optical sorting and moisture checks on every lot, so the 100th bag matches the first.' },
  { icon: Globe2, title: 'Village to world', body: 'The same grain goes to homes in Telangana and containers abroad.' },
];

/** Years alternate left and right along a line that draws itself as the visitor scrolls. */
const JourneyLine: React.FC = () => {
  const [ref, seen] = useInView<HTMLOListElement>(0.1);
  return (
    <ol ref={ref} className="relative space-y-10 lg:space-y-0">
      <span aria-hidden="true" className="absolute bottom-0 left-6 top-0 w-0.5 bg-gold-300/50 lg:left-1/2 lg:-translate-x-1/2" />
      <span
        aria-hidden="true"
        className={`absolute bottom-0 left-6 top-0 w-0.5 origin-top bg-gold-500 transition-transform duration-[2600ms] ease-out lg:left-1/2 lg:-translate-x-1/2 ${seen ? 'scale-y-100' : 'scale-y-0'}`}
      />
      {MILESTONES.map((m, i) => {
        const right = i % 2 === 1;
        return (
          <li key={m.year} className="relative grid grid-cols-[3rem_1fr] gap-5 lg:grid-cols-2 lg:gap-16 lg:py-6">
            <span className="relative z-10 grid h-12 w-12 place-items-center rounded-full bg-forest-800 ring-4 ring-cream lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
              <span className="h-3 w-3 rounded-full bg-gold-400" />
            </span>
            <Reveal delay={i * 60} className={right ? 'lg:col-start-2' : 'lg:col-start-1 lg:text-right'}>
              <div className="rounded-3xl bg-white p-6 ring-1 ring-line shadow-soft">
                <p className="font-display text-5xl leading-none text-gold-600 tabular">{m.year}</p>
                <h3 className="mt-3 font-display text-2xl text-forest-800">{m.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{m.body}</p>
              </div>
            </Reveal>
          </li>
        );
      })}
    </ol>
  );
};

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  const { location, parentCompany } = BRAND_CONFIG;

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Our journey' }]}
        onNavigate={onNavigate}
        eyebrow={`Since 1996 · ${location.city}, ${location.state}`}
        title="From a small rava mill to LG Gold rice"
        intro={`${parentCompany} began in ${location.city} with one small mill. Three decades and many upgrades later, we mill, age and pack rice for homes, traders and exporters.`}
        actions={
          <>
            <Button variant="gold" size="lg" onClick={() => scrollToId('milestones')}>
              See our milestones
            </Button>
            <Button variant="outline-light" size="lg" onClick={() => scrollToId('directors')}>
              Meet our directors
            </Button>
          </>
        }
        aside={
          <figure className="overflow-hidden rounded-3xl ring-1 ring-white/15 shadow-lift">
            <img
              src={millPlantImage}
              srcSet={millPlantSrcSet}
              sizes="(min-width: 1024px) 40vw, 100vw"
              alt={`The ${parentCompany} rice mill in ${location.city}`}
              className="aspect-[4/3] w-full object-cover"
            />
          </figure>
        }
      />

      {/* Story */}
      <Section tone="paper">
        <Container narrow>
          <Eyebrow>Our story</Eyebrow>
          <h2 className="mt-3 font-display text-4xl leading-tight text-forest-800 sm:text-5xl">Rooted in Miryalaguda</h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-soft">
            <p>
              In <strong className="text-forest-800">1996</strong> we started small: a rava mill in Miryalaguda, in the middle of Telangana&apos;s paddy
              country. We bought from the farmers around us, and that has not changed.
            </p>
            <p>
              Step by step the mill grew. We began milling rice in 2002, added a parboiled rice mill in 2004, and kept investing in better machinery,
              more production and more storage. In 2022 we renewed the whole rice mill with high-tech machinery.
            </p>
            <p>
              Today that mill produces <strong className="text-forest-800">LG Gold</strong>: HMT and JSR rice that is aged, optically sorted and packed
              at the same place the paddy arrives.
            </p>
          </div>
        </Container>
      </Section>

      {/* Milestones */}
      <Section tone="cream" grain id="milestones">
        <Container>
          <SectionHeader eyebrow="Our milestones" title="Every step since 1996" align="center" />
          <JourneyLine />
        </Container>
      </Section>

      {/* Numbers */}
      <Section tone="forest" grain tight>
        <Container>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            {[
              { to: 1996, label: 'the year we began', plain: true },
              { to: 7, label: 'milestones on our journey' },
              { to: 2, label: 'Managing Directors' },
              { to: 12, suffix: '+', label: 'months every lot is aged' },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 100}>
                <p className="font-display text-5xl text-gold-400 tabular sm:text-6xl">
                  {s.plain ? <span>{s.to}</span> : <CountUp to={s.to} suffix={s.suffix} />}
                </p>
                <p className="mt-2 text-cream/80">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Directors */}
      <Section tone="forest-deep" grain id="directors">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow dark className="justify-center">Leadership</Eyebrow>
            <h2 className="mt-3 font-display text-4xl leading-tight text-white sm:text-5xl">Our Managing Directors</h2>
            <p className="mt-4 text-lg leading-relaxed text-cream/75">
              Two Managing Directors, one mill, and the same promise to every farmer and customer.
            </p>
          </div>

          <div className="mt-14 space-y-12 lg:space-y-20">
            {DIRECTORS.map((d, i) => {
              const flip = i % 2 === 1;
              return (
                <Reveal key={d.name}>
                  <article className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
                    <div className={`lg:col-span-5 ${flip ? 'lg:order-2' : ''}`}>
                      <div className="relative mx-auto max-w-md">
                        {/* offset gold frame behind the portrait */}
                        <div aria-hidden="true" className={`absolute inset-0 rounded-[2rem] border-2 border-gold-500/60 ${flip ? '-translate-x-4 translate-y-4' : 'translate-x-4 translate-y-4'}`} />
                        <img
                          src={d.photo}
                          alt={`${d.name}, ${d.role}`}
                          loading="lazy"
                          width={800}
                          height={854}
                          className="relative aspect-[4/4.3] w-full rounded-[2rem] object-cover object-top shadow-lift ring-1 ring-white/10"
                        />
                      </div>
                    </div>

                    <div className={`lg:col-span-7 ${flip ? 'lg:order-1 lg:text-right' : ''}`}>
                      <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-gold-400">{d.role}</p>
                      <h3 className="mt-2 font-display text-4xl leading-tight text-white sm:text-5xl">{d.name}</h3>
                      <span aria-hidden="true" className={`mt-5 block h-0.5 w-16 bg-gold-500 ${flip ? 'lg:ml-auto' : ''}`} />
                      <p className="mt-5 max-w-xl text-lg leading-relaxed text-cream/80 lg:inline-block">{d.bio}</p>
                      {d.focus && <p className="mt-4 text-cream/60"><span className="font-semibold text-gold-300">Focus:</span> {d.focus}</p>}
                      {d.quote && (
                        <blockquote className={`mt-6 max-w-xl border-gold-500 font-display text-2xl italic leading-snug text-gold-200 ${flip ? 'lg:ml-auto lg:border-r-2 lg:pr-5' : 'border-l-2 pl-5'}`}>
                          “{d.quote}”
                        </blockquote>
                      )}
                      <ul className={`mt-6 flex flex-wrap gap-2 text-[13px] font-medium text-gold-300 ${flip ? 'lg:justify-end' : ''}`}>
                        {['Since 1996', `${location.city}, ${location.state}`, 'LG Gold'].map((t) => (
                          <li key={t} className="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">{t}</li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Values */}
      <Section tone="cream" grain>
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

          <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-3xl bg-paper p-8 ring-1 ring-line sm:p-10 lg:flex-row lg:items-center">
            <div>
              <p className="font-display text-2xl text-forest-800">Come and see the mill</p>
              <p className="mt-1 text-muted">
                {location.address}, {location.state} {location.pin} · {BRAND_CONFIG.contact.operatingHours}
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button
                href={createWhatsAppUrl('Hello LG Gold, I would like to know more about your rice and the mill.')}
                variant="whatsapp"
                icon={<MessageCircle className="h-5 w-5" />}
              >
                Chat on WhatsApp
              </Button>
              <AppLink to="products" className={buttonClass('outline', 'md')}>
                Shop LG Gold <ArrowRight className="h-4 w-4" />
              </AppLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
};
