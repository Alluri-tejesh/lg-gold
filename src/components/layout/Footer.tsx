import React from 'react';
import { MapPin, Phone, Mail, MessageCircle, Clock, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { BRAND_CONFIG, createWhatsAppUrl, fssaiLabel, phoneTelHref } from '../../config/brandConfig';
import { Logo } from '../ui/Logo';
import { AppLink } from '../ui/AppLink';
import { buttonClass } from '../ui/Button';

const COLUMNS: { title: string; links: { label: string; to: string; param?: string }[] }[] = [
  {
    title: 'Shop',
    links: [
      { label: 'HMT Rice', to: 'product-detail', param: 'hmt-rice' },
      { label: 'JSR Rice', to: 'product-detail', param: 'jsr-rice' },
      { label: 'All products & prices', to: 'products' },
      { label: 'Recipes', to: 'recipes' },
    ],
  },
  {
    title: 'For business',
    links: [
      { label: 'Wholesale supply', to: 'wholesale' },
      { label: 'Truckloads', to: 'bulk' },
      { label: 'Export enquiries', to: 'export' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Our mill', to: 'about' },
      { label: 'Quality process', to: 'quality' },
      { label: 'Contact & directions', to: 'contact' },
    ],
  },
];

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  const { contact, location } = BRAND_CONFIG;

  return (
    <footer className="relative overflow-hidden bg-forest-950 text-cream bg-grain-light pb-24 lg:pb-0">
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-0 h-80 w-80 rounded-full bg-gold-500/10 blur-3xl" />

      {/* Closing call to action */}
      <div className="relative mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 rounded-3xl bg-forest-800 p-8 ring-1 ring-white/10 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <p className="font-display text-3xl text-white sm:text-4xl">Questions? Talk to the mill.</p>
            <p className="mt-3 text-cream/75">
              Prices, stock, delivery or a container quote: we answer on WhatsApp and phone, {contact.operatingHours.replace(/ IST$/, '')}.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={createWhatsAppUrl('Hi LG Gold Team, I would like to make an inquiry.')}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass('whatsapp', 'lg')}
            >
              <MessageCircle className="h-5 w-5" /> WhatsApp us
            </a>
            <a href={phoneTelHref()} className={buttonClass('outline-light', 'lg')}>
              <Phone className="h-5 w-5" /> {contact.primaryPhone}
            </a>
          </div>
        </div>
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-3">
          <Logo dark />
          <p className="mt-5 max-w-sm leading-relaxed text-cream/70">
            Single-origin HMT and JSR rice, aged 12 months or more and Sortex cleaned at our own mill in Venkatadri Palem, Telangana.
          </p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/8 px-4 py-2 text-sm font-semibold text-gold-300 ring-1 ring-white/10">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            {fssaiLabel()}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-6 lg:pl-6">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-gold-400 font-sans">{col.title}</h2>
              <ul className="mt-4 space-y-1">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <AppLink
                      to={l.to}
                      param={l.param}
                      className="group inline-flex min-h-10 items-center gap-1 text-[15px] text-cream/80 hover:text-white"
                    >
                      {l.label}
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                    </AppLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <address className="not-italic lg:col-span-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-gold-400 font-sans">Visit the mill</h2>
          <ul className="mt-4 space-y-3 text-[15px] text-cream/80">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" aria-hidden="true" />
              <a href={location.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                {location.address}, {location.state}, {location.country}
              </a>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" aria-hidden="true" />
              <a href={phoneTelHref()} className="hover:text-white">
                {contact.primaryPhone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" aria-hidden="true" />
              <a href={`mailto:${contact.emailWholesale}`} className="break-all hover:text-white">
                {contact.emailWholesale}
              </a>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" aria-hidden="true" />
              {contact.operatingHours}
            </li>
          </ul>
        </address>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-cream/55 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {year} {BRAND_CONFIG.parentCompany}. All rights reserved.
          </p>
          <p>LG GOLD™ is a brand of {BRAND_CONFIG.parentCompany}.</p>
        </div>
      </div>
    </footer>
  );
};
