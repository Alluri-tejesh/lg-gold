import React, { useState } from 'react';
import { Globe2, Boxes, Store, ChefHat, Building2, Tag, MessageCircle, CheckCircle2, FlaskConical, FileCheck2, Ship } from 'lucide-react';
import { ExportEnquiryForm } from '../types';
import { createEnquiryWhatsAppUrl, createWhatsAppUrl, openWhatsApp, fssaiLabel } from '../config/brandConfig';
import { getProductBySlug } from '../data/products';
import { EXPORT_JOURNEY_STEPS, WHO_WE_SUPPLY_TARGETS, FAQS } from '../data/trustPoints';
import { QuoteSuccessModal } from '../components/common/QuoteSuccessModal';
import { JourneyTimeline } from '../components/common/JourneyTimeline';
import { Reveal } from '../components/common/motion';
import { PageHero } from '../components/ui/PageHero';
import { Container, Section, SectionHeader, Badge } from '../components/ui/Section';
import { Button } from '../components/ui/Button';
import { SelectField, TextAreaField, TextField } from '../components/ui/Field';
import { Faq } from '../components/ui/Faq';
import { scrollToId } from '../router';
import { Spotlight } from '../components/fx/Spotlight';

interface ExportViewProps {
  onNavigate: (route: string, param?: string) => void;
}

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = { Globe2, Boxes, Store, ChefHat, Building2, Tag };

export const ExportView: React.FC<ExportViewProps> = ({ onNavigate }) => {
  const [form, setForm] = useState<ExportEnquiryForm>({
    companyName: '',
    contactPerson: '',
    country: '',
    email: '',
    phoneWhatsapp: '',
    // Defaults must match an <option> value below, or the message sends a value the buyer never saw.
    riceVariety: 'LG Gold HMT Rice',
    requiredQuantity: '1 x 20ft FCL (approx 26 MT)',
    packagingRequirement: 'Standard 26kg Heavy-Duty Export PP Bags',
    destinationPort: '',
    message: '',
  });
  const set = (k: keyof ExportEnquiryForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });
  const [whatsappUrl, setWhatsappUrl] = useState('');

  // The browser checks the required fields before this runs.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = createEnquiryWhatsAppUrl(
      'we would like an export quote for LG Gold rice.',
      [
        ['Company', form.companyName],
        ['Contact person', form.contactPerson],
        ['Country', form.country],
        ['Destination port', form.destinationPort],
        ['Email', form.email],
        ['Phone / WhatsApp', form.phoneWhatsapp],
        ['Variety', form.riceVariety],
        ['Quantity', form.requiredQuantity],
        ['Packaging', form.packagingRequirement],
        ['Notes', form.message],
      ],
      'Please share FOB/CIF rates and the specification sheet.',
    );
    openWhatsApp(url);
    setWhatsappUrl(url);
  };

  const requestSample = () =>
    openWhatsApp(
      createWhatsAppUrl(
        'Hello LG Gold export desk, we would like to request samples of your HMT and JSR rice for evaluation, with the specification sheet. Our company and shipping address:',
      ),
    );

  const products = (['hmt-rice', 'jsr-rice'] as const).map((s) => getProductBySlug(s)).filter(Boolean);

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Export' }]}
        onNavigate={onNavigate}
        eyebrow="Export orders accepted"
        title="Indian rice for importers worldwide"
        intro="Aged, Sortex-cleaned HMT and JSR rice from our own mill in Telangana, shipped in 20ft and 40ft containers to the Middle East, South-East Asia, Africa and beyond."
        actions={
          <>
            <Button variant="gold" size="lg" icon={<Ship className="h-5 w-5" />} onClick={() => scrollToId('export-form')}>
              Request a container quote
            </Button>
            <Button variant="outline-light" size="lg" icon={<FlaskConical className="h-5 w-5" />} onClick={requestSample}>
              Request samples
            </Button>
          </>
        }
        aside={
          <div className="rounded-3xl bg-white/8 p-6 ring-1 ring-white/15 backdrop-blur">
            <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-gold-400">At a glance</p>
            <ul className="mt-4 space-y-3 text-cream/90">
              {[
                '1,000 bags of 26kg (26 MT) per 20ft FCL',
                'PP, laminated or private-label bags',
                'Moisture under 13%, 100% Sortex sorted',
                'Phytosanitary and fumigation certificates',
                'FOB or CIF terms',
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" aria-hidden="true" /> {t}
                </li>
              ))}
            </ul>
          </div>
        }
      />

      {/* Products with export specs */}
      <Section tone="paper">
        <Container>
          <SectionHeader eyebrow="Export varieties" title="Specifications" intro="Typical values for every lot. A certificate of analysis is available with each shipment on request." />
          <div className="grid gap-6 lg:grid-cols-2">
            {products.map((p, i) =>
              p ? (
                <Reveal key={p.slug} delay={i * 120} className="h-full">
                  <article className="h-full rounded-3xl bg-white p-6 ring-1 ring-line shadow-soft sm:p-8">
                    <div className="flex items-center gap-4">
                      <img src={p.images.primary} alt="" className={`h-20 w-20 rounded-2xl bg-cream ${p.images.primaryFit === 'contain' ? 'object-contain p-1' : 'object-cover'}`} referrerPolicy="no-referrer" />
                      <div>
                        <h3 className="font-display text-3xl text-forest-800">{p.name}</h3>
                        <p className="text-muted">{p.grainSpecs.variety}</p>
                      </div>
                    </div>
                    <dl className="mt-6 divide-y divide-line">
                      {[
                        ['Grain length', p.grainSpecs.grainLength],
                        ['Ageing', p.grainSpecs.aging],
                        ['Moisture', p.grainSpecs.moistureContent],
                        ['Broken grains', p.grainSpecs.brokenGrainPercentage],
                        ['Colour', p.grainSpecs.color],
                        ['Packing', '26kg PP, laminated or private label'],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-4 py-3 text-[15px]">
                          <dt className="text-muted">{k}</dt>
                          <dd className="text-right font-semibold text-forest-800">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </article>
                </Reveal>
              ) : null,
            )}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge tone="gold" icon={<FileCheck2 className="h-3.5 w-3.5" />}>
              {fssaiLabel()}
            </Badge>
            <Badge tone="cream">Phytosanitary certificate</Badge>
            <Badge tone="cream">Fumigation certificate</Badge>
            <Badge tone="cream">Certificate of analysis on request</Badge>
          </div>
        </Container>
      </Section>

      {/* How it ships */}
      <Section tone="cream">
        <Container>
          <SectionHeader eyebrow="From our mill to your port" title="How an export order ships" />
          <JourneyTimeline steps={EXPORT_JOURNEY_STEPS} />
        </Container>
      </Section>

      {/* Who we supply */}
      <Section tone="forest-deep" grain>
        <Spotlight>
        <Container>
          <SectionHeader dark eyebrow="Who we supply" title="Built for trade buyers" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {WHO_WE_SUPPLY_TARGETS.map((t, i) => {
              const Icon = ICONS[t.icon] ?? Globe2;
              return (
                <Reveal key={t.title} delay={i * 70} className="h-full">
                  <div className="spot-border h-full rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-500 text-forest-900">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h3 className="mt-4 font-display text-xl text-white">{t.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-cream/75">{t.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
        </Spotlight>
      </Section>

      {/* Enquiry form */}
      <Section tone="paper" id="export-form">
        <Container narrow>
          <SectionHeader eyebrow="Container quote" title="Request an export quote" intro="Your enquiry opens in WhatsApp, already written. Press Send and our export desk replies with FOB/CIF rates." />
          <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-6 ring-1 ring-line shadow-soft sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="Company name" required placeholder="e.g. Al-Madina Food Trading LLC" value={form.companyName} onChange={set('companyName')} autoComplete="organization" />
              <TextField label="Contact person" required value={form.contactPerson} onChange={set('contactPerson')} autoComplete="name" />
              <TextField label="Destination country" required placeholder="e.g. United Arab Emirates" value={form.country} onChange={set('country')} autoComplete="country-name" />
              <TextField label="Destination port" placeholder="e.g. Jebel Ali" value={form.destinationPort} onChange={set('destinationPort')} />
              <TextField label="Business email" required type="email" placeholder="procurement@company.com" value={form.email} onChange={set('email')} autoComplete="email" />
              <TextField
                label="Phone / WhatsApp with country code"
                required
                type="tel"
                inputMode="tel"
                placeholder="+971 50 123 4567"
                value={form.phoneWhatsapp}
                onChange={set('phoneWhatsapp')}
                autoComplete="tel"
              />
              <SelectField
                label="Rice"
                value={form.riceVariety}
                onChange={set('riceVariety')}
                options={[
                  { value: 'LG Gold HMT Rice', label: 'LG Gold HMT Rice' },
                  { value: 'LG Gold JSR Rice', label: 'LG Gold JSR Rice' },
                  { value: 'LG Gold HMT & JSR Combined Load', label: 'Both (mixed container)' },
                ]}
              />
              <SelectField
                label="Quantity"
                value={form.requiredQuantity}
                onChange={set('requiredQuantity')}
                options={[
                  { value: 'Sample Pallet (Trial 1-2 Tons)', label: 'Trial pallet (1–2 tonnes)' },
                  { value: '1 x 20ft FCL (approx 26 MT)', label: '1 × 20ft container (26 tonnes)' },
                  { value: '2-5 x 20ft FCL Containers', label: '2 to 5 containers' },
                  { value: '10+ Containers (Monthly Regular Contract)', label: '10+ containers (regular contract)' },
                ]}
              />
              <SelectField
                label="Packaging"
                value={form.packagingRequirement}
                onChange={set('packagingRequirement')}
                wrapperClassName="sm:col-span-2"
                options={[
                  { value: 'Standard 26kg Heavy-Duty Export PP Bags', label: 'Standard 26kg woven PP bags' },
                  { value: '26kg Laminated Export Bags with Inner Liner', label: '26kg laminated bags with moisture liner' },
                  { value: 'Custom Private Label 26kg Bags', label: 'Private label 26kg bags (your brand)' },
                ]}
              />
              <TextAreaField
                label="Notes"
                rows={3}
                placeholder="Target price, delivery month, incoterms, inspection agency…"
                value={form.message}
                onChange={set('message')}
                wrapperClassName="sm:col-span-2"
              />
            </div>
            <div className="mt-6 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
              <Button type="submit" variant="whatsapp" size="lg" icon={<MessageCircle className="h-5 w-5" />}>
                Send Export Enquiry on WhatsApp
              </Button>
              <p className="text-sm text-muted">Opens WhatsApp with your details filled in. Press Send there.</p>
            </div>
          </form>
        </Container>
      </Section>

      <Section tone="cream" tight>
        <Container narrow>
          <SectionHeader eyebrow="Questions" title="Export FAQ" />
          <Faq
            items={[
              ...FAQS.filter((f) => /Export|Storage|Products/.test(f.category)),
              { question: 'Can I get samples first?', answer: 'Yes. Use “Request samples” at the top of this page, or WhatsApp the export desk with your shipping address.' },
              { question: 'Can you pack under our brand?', answer: 'Yes. We pack private-label 26kg bags with your artwork and language. Share your design and quantity in the enquiry.' },
            ]}
          />
        </Container>
      </Section>

      <QuoteSuccessModal isOpen={whatsappUrl !== ''} onClose={() => setWhatsappUrl('')} quoteType="Export" whatsappUrl={whatsappUrl} />
    </>
  );
};
