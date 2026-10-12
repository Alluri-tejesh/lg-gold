import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Truck, MessageCircle, Info } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { priceInfo, formatPriceDate } from '../../data/prices';

const inputClass =
  'w-full px-3.5 py-2.5 rounded-xs border border-gray-300 text-sm focus:border-[#174A32] focus:ring-1 focus:ring-[#174A32] outline-none';

/** Orders are placed on WhatsApp only: no payment is taken on the site. The mill confirms today's rate there. */
export const CheckoutModal: React.FC = () => {
  const { cart, totalAmount, totalItems, isCheckoutOpen, setIsCheckoutOpen, clearCart, getWhatsAppOrderUrl } = useCart();

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '',
  });
  const [sent, setSent] = useState(false);

  if (!isCheckoutOpen) return null;

  const asOf = formatPriceDate(priceInfo.updated);

  const buildUrl = () =>
    getWhatsAppOrderUrl({
      name: form.fullName,
      phone: form.phone,
      address: `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`,
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    // Open WhatsApp straight from the click so the browser does not block it as a pop-up.
    window.open(buildUrl(), '_blank', 'noopener,noreferrer');
    setSent(true);
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setSent(false);
  };

  const handleDone = () => {
    clearCart();
    handleClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="Order on WhatsApp"
    >
      <div className="bg-[#FFFFFF] w-full max-w-2xl rounded-sm shadow-clean border-t-4 border-[#C9A227] border-x border-b border-[#C9A227]/20 overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 border-b border-[#C9A227]/30 bg-[#F8F5EA] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xs bg-[#174A32] flex items-center justify-center text-[#C9A227]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-brand font-medium text-xl text-[#174A32]">
                {sent ? 'Send your order on WhatsApp' : 'Order on WhatsApp'}
              </h3>
              <p className="text-sm text-[#5F806D]">Direct from Sri Lakshmi Ganapathi Trading Company</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="p-2 rounded-xs text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {sent ? (
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-[#25D366]/15 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-[#128C7E]" />
            </div>
            <div>
              <h4 className="font-serif-brand font-medium text-2xl text-[#174A32] mb-2">Your order message is ready</h4>
              <p className="text-[#5F806D] max-w-md mx-auto leading-relaxed">
                WhatsApp has opened with your order filled in. Press Send there. The mill will reply to confirm today&apos;s
                rate, delivery charges and dispatch time.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={() => window.open(buildUrl(), '_blank', 'noopener,noreferrer')}
                className="px-6 py-3 rounded-xs bg-[#25D366] text-white font-semibold flex items-center justify-center gap-2 hover:bg-[#1ebd5a] cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                Open WhatsApp again
              </button>
              <button
                onClick={handleDone}
                className="px-6 py-3 rounded-xs bg-[#174A32] text-white font-semibold hover:bg-[#226444] cursor-pointer"
              >
                I have sent it
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-5">
            {/* Summary */}
            <div className="p-3.5 bg-[#F8F5EA] rounded-xs border border-[#C9A227]/30 flex items-center justify-between">
              <div>
                <span className="text-[#5F806D]">Ordering: </span>
                <span className="font-bold text-[#174A32]">{totalItems} bag pack(s)</span>
              </div>
              <div className="text-right">
                <span className="text-sm text-[#5F806D]">Estimated total: </span>
                <span className="font-serif-brand font-bold text-[#174A32] text-lg">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <p className="flex items-start gap-2 text-sm text-[#4C6358] leading-relaxed">
              <Info className="w-4 h-4 mt-0.5 shrink-0 text-[#C9A227]" aria-hidden="true" />
              <span>
                Rice rates change daily{asOf ? `, and these prices are as of ${asOf}` : ''}. The mill confirms the final rate and
                delivery charges on WhatsApp before dispatch. No payment is taken on this website.
              </span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="co-name" className="block text-sm font-semibold text-[#174A32] mb-1">Full name *</label>
                <input
                  id="co-name"
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="co-phone" className="block text-sm font-semibold text-[#174A32] mb-1">Phone number (WhatsApp) *</label>
                <input
                  id="co-phone"
                  type="tel"
                  required
                  inputMode="numeric"
                  pattern="[0-9+ ]{10,14}"
                  placeholder="10-digit mobile number"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="co-address" className="block text-sm font-semibold text-[#174A32] mb-1">Delivery address *</label>
                <textarea
                  id="co-address"
                  required
                  rows={2}
                  placeholder="House or flat no, street, landmark"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div>
                <label htmlFor="co-city" className="block text-sm font-semibold text-[#174A32] mb-1">City or district *</label>
                <input
                  id="co-city"
                  type="text"
                  required
                  placeholder="e.g. Hyderabad or Suryapet"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="co-pin" className="block text-sm font-semibold text-[#174A32] mb-1">PIN code *</label>
                <input
                  id="co-pin"
                  type="text"
                  required
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  placeholder="e.g. 508213"
                  value={form.pincode}
                  onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xs bg-[#25D366] text-white font-bold shadow-xs hover:bg-[#1ebd5a] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Send order on WhatsApp</span>
              </button>
              <div className="flex items-center justify-center gap-2 text-sm text-[#5F806D] mt-3">
                <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
                <span>100% genuine LG Gold rice, milled in Telangana</span>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
