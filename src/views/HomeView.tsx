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
import { millPlantImage, jsrBagImage } from '../assets';
import { Reveal, CountUp } from '../components/common/motion';
import { JourneyTimeline } from '../components/common/JourneyTimeline';

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
      
      {/* HERO: one message, one real product shot, two clear actions */}
      <section className="bg-[#F8F5EA] border-b border-[#C9A227]/20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-7 space-y-6">
            <p className="fade-up text-sm sm:text-base font-semibold text-[#8F6A0E]" style={{ ['--d' as string]: '0ms' }}>
              Sri Lakshmi Ganapathi Trading Company, Telangana
            </p>
            <h1 className="fade-up font-serif-brand font-medium text-4xl sm:text-5xl lg:text-6xl text-[#174A32] tracking-tight leading-[1.08]" style={{ ['--d' as string]: '80ms' }}>
              Pure Telangana rice,<br />straight from our mill.
            </h1>
            <p className="fade-up text-lg text-[#202522]/80 leading-relaxed max-w-xl" style={{ ['--d' as string]: '170ms' }}>
              LG Gold mills single-origin HMT and JSR rice at Venkatadri Palem. Every grain is aged for 12 months or more
              and sorted by optical cameras, then packed in 26kg bags for homes, wholesalers and export buyers.
            </p>
            <div className="fade-up flex flex-wrap gap-3 pt-2" style={{ ['--d' as string]: '260ms' }}>
              <button
                onClick={() => onNavigate('products')}
                className="px-7 py-3.5 bg-[#174A32] text-white font-semibold rounded-sm hover:bg-[#226444] transition-colors cursor-pointer"
              >
                Shop 26kg bags
              </button>
              <button
                onClick={() => onNavigate('wholesale')}
                className="px-7 py-3.5 bg-transparent text-[#174A32] font-semibold border-2 border-[#174A32] rounded-sm hover:bg-[#174A32]/5 transition-colors cursor-pointer"
              >
                Get wholesale or export rates
              </button>
            </div>
            <ul className="fade-up flex flex-wrap gap-x-8 gap-y-2 pt-4 text-sm text-[#4C6358] font-medium" style={{ ['--d' as string]: '350ms' }}>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#C9A227]" /> 100% optical sorted</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#C9A227]" /> 12+ months aged</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#C9A227]" /> Ships across India and abroad</li>
            </ul>
          </div>

          <div className="lg:col-span-5">
            <button
              onClick={() => onNavigate('product-detail', 'jsr-rice')}
              className="group relative block w-full max-w-md mx-auto rounded-2xl bg-gradient-to-b from-[#E7D59A]/60 to-[#F8F5EA] border border-[#C9A227]/25 pt-10 pb-6 px-6 cursor-pointer"
              aria-label="View LG Gold JSR rice"
            >
              <img
                src={jsrBagImage}
                alt="LG Gold JSR Lachkari Kolam Rice, 26kg bag"
                className="settle-in mx-auto h-[420px] sm:h-[480px] w-auto rounded-sm shadow-2xl -rotate-2 group-hover:rotate-0 transition-transform duration-300"
              />
              <span className="mt-8 flex items-center justify-between text-left">
                <span>
                  <span className="block font-serif-brand font-bold text-lg text-[#174A32]">JSR Lachkari Kolam Rice</span>
                  <span className="block text-sm text-[#4C6358]">26kg bag, from ₹{PRODUCTS[1]?.packOptions[0]?.retailPrice}</span>
                </span>
                <span className="text-sm font-semibold text-[#174A32] flex items-center gap-1">
                  View <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* NUMBERS: count up once when they scroll into view */}
      <section className="bg-[#174A32] text-[#F8F5EA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-12 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
          {[
            { to: 12, suffix: '+', label: 'months of natural ageing' },
            { to: 26, suffix: ' kg', label: 'in every standard bag' },
            { to: 1000, suffix: '', label: 'bags fit in a 20ft container', format: (n: number) => n.toLocaleString('en-IN') },
            { to: 100, suffix: '%', label: 'optical Sortex sorted' },
          ].map((stat, i) => (
            <Reveal key={stat.label} delay={i * 110}>
              <p className="font-serif-brand font-bold text-4xl sm:text-5xl text-[#C9A227]">
                <CountUp to={stat.to} suffix={stat.suffix} format={stat.format} />
              </p>
              <p className="mt-1 text-[#F8F5EA]/80">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* WAYS TO BUY: three plain columns instead of three boxed cards */}
      <section className="bg-white border-b border-[#C9A227]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-20">
          <h2 className="font-serif-brand font-medium text-3xl sm:text-4xl text-[#174A32] max-w-2xl">
            Buy a single bag, a pallet or a container
          </h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 md:divide-x divide-[#C9A227]/30 border-t border-[#C9A227]/30">
            {[
              {
                route: 'products',
                icon: ShoppingBag,
                title: 'Home and kitchen',
                body: 'Aged, aromatic rice in sealed 26kg bags, delivered to your door. Order online or on WhatsApp.',
                action: 'Shop 26kg bags',
              },
              {
                route: 'wholesale',
                icon: Boxes,
                title: 'Wholesale',
                body: 'Mill-direct lots from 500kg for supermarkets, caterers, restaurants and distributors.',
                action: 'Get wholesale rates',
              },
              {
                route: 'export',
                icon: Globe,
                title: 'Export',
                body: '20ft and 40ft containers with private-label bags, phytosanitary certificates and port logistics.',
                action: 'Request an export quote',
              },
            ].map((p, i) => (
              <Reveal
                key={p.route}
                delay={i * 120}
                className="md:px-8 first:md:pl-0 last:md:pr-0 border-b md:border-b-0 border-[#C9A227]/30 last:border-b-0"
              >
                <button onClick={() => onNavigate(p.route)} className="group text-left py-8 md:py-10 w-full cursor-pointer">
                  <p.icon className="w-7 h-7 text-[#174A32]" />
                  <h3 className="mt-4 font-serif-brand font-bold text-xl text-[#174A32]">{p.title}</h3>
                  <p className="mt-2 text-[#4C6358] leading-relaxed">{p.body}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#174A32] group-hover:text-[#8F6A0E]">
                    {p.action}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. EXPLORE LG GOLD RICE (Product Discovery Cards) */}
      <section className="py-16 sm:py-24 bg-[#FFFFFF] border-b border-[#C9A227]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
            <div className="inline-block">
              <span className="text-xs font-bold text-[#C9A227] block">
                Single-Origin Rice Varieties
              </span>
              <div className="h-px w-12 bg-[#C9A227] mx-auto mt-2" />
            </div>
            <h2 className="font-serif-brand font-medium text-3xl sm:text-4xl lg:text-5xl text-[#174A32] tracking-tight pt-1">
              Explore LG Gold Rice
            </h2>
            <p className="text-sm sm:text-base text-[#5F806D] leading-relaxed max-w-2xl mx-auto">
              Milled from the finest paddy harvests of Telangana, our aged HMT and JSR rice varieties are engineered for unmatched grain separation, natural aroma, and rich culinary texture.
            </p>
          </div>

          {/* 2 Featured Product Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto">
            {PRODUCTS.map((product, i) => (
              <Reveal key={product.id} delay={i * 140} className="h-full flex [&>*]:flex-1">
                <ProductCard
                  product={product}
                  onViewDetails={(slug) => onNavigate('product-detail', slug)}
                  onSelectExportQuote={() => onNavigate('export')}
                />
              </Reveal>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => onNavigate('products')}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#174A32] hover:text-[#C9A227] transition-colors group cursor-pointer border-b border-[#174A32] pb-1"
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
            <span className="text-xs font-bold text-[#C9A227] block">
              Commitment to Excellence
            </span>
            <div className="h-px w-12 bg-[#C9A227] mx-auto my-2" />
            <h2 className="font-serif-brand font-medium text-3xl sm:text-4xl text-[#174A32]">
              Why LG Gold?
            </h2>
            <p className="text-sm text-[#5F806D]">
              Five core principles that guide every grain processed at Sri Lakshmi Ganapathi Trading Company.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {WHY_LG_GOLD_PILLARS.map((pillar, idx) => (
              <Reveal key={pillar.id} delay={idx * 90} className="h-full flex [&>*]:flex-1">
              <div className="lift p-6 bg-white border border-[#C9A227]/20 shadow-clean hover:border-[#C9A227] flex flex-col justify-between rounded-sm">
                <div>
                  <div className="text-2xl font-serif-brand font-bold text-[#174A32] mb-3 border-b border-[#F8F5EA] pb-2">
                    0{idx + 1}
                  </div>
                  <h3 className="font-serif-brand font-bold text-base sm:text-lg text-[#174A32] mb-1">
                    {pillar.title}
                  </h3>
                  <span className="text-xs font-bold text-[#C9A227] block mb-2">
                    {pillar.subtitle}
                  </span>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
              </Reveal>
            ))}
          </div>

        </div>
      </section>

      {/* 7. FARM / GRAIN TO CUSTOMER STORY (Horizontal Visual Journey) */}
      <section className="py-16 sm:py-24 bg-[#FFFFFF] border-b border-[#C9A227]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12 border-b border-[#C9A227]/20 pb-6">
            <div>
              <span className="text-xs font-bold text-[#C9A227]">
                Authentic Processing Journey
              </span>
              <h2 className="font-serif-brand font-medium text-3xl sm:text-4xl text-[#174A32] mt-1">
                From Grain to Your Kitchen
              </h2>
            </div>

            {/* Toggle between Domestic and Export variations */}
            <div className="flex items-center p-1 bg-[#F8F5EA] border border-[#C9A227]/30 rounded-sm">
              <button
                onClick={() => setJourneyTab('domestic')}
                className={`px-4 py-2 text-xs font-bold transition-all cursor-pointer rounded-xs ${
                  journeyTab === 'domestic'
                    ? 'bg-[#174A32] text-white shadow-xs'
                    : 'text-[#174A32]/70 hover:text-[#174A32]'
                }`}
              >
                Domestic Flow
              </button>
              <button
                onClick={() => setJourneyTab('export')}
                className={`px-4 py-2 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 rounded-xs ${
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

          {/* Steps on a line that draws itself when scrolled into view */}
          <JourneyTimeline key={journeyTab} steps={journeyTab === 'domestic' ? GRAIN_TO_KITCHEN_STEPS : EXPORT_JOURNEY_STEPS} />

          {/* Modern Processing Line Spotlight Card */}
          <div className="mt-14 p-6 sm:p-8 bg-[#F8F5EA] border-t-4 border-[#C9A227] border-x border-b border-[#C9A227]/20 rounded-sm shadow-clean grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold text-[#C9A227] flex items-center gap-1.5">
                <Factory className="w-4 h-4" />
                Modern Milltec Milling Infrastructure
              </span>
              <h3 className="font-serif-brand font-medium text-2xl sm:text-3xl text-[#174A32]">
                Sri Lakshmi Ganapathi High-Speed Processing Facility
              </h3>
              <p className="text-sm sm:text-sm text-[#202522] leading-relaxed">
                Operating in Venkatadri Palem, Telangana, our computerized Milltec milling units combine multi-stage de-husking, chilled-water polishing cylinders, and 100% Sortex CCD cameras to eliminate broken grains and foreign matter.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                <div className="p-3 bg-white border border-[#C9A227]/20 rounded-xs">
                  <span className="text-xs font-bold text-[#C9A227] block">Standard Format:</span>
                  <strong className="text-[#174A32]">Standard 26kg Woven Bags</strong>
                </div>
                <div className="p-3 bg-white border border-[#C9A227]/20 rounded-xs">
                  <span className="text-xs font-bold text-[#C9A227] block">Purity Standard:</span>
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
                <div className="bg-[#174A32] p-3 text-white">
                  <span className="text-xs font-bold block text-[#E7D59A]">Milltec Rice Milling Line (Units 12, 14, 15)</span>
                  <span className="text-xs text-white/80">Sri Lakshmi Ganapathi Facility • Venkatadri Palem, Telangana</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => onNavigate('quality')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#174A32] hover:text-[#C9A227] transition-colors border-b border-[#174A32] pb-0.5"
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
                <span className="text-[#C9A227] text-xs font-bold">
                  Global Commodity Supply • Telangana, India
                </span>
              </div>

              <div className="space-y-4">
                <h2 className="font-serif-brand font-medium text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
                  Export Quality Rice from India.
                </h2>
                <div className="inline-block bg-[#C9A227] text-[#174A32] font-black text-xs px-3.5 py-1 rounded-xs">
                  Export Orders Accepted
                </div>
                <p className="text-base text-[#F8F5EA]/90 leading-relaxed pt-2 max-w-xl">
                  LG Gold supplies quality rice for international buyers, importers, distributors, wholesalers and institutional customers.
                </p>
              </div>

              {/* Target B2B Audience Chips */}
              <div className="pt-2">
                <span className="text-xs font-bold text-[#E7D59A] block mb-3">
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
                  className="px-8 py-3.5 bg-[#C9A227] text-[#174A32] font-bold text-xs rounded-sm hover:bg-[#E7D59A] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Request Export Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('products')}
                  className="px-8 py-3.5 bg-transparent text-white font-bold text-xs border border-white/40 hover:bg-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer rounded-sm"
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
                  <p className="text-xs text-white/60 mt-1">Direct Mill Port Logistics</p>
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
                <span className="text-xs font-bold text-[#C9A227]">
                  Commercial Supply Chain
                </span>
              </div>
              <h2 className="font-serif-brand font-medium text-3xl sm:text-4xl text-[#174A32]">
                Wholesale & Bulk Rice Supplier
              </h2>
              <p className="text-sm sm:text-base text-[#5F806D] leading-relaxed">
                Whether you manage a supermarket chain, a catering enterprise, a restaurant network, or an institutional cafeteria, LG Gold provides steady supply, transparent mill pricing, and direct logistics.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-[#F8F5EA] border border-[#C9A227]/20 rounded-sm">
                  <Boxes className="w-5 h-5 text-[#174A32] mb-1.5" />
                  <h4 className="font-bold text-sm text-[#174A32]">Wholesale Packs</h4>
                  <p className="text-xs text-gray-600 mt-0.5">25kg & 50kg Bags from 500kg MOQ</p>
                </div>

                <div className="p-4 bg-[#F8F5EA] border border-[#C9A227]/20 rounded-sm">
                  <Truck className="w-5 h-5 text-[#174A32] mb-1.5" />
                  <h4 className="font-bold text-sm text-[#174A32]">Bulk Tonnage</h4>
                  <p className="text-xs text-gray-600 mt-0.5">Full truck loads & scheduled supply</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => onNavigate('wholesale')}
                  className="px-6 py-3 bg-[#174A32] text-white text-xs font-bold rounded-sm hover:bg-[#226444] transition-colors"
                >
                  Request Wholesale Quote
                </button>
                <button
                  onClick={() => onNavigate('bulk')}
                  className="px-6 py-3 bg-transparent text-[#174A32] border-2 border-[#174A32] text-xs font-bold rounded-sm hover:bg-[#F8F5EA] transition-colors"
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
                  <span className="text-xs font-bold text-[#C9A227] bg-white px-2 py-0.5 border border-[#C9A227]/30">
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
                      <span className="text-gray-500 text-xs">Venkatadri Palem, Telangana</span>
                    </div>
                    <a
                      href={`tel:${BRAND_CONFIG.contact.primaryPhone}`}
                      className="px-3.5 py-1.5 bg-[#174A32] text-white rounded-sm font-bold text-xs hover:bg-[#226444]"
                    >
                      Call Now
                    </a>
                  </div>

                  <a
                    href={createWhatsAppUrl('Hi LG Gold, I would like to request wholesale rates for HMT and JSR Rice.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 bg-[#25D366] text-white rounded-sm font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#1ebd5a] transition-colors shadow-xs"
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
            <span className="text-xs font-bold text-[#C9A227] block">
              Culinary Inspiration
            </span>
            <div className="h-px w-12 bg-[#C9A227] mx-auto my-2" />
            <h2 className="font-serif-brand font-medium text-3xl sm:text-4xl text-[#174A32]">
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
                className={`px-4 py-1.5 text-xs font-bold transition-all cursor-pointer rounded-sm ${
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
              className="px-8 py-3 bg-[#174A32] text-white text-xs font-bold rounded-sm hover:bg-[#226444] transition-colors shadow-xs cursor-pointer"
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
                    <p className="text-xs text-[#E7D59A] mt-0.5 font-medium">Trading Company • Venkatadri Palem, Telangana</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5">
              <div className="inline-block border-l-4 border-[#C9A227] pl-3">
                <span className="text-xs font-bold text-[#C9A227]">
                  Agricultural Roots & Heritage
                </span>
              </div>
              <h2 className="font-serif-brand font-medium text-3xl sm:text-4xl text-[#174A32]">
                The Heritage Behind LG Gold
              </h2>
              <p className="text-sm sm:text-base text-[#202522]/85 leading-relaxed font-normal">
                Sri Lakshmi Ganapathi Trading Company was founded on a simple, uncompromising principle: delivering pure, authentic, unadulterated Indian rice straight from the farmer's harvest to dining tables across the globe.
              </p>
              <p className="text-sm sm:text-sm text-[#5F806D] leading-relaxed">
                Situated at Venkatadri Palem in Telangana's prime paddy growing belt, our milling infrastructure combines traditional grain aging knowledge with modern Sortex optical cleaning technology. We serve daily households, regional supermarket chains, top catering masters, and international container buyers with equal dedication.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('about')}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#174A32] hover:text-[#C9A227] transition-colors border-b border-[#174A32] pb-0.5 cursor-pointer"
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
                <div className="flex items-center gap-2 text-[#C9A227] text-xs font-bold">
                  <MapPin className="w-4 h-4" />
                  <span>Mill & Trade Headquarters</span>
                </div>
                <h3 className="font-serif-brand font-medium text-2xl sm:text-3xl text-white">
                  Visit or Connect with Sri Lakshmi Ganapathi Trading Company
                </h3>
                <p className="text-sm sm:text-sm text-[#F8F5EA]/80 leading-relaxed max-w-xl">
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
                  className="w-full py-3.5 px-6 bg-[#C9A227] text-[#174A32] font-bold text-xs hover:bg-[#E7D59A] transition-colors text-center shadow-xs cursor-pointer rounded-sm"
                >
                  View Interactive Map & Directions
                </button>
                <a
                  href={BRAND_CONFIG.location.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 bg-transparent text-white font-bold text-xs hover:bg-white/10 transition-colors text-center border border-white/30 rounded-sm"
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
            <span className="text-xs font-bold text-[#C9A227] block">
              Experience Pure Telangana Rice
            </span>
            <div className="h-px w-12 bg-[#C9A227] mx-auto mt-2" />
          </div>
          <h2 className="font-serif-brand font-medium text-3xl sm:text-5xl text-[#174A32] tracking-tight">
            Looking for Quality Rice?
          </h2>
          <p className="text-base sm:text-lg text-[#5F806D] max-w-2xl mx-auto leading-relaxed">
            Whether you're shopping for your family, sourcing for your business or looking for an Indian rice supplier, LG Gold is ready to hear from you.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('products')}
              className="w-full sm:w-auto px-10 py-4 bg-[#174A32] text-white font-bold text-xs sm:text-sm shadow-xs hover:bg-[#226444] transition-all border-2 border-[#174A32] rounded-sm cursor-pointer"
            >
              Shop Collection
            </button>

            <button
              onClick={() => onNavigate('export')}
              className="w-full sm:w-auto px-10 py-4 bg-transparent text-[#C9A227] border-2 border-[#C9A227] font-bold text-xs sm:text-sm hover:bg-[#C9A227] hover:text-white transition-all shadow-xs cursor-pointer rounded-sm"
            >
              Wholesale / Export Enquiry
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
