import React from 'react';
import { MapPin, Phone, Mail, MessageCircle, Globe, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { BRAND_CONFIG, createWhatsAppUrl } from '../../config/brandConfig';

interface FooterProps {
  onNavigate: (route: string, param?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#174A32] text-[#F8F5EA] pt-16 pb-24 lg:pb-12 border-t-4 border-[#C9A227]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Top Trust & Commercial Assurance Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 mb-12 border-b border-[#C9A227]/20">
          <div className="flex items-center gap-3.5 p-4 bg-white/5 border border-white/10 rounded-sm">
            <div className="w-9 h-9 bg-[#C9A227] text-[#174A32] flex items-center justify-center font-bold rounded-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-white">Export Quality Certified</h4>
              <p className="text-[11px] text-[#E7D59A]/80">100% Sortex Optical Cleaned</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 bg-white/5 border border-white/10 rounded-sm">
            <div className="w-9 h-9 bg-[#C9A227] text-[#174A32] flex items-center justify-center font-bold rounded-xs">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-white">Export Orders Accepted</h4>
              <p className="text-[11px] text-[#E7D59A]/80">Global Container Logistics</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 bg-white/5 border border-white/10 rounded-sm">
            <div className="w-9 h-9 bg-[#C9A227] text-[#174A32] flex items-center justify-center font-serif-brand font-bold text-base rounded-xs">
              12+
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-white">Naturally Aged Rice</h4>
              <p className="text-[11px] text-[#E7D59A]/80">Fluffy & Non-Sticky Texture</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 bg-white/5 border border-white/10 rounded-sm">
            <div className="w-9 h-9 bg-[#C9A227] text-[#174A32] flex items-center justify-center font-bold rounded-xs">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-white">Instant WhatsApp Orders</h4>
              <p className="text-[11px] text-[#E7D59A]/80">Direct Mill Response</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12">
          
          {/* Col 1: Brand & Corporate */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col">
              <span className="font-serif-brand font-bold text-3xl text-white tracking-tight">
                LG GOLD
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#C9A227] font-semibold mt-0.5">
                {BRAND_CONFIG.parentCompany}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#F8F5EA]/80 leading-relaxed max-w-md">
              A premium Indian rice brand producing single-origin aged HMT and JSR rice from Telangana. Supplying households, restaurants, supermarkets, and international container exports.
            </p>

            <div className="pt-2">
              <span className="inline-block bg-white/10 text-[#E7D59A] border border-[#C9A227]/40 text-[11px] px-3 py-1 font-semibold uppercase tracking-wider rounded-xs">
                Direct Mill Dispatch • Venkatadri Palem
              </span>
            </div>
          </div>

          {/* Col 2: Products */}
          <div className="space-y-3">
            <h4 className="font-serif-brand font-bold text-base text-[#C9A227] tracking-wider uppercase text-xs">
              Products
            </h4>
            <div className="h-px w-8 bg-[#C9A227] opacity-60" />
            <ul className="space-y-2 text-xs text-[#F8F5EA]/80">
              <li>
                <button
                  onClick={() => onNavigate('product-detail', 'hmt-rice')}
                  className="hover:text-[#C9A227] transition-colors flex items-center gap-1 group cursor-pointer"
                >
                  <span>HMT Rice</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('product-detail', 'jsr-rice')}
                  className="hover:text-[#C9A227] transition-colors flex items-center gap-1 group cursor-pointer"
                >
                  <span>JSR Rice</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className="hover:text-[#C9A227] transition-colors cursor-pointer"
                >
                  All Pack Sizes (5kg–50kg)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className="hover:text-[#C9A227] transition-colors cursor-pointer"
                >
                  Product Comparison
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Business & Export */}
          <div className="space-y-3">
            <h4 className="font-serif-brand font-bold text-base text-[#C9A227] tracking-wider uppercase text-xs">
              Business & Export
            </h4>
            <div className="h-px w-8 bg-[#C9A227] opacity-60" />
            <ul className="space-y-2 text-xs text-[#F8F5EA]/80">
              <li>
                <button
                  onClick={() => onNavigate('export')}
                  className="hover:text-[#C9A227] transition-colors flex items-center gap-1.5 cursor-pointer font-bold text-[#E7D59A]"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Rice Export Desk</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('wholesale')}
                  className="hover:text-[#C9A227] transition-colors cursor-pointer"
                >
                  Wholesale Supply
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('bulk')}
                  className="hover:text-[#C9A227] transition-colors cursor-pointer"
                >
                  Bulk Rice Orders
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('quality')}
                  className="hover:text-[#C9A227] transition-colors cursor-pointer"
                >
                  Quality Process
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('recipes')}
                  className="hover:text-[#C9A227] transition-colors cursor-pointer"
                >
                  Authentic Recipes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#C9A227] transition-colors cursor-pointer"
                >
                  About Sri Lakshmi Ganapathi
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Location & Contact */}
          <div className="space-y-3">
            <h4 className="font-serif-brand font-bold text-base text-[#C9A227] tracking-wider uppercase text-xs">
              Headquarters
            </h4>
            <div className="h-px w-8 bg-[#C9A227] opacity-60" />
            <div className="space-y-2.5 text-xs text-[#F8F5EA]/85">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                <span>
                  {BRAND_CONFIG.location.address},<br />
                  {BRAND_CONFIG.location.state}, {BRAND_CONFIG.location.country}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C9A227] shrink-0" />
                <a href={`tel:${BRAND_CONFIG.contact.primaryPhone}`} className="hover:text-[#C9A227]">
                  {BRAND_CONFIG.contact.primaryPhone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#C9A227] shrink-0" />
                <a
                  href={createWhatsAppUrl('Hi LG Gold Team, I would like to make an inquiry.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C9A227]"
                >
                  WhatsApp: {BRAND_CONFIG.contact.primaryPhone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C9A227] shrink-0" />
                <a href={`mailto:${BRAND_CONFIG.contact.emailWholesale}`} className="hover:text-[#C9A227]">
                  {BRAND_CONFIG.contact.emailWholesale}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="pt-8 border-t border-[#C9A227]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F8F5EA]/60">
          <p>
            © {currentYear} {BRAND_CONFIG.parentCompany}. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[#C9A227]">LG GOLD™ is a registered brand of {BRAND_CONFIG.parentCompany}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
