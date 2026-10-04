import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { BRAND_CONFIG } from '../../config/brandConfig';

interface AnnouncementBarProps {
  onNavigate: (route: string) => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onNavigate }) => {
  return (
    <div className="bg-[#174A32] text-[#F8F5EA] text-[11px] sm:text-xs font-semibold py-2 px-4 sm:px-10 border-b border-[#C9A227]/20 uppercase tracking-widest select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left / Center Message */}
        <div className="flex-1 flex items-center justify-center sm:justify-start gap-4 sm:gap-8 overflow-hidden text-center sm:text-left">
          <span className="text-[#C9A227] font-bold tracking-widest shrink-0">
            Export Quality Rice
          </span>
          <span className="hidden sm:inline text-white/30">•</span>
          <span className="hidden sm:inline text-white font-medium tracking-wider">
            Export Orders Accepted
          </span>
          <span className="hidden md:inline text-white/30">•</span>
          <span className="hidden md:inline text-[#E7D59A] font-semibold tracking-wider">
            Wholesale & Bulk Orders
          </span>
        </div>

        {/* Right CTA */}
        <div className="hidden sm:flex items-center gap-6 shrink-0 text-[11px]">
          <button
            onClick={() => onNavigate('export')}
            className="inline-flex items-center gap-1 text-[#C9A227] hover:text-white font-bold tracking-widest transition-colors cursor-pointer"
          >
            <span>Inquire for Export</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <span className="text-white/20">|</span>
          <button
            onClick={() => onNavigate('wholesale')}
            className="text-[#F8F5EA] hover:text-[#C9A227] font-semibold tracking-widest transition-colors cursor-pointer"
          >
            <span>Wholesale Supply</span>
          </button>
        </div>
      </div>
    </div>
  );
};
