import React from 'react';
import {
  Building2,
  Heart,
  ShieldCheck,
  Globe,
  MapPin,
  Sparkles,
  ArrowRight,
  Wheat,
  CheckCircle2,
  Cpu,
  Boxes,
  Layers,
} from 'lucide-react';
import { BRAND_CONFIG } from '../config/brandConfig';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { millPlantImage } from '../assets';

interface AboutViewProps {
  onNavigate: (route: string, param?: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  return (
    <div className="bg-[#F8F5EA] min-h-screen pb-24">
      
      {/* Header Banner */}
      <div className="bg-[#174A32] text-white py-10 sm:py-14 border-b-4 border-[#C9A227]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-4">
          <Breadcrumbs items={[{ label: 'About Us' }]} onNavigate={onNavigate} variant="dark" />
          
          <div className="max-w-3xl space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A227]">
              Agricultural Roots & Milling Heritage
            </span>
            <h1 className="font-serif-brand font-light text-3xl sm:text-5xl text-white">
              The Heritage Behind LG Gold
            </h1>
            <p className="text-sm sm:text-base text-[#F8F5EA]/85 leading-relaxed">
              Milling authentic Telangana rice with time-honored integrity and modern computerized processing precision.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 space-y-14">
        
        {/* Story Section */}
        <div className="bg-white rounded-sm border-t-4 border-[#C9A227] border-x border-b border-[#C9A227]/20 p-6 sm:p-10 shadow-clean grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xs bg-[#174A32]/10 text-[#174A32] text-xs font-bold uppercase tracking-wider">
              <span>Sri Lakshmi Ganapathi Trading Company</span>
            </div>
            
            <h2 className="font-serif-brand font-light text-2xl sm:text-3xl text-[#174A32]">
              Rooted in the Soil of Telangana
            </h2>

            <p className="text-xs sm:text-sm text-[#202522] leading-relaxed">
              Sri Lakshmi Ganapathi Trading Company operates at the intersection of traditional agricultural wisdom and modern food technology. Located in <strong>Venkatadri Palem, Telangana</strong>, our facility sits in the heart of one of India's richest paddy cultivation regions.
            </p>

            <p className="text-xs sm:text-sm text-[#5F806D] leading-relaxed">
              Under the consumer brand <strong>LG GOLD</strong>, we process, age, optical-sort, and package premium single-origin <strong>HMT</strong> and <strong>JSR</strong> rice varieties. We eliminate middleman tampering and ensure that every grain cooked in home kitchens or commercial dining halls delivers exceptional aroma, fluffy grain separation, and pure nutrition.
            </p>

            <div className="pt-2 grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#F8F5EA] rounded-xs border border-[#C9A227]/30">
                <strong className="text-[#174A32] block uppercase tracking-wider text-[10px]">Parent Enterprise:</strong>
                <span className="text-[#202522] font-medium">Sri Lakshmi Ganapathi Trading Company</span>
              </div>
              <div className="p-3 bg-[#F8F5EA] rounded-xs border border-[#C9A227]/30">
                <strong className="text-[#174A32] block uppercase tracking-wider text-[10px]">Consumer Brand:</strong>
                <span className="text-[#202522] font-medium">LG GOLD</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-xs overflow-hidden shadow-clean border border-[#C9A227]/20 relative group">
              <img
                src={millPlantImage}
                alt="Sri Lakshmi Ganapathi Milltec rice milling and processing machinery in Venkatadri Palem"
                className="w-full h-auto max-h-[380px] object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white">
                <span className="text-[11px] font-bold block text-[#E7D59A]">Milltec Industrial Processing Unit</span>
                <span className="text-[10px] text-white/80">Sri Lakshmi Ganapathi Mill Facility • Venkatadri Palem, Telangana</span>
              </div>
            </div>
          </div>
        </div>

        {/* Plant Infrastructure & Technology Highlight */}
        <div className="bg-[#174A32] text-white rounded-sm p-6 sm:p-10 border-t-4 border-[#C9A227] border-x border-b border-[#C9A227]/20 shadow-clean space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#C9A227]/30 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A227] flex items-center gap-1.5">
                <Cpu className="w-4 h-4" />
                Milling Infrastructure & Technology
              </span>
              <h3 className="font-serif-brand font-light text-2xl sm:text-3xl text-white mt-1">
                Automated Milltec Processing Line
              </h3>
            </div>
            <span className="text-xs text-[#E7D59A] font-medium">
              Zero Manual Contamination • 100% Sortex Optical Purity
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-white/5 border border-white/10 rounded-xs space-y-1.5">
              <div className="w-8 h-8 rounded-xs bg-[#C9A227] text-[#174A32] flex items-center justify-center font-bold font-serif-brand">
                01
              </div>
              <h4 className="font-bold text-[#E7D59A] text-sm">Automated De-husking</h4>
              <p className="text-[#F8F5EA]/80 leading-relaxed text-[11px]">
                High-torque rubber roller units strip outer husk gently to prevent kernel micro-fractures.
              </p>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-xs space-y-1.5">
              <div className="w-8 h-8 rounded-xs bg-[#C9A227] text-[#174A32] flex items-center justify-center font-bold font-serif-brand">
                02
              </div>
              <h4 className="font-bold text-[#E7D59A] text-sm">Multi-Stage Polishing</h4>
              <p className="text-[#F8F5EA]/80 leading-relaxed text-[11px]">
                Cylindrical water-mist and dry friction polishers yield silky smooth, pearlescent grains.
              </p>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-xs space-y-1.5">
              <div className="w-8 h-8 rounded-xs bg-[#C9A227] text-[#174A32] flex items-center justify-center font-bold font-serif-brand">
                03
              </div>
              <h4 className="font-bold text-[#E7D59A] text-sm">Optical Sortex Grading</h4>
              <p className="text-[#F8F5EA]/80 leading-relaxed text-[11px]">
                High-speed CCD cameras and pneumatic jets eliminate discolored grains and chalky kernels.
              </p>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-xs space-y-1.5">
              <div className="w-8 h-8 rounded-xs bg-[#C9A227] text-[#174A32] flex items-center justify-center font-bold font-serif-brand">
                04
              </div>
              <h4 className="font-bold text-[#E7D59A] text-sm">Direct Mill Stitching</h4>
              <p className="text-[#F8F5EA]/80 leading-relaxed text-[11px]">
                Automated electronic weighing scales pack directly into tamper-proof 26kg woven bags.
              </p>
            </div>
          </div>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-sm bg-white border-t-4 border-[#C9A227] border-x border-b border-[#C9A227]/20 shadow-clean space-y-3">
            <div className="w-10 h-10 rounded-xs bg-[#174A32]/10 text-[#174A32] flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-serif-brand font-bold text-lg text-[#174A32]">Farmer Partnerships</h3>
            <p className="text-xs text-[#5F806D] leading-relaxed">
              We work directly with regional Telangana paddy farmers, ensuring fair market compensation and sustainable harvesting practices.
            </p>
          </div>

          <div className="p-6 rounded-sm bg-white border-t-4 border-[#C9A227] border-x border-b border-[#C9A227]/20 shadow-clean space-y-3">
            <div className="w-10 h-10 rounded-xs bg-[#174A32]/10 text-[#174A32] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif-brand font-bold text-lg text-[#174A32]">Modern Sortex Standards</h3>
            <p className="text-xs text-[#5F806D] leading-relaxed">
              Every lot undergoes high-speed optical sorting and automated moisture analysis before packaging to ensure zero stones and broken grains.
            </p>
          </div>

          <div className="p-6 rounded-sm bg-white border-t-4 border-[#C9A227] border-x border-b border-[#C9A227]/20 shadow-clean space-y-3">
            <div className="w-10 h-10 rounded-xs bg-[#174A32]/10 text-[#174A32] flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="font-serif-brand font-bold text-lg text-[#174A32]">Global Distribution</h3>
            <p className="text-xs text-[#5F806D] leading-relaxed">
              From local Telangana dining tables to container sea freight for international markets, LG Gold delivers verified Indian grain excellence.
            </p>
          </div>
        </div>

        {/* Commercial Heritage CTA */}
        <div className="bg-[#174A32] text-white rounded-sm p-8 sm:p-10 border-t-4 border-[#C9A227] border-x border-b border-[#C9A227]/20 shadow-clean flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-serif-brand font-light text-2xl text-white">
              Connect with Our Mill Management
            </h3>
            <p className="text-xs text-[#F8F5EA]/80">
              Inquire about retail dealership, state distribution, or container export contracts.
            </p>
          </div>
          <button
            onClick={() => onNavigate('contact')}
            className="px-6 py-3 bg-[#C9A227] text-[#174A32] font-bold uppercase tracking-wider text-xs rounded-xs hover:bg-[#E7D59A] transition-colors shrink-0 cursor-pointer shadow-xs"
          >
            Visit Our Mill & Contact Us
          </button>
        </div>

      </div>
    </div>
  );
};
