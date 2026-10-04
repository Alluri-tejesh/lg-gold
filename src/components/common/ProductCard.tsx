import React, { useState } from 'react';
import { ShoppingBag, ArrowRight, Star, Globe, Boxes, MessageCircle, Check } from 'lucide-react';
import { Product, PackSize } from '../../types';
import { useCart } from '../../context/CartContext';
import { getProductWhatsAppMessage, createWhatsAppUrl } from '../../config/brandConfig';

interface ProductCardProps {
  product: Product;
  onViewDetails: (slug: string) => void;
  onSelectExportQuote?: (productName: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails, onSelectExportQuote }) => {
  const { addToCart } = useCart();
  const [selectedPackSize, setSelectedPackSize] = useState<PackSize>(product.packOptions[0]?.size || '26kg Bag');
  const [isAdded, setIsAdded] = useState(false);

  const currentPack = product.packOptions.find(p => p.size === selectedPackSize) || product.packOptions[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedPackSize, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    const msg = getProductWhatsAppMessage(product.name, selectedPackSize);
    window.open(createWhatsAppUrl(msg), '_blank');
  };

  return (
    <div
      onClick={() => onViewDetails(product.slug)}
      className="bg-[#FFFFFF] border-t-4 border-[#C9A227] border-x border-b border-[#C9A227]/20 shadow-clean hover:border-[#C9A227] transition-all duration-200 flex flex-col justify-between overflow-hidden group cursor-pointer rounded-sm"
    >
      {/* Top Image Container */}
      <div className="relative aspect-4/3 bg-[#F8F5EA] overflow-hidden border-b border-[#C9A227]/20">
        <img
          src={product.images.primary}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />

        {/* Brand Stamp */}
        <div className="absolute top-3.5 left-3.5 bg-[#174A32] text-white px-2.5 py-0.5 border border-[#C9A227]/40 shadow-xs flex items-center gap-1.5 rounded-xs">
          <span className="font-serif-brand font-bold text-xs text-[#C9A227]">LG GOLD</span>
          <span className="text-[10px] text-[#E7D59A]">• {product.grainSpecs.aging}</span>
        </div>

        {/* Rating badge */}
        <div className="absolute top-3.5 right-3.5 bg-white text-[#202522] px-2 py-0.5 text-xs font-bold shadow-xs flex items-center gap-1 border border-gray-200 rounded-xs">
          <Star className="w-3.5 h-3.5 fill-[#C9A227] text-[#C9A227]" />
          <span>{product.rating}</span>
          <span className="text-gray-400 font-normal text-[10px]">({product.reviewCount})</span>
        </div>

        {/* Grain Spec Ribbon */}
        <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-3 pt-6 text-white flex items-center justify-between text-xs font-medium">
          <span className="truncate">{product.grainSpecs.grainLength}</span>
          <span className="text-[#E7D59A] text-[10px] uppercase tracking-widest font-bold">100% Sortex Clean</span>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Variety & Title */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#5F806D]">
              {product.grainSpecs.variety}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#174A32] bg-[#F8F5EA] px-2 py-0.5 border border-[#C9A227]/30">
              Standard 26kg Pack
            </span>
          </div>

          <h3 className="font-serif-brand font-light text-2xl text-[#174A32] group-hover:text-[#C9A227] transition-colors leading-tight">
            {product.name}
          </h3>

          <p className="text-xs sm:text-sm text-[#5F806D] mt-2 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Commercial Availability Badges */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#F8F5EA] text-[#174A32] border border-[#C9A227]/20 rounded-xs">
            ✓ 26kg Mill Bags
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#F8F5EA] text-[#174A32] border border-[#C9A227]/20 rounded-xs">
            <Boxes className="w-3 h-3 text-[#C9A227]" /> Wholesale Supply
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#F8F5EA] text-[#174A32] border border-[#C9A227]/20 rounded-xs">
            <Globe className="w-3 h-3 text-[#C9A227]" /> Export Ready
          </span>
        </div>

        {/* Pack Size Selector */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#174A32] mb-1.5 uppercase tracking-wider">
            <span className="text-[11px]">Choose Quantity / Pack:</span>
            <span className="text-[10px] text-[#5F806D] font-medium lowercase">{currentPack.packagingType}</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5" onClick={(e) => e.stopPropagation()}>
            {product.packOptions.map((pack) => {
              const isSelected = selectedPackSize === pack.size;
              return (
                <button
                  key={pack.size}
                  type="button"
                  onClick={() => setSelectedPackSize(pack.size)}
                  className={`py-2 px-1 text-xs font-bold rounded-xs border transition-all cursor-pointer text-center ${
                    isSelected
                      ? 'border-[#174A32] bg-[#174A32] text-white shadow-xs'
                      : 'border-gray-200 bg-[#F8F5EA]/60 text-gray-700 hover:border-[#C9A227]'
                  }`}
                >
                  <span className="block truncate">{pack.size}</span>
                  <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-[#E7D59A]' : 'text-gray-500'}`}>
                    ₹{pack.retailPrice}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-3 border-t border-[#C9A227]/20 flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#5F806D] font-bold block">Retail Price</span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif-brand font-bold text-2xl text-[#174A32]">
                  ₹{currentPack.retailPrice.toLocaleString('en-IN')}
                </span>
                {currentPack.mrp > currentPack.retailPrice && (
                  <span className="text-xs text-gray-400 line-through">
                    ₹{currentPack.mrp.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-[#5F806D] uppercase tracking-wider block font-bold">Mill Direct</span>
              <span className="text-[11px] font-bold text-[#174A32] bg-[#F8F5EA] px-2 py-0.5 border border-[#C9A227]/30 rounded-xs">
                In Stock
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="grid grid-cols-2 gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handleAddToCart}
              className={`w-full py-2.5 px-2 sm:px-3 rounded-xs font-bold uppercase tracking-wider text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer whitespace-nowrap ${
                isAdded
                  ? 'bg-[#226444] text-white'
                  : 'bg-[#174A32] text-white hover:bg-[#1a5a3d] border border-[#174A32]'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C9A227] shrink-0" />
                  <span className="truncate">Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C9A227] shrink-0" />
                  <span className="truncate">Add to Cart</span>
                </>
              )}
            </button>

            <button
              onClick={handleWhatsAppOrder}
              className="w-full py-2.5 px-2 sm:px-3 rounded-xs bg-[#25D366]/15 hover:bg-[#25D366] text-[#128C7E] hover:text-white font-bold uppercase tracking-wider text-[11px] sm:text-xs flex items-center justify-center gap-1.5 border border-[#25D366]/40 transition-all cursor-pointer whitespace-nowrap"
            >
              <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="truncate">WhatsApp</span>
            </button>
          </div>

          {/* Detail link */}
          <div className="flex items-center justify-between text-xs text-[#174A32] font-bold uppercase tracking-wider group-hover:text-[#C9A227] pt-1">
            <span>View Specifications</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
