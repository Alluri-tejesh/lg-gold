import React from 'react';
import { Phone } from 'lucide-react';
import { BRAND_CONFIG } from '../../config/brandConfig';

interface AnnouncementBarProps {
  onNavigate: (route: string) => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onNavigate }) => {
  return (
    <div className="bg-[#0B3B2C] text-[#F3F4EC] text-xs py-2 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <p className="hidden sm:block text-[#F3F4EC]/80">
          Mill desk is open {BRAND_CONFIG.contact.operatingHours.replace('Mon - Sat: ', 'Mon to Sat, ')}
        </p>
        <button
          onClick={() => onNavigate('export')}
          className="sm:hidden font-semibold text-[#E0A21A] cursor-pointer"
        >
          Export orders accepted
        </button>
        <a
          href={`tel:${BRAND_CONFIG.contact.primaryPhone}`}
          className="tnum inline-flex items-center gap-2 font-semibold hover:text-[#E0A21A] transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-[#E0A21A]" aria-hidden="true" />
          <span className="hidden sm:inline">Call the mill </span>{BRAND_CONFIG.contact.primaryPhone}
        </a>
      </div>
    </div>
  );
};
