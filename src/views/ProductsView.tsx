import React, { useState } from 'react';
import { ShieldCheck, Globe, Boxes, Check, Star, ArrowRight, Sparkles } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/common/ProductCard';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { GrainComparison } from '../components/common/GrainComparison';

interface ProductsViewProps {
  onNavigate: (route: string, param?: string) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({ onNavigate }) => {
  const [selectedVarietyFilter, setSelectedVarietyFilter] = useState<'all' | 'hmt' | 'jsr'>('all');

  const filteredProducts = PRODUCTS.filter(p => {
    if (selectedVarietyFilter === 'hmt') return p.slug === 'hmt-rice';
    if (selectedVarietyFilter === 'jsr') return p.slug === 'jsr-rice';
    return true;
  });

  return (
    <div className="bg-[#F3F4EC] min-h-screen pb-24">
      
      {/* Header Banner */}
      <div className="bg-[#0B3B2C] text-white py-10 sm:py-14 border-b-4 border-[#E0A21A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-4">
          <Breadcrumbs items={[{ label: 'Rice Products' }]} onNavigate={onNavigate} variant="dark" />
          
          <div className="max-w-3xl space-y-2">
            <span className="text-[11px] font-bold text-[#E0A21A] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              100% Sortex Optical Checked
            </span>
            <h1 className="font-serif-brand font-bold text-3xl sm:text-5xl text-white">
              LG Gold Premium Rice Collection
            </h1>
            <p className="text-sm sm:text-base text-[#F3F4EC]/85 leading-relaxed">
              Explore our flagship HMT and JSR rice varieties. Available in standard 26kg family & commercial bags, wholesale lots, and containerized export shipments.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-12">
        
        {/* Filters and Variety Picker */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white border border-[#E0A21A]/20 shadow-clean rounded-sm">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#0B3B2C]">Filter Variety:</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setSelectedVarietyFilter('all')}
                className={`px-3 py-1.5 text-xs font-bold transition-all cursor-pointer rounded-xs ${
                  selectedVarietyFilter === 'all'
                    ? 'bg-[#0B3B2C] text-white'
                    : 'bg-[#F3F4EC] text-[#15231C] hover:bg-[#F0D890]/40'
                }`}
              >
                All ({PRODUCTS.length})
              </button>
              <button
                onClick={() => setSelectedVarietyFilter('hmt')}
                className={`px-3 py-1.5 text-xs font-bold transition-all cursor-pointer rounded-xs ${
                  selectedVarietyFilter === 'hmt'
                    ? 'bg-[#0B3B2C] text-white'
                    : 'bg-[#F3F4EC] text-[#15231C] hover:bg-[#F0D890]/40'
                }`}
              >
                HMT Rice
              </button>
              <button
                onClick={() => setSelectedVarietyFilter('jsr')}
                className={`px-3 py-1.5 text-xs font-bold transition-all cursor-pointer rounded-xs ${
                  selectedVarietyFilter === 'jsr'
                    ? 'bg-[#0B3B2C] text-white'
                    : 'bg-[#F3F4EC] text-[#15231C] hover:bg-[#F0D890]/40'
                }`}
              >
                JSR Rice
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#4C6358] font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#E0A21A]" />
            <span>Direct Mill Dispatch • Telangana</span>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={(slug) => onNavigate('product-detail', slug)}
              onSelectExportQuote={() => onNavigate('export')}
            />
          ))}
        </div>

        {/* Grain Comparison Section */}
        <GrainComparison onNavigate={onNavigate} />

        {/* Commercial Inquiries CTA banner */}
        <div className="bg-[#0B3B2C] text-white p-8 sm:p-10 border-t-4 border-[#E0A21A] flex flex-col md:flex-row items-center justify-between gap-6 shadow-clean rounded-sm">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[11px] font-bold text-[#E0A21A]">
              B2B Commercial Procurement
            </span>
            <h3 className="font-serif-brand font-bold text-2xl sm:text-3xl text-white">
              Looking for Wholesale Packs or Container Export?
            </h3>
            <p className="text-xs sm:text-sm text-[#F3F4EC]/80 max-w-xl">
              We provide customized bag printing, competitive mill-gate rates, and international FOB/CIF container shipping.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => onNavigate('wholesale')}
              className="px-6 py-3 bg-white text-[#0B3B2C] text-xs font-bold hover:bg-[#F3F4EC] transition-colors rounded-xs cursor-pointer"
            >
              Wholesale Inquiry
            </button>
            <button
              onClick={() => onNavigate('export')}
              className="px-6 py-3 bg-[#E0A21A] text-[#0B3B2C] text-xs font-bold hover:bg-[#F0D890] transition-colors rounded-xs cursor-pointer"
            >
              Request Export Quote
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
