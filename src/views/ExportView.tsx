import React, { useState } from 'react';
import {
  Globe,
  Container,
  ShieldCheck,
  PackageCheck,
  CheckCircle2,
  Building2,
  Boxes,
  Store,
  ChefHat,
  MessageCircle,
  Phone,
  FileCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { ExportEnquiryForm } from '../types';
import { BRAND_CONFIG, createWhatsAppUrl } from '../config/brandConfig';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { QuoteSuccessModal } from '../components/common/QuoteSuccessModal';

interface ExportViewProps {
  onNavigate: (route: string, param?: string) => void;
}

export const ExportView: React.FC<ExportViewProps> = ({ onNavigate }) => {
  const [form, setForm] = useState<ExportEnquiryForm>({
    companyName: '',
    contactPerson: '',
    country: '',
    email: '',
    phoneWhatsapp: '',
    riceVariety: 'LG Gold HMT Rice & JSR Rice Mix',
    requiredQuantity: '1 x 20ft FCL (1,000 Bags of 26kg = 26 MT)',
    packagingRequirement: 'Standard 26kg Heavy-Duty Export PP Bags',
    destinationPort: '',
    message: '',
  });

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [refId, setRefId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.companyName || !form.contactPerson || !form.email || !form.country) {
      alert('Please fill in all mandatory fields to submit your export quote request.');
      return;
    }

    const generatedId = `EXP-${Math.floor(100000 + Math.random() * 900000)}`;
    setRefId(generatedId);
    setIsSuccessOpen(true);
  };

  const handleWhatsAppInquiry = () => {
    const msg = `*INTERNATIONAL EXPORT INQUIRY - LG GOLD RICE*\n` +
      `Company: ${form.companyName || 'International Buyer'}\n` +
      `Country: ${form.country || 'Global'}\n` +
      `Variety: ${form.riceVariety}\n` +
      `Quantity: ${form.requiredQuantity}\n` +
      `Port: ${form.destinationPort || 'Major Seaport'}\n` +
      `Please share FOB/CIF rates and specification sheet.`;
    window.open(createWhatsAppUrl(msg), '_blank');
  };

  return (
    <div className="bg-[#F8F5EA] min-h-screen pb-24">
      
      {/* Top Hero Banner in Deep Green & Gold */}
      <div className="bg-[#174A32] text-white py-12 sm:py-16 border-b-4 border-[#C9A227] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 space-y-5">
          <Breadcrumbs items={[{ label: 'Export Desk' }]} onNavigate={onNavigate} variant="dark" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-[#E7D59A] border border-[#C9A227]/40 text-[11px] font-bold uppercase tracking-widest rounded-xs">
                <Globe className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>Direct Agricultural Exports From Telangana, India</span>
              </div>

              <h1 className="font-serif-brand font-light text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
                Export Quality Rice from India
              </h1>

              <div className="inline-block bg-[#C9A227] text-[#174A32] font-black text-xs px-3.5 py-1.5 rounded-xs tracking-widest uppercase shadow-xs">
                EXPORT ORDERS ACCEPTED
              </div>

              <p className="text-base sm:text-lg text-[#F8F5EA]/90 leading-relaxed max-w-2xl">
                LG Gold by Sri Lakshmi Ganapathi Trading Company supplies quality rice for international buyers, importers, distributors, wholesalers and institutional customers across the Middle East, Southeast Asia, Europe, and Africa.
              </p>
            </div>

            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-xs p-6 border border-white/20 text-xs space-y-3">
              <span className="text-[#C9A227] font-bold text-xs uppercase tracking-wider block">Export Capabilities Summary</span>
              <div className="space-y-2.5 text-[#F8F5EA]/90 text-[13px]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A227] shrink-0" />
                  <span>20ft & 40ft Full Container Loads (FCL)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A227] shrink-0" />
                  <span>100% Sortex Optical Color Sorted</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A227] shrink-0" />
                  <span>Moisture Controlled Strictly &lt; 13%</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A227] shrink-0" />
                  <span>Phytosanitary & Fumigation Compliance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-12 space-y-16">
        
        {/* Section: Export Products */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A227]">
              Certified Export Varieties
            </span>
            <h2 className="font-serif-brand font-light text-3xl sm:text-4xl text-[#174A32]">
              Export Products
            </h2>
            <p className="text-xs sm:text-sm text-[#5F806D]">
              Single-origin Telangana paddy, milled and sorted to international commercial standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* HMT Export Box */}
            <div className="p-6 rounded-sm bg-white border-t-4 border-[#C9A227] border-x border-b border-[#C9A227]/20 shadow-clean space-y-4 hover:border-[#C9A227] transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5F806D]">Medium-Slender Grain</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#174A32] bg-[#F8F5EA] px-2.5 py-1 rounded-xs border border-[#C9A227]/30">
                  Export Grade A
                </span>
              </div>
              <h3 className="font-serif-brand font-light text-2xl text-[#174A32]">LG Gold HMT Rice</h3>
              <p className="text-xs sm:text-sm text-[#5F806D] leading-relaxed">
                Celebrated for high elongation, distinct separate grains, and versatile culinary performance in biryanis, pilafs, and daily family dining.
              </p>
              <div className="space-y-1.5 text-xs text-[#202522] pt-2 border-t border-[#F8F5EA]">
                <div className="flex justify-between"><span>Grain Length:</span><span className="font-bold">5.2 – 5.6 mm</span></div>
                <div className="flex justify-between"><span>Moisture:</span><span className="font-bold">&lt; 13.0%</span></div>
                <div className="flex justify-between"><span>Broken Ratio:</span><span className="font-bold">&lt; 2.0% (Sortex)</span></div>
                <div className="flex justify-between"><span>Standard Packaging:</span><span className="font-bold">25kg / 50kg PP, Jute, BOPP</span></div>
              </div>
            </div>

            {/* JSR Export Box */}
            <div className="p-6 rounded-sm bg-white border-t-4 border-[#C9A227] border-x border-b border-[#C9A227]/20 shadow-clean space-y-4 hover:border-[#C9A227] transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5F806D]">Super-Fine Grain</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#174A32] bg-[#F8F5EA] px-2.5 py-1 rounded-xs border border-[#C9A227]/30">
                  Export Grade A+
                </span>
              </div>
              <h3 className="font-serif-brand font-light text-2xl text-[#174A32]">LG Gold JSR Rice</h3>
              <p className="text-xs sm:text-sm text-[#5F806D] leading-relaxed">
                Super-fine slender morphology with exceptional tenderness, easy digestibility, and brilliant white polish for premium table rice markets.
              </p>
              <div className="space-y-1.5 text-xs text-[#202522] pt-2 border-t border-[#F8F5EA]">
                <div className="flex justify-between"><span>Grain Length:</span><span className="font-bold">4.8 – 5.2 mm</span></div>
                <div className="flex justify-between"><span>Moisture:</span><span className="font-bold">&lt; 12.8%</span></div>
                <div className="flex justify-between"><span>Broken Ratio:</span><span className="font-bold">&lt; 1.8% (Sortex)</span></div>
                <div className="flex justify-between"><span>Standard Packaging:</span><span className="font-bold">5kg, 10kg, 25kg, 50kg</span></div>
              </div>
            </div>

          </div>
        </div>

        {/* Section: Who We Supply */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A227]">
              Global Client Profiles
            </span>
            <h2 className="font-serif-brand font-light text-3xl sm:text-4xl text-[#174A32]">
              Who We Supply
            </h2>
            <p className="text-xs sm:text-sm text-[#5F806D]">
              Trusted by international food importers, retail conglomerates, and institutional food buyers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-sm bg-white border border-[#C9A227]/20 shadow-clean flex items-start gap-4">
              <div className="w-10 h-10 rounded-xs bg-[#174A32] text-[#C9A227] flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif-brand font-bold text-base text-[#174A32]">Importers & Traders</h4>
                <p className="text-xs text-[#5F806D] mt-1">Full container load contracts, custom ocean freight documents, and regular monthly allocations.</p>
              </div>
            </div>

            <div className="p-6 rounded-sm bg-white border border-[#C9A227]/20 shadow-clean flex items-start gap-4">
              <div className="w-10 h-10 rounded-xs bg-[#174A32] text-[#C9A227] flex items-center justify-center shrink-0">
                <Boxes className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif-brand font-bold text-base text-[#174A32]">International Distributors</h4>
                <p className="text-xs text-[#5F806D] mt-1">Reliable palletized shipments, multi-pack size consolidation, and brand marketing support.</p>
              </div>
            </div>

            <div className="p-6 rounded-sm bg-white border border-[#C9A227]/20 shadow-clean flex items-start gap-4">
              <div className="w-10 h-10 rounded-xs bg-[#174A32] text-[#C9A227] flex items-center justify-center shrink-0">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif-brand font-bold text-base text-[#174A32]">Supermarket Retailers</h4>
                <p className="text-xs text-[#5F806D] mt-1">Shelf-ready 5kg and 10kg consumer packaging with international barcode standards.</p>
              </div>
            </div>

            <div className="p-6 rounded-sm bg-white border border-[#C9A227]/20 shadow-clean flex items-start gap-4">
              <div className="w-10 h-10 rounded-xs bg-[#174A32] text-[#C9A227] flex items-center justify-center shrink-0">
                <ChefHat className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif-brand font-bold text-base text-[#174A32]">Hotels & Restaurants</h4>
                <p className="text-xs text-[#5F806D] mt-1">High cooking yield, uniform grain consistency, and minimal wastage for culinary operations.</p>
              </div>
            </div>

            <div className="p-6 rounded-sm bg-white border border-[#C9A227]/20 shadow-clean flex items-start gap-4">
              <div className="w-10 h-10 rounded-xs bg-[#174A32] text-[#C9A227] flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif-brand font-bold text-base text-[#174A32]">Institutional Buyers</h4>
                <p className="text-xs text-[#5F806D] mt-1">Cost-effective 50kg bags for government, educational, and corporate meal programs.</p>
              </div>
            </div>

            <div className="p-6 rounded-sm bg-white border border-[#C9A227]/20 shadow-clean flex items-start gap-4">
              <div className="w-10 h-10 rounded-xs bg-[#174A32] text-[#C9A227] flex items-center justify-center shrink-0">
                <PackageCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif-brand font-bold text-base text-[#174A32]">Private Label Partners</h4>
                <p className="text-xs text-[#5F806D] mt-1">Customized bag printing with buyer’s brand name, artwork, and localized nutrition facts.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section: B2B Export Enquiry Form */}
        <div className="bg-white rounded-sm border-t-4 border-[#C9A227] border-x border-b border-[#C9A227]/20 shadow-clean overflow-hidden max-w-4xl mx-auto">
          <div className="bg-[#174A32] text-white p-6 sm:p-8 border-b border-[#C9A227]/40">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A227]">Commercial RFQ</span>
                <h3 className="font-serif-brand font-light text-2xl sm:text-3xl text-white">
                  Request International Export Quote
                </h3>
                <p className="text-xs sm:text-sm text-[#F8F5EA]/80 mt-1">
                  Fill out your container requirements. Our international trade specialists will reply with formal FOB/CIF quotation within 4 business hours.
                </p>
              </div>
              <div className="hidden sm:block">
                <Globe className="w-12 h-12 text-[#C9A227]/70" />
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              <div>
                <label className="block text-xs font-bold text-[#174A32] uppercase tracking-wider mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Al-Madina Food Trading LLC"
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xs border border-gray-300 text-sm focus:border-[#174A32] focus:ring-1 focus:ring-[#174A32] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#174A32] uppercase tracking-wider mb-1">Contact Person *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariq Mansoor"
                  value={form.contactPerson}
                  onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xs border border-gray-300 text-sm focus:border-[#174A32] focus:ring-1 focus:ring-[#174A32] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#174A32] uppercase tracking-wider mb-1">Destination Country *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. United Arab Emirates, Singapore, USA, UK"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xs border border-gray-300 text-sm focus:border-[#174A32] focus:ring-1 focus:ring-[#174A32] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#174A32] uppercase tracking-wider mb-1">Destination Seaport / Airport</label>
                <input
                  type="text"
                  placeholder="e.g. Jebel Ali Port, Port of Singapore, Colombo"
                  value={form.destinationPort}
                  onChange={(e) => setForm({ ...form, destinationPort: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xs border border-gray-300 text-sm focus:border-[#174A32] focus:ring-1 focus:ring-[#174A32] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#174A32] uppercase tracking-wider mb-1">Corporate Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="procurement@company.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xs border border-gray-300 text-sm focus:border-[#174A32] focus:ring-1 focus:ring-[#174A32] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#174A32] uppercase tracking-wider mb-1">Phone / WhatsApp (with Country Code) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +971 50 123 4567"
                  value={form.phoneWhatsapp}
                  onChange={(e) => setForm({ ...form, phoneWhatsapp: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xs border border-gray-300 text-sm focus:border-[#174A32] focus:ring-1 focus:ring-[#174A32] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#174A32] uppercase tracking-wider mb-1">Rice Variety Required *</label>
                <select
                  value={form.riceVariety}
                  onChange={(e) => setForm({ ...form, riceVariety: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xs border border-gray-300 text-sm focus:border-[#174A32] focus:ring-1 focus:ring-[#174A32] outline-none bg-white"
                >
                  <option value="LG Gold HMT Rice">LG Gold HMT Rice (Medium-Slender)</option>
                  <option value="LG Gold JSR Rice">LG Gold JSR Rice (Super-Fine Slender)</option>
                  <option value="LG Gold HMT & JSR Combined Load">Both HMT and JSR (Mixed FCL)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#174A32] uppercase tracking-wider mb-1">Required Quantity / Container Size *</label>
                <select
                  value={form.requiredQuantity}
                  onChange={(e) => setForm({ ...form, requiredQuantity: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xs border border-gray-300 text-sm focus:border-[#174A32] focus:ring-1 focus:ring-[#174A32] outline-none bg-white"
                >
                  <option value="1 x 20ft FCL (approx 26 MT)">1 x 20ft FCL Container (26 Metric Tons)</option>
                  <option value="2-5 x 20ft FCL Containers">2 to 5 Containers (50 - 130 MT)</option>
                  <option value="10+ Containers (Monthly Regular Contract)">10+ Containers (Annual Contract)</option>
                  <option value="Sample Pallet (Trial 1-2 Tons)">Trial Sample Pallet (1 - 2 Tons)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#174A32] uppercase tracking-wider mb-1">Packaging Specification</label>
                <select
                  value={form.packagingRequirement}
                  onChange={(e) => setForm({ ...form, packagingRequirement: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xs border border-gray-300 text-sm focus:border-[#174A32] focus:ring-1 focus:ring-[#174A32] outline-none bg-white"
                >
                  <option value="Standard 26kg Heavy-Duty Export PP Bags">Standard 26kg Heavy-Duty Woven PP Bags (1,000 Bags / 20ft FCL)</option>
                  <option value="26kg Laminated Export Bags with Inner Liner">26kg Laminated Export Bags with Moisture-Barrier Liner</option>
                  <option value="Custom Private Label 26kg Bags">Custom Private Label Printed 26kg Bags</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#174A32] uppercase tracking-wider mb-1">Additional Requirements / Notes</label>
                <textarea
                  rows={3}
                  placeholder="Target delivery dates, target price, incoterms (FOB / CIF / CFR), inspection agencies required..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xs border border-gray-300 text-sm focus:border-[#174A32] focus:ring-1 focus:ring-[#174A32] outline-none resize-none"
                />
              </div>

            </div>

            <div className="pt-4 border-t border-[#C9A227]/20 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-4 bg-[#174A32] text-white font-bold uppercase tracking-wider text-xs rounded-xs shadow-xs hover:bg-[#1a5a3d] transition-all flex items-center justify-center gap-2 border border-[#174A32] cursor-pointer"
              >
                <span>Request Export Quote</span>
                <ArrowRight className="w-4 h-4 text-[#C9A227]" />
              </button>

              <button
                type="button"
                onClick={handleWhatsAppInquiry}
                className="w-full sm:w-auto px-6 py-4 bg-[#25D366] text-white font-bold uppercase tracking-wider text-xs rounded-xs shadow-xs hover:bg-[#1ebd5a] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Instant Inquiry via WhatsApp</span>
              </button>
            </div>
          </form>
        </div>

      </div>

      <QuoteSuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        quoteType="Export"
        referenceId={refId}
        data={form}
      />

    </div>
  );
};
