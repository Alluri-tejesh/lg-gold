import React, { useState } from 'react';
import { MapPin, Phone, Mail, MessageCircle, Clock, Navigation, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { BRAND_CONFIG, createWhatsAppUrl, createEnquiryWhatsAppUrl, openWhatsApp, phoneTelHref } from '../config/brandConfig';
import { OpenNowBadge } from '../components/common/OpenNow';
import { Reveal } from '../components/common/motion';
import { PageHero } from '../components/ui/PageHero';
import { Container, Section } from '../components/ui/Section';
import { Button } from '../components/ui/Button';
import { SelectField, TextAreaField, TextField } from '../components/ui/Field';

interface ContactViewProps {
  onNavigate: (route: string, param?: string) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onNavigate }) => {
  const { contact, location } = BRAND_CONFIG;
  const [form, setForm] = useState({ name: '', email: '', phone: '', inquiryType: 'Wholesale Orders', message: '' });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value });
  /** The WhatsApp link opened by the form, kept so the visitor can open it again. Empty until the form is sent. */
  const [whatsappUrl, setWhatsappUrl] = useState('');

  // The browser checks the required fields before this runs.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = createEnquiryWhatsAppUrl(
      'I have a question for the mill.',
      [
        ['Name', form.name],
        ['Phone / WhatsApp', form.phone],
        ['Email', form.email],
        ['Regarding', form.inquiryType],
        ['Message', form.message],
      ],
      'Thank you.',
    );
    openWhatsApp(url);
    setWhatsappUrl(url);
  };

  const ways = [
    {
      icon: Phone,
      title: 'Call the mill',
      value: contact.primaryPhone,
      href: phoneTelHref(),
      cta: 'Call now',
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      value: 'Fastest reply',
      href: createWhatsAppUrl('Hi LG Gold Team, I have a question.'),
      cta: 'Start chat',
      whatsapp: true,
    },
    {
      icon: Mail,
      title: 'Email',
      value: contact.emailRetail,
      href: `mailto:${contact.emailRetail}`,
      cta: 'Write an email',
    },
    {
      icon: Navigation,
      title: 'Visit',
      value: `${location.city}, ${location.state}`,
      href: location.googleMapsUrl,
      cta: 'Get directions',
    },
  ];

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Contact' }]}
        onNavigate={onNavigate}
        eyebrow="Talk to the mill"
        title="We're a call or a message away"
        intro="Orders, prices, wholesale, export or a visit to the mill: reach the people who mill your rice."
        actions={<OpenNowBadge dark />}
      />

      <Section tone="paper" tight>
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ways.map((w, i) => (
              <Reveal key={w.title} delay={i * 70} className="h-full">
                <a
                  href={w.href}
                  {...(/^https?:/.test(w.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group flex h-full flex-col rounded-3xl bg-white p-6 ring-1 ring-line transition-all duration-300 hover:-translate-y-1 hover:shadow-lift hover:ring-gold-500"
                >
                  <span className={`grid h-12 w-12 place-items-center rounded-2xl ${w.whatsapp ? 'bg-whatsapp text-white' : 'bg-forest-800 text-gold-400'}`}>
                    <w.icon className="h-6 w-6" />
                  </span>
                  <h2 className="mt-4 font-display text-xl text-forest-800">{w.title}</h2>
                  <p className="mt-1 break-words text-[15px] text-muted">{w.value}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-4 font-semibold text-forest-800 group-hover:text-gold-700">
                    {w.cta} <ArrowUpRight className="h-4 w-4" />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="cream">
        <Container className="grid gap-8 lg:grid-cols-12">
          {/* Message form */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl bg-white p-6 ring-1 ring-line shadow-soft sm:p-8">
              <h2 className="font-display text-3xl text-forest-800">Send a message</h2>
              <p className="mt-1 text-muted">It opens in WhatsApp, and we reply there.</p>

              {whatsappUrl ? (
                <div className="mt-6 rounded-2xl bg-cream p-8 text-center ring-1 ring-line" role="status">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-whatsapp-ink" />
                  <h3 className="mt-3 font-display text-2xl text-forest-800">Your message is ready on WhatsApp</h3>
                  <p className="mt-2 text-muted">WhatsApp has opened with your message filled in. Press Send there and we will reply on WhatsApp.</p>
                  <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
                    <Button variant="whatsapp" onClick={() => openWhatsApp(whatsappUrl)}>
                      Open WhatsApp again
                    </Button>
                    <Button variant="outline" onClick={() => setWhatsappUrl('')}>
                      Send another message
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <TextField label="Your name" required value={form.name} onChange={set('name')} autoComplete="name" />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <TextField label="Phone / WhatsApp" required type="tel" inputMode="tel" placeholder="98765 43210" value={form.phone} onChange={set('phone')} autoComplete="tel" />
                    <TextField label="Email" type="email" placeholder="name@example.com" value={form.email} onChange={set('email')} autoComplete="email" />
                  </div>
                  <SelectField
                    label="This is about"
                    value={form.inquiryType}
                    onChange={set('inquiryType')}
                    options={[
                      { value: 'Retail Packs / Home Delivery', label: 'Home delivery (26kg bags)' },
                      { value: 'Wholesale Orders', label: 'Wholesale (26kg bags in bulk)' },
                      { value: 'Export Enquiry', label: 'Export containers (FOB / CIF)' },
                      { value: 'Catering & Institutional Supply', label: 'Catering or canteen supply' },
                      { value: 'Distributorship Proposal', label: 'Becoming a distributor' },
                      { value: 'Other', label: 'Something else' },
                    ]}
                  />
                  <TextAreaField label="Message" rows={4} placeholder="How can we help?" value={form.message} onChange={set('message')} />
                  <Button type="submit" variant="whatsapp" size="lg" block icon={<MessageCircle className="h-5 w-5" />}>
                    Send Message on WhatsApp
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Map and hours */}
          <div className="space-y-4 lg:col-span-6">
            <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-line shadow-soft">
              <iframe
                title="Map showing Sri Lakshmi Ganapathi Trading Company in Venkatadri Palem"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(location.plusCode)}&z=14&output=embed`}
                className="h-80 w-full border-0 lg:h-96"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-forest-800">{BRAND_CONFIG.parentCompany}</p>
                    <p className="text-[15px] text-muted">
                      {location.address}, {location.state}, {location.country}
                    </p>
                  </div>
                </div>
                <Button href={location.googleMapsUrl} size="sm" icon={<Navigation className="h-4 w-4" />}>
                  Directions
                </Button>
              </div>
            </div>
            <div className="rounded-3xl bg-forest-800 p-6 text-cream">
              <p className="flex items-center gap-2 font-semibold text-gold-300">
                <Clock className="h-5 w-5" aria-hidden="true" /> Opening hours
              </p>
              <dl className="mt-3 space-y-2 text-[15px]">
                <div className="flex justify-between gap-4">
                  <dt className="text-cream/70">Mill & office</dt>
                  <dd>{contact.operatingHours}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-cream/70">Sunday</dt>
                  <dd>WhatsApp only</dd>
                </div>
              </dl>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
};
