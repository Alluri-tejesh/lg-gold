import React from 'react';
import {
  Check,
  Wheat,
  Sparkles,
  Utensils,
  ArrowRight,
} from 'lucide-react';
import { PRODUCTS } from '../../data/products';

interface GrainComparisonProps {
  onNavigate: (route: string, param?: string) => void;
}

export const GrainComparison: React.FC<GrainComparisonProps> = ({ onNavigate }) => {
  return (
    <div className="bg-white border-t-4 border-[#C9A227] border-x border-b border-[#C9A227]/20 p-4 sm:p-8 shadow-clean rounded-sm space-y-6">
      
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto space-y-1.5 pb-2">
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#C9A227] block">
          Direct Variety Comparison
        </span>
        <h2 className="font-serif-brand font-light text-2xl sm:text-3xl text-[#174A32]">
          HMT vs JSR Rice Comparison
        </h2>
        <p className="text-xs sm:text-sm text-[#5F806D] max-w-lg mx-auto">
          Understand the grain dimensions, cooking behavior, and culinary suitability for each single-origin Telangana variety.
        </p>
      </div>

      {/* Modern Clean Comparison Table Layout */}
      <div className="w-full max-w-3xl mx-auto">
        
        {/* Table Column Headers */}
        <div className="grid grid-cols-12 items-end pb-3 sm:pb-4 border-b border-gray-200 gap-2">
          
          {/* Column 1: Attribute Label */}
          <div className="col-span-6 sm:col-span-6">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Attribute
            </span>
          </div>

          {/* Column 2: LG Gold HMT Header */}
          <div className="col-span-3 sm:col-span-3 text-center flex flex-col items-center justify-end">
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-[#174A32]/10 text-[#174A32] flex items-center justify-center mb-1 shadow-2xs">
              <Wheat className="w-4 h-4 sm:w-5 sm:h-5 text-[#174A32]" />
            </div>
            <span className="font-bold text-[11px] sm:text-sm text-[#174A32] leading-tight block">
              LG Gold HMT
            </span>
            <span className="text-[9px] sm:text-[10px] text-[#5F806D] font-medium block mt-0.5">
              Medium-Slender
            </span>
          </div>

          {/* Column 3: LG Gold JSR Header */}
          <div className="col-span-3 sm:col-span-3 text-center flex flex-col items-center justify-end">
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-[#C9A227]/20 text-[#916E14] flex items-center justify-center mb-1 shadow-2xs">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#C9A227]" />
            </div>
            <span className="font-bold text-[11px] sm:text-sm text-[#916E14] leading-tight block">
              LG Gold JSR
            </span>
            <span className="text-[9px] sm:text-[10px] text-[#916E14]/80 font-medium block mt-0.5">
              Super-Fine Grain
            </span>
          </div>
        </div>

        {/* Row 1: Average Grain Length */}
        <div className="grid grid-cols-12 items-center py-2.5 sm:py-3.5 border-b border-gray-100 gap-2">
          <div className="col-span-6 sm:col-span-6">
            <span className="font-bold text-xs sm:text-sm text-[#174A32] block">
              Grain Length
            </span>
            <span className="text-[10px] text-gray-500 hidden sm:block">Pre-cooked kernel size</span>
          </div>
          <div className="col-span-3 sm:col-span-3 text-center">
            <span className="font-bold text-xs sm:text-sm text-[#174A32]">
              5.4 mm
            </span>
          </div>
          <div className="col-span-3 sm:col-span-3 text-center">
            <span className="font-bold text-xs sm:text-sm text-[#916E14]">
              5.0 mm
            </span>
          </div>
        </div>

        {/* Row 2: 100% Sortex Optical Cleaned */}
        <div className="grid grid-cols-12 items-center py-2.5 sm:py-3.5 border-b border-gray-100 gap-2">
          <div className="col-span-6 sm:col-span-6">
            <span className="font-bold text-xs sm:text-sm text-[#174A32] block">
              100% Sortex Cleaned
            </span>
            <span className="text-[10px] text-gray-500 hidden sm:block">High-speed CCD color sorting</span>
          </div>
          <div className="col-span-3 sm:col-span-3 flex justify-center">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#174A32] text-white flex items-center justify-center shadow-2xs">
              <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
            </div>
          </div>
          <div className="col-span-3 sm:col-span-3 flex justify-center">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#C9A227] text-[#174A32] flex items-center justify-center shadow-2xs">
              <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
            </div>
          </div>
        </div>

        {/* Row 3: Zero Stones & Foreign Seeds */}
        <div className="grid grid-cols-12 items-center py-2.5 sm:py-3.5 border-b border-gray-100 gap-2">
          <div className="col-span-6 sm:col-span-6">
            <span className="font-bold text-xs sm:text-sm text-[#174A32] block">
              Zero Stones & Seeds
            </span>
            <span className="text-[10px] text-gray-500 hidden sm:block">Multi-vibratory sieves</span>
          </div>
          <div className="col-span-3 sm:col-span-3 flex justify-center">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#174A32] text-white flex items-center justify-center shadow-2xs">
              <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
            </div>
          </div>
          <div className="col-span-3 sm:col-span-3 flex justify-center">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#C9A227] text-[#174A32] flex items-center justify-center shadow-2xs">
              <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
            </div>
          </div>
        </div>

        {/* Row 4: Moisture Controlled (< 13%) */}
        <div className="grid grid-cols-12 items-center py-2.5 sm:py-3.5 border-b border-gray-100 gap-2">
          <div className="col-span-6 sm:col-span-6">
            <span className="font-bold text-xs sm:text-sm text-[#174A32] block">
              Moisture &lt; 13%
            </span>
            <span className="text-[10px] text-gray-500 hidden sm:block">Prevents spoilage & pest growth</span>
          </div>
          <div className="col-span-3 sm:col-span-3 flex justify-center">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#174A32] text-white flex items-center justify-center shadow-2xs">
              <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
            </div>
          </div>
          <div className="col-span-3 sm:col-span-3 flex justify-center">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#C9A227] text-[#174A32] flex items-center justify-center shadow-2xs">
              <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
            </div>
          </div>
        </div>

        {/* Row 5: Natural Godown Aging */}
        <div className="grid grid-cols-12 items-center py-2.5 sm:py-3.5 border-b border-gray-100 gap-2">
          <div className="col-span-6 sm:col-span-6">
            <span className="font-bold text-xs sm:text-sm text-[#174A32] block">
              Natural Aging
            </span>
            <span className="text-[10px] text-gray-500 hidden sm:block">Aerated Telangana storage</span>
          </div>
          <div className="col-span-3 sm:col-span-3 text-center">
            <span className="font-bold text-xs sm:text-sm text-[#174A32]">
              12+ Months
            </span>
          </div>
          <div className="col-span-3 sm:col-span-3 text-center">
            <span className="font-bold text-xs sm:text-sm text-[#916E14]">
              12+ Months
            </span>
          </div>
        </div>

        {/* Row 6: Cooked Grain Texture */}
        <div className="grid grid-cols-12 items-center py-2.5 sm:py-3.5 border-b border-gray-100 gap-2">
          <div className="col-span-6 sm:col-span-6">
            <span className="font-bold text-xs sm:text-sm text-[#174A32] block">
              Cooked Texture
            </span>
            <span className="text-[10px] text-gray-500 hidden sm:block">Grain separation & mouthfeel</span>
          </div>
          <div className="col-span-3 sm:col-span-3 text-center">
            <span className="font-semibold text-[11px] sm:text-xs text-[#174A32] leading-tight block">
              Firm & Separate
            </span>
          </div>
          <div className="col-span-3 sm:col-span-3 text-center">
            <span className="font-semibold text-[11px] sm:text-xs text-[#916E14] leading-tight block">
              Extra-Soft & Tender
            </span>
          </div>
        </div>

        {/* Row 7: Cooking Water Ratio */}
        <div className="grid grid-cols-12 items-center py-2.5 sm:py-3.5 border-b border-gray-100 gap-2">
          <div className="col-span-6 sm:col-span-6">
            <span className="font-bold text-xs sm:text-sm text-[#174A32] block">
              Water Ratio
            </span>
            <span className="text-[10px] text-gray-500 hidden sm:block">Optimum absorption (Rice : Water)</span>
          </div>
          <div className="col-span-3 sm:col-span-3 text-center">
            <span className="font-bold text-xs sm:text-sm text-[#174A32]">
              1 : 2.0
            </span>
          </div>
          <div className="col-span-3 sm:col-span-3 text-center">
            <span className="font-bold text-xs sm:text-sm text-[#916E14]">
              1 : 2.25
            </span>
          </div>
        </div>

        {/* Section: Ideal Culinary Suitability */}
        <div className="pt-2">
          
          {/* Main Category Header Row */}
          <div className="my-2 py-2 px-2.5 sm:px-3 bg-[#F8F5EA] border-y border-[#C9A227]/30 flex items-center justify-between rounded-xs">
            <div className="flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
              <span className="font-bold text-xs sm:text-sm text-[#174A32]">
                Culinary Suitability
              </span>
            </div>
            <span className="text-[10px] sm:text-xs text-[#5F806D] font-medium">
              Dish & Recipe Matching
            </span>
          </div>

          {/* Sub-item: Hyderabadi Dum Biryani */}
          <div className="grid grid-cols-12 items-center py-2 sm:py-2.5 border-b border-gray-100 gap-2 px-1 sm:px-2">
            <div className="col-span-6 sm:col-span-6 flex items-center gap-1.5 sm:gap-2">
              <span className="text-xs sm:text-sm shrink-0">🍚</span>
              <span className="text-[11px] sm:text-xs text-[#202522] font-medium leading-tight">Biryani & Pulao</span>
            </div>
            <div className="col-span-3 sm:col-span-3 text-center">
              <span className="text-[10px] sm:text-xs font-bold text-[#174A32]">Best Match ⭐</span>
            </div>
            <div className="col-span-3 sm:col-span-3 text-center">
              <span className="text-[10px] sm:text-xs text-gray-500">Good</span>
            </div>
          </div>

          {/* Sub-item: Traditional Andhra Thali / Sambar */}
          <div className="grid grid-cols-12 items-center py-2 sm:py-2.5 border-b border-gray-100 gap-2 px-1 sm:px-2">
            <div className="col-span-6 sm:col-span-6 flex items-center gap-1.5 sm:gap-2">
              <span className="text-xs sm:text-sm shrink-0">🍛</span>
              <span className="text-[11px] sm:text-xs text-[#202522] font-medium leading-tight">Thali & Sambar</span>
            </div>
            <div className="col-span-3 sm:col-span-3 text-center">
              <span className="text-[10px] sm:text-xs text-gray-500">Good</span>
            </div>
            <div className="col-span-3 sm:col-span-3 text-center">
              <span className="text-[10px] sm:text-xs font-bold text-[#916E14]">Best Match ⭐</span>
            </div>
          </div>

          {/* Sub-item: Rasam Rice & Curd Rice */}
          <div className="grid grid-cols-12 items-center py-2 sm:py-2.5 border-b border-gray-100 gap-2 px-1 sm:px-2">
            <div className="col-span-6 sm:col-span-6 flex items-center gap-1.5 sm:gap-2">
              <span className="text-xs sm:text-sm shrink-0">🥣</span>
              <span className="text-[11px] sm:text-xs text-[#202522] font-medium leading-tight">Rasam & Curd</span>
            </div>
            <div className="col-span-3 sm:col-span-3 text-center">
              <span className="text-[10px] sm:text-xs text-gray-500">Good</span>
            </div>
            <div className="col-span-3 sm:col-span-3 text-center">
              <span className="text-[10px] sm:text-xs font-bold text-[#916E14]">Best Match ⭐</span>
            </div>
          </div>

          {/* Sub-item: Daily Family Meals */}
          <div className="grid grid-cols-12 items-center py-2 sm:py-2.5 border-b border-gray-100 gap-2 px-1 sm:px-2">
            <div className="col-span-6 sm:col-span-6 flex items-center gap-1.5 sm:gap-2">
              <span className="text-xs sm:text-sm shrink-0">🏠</span>
              <span className="text-[11px] sm:text-xs text-[#202522] font-medium leading-tight">Daily Family Meals</span>
            </div>
            <div className="col-span-3 sm:col-span-3 text-center">
              <span className="text-[10px] sm:text-xs font-bold text-[#174A32]">Everyday Choice</span>
            </div>
            <div className="col-span-3 sm:col-span-3 text-center">
              <span className="text-[10px] sm:text-xs font-bold text-[#916E14]">Special Dining</span>
            </div>
          </div>

        </div>

        {/* Row: Standard Packaging */}
        <div className="grid grid-cols-12 items-center py-2.5 sm:py-3.5 border-b border-gray-100 gap-2">
          <div className="col-span-6 sm:col-span-6">
            <span className="font-bold text-xs sm:text-sm text-[#174A32] block">
              Standard Packaging
            </span>
            <span className="text-[10px] text-gray-500 hidden sm:block">Tamper-evident machine stitched</span>
          </div>
          <div className="col-span-3 sm:col-span-3 text-center">
            <span className="font-bold text-xs sm:text-sm text-[#174A32]">
              26kg Bag
            </span>
          </div>
          <div className="col-span-3 sm:col-span-3 text-center">
            <span className="font-bold text-xs sm:text-sm text-[#916E14]">
              26kg Bag
            </span>
          </div>
        </div>

        {/* Row: Retail Price */}
        <div className="grid grid-cols-12 items-center py-2.5 sm:py-3.5 border-b-2 border-[#C9A227]/30 gap-2 bg-[#F8F5EA]/30 px-1 sm:px-2 rounded-xs">
          <div className="col-span-6 sm:col-span-6">
            <span className="font-bold text-xs sm:text-sm text-[#174A32] block">
              Price (26kg Bag)
            </span>
            <span className="text-[10px] text-gray-500 hidden sm:block">Includes GST & mill-direct packing</span>
          </div>
          <div className="col-span-3 sm:col-span-3 text-center">
            <span className="font-serif-brand font-bold text-xs sm:text-base text-[#174A32]">
              ₹1,650
            </span>
          </div>
          <div className="col-span-3 sm:col-span-3 text-center">
            <span className="font-serif-brand font-bold text-xs sm:text-base text-[#916E14]">
              ₹1,820
            </span>
          </div>
        </div>

        {/* Direct Navigation Action Buttons: Responsive Auto-sizing & No Text Wrap */}
        <div className="grid grid-cols-2 sm:grid-cols-12 items-center pt-4 gap-2.5 sm:gap-2">
          
          {/* Desktop Left Text */}
          <div className="hidden sm:block sm:col-span-6">
            <span className="text-[11px] text-[#5F806D]">
              Click to view detailed grain specs, recipes & reviews
            </span>
          </div>

          {/* HMT Button: Full width on mobile column, perfectly scaled */}
          <div className="col-span-1 sm:col-span-3">
            <button
              onClick={() => onNavigate('product-detail', 'hmt-rice')}
              className="w-full py-2.5 sm:py-2 px-2 sm:px-3 bg-[#174A32] hover:bg-[#226444] text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider rounded-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs whitespace-nowrap"
            >
              <span>View HMT</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          </div>

          {/* JSR Button: Full width on mobile column, perfectly scaled */}
          <div className="col-span-1 sm:col-span-3">
            <button
              onClick={() => onNavigate('product-detail', 'jsr-rice')}
              className="w-full py-2.5 sm:py-2 px-2 sm:px-3 bg-[#C9A227] hover:bg-[#b08d1f] text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider rounded-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs whitespace-nowrap"
            >
              <span>View JSR</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-5 pt-3 border-t border-gray-200 text-center sm:text-left">
          <p className="text-[11px] text-gray-500 leading-relaxed">
            All LG Gold rice bags are processed at Sri Lakshmi Ganapathi Modern Milltec Facility in Venkatadri Palem, Telangana. Aged for a minimum of 12 months with 100% Sortex optical verification and tamper-evident machine stitching.
          </p>
        </div>

      </div>

    </div>
  );
};
