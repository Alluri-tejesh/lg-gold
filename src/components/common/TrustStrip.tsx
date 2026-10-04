import React from 'react';
import { ShieldCheck, Globe, Boxes, Truck, CheckCircle } from 'lucide-react';
import { BRAND_CONFIG } from '../../config/brandConfig';

interface TrustStripProps {
  onNavigate?: (route: string) => void;
}

export const TrustStrip: React.FC<TrustStripProps> = ({ onNavigate }) => {
  const trustPoints = [
    {
      title: 'Export Quality',
      subtitle: '100% Sortex Cleaned & Silky Polished',
      icon: ShieldCheck,
      route: 'quality',
      badge: 'Grade A'
    },
    {
      title: 'Export Orders Accepted',
      subtitle: '20ft & 40ft Containerized Cargo',
      icon: Globe,
      route: 'export',
      badge: 'Global'
    },
    {
      title: 'Wholesale Supply',
      subtitle: 'Consistent Mill Pricing for Retailers',
      icon: Boxes,
      route: 'wholesale',
      badge: 'B2B Trade'
    },
    {
      title: 'Bulk Orders',
      subtitle: '50kg Commercial Bags & Tons',
      icon: Truck,
      route: 'bulk',
      badge: 'Direct Mill'
    },
  ];

  return (
    <div className="w-full bg-[#FFFFFF] border-b border-[#C9A227]/20 py-8 sm:py-10 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPoints.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                onClick={() => onNavigate && onNavigate(item.route)}
                className="p-5 bg-white border border-[#C9A227]/20 hover:border-[#C9A227] shadow-clean transition-all duration-200 flex flex-col justify-between group cursor-pointer rounded-sm"
              >
                <div className="flex items-start justify-between mb-4 border-b border-[#F8F5EA] pb-3">
                  <div className="w-9 h-9 bg-[#174A32] text-[#C9A227] flex items-center justify-center rounded-xs">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 bg-[#F8F5EA] text-[#174A32] border border-[#C9A227]/30">
                    {item.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif-brand font-bold text-base text-[#174A32] group-hover:text-[#C9A227] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#5F806D] mt-1 leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
