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
      className="bg-[#FFFFFF] border-t-4 border-[#E0A21A] border-x border-b border-[#E0A21A]/20 shadow-clean hover:border-[#E0A21A] transition-all duration-200 flex flex-col justify-between overflow-hidden group cursor-pointer rounded-sm"
    >
      {/* Top Image Container */}
      <div className="relative aspect-4/3 bg-[#F3F4EC] overflow-hidden border-b border-[#E0A21A]/20">
        <img
          src={product.images.primary}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />

        {/* Brand Stamp */}
        <div className="absolute top-3.5 left-3.5 bg-[#0B3B2C] text-white px-2.5 py-0.5 border border-[#E0A21A]/40 shadow-xs flex items-center gap-1.5 rounded-xs">
          <span className="font-serif-brand font-bold text-xs text-[#E0A21A]">LG GOLD</span>
          <span className="text-[10px] text-[#F0D890]">• {product.grainSpecs.aging}</span>
        </div>

        {/* Rating badge */}
        <div className="absolute top-3.5 right-3.5 bg-white text-[#15231C] px-2 py-0.5 text-xs font-bold shadow-xs flex items-center gap-1 border border-gray-200 rounded-xs">
          <Star className="w-3.5 h-3.5 fill-[#E0A21A] text-[#E0A21A]" />
          <span>{product.rating}</span>
          <span className="text-gray-400 font-normal text-[10px]">({product.reviewCount})</span>
        </div>

        {/* Grain Spec Ribbon */}
        <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-3 pt-6 text-white flex items-center justify-between text-xs font-medium">
          <span className="truncate">{product.grainSpecs.grainLength}</span>
          <span className="text-[#F0D890] text-[10px] font-bold">100% Sortex Clean</span>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Variety & Title */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-bold text-[#4C6358]">
              {product.grainSpecs.variety}
            </span>
            <span className="text-[10px] font-bold text-[#0B3B2C] bg-[#F3F4EC] px-2 py-0.5 border border-[#E0A21A]/30">
              Standard 26kg Pack
            </span>
          </div>

          <h3 className="font-serif-brand font-bold text-2xl text-[#0B3B2C] group-hover:text-[#E0A21A] transition-colors leading-tight">
            {product.name}
          </h3>

          <p className="text-xs sm:text-sm text-[#4C6358] mt-2 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Commercial Availability Badges */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-[#F3F4EC] text-[#0B3B2C] border border-[#E0A21A]/20 rounded-xs">
            ✓ 26kg Mill Bags
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-[#F3F4EC] text-[#0B3B2C] border border-[#E0A21A]/20 rounded-xs">
            <Boxes className="w-3 h-3 text-[#E0A21A]" /> Wholesale Supply
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-[#F3F4EC] text-[#0B3B2C] border border-[#E0A21A]/20 rounded-xs">
            <Globe className="w-3 h-3 text-[#E0A21A]" /> Export Ready
          </span>
        </div>

        {/* Pack Size Selector */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#0B3B2C] mb-1.5">
            <span className="text-[11px]">Choose Quantity / Pack:</span>
            <span className="text-[10px] text-[#4C6358] font-medium lowercase">{currentPack.packagingType}</span>
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
                      ? 'border-[#0B3B2C] bg-[#0B3B2C] text-white shadow-xs'
                      : 'border-gray-200 bg-[#F3F4EC]/60 text-gray-700 hover:border-[#E0A21A]'
                  }`}
                >
                  <span className="block truncate">{pack.size}</span>
                  <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-[#F0D890]' : 'text-gray-500'}`}>
                    ₹{pack.retailPrice}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-3 border-t border-[#E0A21A]/20 flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[10px] text-[#4C6358] font-bold block">Retail Price</span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif-brand font-bold text-2xl text-[#0B3B2C]">
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
              <span className="text-[10px] text-[#4C6358] block font-bold">Mill Direct</span>
              <span className="text-[11px] font-bold text-[#0B3B2C] bg-[#F3F4EC] px-2 py-0.5 border border-[#E0A21A]/30 rounded-xs">
                In Stock
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="grid grid-cols-2 gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handleAddToCart}
              className={`w-full py-2.5 px-2 sm:px-3 rounded-xs font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer whitespace-nowrap ${
                isAdded
                  ? 'bg-[#14553F] text-white'
                  : 'bg-[#0B3B2C] text-white hover:bg-[#14553F] border border-[#0B3B2C]'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E0A21A] shrink-0" />
                  <span className="truncate">Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E0A21A] shrink-0" />
                  <span className="truncate">Add to Cart</span>
                </>
              )}
            </button>

            <button
              onClick={handleWhatsAppOrder}
              className="w-full py-2.5 px-2 sm:px-3 rounded-xs bg-[#25D366]/15 hover:bg-[#25D366] text-[#128C7E] hover:text-white font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 border border-[#25D366]/40 transition-all cursor-pointer whitespace-nowrap"
            >
              <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="truncate">WhatsApp</span>
            </button>
          </div>

          {/* Detail link */}
          <div className="flex items-center justify-between text-xs text-[#0B3B2C] font-bold group-hover:text-[#E0A21A] pt-1">
            <span>View Specifications</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
