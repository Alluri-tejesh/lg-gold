import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Truck, MessageCircle, CreditCard, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { BRAND_CONFIG, createWhatsAppUrl } from '../../config/brandConfig';

export const CheckoutModal: React.FC = () => {
  const {
    cart,
    totalAmount,
    totalItems,
    isCheckoutOpen,
    setIsCheckoutOpen,
    clearCart,
    getWhatsAppOrderUrl,
  } = useCart();

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '',
    paymentMethod: 'upi', // upi, cod, whatsapp
    orderNotes: '',
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');

  if (!isCheckoutOpen) return null;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.address) {
      alert('Please fill in your name, phone number, and delivery address.');
      return;
    }

    const orderId = `LGG-${Math.floor(100000 + Math.random() * 900000)}`;
    setPlacedOrderId(orderId);
    setOrderPlaced(true);

    // If WhatsApp payment selected, open WhatsApp with populated delivery details
    if (form.paymentMethod === 'whatsapp') {
      const whatsappUrl = getWhatsAppOrderUrl({
        name: form.fullName,
        phone: form.phone,
        address: `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`,
      });
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 600);
    }
  };

  const handleClose = () => {
    if (orderPlaced) {
      clearCart();
    }
    setIsCheckoutOpen(false);
    setOrderPlaced(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#FFFFFF] w-full max-w-2xl rounded-sm shadow-clean border-t-4 border-[#C9A227] border-x border-b border-[#C9A227]/20 overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-5 border-b border-[#C9A227]/30 bg-[#F8F5EA] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xs bg-[#174A32] flex items-center justify-center text-[#C9A227]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-brand font-light text-xl text-[#174A32]">
                {orderPlaced ? 'Order Confirmed' : 'Doorstep Rice Delivery'}
              </h3>
              <p className="text-xs text-[#5F806D]">
                {orderPlaced ? `Reference: #${placedOrderId}` : 'Direct from Sri Lakshmi Ganapathi Trading Company'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xs text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {orderPlaced ? (
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-[#174A32]/10 text-[#174A32] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-[#174A32]" />
            </div>

            <div>
              <h4 className="font-serif-brand font-light text-2xl text-[#174A32] mb-1">
                Thank You, {form.fullName}!
              </h4>
              <p className="text-sm text-[#5F806D] max-w-md mx-auto">
                Your order <strong className="text-[#174A32]">#{placedOrderId}</strong> has been received by our mill dispatch desk. We will package your fresh rice and update you via SMS / WhatsApp.
              </p>
            </div>

            <div className="p-4 rounded-xs bg-[#F8F5EA] border border-[#C9A227]/30 text-left text-xs sm:text-sm space-y-2 max-w-md mx-auto">
              <div className="flex justify-between text-[#5F806D]">
                <span>Items:</span>
                <span className="font-bold text-[#202522]">{totalItems} Packs</span>
              </div>
              <div className="flex justify-between text-[#5F806D]">
                <span>Total Amount:</span>
                <span className="font-bold text-[#174A32]">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#5F806D]">
                <span>Delivery Address:</span>
                <span className="font-medium text-right text-[#202522]">{form.address}, {form.city}</span>
              </div>
              <div className="flex justify-between text-[#5F806D]">
                <span>Payment Mode:</span>
                <span className="font-bold uppercase tracking-wider text-[#C9A227]">{form.paymentMethod}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={() => {
                  const url = createWhatsAppUrl(`Hi LG Gold Team, I just placed order #${placedOrderId} for ₹${totalAmount.toLocaleString('en-IN')}. Please confirm dispatch timeline.`);
                  window.open(url, '_blank');
                }}
                className="px-6 py-2.5 rounded-xs bg-[#25D366] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs hover:bg-[#1ebd5a] cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Track on WhatsApp</span>
              </button>
              <button
                onClick={handleClose}
                className="px-6 py-2.5 rounded-xs bg-[#174A32] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1a5a3d] cursor-pointer border border-[#174A32]"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="p-5 sm:p-7 space-y-5">
            {/* Order Summary banner */}
            <div className="p-3 bg-[#F8F5EA] rounded-xs border border-[#C9A227]/30 flex items-center justify-between text-xs sm:text-sm">
              <div>
                <span className="text-[#5F806D]">Ordering: </span>
                <span className="font-bold text-[#174A32]">{totalItems} Rice Pack(s)</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#5F806D]">Payable: </span>
                <span className="font-serif-brand font-bold text-[#174A32] text-lg">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#174A32] uppercase tracking-wider mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xs border border-gray-300 text-sm focus:border-[#174A32] focus:ring-1 focus:ring-[#174A32] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#174A32] uppercase tracking-wider mb-1">Phone Number (WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile number"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xs border border-gray-300 text-sm focus:border-[#174A32] focus:ring-1 focus:ring-[#174A32] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#174A32] uppercase tracking-wider mb-1">Delivery Address *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="House/Flat No, Street, Landmark"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xs border border-gray-300 text-sm focus:border-[#174A32] focus:ring-1 focus:ring-[#174A32] outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#174A32] uppercase tracking-wider mb-1">City / District *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hyderabad / Suryapet"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xs border border-gray-300 text-sm focus:border-[#174A32] focus:ring-1 focus:ring-[#174A32] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#174A32] uppercase tracking-wider mb-1">PIN Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 508213"
                  value={form.pincode}
                  onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xs border border-gray-300 text-sm focus:border-[#174A32] focus:ring-1 focus:ring-[#174A32] outline-none"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold text-[#174A32] uppercase tracking-wider mb-2">Select Payment Method</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                
                <label
                  onClick={() => setForm({ ...form, paymentMethod: 'upi' })}
                  className={`p-3 rounded-xs border flex flex-col justify-between cursor-pointer transition-all ${
                    form.paymentMethod === 'upi'
                      ? 'border-[#174A32] bg-[#174A32]/5 text-[#174A32]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">UPI / GPay / PhonePe</span>
                    <input
                      type="radio"
                      name="payment"
                      checked={form.paymentMethod === 'upi'}
                      onChange={() => setForm({ ...form, paymentMethod: 'upi' })}
                      className="accent-[#174A32]"
                    />
                  </div>
                  <span className="text-[10px] text-[#5F806D] mt-1">Instant QR Code / VPA</span>
                </label>

                <label
                  onClick={() => setForm({ ...form, paymentMethod: 'cod' })}
                  className={`p-3 rounded-xs border flex flex-col justify-between cursor-pointer transition-all ${
                    form.paymentMethod === 'cod'
                      ? 'border-[#174A32] bg-[#174A32]/5 text-[#174A32]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">Cash on Delivery</span>
                    <input
                      type="radio"
                      name="payment"
                      checked={form.paymentMethod === 'cod'}
                      onChange={() => setForm({ ...form, paymentMethod: 'cod' })}
                      className="accent-[#174A32]"
                    />
                  </div>
                  <span className="text-[10px] text-[#5F806D] mt-1">Pay on bag handover</span>
                </label>

                <label
                  onClick={() => setForm({ ...form, paymentMethod: 'whatsapp' })}
                  className={`p-3 rounded-xs border flex flex-col justify-between cursor-pointer transition-all ${
                    form.paymentMethod === 'whatsapp'
                      ? 'border-[#25D366] bg-[#25D366]/10 text-[#128C7E]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs flex items-center gap-1">
                      <MessageCircle className="w-3 h-3 text-[#25D366]" />
                      WhatsApp Order
                    </span>
                    <input
                      type="radio"
                      name="payment"
                      checked={form.paymentMethod === 'whatsapp'}
                      onChange={() => setForm({ ...form, paymentMethod: 'whatsapp' })}
                      className="accent-[#25D366]"
                    />
                  </div>
                  <span className="text-[10px] text-[#5F806D] mt-1">Confirm with Mill Desk</span>
                </label>

              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3 border-t border-gray-100">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xs bg-[#174A32] text-white font-bold uppercase tracking-wider text-xs shadow-xs hover:bg-[#1a5a3d] transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#174A32]"
              >
                <span>Confirm Order (₹{totalAmount.toLocaleString('en-IN')})</span>
                <ArrowRight className="w-4 h-4 text-[#C9A227]" />
              </button>
              <div className="flex items-center justify-center gap-2 text-[11px] text-[#5F806D] mt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>100% Genuine LG Gold Rice • Sourced & Milled in Telangana</span>
              </div>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
