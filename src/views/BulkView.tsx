import React, { useState } from 'react';
import {
  Truck,
  Boxes,
  ShieldCheck,
  Building2,
  FileCheck,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Phone,
} from 'lucide-react';
import { BRAND_CONFIG, createWhatsAppUrl } from '../config/brandConfig';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { QuoteSuccessModal } from '../components/common/QuoteSuccessModal';

interface BulkViewProps {
  onNavigate: (route: string, param?: string) => void;
}

export const BulkView: React.FC<BulkViewProps> = ({ onNavigate }) => {
  const [form, setForm] = useState({
    businessName: '',
    contactPerson: '',
    phone: '',
    location: '',
    tonnage: '10 Metric Tons (~385 Bags of 26kg)',
    variety: 'LG Gold HMT Rice',
    packaging: '26kg Heavy-Duty Woven PP Bags',
    notes: '',
  });

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [refId, setRefId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.businessName || !form.contactPerson || !form.phone) {
      alert('Please fill in required fields.');
      return;
    }
    setRefId(`BLK-${Math.floor(100000 + Math.random() * 900000)}`);
    setIsSuccessOpen(true);
  };

  const handleWhatsApp = () => {
    const msg = `*BULK RICE TRUCKLOAD INQUIRY - LG GOLD*\n` +
      `Business: ${form.businessName || 'Bulk Buyer'}\n` +
      `Tonnage: ${form.tonnage}\n` +
      `Variety: ${form.variety}\n` +
      `Location: ${form.location || 'India'}\n` +
      `Please provide mill gate rate for direct truck dispatch.`;
    window.open(createWhatsAppUrl(msg), '_blank');
  };

  return (
    <div className="bg-[#F8F5EA] min-h-screen pb-24">
      
      {/* Header Banner */}
      <div className="bg-[#174A32] text-white py-10 sm:py-14 border-b-4 border-[#C9A227]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-4">
          <Breadcrumbs items={[{ label: 'Bulk Rice Orders' }]} onNavigate={onNavigate} variant="dark" />
          
          <div className="max-w-3xl space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A227]">
              Commercial Tonnage & Institutional Logistics
            </span>
            <h1 className="font-serif-brand font-light text-3xl sm:text-5xl text-white">
              Bulk Rice Orders (Tons & Truckloads)
            </h1>
            <p className="text-sm sm:text-base text-[#F8F5EA]/85 leading-relaxed">
              Direct mill dispatch in standardized 26kg bags and multi-ton consignments from Sri Lakshmi Ganapathi Trading Company in Venkatadri Palem, Telangana.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 space-y-12">
        
        {/* Capability Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-sm bg-white border-t-4 border-[#C9A227] border-x border-b border-[#C9A227]/20 shadow-clean space-y-2">
            <Truck className="w-8 h-8 text-[#174A32] mb-2" />
            <h3 className="font-serif-brand font-bold text-lg text-[#174A32]">Full Truck Loads (FTL)</h3>
            <p className="text-xs text-[#5F806D] leading-relaxed">
              Direct lorry dispatches (10 MT to 26 MT) with certified weighbridge slips and tamper-evident tarpaulin strapping.
            </p>
          </div>

          <div className="p-6 rounded-sm bg-white border-t-4 border-[#C9A227] border-x border-b border-[#C9A227]/20 shadow-clean space-y-2">
            <Boxes className="w-8 h-8 text-[#174A32] mb-2" />
            <h3 className="font-serif-brand font-bold text-lg text-[#174A32]">Standard 26kg Mill Bags</h3>
            <p className="text-xs text-[#5F806D] leading-relaxed">
              Standardized moisture-barrier 26kg woven PP bags engineered for easy handling, stacking in godowns, and commercial kitchens.
            </p>
          </div>

          <div className="p-6 rounded-sm bg-white border-t-4 border-[#C9A227] border-x border-b border-[#C9A227]/20 shadow-clean space-y-2">
            <ShieldCheck className="w-8 h-8 text-[#174A32] mb-2" />
            <h3 className="font-serif-brand font-bold text-lg text-[#174A32]">Quality Batch Guarantee</h3>
            <p className="text-xs text-[#5F806D] leading-relaxed">
              Every truckload is 100% Sortex color-checked with consistent grain length, uniform polish, and strict moisture compliance (&lt;13%).
            </p>
          </div>
        </div>

        {/* Bulk Form */}
        <div className="bg-white rounded-sm border-t-4 border-[#C9A227] border-x border-b border-[#C9A227]/20 shadow-clean overflow-hidden max-w-3xl mx-auto">
          <div className="bg-[#174A32] text-white p-6 sm:p-8 border-b border-[#C9A227]/40">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A227]">Direct Dispatch Desk</span>
            <h3 className="font-serif-brand font-light text-2xl sm:text-3xl text-white">
              Bulk Tonnage Dispatch Form
            </h3>
            <p className="text-xs text-[#F8F5EA]/80 mt-1">
              Connect with our dispatch desk for spot mill rates and freight logistics.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#174A32] uppercase tracking-wider mb-1">Company / Organization *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hyderabad Mega Kitchens"
                  value={form.businessName}
                  onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xs border border-gray-300 text-sm focus:border-[#174A32] focus:ring-1 focus:ring-[#174A32] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#174A32] uppercase tracking-wider mb-1">Contact Person *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Reddy"
                  value={form.contactPerson}
                  onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xs border border-gray-300 text-sm focus:border-[#174A32] focus:ring-1 focus:ring-[#174A32] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#174A32] uppercase tracking-wider mb-1">Phone / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile number"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xs border border-gray-300 text-sm focus:border-[#174A32] focus:ring-1 focus:ring-[#174A32] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#174A32] uppercase tracking-wider mb-1">Delivery Destination Pin / City</label>
                <input
                  type="text"
                  placeholder="e.g. Gachibowli, Hyderabad"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xs border border-gray-300 text-sm focus:border-[#174A32] focus:ring-1 focus:ring-[#174A32] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#174A32] uppercase tracking-wider mb-1">Required Volume</label>
                <select
                  value={form.tonnage}
                  onChange={(e) => setForm({ ...form, tonnage: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xs border border-gray-300 text-sm focus:border-[#174A32] focus:ring-1 focus:ring-[#174A32] outline-none bg-white"
                >
                  <option value="5 to 10 Metric Tons">5 to 10 Metric Tons (Medium LCV)</option>
                  <option value="15 to 25 Metric Tons (Full 10-wheel Truck)">15 to 25 Metric Tons (Full Truck)</option>
                  <option value="50+ Metric Tons (Multiple Truckloads)">50+ Metric Tons (Weekly Supply)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#174A32] uppercase tracking-wider mb-1">Rice Variety</label>
                <select
                  value={form.variety}
                  onChange={(e) => setForm({ ...form, variety: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xs border border-gray-300 text-sm focus:border-[#174A32] focus:ring-1 focus:ring-[#174A32] outline-none bg-white"
                >
                  <option value="LG Gold HMT Rice">LG Gold HMT Rice</option>
                  <option value="LG Gold JSR Rice">LG Gold JSR Rice</option>
                  <option value="Both HMT & JSR Varieties">Both Varieties</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-[#C9A227]/20 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="px-6 py-3.5 bg-[#174A32] text-white font-bold uppercase tracking-wider text-xs rounded-xs hover:bg-[#1a5a3d] transition-colors border border-[#174A32] cursor-pointer"
              >
                Submit Bulk RFQ
              </button>
              <button
                type="button"
                onClick={handleWhatsApp}
                className="px-6 py-3.5 bg-[#25D366] text-white font-bold uppercase tracking-wider text-xs rounded-xs hover:bg-[#1ebd5a] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Chat with Mill Dispatch</span>
              </button>
            </div>
          </form>
        </div>

      </div>

      <QuoteSuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        quoteType="Bulk"
        referenceId={refId}
        data={form}
      />

    </div>
  );
};
