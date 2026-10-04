import React, { useState } from 'react';
import {
  Boxes,
  Truck,
  Store,
  ChefHat,
  Building2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
  Calculator,
} from 'lucide-react';
import { WholesaleEnquiryForm } from '../types';
import { BRAND_CONFIG, createWhatsAppUrl } from '../config/brandConfig';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { QuoteSuccessModal } from '../components/common/QuoteSuccessModal';

interface WholesaleViewProps {
  onNavigate: (route: string, param?: string) => void;
}

export const WholesaleView: React.FC<WholesaleViewProps> = ({ onNavigate }) => {
  const [form, setForm] = useState<WholesaleEnquiryForm>({
    businessName: '',
    contactPerson: '',
    businessType: 'Supermarket',
    cityState: '',
    phoneWhatsapp: '',
    email: '',
    riceVariety: 'LG Gold HMT Rice',
    monthlyRequirement: '25 to 50 Quintals (2.5 - 5 Tons)',
    message: '',
  });

  const [calcVariety, setCalcVariety] = useState<'hmt' | 'jsr'>('hmt');
  const [calcBags, setCalcBags] = useState(40); // 40 x 26kg = 1,040 kg (~1 Ton)

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [refId, setRefId] = useState('');

  // Wholesale estimated calculation based on 26kg standard bag
  const baseWholesalePricePerKg = calcVariety === 'hmt' ? 58 : 64;
  const bagWeight = 26;
  const totalWeightKg = calcBags * bagWeight;
  const estimatedCost = totalWeightKg * baseWholesalePricePerKg;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.businessName || !form.contactPerson || !form.phoneWhatsapp) {
      alert('Please fill in your business name, contact person, and phone number.');
      return;
    }

    const generatedId = `WHL-${Math.floor(100000 + Math.random() * 900000)}`;
    setRefId(generatedId);
    setIsSuccessOpen(true);
  };

  const handleWhatsAppQuote = () => {
    const msg = `*WHOLESALE RICE INQUIRY - LG GOLD*\n` +
      `Business: ${form.businessName || 'Wholesale Partner'}\n` +
      `Type: ${form.businessType}\n` +
      `Location: ${form.cityState || 'Telangana / Pan-India'}\n` +
      `Requirement: ${form.riceVariety} - ${form.monthlyRequirement}\n` +
      `Please share current trade price list.`;
    window.open(createWhatsAppUrl(msg), '_blank');
  };

  return (
    <div className="bg-[#F8F5EA] min-h-screen pb-24">
      
      {/* Header Banner */}
      <div className="bg-[#174A32] text-white py-10 sm:py-14 border-b-4 border-[#C9A227]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-4">
          <Breadcrumbs items={[{ label: 'Wholesale Supplier' }]} onNavigate={onNavigate} variant="dark" />
          
          <div className="max-w-3xl space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A227]">
              B2B Merchant & Institutional Channel
            </span>
            <h1 className="font-serif-brand font-light text-3xl sm:text-5xl text-white">
              Wholesale Rice Supplier
            </h1>
            <p className="text-sm sm:text-base text-[#F8F5EA]/85 leading-relaxed">
              Direct mill supply of aged LG Gold HMT and JSR rice for retailers, distributors, supermarkets, hotels, restaurants, caterers, and institutions across India.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 space-y-14">
        
        {/* Interactive Wholesale Estimator & Calculator */}
        <div className="bg-white rounded-sm border-t-4 border-[#C9A227] border-x border-b border-[#C9A227]/20 p-6 sm:p-8 shadow-clean space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#C9A227]/20 pb-4">
            <div>
              <div className="flex items-center gap-2 text-[#C9A227] text-xs font-bold uppercase tracking-wider">
                <Calculator className="w-4 h-4" />
                <span>B2B Commercial Estimator</span>
              </div>
              <h2 className="font-serif-brand font-light text-2xl text-[#174A32] mt-0.5">
                Calculate Approximate Wholesale Order
              </h2>
            </div>
            <span className="text-xs text-[#5F806D]">
              *Taxes & transport freight calculated based on destination pin code
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              
              {/* Variety Select */}
              <div>
                <label className="block text-xs font-bold text-[#174A32] uppercase tracking-wider mb-1.5">1. Select Variety</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCalcVariety('hmt')}
                    className={`p-3.5 rounded-xs border text-left transition-all cursor-pointer ${
                      calcVariety === 'hmt'
                        ? 'border-[#174A32] bg-[#F8F5EA] text-[#174A32] ring-1 ring-[#174A32]'
                        : 'border-gray-200 bg-white hover:border-[#C9A227]'
                    }`}
                  >
                    <span className="font-bold text-sm text-[#174A32] block">LG Gold HMT Rice</span>
                    <span className="text-xs text-[#5F806D]">Medium-Slender Aged Grain</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCalcVariety('jsr')}
                    className={`p-3.5 rounded-xs border text-left transition-all cursor-pointer ${
                      calcVariety === 'jsr'
                        ? 'border-[#174A32] bg-[#F8F5EA] text-[#174A32] ring-1 ring-[#174A32]'
                        : 'border-gray-200 bg-white hover:border-[#C9A227]'
                    }`}
                  >
                    <span className="font-bold text-sm text-[#174A32] block">LG Gold JSR Rice</span>
                    <span className="text-xs text-[#5F806D]">Super-Fine Table Rice</span>
                  </button>
                </div>
              </div>

              {/* Standard Packaging Spec */}
              <div>
                <label className="block text-xs font-bold text-[#174A32] uppercase tracking-wider mb-1.5">2. Standard Packaging Unit</label>
                <div className="p-3 bg-[#F8F5EA] border border-[#C9A227]/40 rounded-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-[#174A32] block">Standard 26kg Heavy-Duty Woven PP Bag</span>
                    <span className="text-[11px] text-[#5F806D]">Tamper-evident machine stitched, 100% Sortex clean rice</span>
                  </div>
                  <span className="text-xs font-bold bg-[#174A32] text-white px-2.5 py-1 rounded-xs">
                    26 KG / Bag
                  </span>
                </div>
              </div>

              {/* Bag Quantity Stepper & Quick Presets */}
              <div>
                <div className="flex justify-between text-xs font-bold text-[#174A32] uppercase tracking-wider mb-1.5">
                  <span>3. Number of 26kg Bags:</span>
                  <span className="text-[#174A32]">{calcBags} Bags ({totalWeightKg.toLocaleString('en-IN')} kg / {(totalWeightKg / 1000).toFixed(2)} MT)</span>
                </div>
                
                {/* Quick Presets */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  {[
                    { label: '5 Bags (130kg)', val: 5 },
                    { label: '10 Bags (260kg)', val: 10 },
                    { label: '40 Bags (~1 MT)', val: 40 },
                    { label: '100 Bags (2.6 MT)', val: 100 },
                  ].map((preset) => (
                    <button
                      key={preset.val}
                      type="button"
                      onClick={() => setCalcBags(preset.val)}
                      className={`py-2 px-2 text-[10px] sm:text-[11px] font-bold rounded-xs border transition-all cursor-pointer whitespace-nowrap text-center ${
                        calcBags === preset.val
                          ? 'bg-[#174A32] text-white border-[#174A32]'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-[#C9A227]'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <input
                  type="range"
                  min="5"
                  max="200"
                  step="5"
                  value={calcBags}
                  onChange={(e) => setCalcBags(Number(e.target.value))}
                  className="w-full accent-[#174A32]"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1 uppercase font-bold">
                  <span>5 Bags (Min)</span>
                  <span>40 Bags (LCV)</span>
                  <span>100 Bags</span>
                  <span>200 Bags (Full Truck)</span>
                </div>
              </div>

            </div>

            {/* Estimated Output Card */}
            <div className="lg:col-span-5 bg-[#F8F5EA] rounded-xs p-6 border border-[#C9A227]/30 space-y-4 text-xs sm:text-sm">
              <span className="font-serif-brand font-light text-xl text-[#174A32] block">
                Estimated Trade Valuation
              </span>

              <div className="space-y-2 text-[#202522]">
                <div className="flex justify-between">
                  <span className="text-[#5F806D]">Total Volume:</span>
                  <span className="font-bold text-[#174A32]">{totalWeightKg.toLocaleString('en-IN')} kg ({calcBags} bags)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5F806D]">Est. Mill Rate / kg:</span>
                  <span className="font-bold">₹{baseWholesalePricePerKg}/kg approx</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5F806D]">Dispatched From:</span>
                  <span className="font-medium">Venkatadri Palem, Telangana</span>
                </div>
                <div className="pt-3 border-t border-[#C9A227]/30 flex justify-between items-baseline">
                  <span className="font-bold text-sm uppercase tracking-wider text-[#174A32]">Est. Value:</span>
                  <span className="font-serif-brand font-bold text-2xl text-[#174A32]">
                    ₹{estimatedCost.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                onClick={handleWhatsAppQuote}
                className="w-full py-3 bg-[#25D366] text-white rounded-xs font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:bg-[#1ebd5a] transition-colors cursor-pointer shadow-xs"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Confirm Live Trade Price</span>
              </button>
            </div>
          </div>
        </div>

        {/* Wholesale Form Section */}
        <div className="bg-white rounded-sm border-t-4 border-[#C9A227] border-x border-b border-[#C9A227]/20 shadow-clean overflow-hidden max-w-4xl mx-auto">
          <div className="bg-[#174A32] text-white p-6 sm:p-8 border-b border-[#C9A227]/40">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A227]">Direct RFQ</span>
            <h3 className="font-serif-brand font-light text-2xl sm:text-3xl text-white">
              Request Official Wholesale Quotation
            </h3>
            <p className="text-xs text-[#F8F5EA]/80 mt-1">
              For recurring supply agreements, supermarket placement, or catering inquiries.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#174A32] uppercase tracking-wider mb-1">Business / Firm Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Swagath Grand Caterers / More Supermarket"
                  value={form.businessName}
                  onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xs border border-gray-300 text-sm focus:border-[#174A32] focus:ring-1 focus:ring-[#174A32] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#174A32] uppercase tracking-wider mb-1">Contact Person *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. K. Srinivas"
                  value={form.contactPerson}
                  onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xs border border-gray-300 text-sm focus:border-[#174A32] focus:ring-1 focus:ring-[#174A32] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#174A32] uppercase tracking-wider mb-1">Business Type</label>
                <select
                  value={form.businessType}
                  onChange={(e) => setForm({ ...form, businessType: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xs border border-gray-300 text-sm focus:border-[#174A32] focus:ring-1 focus:ring-[#174A32] outline-none bg-white"
                >
                  <option value="Supermarket">Supermarket / Grocery Retail Chain</option>
                  <option value="Retailer">Independent Kirana / Retailer</option>
                  <option value="Distributor">Regional Stockist / Distributor</option>
                  <option value="Hotel / Restaurant">Hotel / Restaurant / Cloud Kitchen</option>
                  <option value="Catering">Wedding & Event Catering</option>
                  <option value="Institutional Buyer">Hostel / Corporate Canteen</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#174A32] uppercase tracking-wider mb-1">City & State *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hyderabad, Telangana / Bengaluru, Karnataka"
                  value={form.cityState}
                  onChange={(e) => setForm({ ...form, cityState: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xs border border-gray-300 text-sm focus:border-[#174A32] focus:ring-1 focus:ring-[#174A32] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#174A32] uppercase tracking-wider mb-1">Phone / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 98490 12345"
                  value={form.phoneWhatsapp}
                  onChange={(e) => setForm({ ...form, phoneWhatsapp: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xs border border-gray-300 text-sm focus:border-[#174A32] focus:ring-1 focus:ring-[#174A32] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#174A32] uppercase tracking-wider mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="purchase@business.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xs border border-gray-300 text-sm focus:border-[#174A32] focus:ring-1 focus:ring-[#174A32] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#174A32] uppercase tracking-wider mb-1">Preferred Variety</label>
                <select
                  value={form.riceVariety}
                  onChange={(e) => setForm({ ...form, riceVariety: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xs border border-gray-300 text-sm focus:border-[#174A32] focus:ring-1 focus:ring-[#174A32] outline-none bg-white"
                >
                  <option value="LG Gold HMT Rice">LG Gold HMT Rice</option>
                  <option value="LG Gold JSR Rice">LG Gold JSR Rice</option>
                  <option value="Both HMT & JSR Varieties">Both HMT and JSR Varieties</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#174A32] uppercase tracking-wider mb-1">Monthly Requirement</label>
                <select
                  value={form.monthlyRequirement}
                  onChange={(e) => setForm({ ...form, monthlyRequirement: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xs border border-gray-300 text-sm focus:border-[#174A32] focus:ring-1 focus:ring-[#174A32] outline-none bg-white"
                >
                  <option value="500kg to 1 Ton (Trial Order)">500kg to 1 Ton (Trial Order)</option>
                  <option value="1 to 5 Tons (Regular Supermarket / Catering)">1 to 5 Tons per month</option>
                  <option value="5 to 20 Tons (Distributor / Chain)">5 to 20 Tons per month</option>
                  <option value="20+ Tons (Truckloads)">20+ Tons (Truckload contract)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#174A32] uppercase tracking-wider mb-1">Message / Special Instructions</label>
                <textarea
                  rows={2}
                  placeholder="Need sample pouches, specific packaging, or payment credit terms?"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xs border border-gray-300 text-sm focus:border-[#174A32] focus:ring-1 focus:ring-[#174A32] outline-none resize-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#C9A227]/20 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="px-8 py-3.5 bg-[#174A32] text-white font-bold uppercase tracking-wider text-xs rounded-xs hover:bg-[#1a5a3d] transition-colors flex items-center justify-center gap-2 border border-[#174A32] cursor-pointer"
              >
                <span>Request Wholesale Quote</span>
                <ArrowRight className="w-4 h-4 text-[#C9A227]" />
              </button>
              <button
                type="button"
                onClick={handleWhatsAppQuote}
                className="px-6 py-3.5 bg-[#25D366] text-white font-bold uppercase tracking-wider text-xs rounded-xs hover:bg-[#1ebd5a] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Instant WhatsApp Quote</span>
              </button>
            </div>
          </form>
        </div>

      </div>

      <QuoteSuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        quoteType="Wholesale"
        referenceId={refId}
        data={form}
      />

    </div>
  );
};
