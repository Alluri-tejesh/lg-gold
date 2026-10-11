import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Send,
  Building2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { BRAND_CONFIG, createWhatsAppUrl } from '../config/brandConfig';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

interface ContactViewProps {
  onNavigate: (route: string, param?: string) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onNavigate }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'Wholesale Orders',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      alert('Please provide your name and phone number.');
      return;
    }
    setIsSubmitted(true);
  };

  const handleDirectWhatsApp = () => {
    const msg = `Hi LG Gold Team, I am contacting you regarding ${form.inquiryType}. My name is ${form.name || 'a customer'}.`;
    window.open(createWhatsAppUrl(msg), '_blank');
  };

  return (
    <div className="bg-[#F3F4EC] min-h-screen pb-24">
      
      {/* Header Banner */}
      <div className="bg-[#0B3B2C] text-white py-10 sm:py-14 border-b-4 border-[#E0A21A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-4">
          <Breadcrumbs items={[{ label: 'Contact Us' }]} onNavigate={onNavigate} variant="dark" />
          
          <div className="max-w-3xl space-y-3">
            <span className="text-[10px] font-bold text-[#E0A21A]">
              Mill & Commercial Desk
            </span>
            <h1 className="font-serif-brand font-bold text-3xl sm:text-5xl text-white">
              Contact LG Gold
            </h1>
            <p className="text-sm sm:text-base text-[#F3F4EC]/85 leading-relaxed">
              Reach out to Sri Lakshmi Ganapathi Trading Company for retail inquiries, wholesale dealership, bulk godown deliveries, or international export shipments.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 space-y-12">
        
        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Location Box */}
          <div className="p-6 rounded-sm bg-white border-t-4 border-[#E0A21A] border-x border-b border-[#E0A21A]/20 shadow-clean space-y-3">
            <div className="w-10 h-10 rounded-xs bg-[#0B3B2C]/10 text-[#0B3B2C] flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-serif-brand font-bold text-lg text-[#0B3B2C]">Mill & Office Address</h3>
            <p className="text-xs text-[#15231C] leading-relaxed">
              <strong>{BRAND_CONFIG.parentCompany}</strong><br />
              {BRAND_CONFIG.location.address}, {BRAND_CONFIG.location.state}, {BRAND_CONFIG.location.country}<br />
              Plus Code: <strong className="text-[#E0A21A]">{BRAND_CONFIG.location.plusCode}</strong>
            </p>
            <a
              href={BRAND_CONFIG.location.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B3B2C] hover:text-[#E0A21A] transition-colors pt-1"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Direct Phone & WhatsApp */}
          <div className="p-6 rounded-sm bg-white border-t-4 border-[#E0A21A] border-x border-b border-[#E0A21A]/20 shadow-clean space-y-3">
            <div className="w-10 h-10 rounded-xs bg-[#0B3B2C]/10 text-[#0B3B2C] flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-serif-brand font-bold text-lg text-[#0B3B2C]">Phone & WhatsApp</h3>
            <div className="space-y-1 text-xs text-[#15231C]">
              <p>Direct Calling: <strong>{BRAND_CONFIG.contact.primaryPhone}</strong></p>
              <p>Email: <strong>{BRAND_CONFIG.contact.emailRetail}</strong></p>
            </div>
            <button
              onClick={handleDirectWhatsApp}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#128C7E] hover:underline pt-1 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Direct WhatsApp Desk</span>
            </button>
          </div>

          {/* Operating Hours */}
          <div className="p-6 rounded-sm bg-white border-t-4 border-[#E0A21A] border-x border-b border-[#E0A21A]/20 shadow-clean space-y-3">
            <div className="w-10 h-10 rounded-xs bg-[#0B3B2C]/10 text-[#0B3B2C] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-serif-brand font-bold text-lg text-[#0B3B2C]">Operating Hours</h3>
            <div className="space-y-1.5 text-xs text-[#15231C]">
              <div className="flex justify-between">
                <span className="text-[#4C6358]">Mill Dispatch Desk:</span>
                <span className="font-bold">Mon – Sat (8 AM – 8 PM)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4C6358]">Wholesale Office:</span>
                <span className="font-bold">Mon – Sat (9 AM – 7 PM)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4C6358]">Sunday Operations:</span>
                <span className="text-[#4C6358]">Online & WhatsApp only</span>
              </div>
            </div>
          </div>

        </div>

        {/* Contact Form & Map Simulation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Contact Form (6 Cols) */}
          <div className="lg:col-span-6 bg-white rounded-sm border-t-4 border-[#E0A21A] border-x border-b border-[#E0A21A]/20 p-6 sm:p-8 shadow-clean space-y-5">
            <div>
              <span className="text-[10px] font-bold text-[#E0A21A]">Direct Message</span>
              <h2 className="font-serif-brand font-bold text-2xl text-[#0B3B2C]">
                Send Us a Message
              </h2>
              <p className="text-xs text-[#4C6358] mt-0.5">
                We typically respond within 2-4 business hours.
              </p>
            </div>

            {isSubmitted ? (
              <div className="p-8 text-center bg-[#F3F4EC] rounded-xs border border-[#E0A21A]/30 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#0B3B2C] mx-auto" />
                <h3 className="font-serif-brand font-bold text-xl text-[#0B3B2C]">Thank you! Message Received</h3>
                <p className="text-xs text-[#4C6358]">
                  Our commercial team has received your query and will contact you promptly.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-4 py-2 bg-[#0B3B2C] text-white text-xs font-bold rounded-xs cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#0B3B2C] mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand Kumar"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xs border border-gray-300 text-sm focus:border-[#0B3B2C] focus:ring-1 focus:ring-[#0B3B2C] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0B3B2C] mb-1">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xs border border-gray-300 text-sm focus:border-[#0B3B2C] focus:ring-1 focus:ring-[#0B3B2C] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0B3B2C] mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="name@domain.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xs border border-gray-300 text-sm focus:border-[#0B3B2C] focus:ring-1 focus:ring-[#0B3B2C] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B3B2C] mb-1">Inquiry Purpose</label>
                  <select
                    value={form.inquiryType}
                    onChange={(e) => setForm({ ...form, inquiryType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xs border border-gray-300 text-sm focus:border-[#0B3B2C] focus:ring-1 focus:ring-[#0B3B2C] outline-none bg-white"
                  >
                    <option value="Retail Packs / Home Delivery">Retail Consumer Packs (5kg / 10kg)</option>
                    <option value="Wholesale Orders">Wholesale Rice (25kg / 50kg Bags)</option>
                    <option value="Export Enquiry">Export Container Loads (FOB / CIF)</option>
                    <option value="Catering & Institutional Supply">Catering & Restaurant Supply</option>
                    <option value="Distributorship Proposal">Distributor / Stockist Proposal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B3B2C] mb-1">Message</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your requirement..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xs border border-gray-300 text-sm focus:border-[#0B3B2C] focus:ring-1 focus:ring-[#0B3B2C] outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#0B3B2C] text-white font-bold text-xs rounded-xs hover:bg-[#14553F] transition-colors flex items-center justify-center gap-2 border border-[#0B3B2C] cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>

          {/* Interactive Map Visual (6 Cols) */}
          <div className="lg:col-span-6 bg-white rounded-sm border-t-4 border-[#E0A21A] border-x border-b border-[#E0A21A]/20 p-6 sm:p-8 shadow-clean space-y-4 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#E0A21A]">Location & Logistics Hub</span>
                <span className="text-[10px] font-bold text-[#0B3B2C] bg-[#F3F4EC] px-2 py-0.5 rounded-xs border border-[#E0A21A]/30">
                  Plus Code: VG3P+G6
                </span>
              </div>
              <h3 className="font-serif-brand font-bold text-xl text-[#0B3B2C]">
                Venkatadri Palem, Telangana, India
              </h3>
            </div>

            {/* Map Frame Card */}
            <div className="aspect-4/3 rounded-xs overflow-hidden bg-emerald-950 relative border border-[#E0A21A]/30">
              <iframe
                title="Sri Lakshmi Ganapathi Trading Company Location"
                src="https://maps.google.com/maps?q=Venkatadri%20Palem,%20Telangana,%20India&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>

            <div className="p-4 rounded-xs bg-[#F3F4EC] border border-[#E0A21A]/30 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-[#0B3B2C] block">Sri Lakshmi Ganapathi Trading Company</span>
                <span className="text-[#4C6358]">Venkatadri Palem, Telangana, India</span>
              </div>
              <a
                href={BRAND_CONFIG.location.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-[#0B3B2C] text-white rounded-xs font-bold text-[11px] hover:bg-[#14553F] transition-colors shrink-0"
              >
                Get Directions
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
