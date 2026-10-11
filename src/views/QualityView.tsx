import React from 'react';
import {
  ShieldCheck,
  Eye,
  CheckCircle2,
  Sparkles,
  Award,
  Factory,
  Boxes,
  Globe,
  ArrowRight,
  Wheat,
  Cpu,
} from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { millPlantImage } from '../assets';

interface QualityViewProps {
  onNavigate: (route: string, param?: string) => void;
}

export const QualityView: React.FC<QualityViewProps> = ({ onNavigate }) => {
  const qualitySteps = [
    {
      num: '01',
      title: 'Paddy Sourcing & Grain Selection',
      desc: 'Selected from the fertile canal-fed river basins of Telangana. Only unbroken, fully matured harvest lots meeting standard test weight and uniform moisture parameters are accepted.',
    },
    {
      num: '02',
      title: 'Pre-Cleaning, Destoning & De-Husking',
      desc: 'Multi-stage aspiration and vibratory sieves remove stones, dust, husk, and extraneous matter before grain touches the milling cylinder.',
    },
    {
      num: '03',
      title: 'Controlled Polish & Temperature Regulation',
      desc: 'Milled through chilled-water polisher rollers that strip the husk while protecting essential aleurone nutrients and preventing thermal grain cracking.',
    },
    {
      num: '04',
      title: '100% Sortex Optical Color Sorting',
      desc: 'High-resolution Japanese CCD optical sorters inspect each grain individually, blowing away discolored, chalky, peck, red-streaked, and broken grains at microsecond speed.',
    },
    {
      num: '05',
      title: 'Natural Aging & Moisture Control',
      desc: 'Aged for a minimum of 12 months in aerated godowns to stabilize amylase and moisture under strictly < 13% for non-sticky, maximum volume elongation during cooking.',
    },
    {
      num: '06',
      title: 'Hygienic Tamper-Evident Packaging',
      desc: 'Automatically weighed and machine-stitched into 26kg food-grade virgin woven export sacks without manual hand contact.',
    },
  ];

  return (
    <div className="bg-[#F3F4EC] min-h-screen pb-24">
      
      {/* Header Banner */}
      <div className="bg-[#0B3B2C] text-white py-10 sm:py-14 border-b-4 border-[#E0A21A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-4">
          <Breadcrumbs items={[{ label: 'Our Quality Standards' }]} onNavigate={onNavigate} variant="dark" />
          
          <div className="max-w-3xl space-y-3">
            <span className="text-[10px] font-bold text-[#E0A21A] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              100% Sortex Optical Checked
            </span>
            <h1 className="font-serif-brand font-bold text-3xl sm:text-5xl text-white">
              The LG Gold Quality Promise
            </h1>
            <p className="text-sm sm:text-base text-[#F3F4EC]/85 leading-relaxed">
              Every grain of LG Gold HMT and JSR rice is backed by rigorous optical sorting, computerized milling control, and authentic Telangana paddy heritage.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 space-y-14">
        
        {/* Optical Sorting & Milling Infrastructure Spotlight */}
        <div className="bg-white rounded-sm border-t-4 border-[#E0A21A] border-x border-b border-[#E0A21A]/20 p-6 sm:p-10 shadow-clean grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-[10px] font-bold text-[#E0A21A] flex items-center gap-1">
              <Factory className="w-4 h-4" /> Computerized Milltec Processing Line
            </span>
            <h2 className="font-serif-brand font-bold text-2xl sm:text-3xl text-[#0B3B2C]">
              Precision Milling & 100% Sortex Cleaning
            </h2>
            <p className="text-xs sm:text-sm text-[#15231C] leading-relaxed">
              Our Venkatadri Palem facility features automated multi-cylinder Milltec milling systems equipped with digital control consoles, pneumatic bucket elevators, and high-speed optical sorters.
            </p>
            <p className="text-xs sm:text-sm text-[#4C6358] leading-relaxed">
              Multi-camera CCD color sorters photograph every single grain at 30,000 frames per second. High-speed pneumatic air injectors instantly eject discolored, chalky, or damaged grains, delivering pristine, pearlescent 26kg bags with zero stones.
            </p>

            <div className="pt-2 grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#F3F4EC] rounded-xs border border-[#E0A21A]/30 font-bold text-[#0B3B2C] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E0A21A] shrink-0" />
                <span>Zero Stones & Black Tips</span>
              </div>
              <div className="p-3 bg-[#F3F4EC] rounded-xs border border-[#E0A21A]/30 font-bold text-[#0B3B2C] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E0A21A] shrink-0" />
                <span>Computerized Moisture &lt; 13%</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-xs overflow-hidden shadow-clean border border-[#E0A21A]/20 relative group">
              <img
                src={millPlantImage}
                alt="Automated Milltec milling machinery inside Sri Lakshmi Ganapathi Trading Company"
                className="w-full h-auto max-h-[380px] object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 text-white">
                <span className="text-[11px] font-bold block text-[#F0D890]">Milltec Automated Milling Units (12, 14, 15)</span>
                <span className="text-[10px] text-white/80">Sri Lakshmi Ganapathi Facility • Venkatadri Palem, Telangana</span>
              </div>
            </div>
          </div>
        </div>

        {/* 6 Step Process */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-bold text-[#E0A21A]">
              End-to-End Quality Architecture
            </span>
            <h2 className="font-serif-brand font-bold text-3xl text-[#0B3B2C]">
              From Harvest to Sealed Pack
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {qualitySteps.map((step) => (
              <div
                key={step.num}
                className="p-6 rounded-sm bg-white border-t-4 border-[#E0A21A] border-x border-b border-[#E0A21A]/20 shadow-clean hover:border-[#E0A21A] transition-all space-y-3"
              >
                <div className="w-10 h-10 rounded-xs bg-[#0B3B2C] text-[#E0A21A] font-serif-brand font-bold text-base flex items-center justify-center shadow-xs">
                  {step.num}
                </div>
                <h3 className="font-serif-brand font-bold text-lg text-[#0B3B2C]">
                  {step.title}
                </h3>
                <p className="text-xs text-[#4C6358] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Commercial Quality CTA */}
        <div className="bg-[#0B3B2C] text-white rounded-sm p-8 sm:p-10 border-t-4 border-[#E0A21A] border-x border-b border-[#E0A21A]/20 shadow-clean flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif-brand font-bold text-2xl text-white">
              Need Certificate of Analysis (COA) or Lab Specs?
            </h3>
            <p className="text-xs text-[#F3F4EC]/80 mt-1 max-w-xl">
              We provide moisture, broken grain percentage, and pesticide residue test reports for container export and institutional tenders.
            </p>
          </div>
          <button
            onClick={() => onNavigate('export')}
            className="px-6 py-3.5 bg-[#E0A21A] text-[#0B3B2C] font-bold text-xs rounded-xs hover:bg-[#F0D890] transition-colors shrink-0 cursor-pointer shadow-xs"
          >
            Contact Quality Desk
          </button>
        </div>

      </div>
    </div>
  );
};
