import React from 'react';
import { BRAND_CONFIG, createWhatsAppUrl } from '../../config/brandConfig';

interface FooterProps {
  onNavigate: (route: string, param?: string) => void;
}

const LINK_GROUPS = [
  {
    title: 'Buy rice',
    links: [
      { label: 'HMT rice', route: 'product-detail', param: 'hmt-rice' },
      { label: 'JSR rice', route: 'product-detail', param: 'jsr-rice' },
      { label: 'Compare varieties', route: 'products' },
      { label: 'Recipes', route: 'recipes' },
    ],
  },
  {
    title: 'Trade desk',
    links: [
      { label: 'Wholesale supply', route: 'wholesale' },
      { label: 'Bulk orders', route: 'bulk' },
      { label: 'Export containers', route: 'export' },
      { label: 'Quality and mill', route: 'quality' },
      { label: 'About us', route: 'about' },
    ],
  },
];

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#072A1F] text-[#F3F4EC] bg-grain pt-16 pb-28 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12 border-b border-[#F3F4EC]/15">
          <div className="lg:col-span-5 space-y-5">
            <p className="font-serif-brand font-extrabold text-5xl sm:text-6xl text-[#E0A21A] leading-none">
              LG Gold
            </p>
            <p className="text-sm text-[#F3F4EC]/75 leading-relaxed max-w-md">
              {BRAND_CONFIG.parentCompany} mills and packs HMT and JSR rice at Venkatadri Palem,
              Telangana, for households, wholesalers, caterers and export buyers.
            </p>
          </div>

          {LINK_GROUPS.map((group) => (
            <div key={group.title} className="lg:col-span-2">
              <h4 className="font-serif-brand text-base font-bold text-[#F3F4EC] mb-4">{group.title}</h4>
              <ul className="space-y-2.5 text-sm text-[#F3F4EC]/75">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => onNavigate(link.route, link.param)}
                      className="hover:text-[#E0A21A] transition-colors cursor-pointer text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-3">
            <h4 className="font-serif-brand text-base font-bold text-[#F3F4EC] mb-4">Reach the mill</h4>
            <address className="not-italic space-y-3 text-sm text-[#F3F4EC]/75">
              <p>
                {BRAND_CONFIG.location.address},<br />
                {BRAND_CONFIG.location.state}, {BRAND_CONFIG.location.country}
              </p>
              <p>
                <a
                  href={`tel:${BRAND_CONFIG.contact.primaryPhone}`}
                  className="tnum text-[#F3F4EC] font-semibold hover:text-[#E0A21A]"
                >
                  {BRAND_CONFIG.contact.primaryPhone}
                </a>
              </p>
              <p>
                <a
                  href={createWhatsAppUrl('Hi LG Gold Team, I would like to make an enquiry.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#E0A21A]"
                >
                  Message on WhatsApp
                </a>
              </p>
              <p>
                <a href={`mailto:${BRAND_CONFIG.contact.emailWholesale}`} className="hover:text-[#E0A21A] break-all">
                  {BRAND_CONFIG.contact.emailWholesale}
                </a>
              </p>
              <p className="text-[#F3F4EC]/55">{BRAND_CONFIG.contact.operatingHours}</p>
            </address>
          </div>
        </div>

        <p className="pt-8 text-xs text-[#F3F4EC]/55">
          © {currentYear} {BRAND_CONFIG.parentCompany}. LG Gold is a brand of {BRAND_CONFIG.parentCompany}.
        </p>
      </div>
    </footer>
  );
};
