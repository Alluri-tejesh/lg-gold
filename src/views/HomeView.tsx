import React, { useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Globe,
  Truck,
  Boxes,
  ChefHat,
  Sparkles,
  CheckCircle2,
  MapPin,
  MessageCircle,
  Phone,
  ArrowUpRight,
  Wheat,
  Factory,
  PackageCheck,
  Eye,
  Box,
  Utensils,
  Container,
  Star,
  ShoppingBag,
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { RECIPES, RECIPE_CATEGORIES } from '../data/recipes';
import {
  WHY_LG_GOLD_PILLARS,
  GRAIN_TO_KITCHEN_STEPS,
  EXPORT_JOURNEY_STEPS,
  WHO_WE_SUPPLY_TARGETS,
  REVIEWS,
} from '../data/trustPoints';
import { BRAND_CONFIG, createWhatsAppUrl } from '../config/brandConfig';
import { ProductCard } from '../components/common/ProductCard';
import { RecipeCard } from '../components/common/RecipeCard';
import { TrustStrip } from '../components/common/TrustStrip';
import { millPlantImage } from '../assets';

interface HomeViewProps {
  onNavigate: (route: string, param?: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const [journeyTab, setJourneyTab] = useState<'domestic' | 'export'>('domestic');
  const [activeRecipeCategory, setActiveRecipeCategory] = useState('All');

  const filteredFeaturedRecipes = RECIPES.filter(r => {
    if (activeRecipeCategory === 'All') return true;
    return r.categories.includes(activeRecipeCategory);
  }).slice(0, 4);

  return (
    <div className="space-y-0">
      
      {/* 3. HERO SECTION (Clear 3-Pathway Architecture) */}
      <section className="relative bg-[#F8F5EA] overflow-hidden pt-8 pb-14 lg:pt-14 lg:pb-20 border-b border-[#C9A227]/20">
        
        {/* Subtle Background Radial Dots Pattern */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-minimal-dots" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 space-y-10">
          
          {/* Top Intro Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Main Copy (7 Cols) */}
            <div className="lg:col-span-7 space-y-5 text-left">
              
              {/* Clean Accent Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#174A32]/10 border border-[#174A32]/20 rounded-xs">
                <Wheat className="w-3.5 h-3.5 text-[#174A32]" />
                <span className="text-[#174A32] font-bold uppercase tracking-widest text-[11px]">
                  Sri Lakshmi Ganapathi Trading Company • Telangana Mill
                </span>
              </div>

              {/* Main H1 */}
              <div className="space-y-3">
                <h1 className="font-serif-brand font-light text-3xl sm:text-5xl lg:text-6xl text-[#174A32] tracking-tight leading-[1.1]">
                  Pure Telangana Rice.<br />
                  <span className="font-medium text-[#174A32]">Direct from Our Mill.</span>
                </h1>
                <p className="text-sm sm:text-base text-[#5F806D] max-w-2xl leading-relaxed font-normal">
                  LG Gold processes single-origin <strong className="text-[#174A32] font-semibold">HMT</strong> and <strong className="text-[#174A32] font-semibold">JSR (Sona Masoori)</strong> rice in Venkatadri Palem, Telangana. 100% optical Sortex cleaned, 12+ months aged, and packed with zero middleman adulteration.
                </p>
              </div>

              {/* Quick Trust Highlights */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#174A32] pt-1">
                <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 border border-[#C9A227]/30 rounded-xs shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A227]" />
                  <span>100% Optical Sortex Clean</span>
                </span>
                <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 border border-[#C9A227]/30 rounded-xs shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A227]" />
                  <span>12+ Months Naturally Aged</span>
                </span>
                <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 border border-[#C9A227]/30 rounded-xs shadow-2xs">
                  <Globe className="w-4 h-4 text-[#C9A227]" />
                  <span>Export & Domestic Supply</span>
                </span>
              </div>

            </div>

            {/* Right Quick Showcase Card (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-sm border-t-4 border-[#C9A227] border-x border-b border-[#C9A227]/20 p-5 sm:p-6 shadow-clean space-y-4">
                <div className="flex items-center justify-between border-b border-[#C9A227]/20 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A227] block">Featured Varieties</span>
                    <h3 className="font-serif-brand font-bold text-lg text-[#174A32]">LG Gold Premium Collection</h3>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#174A32] text-white px-2 py-0.5 rounded-xs">
                    In Stock
                  </span>
                </div>

                {/* 2 Quick Mini Products */}
                <div className="space-y-3">
                  {PRODUCTS.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => onNavigate('product-detail', prod.slug)}
                      className="p-3.5 bg-[#F8F5EA]/60 hover:bg-[#F8F5EA] border border-[#C9A227]/25 hover:border-[#C9A227] transition-all rounded-xs cursor-pointer group shadow-2xs"
                    >
                      <div className="flex items-start sm:items-center gap-3">
                        <img
                          src={prod.images.primary}
                          alt={prod.name}
                          className="w-16 h-16 object-cover rounded-xs border border-[#C9A227]/30 shrink-0 bg-white"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-serif-brand font-bold text-sm sm:text-base text-[#174A32] group-hover:text-[#C9A227] transition-colors truncate">
                              {prod.name}
                            </h4>
                            <span className="font-serif-brand font-bold text-sm text-[#174A32] shrink-0">
                              ₹{prod.packOptions[0]?.retailPrice}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                            <span className="text-[9px] font-bold uppercase tracking-wider bg-[#174A32]/10 text-[#174A32] px-1.5 py-0.5 rounded-2xs">
                              {prod.shortName === 'HMT Rice' ? 'HMT • Medium Slender' : 'JSR • Super-Fine Grain'}
                            </span>
                            <span className="text-[10px] text-[#5F806D]">
                              • {prod.grainSpecs.aging}
                            </span>
                          </div>

                          <div className="mt-1.5 flex items-center justify-between text-[11px]">
                            <span className="text-[#5F806D] text-[10px] sm:text-[11px]">Standard 26kg Bag</span>
                            <span className="text-[#C9A227] font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform text-[11px]">
                              <span>View Details</span>
                              <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-[#5F806D] border-t border-[#C9A227]/20">
                  <span>Fast Delivery Across Telangana & India</span>
                  <button
                    onClick={() => onNavigate('products')}
                    className="text-[#174A32] font-bold hover:text-[#C9A227] transition-colors cursor-pointer"
                  >
                    View All 26kg Packs &rarr;
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* 3 Clear Segment Pathways: "What are you looking for?" */}
          <div className="space-y-3 pt-4">
            <div className="text-center sm:text-left">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A227]">Select Your Requirement</span>
              <h2 className="font-serif-brand font-light text-xl sm:text-2xl text-[#174A32]">How Can We Serve You Today?</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Pathway 1: Home Consumer */}
              <div 
                onClick={() => onNavigate('products')}
                className="p-6 bg-white border-t-4 border-[#174A32] border-x border-b border-[#C9A227]/20 rounded-sm shadow-clean hover:shadow-md hover:border-[#C9A227] transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-[#174A32]/10 text-[#174A32] rounded-xs flex items-center justify-center font-bold">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A227] block">Home & Kitchen</span>
                    <h3 className="font-serif-brand font-bold text-lg text-[#174A32] group-hover:text-[#C9A227] transition-colors">
                      Standard 26kg Mill Bags
                    </h3>
                  </div>
                  <p className="text-xs text-[#5F806D] leading-relaxed">
                    Aged, aroma-rich rice for everyday meals, biryanis, and festive dining. Direct doorstep delivery in genuine 26kg sealed bags.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-[#C9A227]/20 flex items-center justify-between text-xs font-bold text-[#174A32]">
                  <span>Order 26kg Bag</span>
                  <ArrowRight className="w-4 h-4 text-[#C9A227] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Pathway 2: Wholesale B2B */}
              <div 
                onClick={() => onNavigate('wholesale')}
                className="p-6 bg-white border-t-4 border-[#C9A227] border-x border-b border-[#C9A227]/20 rounded-sm shadow-clean hover:shadow-md hover:border-[#C9A227] transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-[#C9A227]/15 text-[#174A32] rounded-xs flex items-center justify-center font-bold">
                    <Boxes className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A227] block">Commercial B2B</span>
                    <h3 className="font-serif-brand font-bold text-lg text-[#174A32] group-hover:text-[#C9A227] transition-colors">
                      Wholesale (5-10+ Bags of 26kg)
                    </h3>
                  </div>
                  <p className="text-xs text-[#5F806D] leading-relaxed">
                    Mill-direct multi-bag bundles and tonnage for supermarkets, caterers, restaurants, and regional mandis.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-[#C9A227]/20 flex items-center justify-between text-xs font-bold text-[#174A32]">
                  <span>Wholesale Price Calculator</span>
                  <ArrowRight className="w-4 h-4 text-[#C9A227] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Pathway 3: Global Export */}
              <div 
                onClick={() => onNavigate('export')}
                className="p-6 bg-[#174A32] text-white border-t-4 border-[#C9A227] border-x border-b border-[#C9A227]/20 rounded-sm shadow-clean hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-white/10 text-[#C9A227] rounded-xs flex items-center justify-center font-bold">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A227] block">International Trade</span>
                    <h3 className="font-serif-brand font-bold text-lg text-white group-hover:text-[#C9A227] transition-colors">
                      Global Export (20ft / 40ft FCL)
                    </h3>
                  </div>
                  <p className="text-xs text-[#F8F5EA]/85 leading-relaxed">
                    Export Grade A optical Sortex rice, custom brand printing, phytosanitary certificates, and port logistics.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-bold text-[#C9A227]">
                  <span>Export Desk & CIF/FOB</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 4. TRUST / COMMERCIAL CAPABILITY STRIP */}
      <TrustStrip onNavigate={onNavigate} />

      {/* 5. EXPLORE LG GOLD RICE (Product Discovery Cards) */}
      <section className="py-16 sm:py-24 bg-[#FFFFFF] border-b border-[#C9A227]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
            <div className="inline-block">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227] block">
                Single-Origin Rice Varieties
              </span>
              <div className="h-px w-12 bg-[#C9A227] mx-auto mt-2" />
            </div>
            <h2 className="font-serif-brand font-light text-3xl sm:text-4xl lg:text-5xl text-[#174A32] tracking-tight pt-1">
              Explore LG Gold Rice
            </h2>
            <p className="text-sm sm:text-base text-[#5F806D] leading-relaxed max-w-2xl mx-auto">
              Milled from the finest paddy harvests of Telangana, our aged HMT and JSR rice varieties are engineered for unmatched grain separation, natural aroma, and rich culinary texture.
            </p>
          </div>

          {/* 2 Featured Product Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto">
            {PRODUCTS.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={(slug) => onNavigate('product-detail', slug)}
                onSelectExportQuote={() => onNavigate('export')}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => onNavigate('products')}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#174A32] hover:text-[#C9A227] transition-colors group cursor-pointer border-b border-[#174A32] pb-1"
            >
              <span>Compare grain specifications, cooking ratios & wholesale packs</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </section>

      {/* 6. WHY LG GOLD (5 Trust Cards) */}
      <section className="py-16 sm:py-24 bg-[#F8F5EA] border-b border-[#C9A227]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227] block">
              Commitment to Excellence
            </span>
            <div className="h-px w-12 bg-[#C9A227] mx-auto my-2" />
            <h2 className="font-serif-brand font-light text-3xl sm:text-4xl text-[#174A32]">
              Why LG Gold?
            </h2>
            <p className="text-sm text-[#5F806D]">
              Five core principles that guide every grain processed at Sri Lakshmi Ganapathi Trading Company.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {WHY_LG_GOLD_PILLARS.map((pillar, idx) => (
              <div
                key={pillar.id}
                className="p-6 bg-white border border-[#C9A227]/20 shadow-clean hover:border-[#C9A227] transition-all flex flex-col justify-between rounded-sm"
              >
                <div>
                  <div className="text-2xl font-serif-brand font-bold text-[#174A32] mb-3 border-b border-[#F8F5EA] pb-2">
                    0{idx + 1}
                  </div>
                  <h3 className="font-serif-brand font-bold text-base sm:text-lg text-[#174A32] mb-1">
                    {pillar.title}
                  </h3>
                  <span className="text-[10px] font-bold text-[#C9A227] uppercase tracking-wider block mb-2">
                    {pillar.subtitle}
                  </span>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. FARM / GRAIN TO CUSTOMER STORY (Horizontal Visual Journey) */}
      <section className="py-16 sm:py-24 bg-[#FFFFFF] border-b border-[#C9A227]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12 border-b border-[#C9A227]/20 pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">
                Authentic Processing Journey
              </span>
              <h2 className="font-serif-brand font-light text-3xl sm:text-4xl text-[#174A32] mt-1">
                From Grain to Your Kitchen
              </h2>
            </div>

            {/* Toggle between Domestic and Export variations */}
            <div className="flex items-center p-1 bg-[#F8F5EA] border border-[#C9A227]/30 rounded-sm">
              <button
                onClick={() => setJourneyTab('domestic')}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer rounded-xs ${
                  journeyTab === 'domestic'
                    ? 'bg-[#174A32] text-white shadow-xs'
                    : 'text-[#174A32]/70 hover:text-[#174A32]'
                }`}
              >
                Domestic Flow
              </button>
              <button
                onClick={() => setJourneyTab('export')}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 rounded-xs ${
                  journeyTab === 'export'
                    ? 'bg-[#174A32] text-white shadow-xs'
                    : 'text-[#174A32]/70 hover:text-[#174A32]'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>Export Flow</span>
              </button>
            </div>
          </div>

          {/* Steps Timeline Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 relative">
            {(journeyTab === 'domestic' ? GRAIN_TO_KITCHEN_STEPS : EXPORT_JOURNEY_STEPS).map((step) => (
              <div
                key={step.step}
                className="p-5 bg-[#F8F5EA]/60 border border-[#C9A227]/20 hover:bg-white hover:border-[#C9A227] transition-all flex flex-col justify-between relative group rounded-sm shadow-clean"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 border-b border-[#E7D59A]/40 pb-2">
                    <span className="w-6 h-6 bg-[#174A32] text-[#C9A227] text-xs font-bold flex items-center justify-center rounded-xs font-serif-brand">
                      {step.step}
                    </span>
                    <span className="text-[10px] font-bold text-[#5F806D] uppercase tracking-widest">Step {step.step}</span>
                  </div>

                  <h3 className="font-serif-brand font-bold text-sm sm:text-base text-[#174A32] mb-1.5">
                    {step.title}
                  </h3>

                  <p className="text-xs text-[#202522]/80 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E7D59A]/40 text-[10px] uppercase font-bold tracking-wider text-[#C9A227]">
                  Standard Verified ✓
                </div>
              </div>
            ))}
          </div>

          {/* Modern Processing Line Spotlight Card */}
          <div className="mt-14 p-6 sm:p-8 bg-[#F8F5EA] border-t-4 border-[#C9A227] border-x border-b border-[#C9A227]/20 rounded-sm shadow-clean grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A227] flex items-center gap-1.5">
                <Factory className="w-4 h-4" />
                Modern Milltec Milling Infrastructure
              </span>
              <h3 className="font-serif-brand font-light text-2xl sm:text-3xl text-[#174A32]">
                Sri Lakshmi Ganapathi High-Speed Processing Facility
              </h3>
              <p className="text-xs sm:text-sm text-[#202522] leading-relaxed">
                Operating in Venkatadri Palem, Telangana, our computerized Milltec milling units combine multi-stage de-husking, chilled-water polishing cylinders, and 100% Sortex CCD cameras to eliminate broken grains and foreign matter.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                <div className="p-3 bg-white border border-[#C9A227]/20 rounded-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A227] block">Standard Format:</span>
                  <strong className="text-[#174A32]">Standard 26kg Woven Bags</strong>
                </div>
                <div className="p-3 bg-white border border-[#C9A227]/20 rounded-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A227] block">Purity Standard:</span>
                  <strong className="text-[#174A32]">100% Sortex Cleaned</strong>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-xs overflow-hidden shadow-clean border border-[#C9A227]/20 relative group">
                <img
                  src={millPlantImage}
                  alt="Sri Lakshmi Ganapathi Milltec industrial rice processing plant in Venkatadri Palem"
                  className="w-full h-auto max-h-[320px] object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white">
                  <span className="text-[11px] font-bold block text-[#E7D59A]">Milltec Rice Milling Line (Units 12, 14, 15)</span>
                  <span className="text-[10px] text-white/80">Sri Lakshmi Ganapathi Facility • Venkatadri Palem, Telangana</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => onNavigate('quality')}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#174A32] hover:text-[#C9A227] transition-colors border-b border-[#174A32] pb-0.5"
            >
              <span>Explore our full milling & optical sorting standards</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* 9. EXPORT QUALITY RICE (Deep Green Background, Gold Accents) */}
      <section className="py-20 bg-[#174A32] text-[#F8F5EA] relative overflow-hidden border-b border-[#C9A227]/20">
        
        {/* Background minimal texture */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-minimal-dots" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-block border-l-4 border-[#C9A227] pl-3">
                <span className="text-[#C9A227] text-xs font-bold uppercase tracking-widest">
                  Global Commodity Supply • Telangana, India
                </span>
              </div>

              <div className="space-y-4">
                <h2 className="font-serif-brand font-light text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
                  Export Quality Rice from India.
                </h2>
                <div className="inline-block bg-[#C9A227] text-[#174A32] font-black text-xs px-3.5 py-1 uppercase tracking-widest rounded-xs">
                  Export Orders Accepted
                </div>
                <p className="text-base text-[#F8F5EA]/90 leading-relaxed pt-2 max-w-xl">
                  LG Gold supplies quality rice for international buyers, importers, distributors, wholesalers and institutional customers.
                </p>
              </div>

              {/* Target B2B Audience Chips */}
              <div className="pt-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#E7D59A] block mb-3">
                  Target Global Markets & Buyers:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Importers',
                    'International Distributors',
                    'Wholesalers',
                    'Retail Chains',
                    'Hotels & Caterers',
                    'Institutional Buyers',
                    'Commodity Traders',
                    'Private Label Brands',
                  ].map((target, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white/10 text-xs font-medium text-white border border-white/15 rounded-xs"
                    >
                      {target}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                <button
                  onClick={() => onNavigate('export')}
                  className="px-8 py-3.5 bg-[#C9A227] text-[#174A32] font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-[#E7D59A] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Request Export Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('products')}
                  className="px-8 py-3.5 bg-transparent text-white font-bold uppercase tracking-widest text-xs border border-white/40 hover:bg-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer rounded-sm"
                >
                  <span>View Export Specs</span>
                </button>
              </div>

            </div>

            {/* Right Specification Box */}
            <div className="lg:col-span-5">
              <div className="bg-white/5 backdrop-blur-xs rounded-sm p-6 sm:p-8 border border-white/15 shadow-xl space-y-5">
                <div className="border-b border-white/15 pb-3">
                  <h3 className="font-serif-brand font-bold text-xl text-[#C9A227] flex items-center gap-2">
                    <Container className="w-5 h-5" />
                    <span>Export Standard Capabilities</span>
                  </h3>
                  <p className="text-[10px] text-white/60 uppercase tracking-widest mt-1">Direct Mill Port Logistics</p>
                </div>

                <div className="space-y-3.5 text-xs sm:text-sm">
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-white/75">Rice Varieties</span>
                    <span className="font-bold text-white">LG Gold HMT & JSR</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-white/75">Container Loads</span>
                    <span className="font-bold text-white">20ft FCL (25-26 MT) & 40ft FCL</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-white/75">Moisture Content</span>
                    <span className="font-bold text-[#E7D59A]">Strictly &lt; 13.0%</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-white/75">Optical Sorting</span>
                    <span className="font-bold text-white">100% Sortex Color Cleaned</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-white/75">Packaging Types</span>
                    <span className="font-bold text-white">BOPP, Non-Woven, PP, Jute</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-white/75">Private Labeling</span>
                    <span className="font-bold text-[#E7D59A]">Custom Print Available</span>
                  </div>
                </div>

                <div className="p-3 bg-white/5 border border-white/10 text-xs text-white/90 rounded-xs">
                  ⚡ <strong>Fast Port Dispatch:</strong> Connected to major container terminals via direct highway transit.
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 10. WHOLESALE / BULK ORDERS SECTION */}
      <section className="py-16 sm:py-24 bg-[#FFFFFF] border-b border-[#C9A227]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-block border-l-4 border-[#C9A227] pl-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">
                  Commercial Supply Chain
                </span>
              </div>
              <h2 className="font-serif-brand font-light text-3xl sm:text-4xl text-[#174A32]">
                Wholesale & Bulk Rice Supplier
              </h2>
              <p className="text-sm sm:text-base text-[#5F806D] leading-relaxed">
                Whether you manage a supermarket chain, a catering enterprise, a restaurant network, or an institutional cafeteria, LG Gold provides steady supply, transparent mill pricing, and direct logistics.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-[#F8F5EA] border border-[#C9A227]/20 rounded-sm">
                  <Boxes className="w-5 h-5 text-[#174A32] mb-1.5" />
                  <h4 className="font-bold text-sm text-[#174A32]">Wholesale Packs</h4>
                  <p className="text-[11px] text-gray-600 mt-0.5">25kg & 50kg Bags from 500kg MOQ</p>
                </div>

                <div className="p-4 bg-[#F8F5EA] border border-[#C9A227]/20 rounded-sm">
                  <Truck className="w-5 h-5 text-[#174A32] mb-1.5" />
                  <h4 className="font-bold text-sm text-[#174A32]">Bulk Tonnage</h4>
                  <p className="text-[11px] text-gray-600 mt-0.5">Full truck loads & scheduled supply</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => onNavigate('wholesale')}
                  className="px-6 py-3 bg-[#174A32] text-white text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-[#226444] transition-colors"
                >
                  Request Wholesale Quote
                </button>
                <button
                  onClick={() => onNavigate('bulk')}
                  className="px-6 py-3 bg-transparent text-[#174A32] border-2 border-[#174A32] text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-[#F8F5EA] transition-colors"
                >
                  Bulk Rice Orders (Tons)
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="p-6 sm:p-8 bg-[#F8F5EA] border border-[#C9A227]/30 shadow-clean space-y-4 rounded-sm">
                <div className="flex items-center justify-between border-b border-[#C9A227]/20 pb-3">
                  <h3 className="font-serif-brand font-bold text-lg text-[#174A32]">
                    Quick Trade Inquiry Desk
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A227] bg-white px-2 py-0.5 border border-[#C9A227]/30">
                    Mill Direct
                  </span>
                </div>

                <p className="text-xs text-gray-600">
                  Need current mandi rates for HMT or JSR rice? Connect directly with our commercial dispatch manager:
                </p>

                <div className="space-y-3 text-xs">
                  <div className="p-4 bg-white border border-[#C9A227]/20 flex items-center justify-between rounded-sm">
                    <div>
                      <span className="font-bold text-[#174A32] block">Sri Lakshmi Ganapathi Trading Desk</span>
                      <span className="text-gray-500 text-[11px]">Venkatadri Palem, Telangana</span>
                    </div>
                    <a
                      href={`tel:${BRAND_CONFIG.contact.primaryPhone}`}
                      className="px-3.5 py-1.5 bg-[#174A32] text-white rounded-sm font-bold uppercase tracking-wider text-[11px] hover:bg-[#226444]"
                    >
                      Call Now
                    </a>
                  </div>

                  <a
                    href={createWhatsAppUrl('Hi LG Gold, I would like to request wholesale rates for HMT and JSR Rice.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 bg-[#25D366] text-white rounded-sm font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:bg-[#1ebd5a] transition-colors shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Inquire on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 11. RECIPES SECTION ("Cook Something Delicious") */}
      <section className="py-16 sm:py-24 bg-[#F8F5EA] border-b border-[#C9A227]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227] block">
              Culinary Inspiration
            </span>
            <div className="h-px w-12 bg-[#C9A227] mx-auto my-2" />
            <h2 className="font-serif-brand font-light text-3xl sm:text-4xl text-[#174A32]">
              Cook Something Delicious
            </h2>
            <p className="text-sm text-[#5F806D]">
              Discover simple and delicious recipes made with LG Gold rice.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {['All', 'Biryani', 'South Indian', 'Everyday Meals', 'Quick & Easy', 'Vegetarian'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveRecipeCategory(cat)}
                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer rounded-sm ${
                  activeRecipeCategory === cat
                    ? 'bg-[#174A32] text-white shadow-xs'
                    : 'bg-white text-gray-700 border border-[#C9A227]/20 hover:border-[#C9A227]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Recipe Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredFeaturedRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onViewRecipe={(slug) => onNavigate('recipe-detail', slug)}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => onNavigate('recipes')}
              className="px-8 py-3 bg-[#174A32] text-white text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-[#226444] transition-colors shadow-xs cursor-pointer"
            >
              Explore All Recipes & Cooking Guides
            </button>
          </div>

        </div>
      </section>

      {/* 12. ABOUT LG GOLD */}
      <section className="py-16 sm:py-24 bg-[#FFFFFF] border-b border-[#C9A227]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5">
              <div className="overflow-hidden shadow-xl border-t-8 border-[#C9A227] border-x border-b border-[#C9A227]/20 bg-white relative rounded-sm">
                <img
                  src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80"
                  alt="Agricultural Heritage of Telangana"
                  className="w-full h-80 sm:h-96 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent flex items-end p-6 text-white">
                  <div>
                    <span className="font-serif-brand font-bold text-xl text-[#C9A227]">Sri Lakshmi Ganapathi</span>
                    <p className="text-xs text-[#E7D59A] uppercase tracking-wider mt-0.5 font-medium">Trading Company • Venkatadri Palem, Telangana</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5">
              <div className="inline-block border-l-4 border-[#C9A227] pl-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">
                  Agricultural Roots & Heritage
                </span>
              </div>
              <h2 className="font-serif-brand font-light text-3xl sm:text-4xl text-[#174A32]">
                The Heritage Behind LG Gold
              </h2>
              <p className="text-sm sm:text-base text-[#202522]/85 leading-relaxed font-normal">
                Sri Lakshmi Ganapathi Trading Company was founded on a simple, uncompromising principle: delivering pure, authentic, unadulterated Indian rice straight from the farmer's harvest to dining tables across the globe.
              </p>
              <p className="text-xs sm:text-sm text-[#5F806D] leading-relaxed">
                Situated at Venkatadri Palem in Telangana's prime paddy growing belt, our milling infrastructure combines traditional grain aging knowledge with modern Sortex optical cleaning technology. We serve daily households, regional supermarket chains, top catering masters, and international container buyers with equal dedication.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('about')}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#174A32] hover:text-[#C9A227] transition-colors border-b border-[#174A32] pb-0.5 cursor-pointer"
                >
                  <span>Learn more about our mill, ethics & vision</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 13. LOCATION / CONTACT */}
      <section className="py-16 bg-[#F8F5EA] border-b border-[#C9A227]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="p-8 sm:p-12 bg-[#174A32] text-white relative overflow-hidden shadow-xl rounded-sm border-t-4 border-[#C9A227]">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2 text-[#C9A227] text-xs font-bold uppercase tracking-widest">
                  <MapPin className="w-4 h-4" />
                  <span>Mill & Trade Headquarters</span>
                </div>
                <h3 className="font-serif-brand font-light text-2xl sm:text-3xl text-white">
                  Visit or Connect with Sri Lakshmi Ganapathi Trading Company
                </h3>
                <p className="text-xs sm:text-sm text-[#F8F5EA]/80 leading-relaxed max-w-xl">
                  <strong>Location Plus Code:</strong> VG3P+G6, Venkatadri Palem, Telangana, India. Direct road and freight connectivity for prompt dispatch.
                </p>
                <div className="flex flex-wrap gap-6 pt-2 text-xs font-semibold">
                  <div className="flex items-center gap-1.5 text-[#E7D59A]">
                    <Phone className="w-4 h-4 text-[#C9A227]" />
                    <span>{BRAND_CONFIG.contact.primaryPhone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#E7D59A]">
                    <MessageCircle className="w-4 h-4 text-[#C9A227]" />
                    <span>WhatsApp Available</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
                <button
                  onClick={() => onNavigate('contact')}
                  className="w-full py-3.5 px-6 bg-[#C9A227] text-[#174A32] font-bold uppercase tracking-widest text-xs hover:bg-[#E7D59A] transition-colors text-center shadow-xs cursor-pointer rounded-sm"
                >
                  View Interactive Map & Directions
                </button>
                <a
                  href={BRAND_CONFIG.location.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 bg-transparent text-white font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-colors text-center border border-white/30 rounded-sm"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 14. FINAL CTA */}
      <section className="py-20 sm:py-28 bg-[#FFFFFF] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-6">
          <div className="inline-block">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227] block">
              Experience Pure Telangana Rice
            </span>
            <div className="h-px w-12 bg-[#C9A227] mx-auto mt-2" />
          </div>
          <h2 className="font-serif-brand font-light text-3xl sm:text-5xl text-[#174A32] tracking-tight">
            Looking for Quality Rice?
          </h2>
          <p className="text-base sm:text-lg text-[#5F806D] max-w-2xl mx-auto leading-relaxed">
            Whether you're shopping for your family, sourcing for your business or looking for an Indian rice supplier, LG Gold is ready to hear from you.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('products')}
              className="w-full sm:w-auto px-10 py-4 bg-[#174A32] text-white font-bold uppercase tracking-widest text-xs sm:text-sm shadow-xs hover:bg-[#226444] transition-all border-2 border-[#174A32] rounded-sm cursor-pointer"
            >
              Shop Collection
            </button>

            <button
              onClick={() => onNavigate('export')}
              className="w-full sm:w-auto px-10 py-4 bg-transparent text-[#C9A227] border-2 border-[#C9A227] font-bold uppercase tracking-widest text-xs sm:text-sm hover:bg-[#C9A227] hover:text-white transition-all shadow-xs cursor-pointer rounded-sm"
            >
              Wholesale / Export Enquiry
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
