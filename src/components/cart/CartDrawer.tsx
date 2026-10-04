import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, MessageCircle, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface CartDrawerProps {
  onNavigate: (route: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    totalItems,
    totalAmount,
    totalSavings,
    getWhatsAppOrderUrl,
    setIsCheckoutOpen,
  } = useCart();

  if (!isCartOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 1500;
  const progressPercent = Math.min(100, (totalAmount / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - totalAmount);

  const handleWhatsAppCheckout = () => {
    const url = getWhatsAppOrderUrl();
    window.open(url, '_blank');
  };

  const handleOpenCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="w-full max-w-md bg-[#FFFFFF] h-full shadow-2xl flex flex-col justify-between border-l border-[#C9A227]/30">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#C9A227]/30 bg-[#F8F5EA] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xs bg-[#174A32] flex items-center justify-center text-[#C9A227]">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif-brand font-light text-lg text-[#174A32]">Your Rice Cart</h3>
              <p className="text-xs text-[#5F806D]">{totalItems} {totalItems === 1 ? 'pack' : 'packs'} selected</p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
            className="p-2 rounded-xs text-gray-500 hover:text-[#174A32] hover:bg-white/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="px-5 py-3 bg-[#174A32]/5 border-b border-[#C9A227]/20">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="flex items-center gap-1 text-[#174A32]">
              <Truck className="w-3.5 h-3.5 text-[#C9A227]" />
              {remainingForFreeShipping === 0 ? (
                <span className="text-[#174A32] font-bold">You unlocked FREE Doorstep Delivery!</span>
              ) : (
                <span>Add ₹{remainingForFreeShipping.toLocaleString('en-IN')} more for Free Delivery</span>
              )}
            </span>
            <span className="text-xs text-[#5F806D]">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full h-1 bg-gray-200 rounded-xs overflow-hidden">
            <div
              className="h-full bg-[#C9A227] transition-all duration-500 rounded-xs"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 bg-[#F8F5EA] rounded-full flex items-center justify-center mx-auto mb-4 text-[#5F806D] border border-[#C9A227]/30">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-serif-brand font-light text-lg text-[#174A32] mb-1">Your cart is empty</h4>
              <p className="text-xs text-[#5F806D] mb-6 max-w-xs mx-auto">
                Explore our aged HMT and JSR rice varieties packed with authentic South Indian flavor.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onNavigate('products');
                }}
                className="px-6 py-2.5 rounded-xs bg-[#174A32] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1a5a3d] transition-colors cursor-pointer"
              >
                Browse LG Gold Rice
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xs border-t-2 border-[#C9A227] border-x border-b border-[#C9A227]/20 bg-white hover:border-[#C9A227] shadow-xs transition-all flex gap-3"
              >
                <img
                  src={item.image}
                  alt={item.productName}
                  className="w-18 h-18 rounded-xs object-cover border border-gray-100 shrink-0"
                  referrerPolicy="no-referrer"
                />

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-sm text-[#174A32] truncate">
                        {item.productName}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#5F806D] bg-[#F8F5EA] px-2 py-0.5 rounded-xs mt-0.5 border border-[#C9A227]/20">
                      Pack: {item.packSize}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#C9A227]/20">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-[#202522]">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                      {item.mrp > item.price && (
                        <span className="text-[11px] text-gray-400 line-through">
                          ₹{(item.mrp * item.quantity).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center border border-gray-300 rounded-xs overflow-hidden bg-gray-50">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2 text-xs font-bold text-[#202522]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer & Checkout Actions */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#C9A227]/30 bg-[#F8F5EA] space-y-3">
            
            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#5F806D]">
                <span>Subtotal ({totalItems} items)</span>
                <span className="font-semibold text-[#202522]">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              {totalSavings > 0 && (
                <div className="flex justify-between text-[#174A32] font-semibold">
                  <span>Total Discount Savings</span>
                  <span>- ₹{totalSavings.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-[#5F806D]">
                <span>Doorstep Delivery</span>
                <span>{remainingForFreeShipping === 0 ? 'FREE' : '₹50'}</span>
              </div>
              <div className="pt-2 border-t border-[#C9A227]/30 flex justify-between items-baseline">
                <span className="font-serif-brand font-bold text-base text-[#174A32]">Total Amount</span>
                <span className="font-serif-brand font-bold text-xl text-[#174A32]">
                  ₹{(totalAmount + (remainingForFreeShipping === 0 ? 0 : 50)).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleOpenCheckout}
                className="w-full py-3 px-3 rounded-xs bg-[#174A32] text-white font-bold uppercase tracking-wider text-xs shadow-sm hover:bg-[#1a5a3d] transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#174A32] whitespace-nowrap"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-[#C9A227] shrink-0" />
              </button>

              <button
                onClick={handleWhatsAppCheckout}
                className="w-full py-2.5 px-3 rounded-xs bg-[#25D366] text-white font-bold uppercase tracking-wider text-xs shadow-xs hover:bg-[#1ebd5a] transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 fill-white shrink-0" />
                <span>Instant Order on WhatsApp</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] text-[#5F806D] pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>Direct Mill Packing & Quality Guaranteed</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
