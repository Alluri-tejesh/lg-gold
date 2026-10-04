import React, { useState } from 'react';
import {
  ShoppingBag,
  Star,
  ShieldCheck,
  Globe,
  Boxes,
  Truck,
  MessageCircle,
  Clock,
  Flame,
  CheckCircle2,
  Share2,
  ArrowRight,
  Sparkles,
  Utensils,
  ChevronRight,
  BookOpen,
  Wheat,
  Award,
} from 'lucide-react';
import { Product, PackSize } from '../types';
import { PRODUCTS, getProductBySlug } from '../data/products';
import { RECIPES } from '../data/recipes';
import { useCart } from '../../src/context/CartContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { RecipeCard } from '../components/common/RecipeCard';
import { GrainComparison } from '../components/common/GrainComparison';
import { getProductWhatsAppMessage, createWhatsAppUrl } from '../config/brandConfig';

interface ProductDetailViewProps {
  productSlug: string;
  onNavigate: (route: string, param?: string) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ productSlug, onNavigate }) => {
  const product = getProductBySlug(productSlug) || PRODUCTS[0];
  const { addToCart, setIsCheckoutOpen } = useCart();

  const [selectedPackSize, setSelectedPackSize] = useState<PackSize>(product.packOptions[0]?.size || '26kg Bag');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'specs' | 'cooking' | 'nutrition' | 'commercial'>('specs');
  const [isCopied, setIsCopied] = useState(false);

  const currentPack = product.packOptions.find(p => p.size === selectedPackSize) || product.packOptions[0];

  // Linked recipes made with this rice
  const linkedRecipes = RECIPES.filter(r => r.recommendedProductId === product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedPackSize, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedPackSize, quantity);
    setIsCheckoutOpen(true);
  };

  const handleWhatsAppOrder = () => {
    const msg = getProductWhatsAppMessage(product.name, `${quantity}x ${selectedPackSize}`);
    window.open(createWhatsAppUrl(msg), '_blank');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="bg-[#F8F5EA] min-h-screen pb-24">
      
      {/* Breadcrumb Nav */}
      <div className="bg-white/80 backdrop-blur-xs border-b border-[#C9A227]/20 py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <Breadcrumbs
            items={[
              { label: 'Products', route: 'products' },
              { label: product.name }
            ]}
            onNavigate={onNavigate}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-12">
        
        {/* Main Product Hero / Purchase Section */}
        <div className="bg-white border-t-4 border-[#C9A227] border-x border-b border-[#C9A227]/20 p-6 sm:p-10 shadow-clean rounded-sm grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* Left Column: Image Gallery (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Primary Large Image */}
            <div className="relative aspect-4/3 overflow-hidden bg-[#F8F5EA] border border-[#C9A227]/20 rounded-xs">
              <img
                src={product.images.gallery[activeImageIndex] || product.images.primary}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />

              <div className="absolute top-4 left-4 bg-[#174A32] text-white px-2.5 py-0.5 text-xs font-bold border border-[#C9A227]/50 shadow-xs rounded-xs">
                <span className="text-[#C9A227] font-serif-brand">LG GOLD</span> • {product.grainSpecs.aging}
              </div>

              <div className="absolute bottom-0 inset-x-0 bg-black/80 text-white px-3 py-2 text-xs flex items-center justify-between">
                <span>100% Sortex Optical Checked</span>
                <span className="text-[#E7D59A] font-bold uppercase tracking-wider text-[10px]">Grade A Quality</span>
              </div>
            </div>

            {/* Thumbnail Row */}
            <div className="grid grid-cols-4 gap-3">
              {product.images.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`aspect-square overflow-hidden border-2 transition-all cursor-pointer rounded-xs ${
                    activeImageIndex === idx
                      ? 'border-[#174A32] ring-2 ring-[#C9A227]'
                      : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>

            {/* Commercial Verification Badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-3">
              <div className="bg-[#F8F5EA]/80 border border-[#C9A227]/30 p-2.5 sm:p-3 rounded-xs text-center shadow-2xs flex flex-col items-center justify-center">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#174A32]/10 text-[#174A32] flex items-center justify-center mb-1.5 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="font-bold text-[11px] sm:text-xs text-[#174A32] leading-tight block whitespace-nowrap">
                  &lt; 13% Moisture
                </span>
                <span className="text-[9px] sm:text-[10px] text-[#5F806D] font-medium uppercase tracking-wider block mt-0.5 whitespace-nowrap">
                  Export Standard
                </span>
              </div>

              <div className="bg-[#F8F5EA]/80 border border-[#C9A227]/30 p-2.5 sm:p-3 rounded-xs text-center shadow-2xs flex flex-col items-center justify-center">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#C9A227]/20 text-[#916E14] flex items-center justify-center mb-1.5 shrink-0">
                  <Truck className="w-4 h-4 text-[#C9A227]" />
                </div>
                <span className="font-bold text-[11px] sm:text-xs text-[#174A32] leading-tight block whitespace-nowrap">
                  Direct Mill-Fresh
                </span>
                <span className="text-[9px] sm:text-[10px] text-[#5F806D] font-medium uppercase tracking-wider block mt-0.5 whitespace-nowrap">
                  Telangana Origin
                </span>
              </div>

              <div className="bg-[#F8F5EA]/80 border border-[#C9A227]/30 p-2.5 sm:p-3 rounded-xs text-center shadow-2xs flex flex-col items-center justify-center">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#174A32]/10 text-[#174A32] flex items-center justify-center mb-1.5 shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <span className="font-bold text-[11px] sm:text-xs text-[#174A32] leading-tight block whitespace-nowrap">
                  Export Ready
                </span>
                <span className="text-[9px] sm:text-[10px] text-[#5F806D] font-medium uppercase tracking-wider block mt-0.5 whitespace-nowrap">
                  FOB &amp; CIF Orders
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Ordering (6 Cols) */}
          <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
            
            <div className="space-y-4">
              {/* Top Meta Bar: Origin/Sortex Badge + Rating + Share */}
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#174A32] bg-[#F8F5EA] px-2.5 py-1 border border-[#C9A227]/30 rounded-xs whitespace-nowrap">
                    <Wheat className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                    <span>100% Sortex Cleaned • Aged 12+ M</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1 text-xs font-bold text-[#174A32] bg-[#F8F5EA] px-2.5 py-1 border border-[#C9A227]/20 rounded-xs whitespace-nowrap">
                    <Star className="w-3.5 h-3.5 fill-[#C9A227] text-[#C9A227]" />
                    <span>{product.rating}</span>
                    <span className="text-gray-400 font-normal">({product.reviewCount})</span>
                  </div>
                  <button
                    onClick={handleShare}
                    aria-label="Share product"
                    title="Share Product"
                    className="p-1.5 rounded-xs hover:bg-[#F8F5EA] text-gray-500 transition-colors border border-gray-200 cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  {isCopied && <span className="text-[10px] text-[#174A32] font-bold">Copied!</span>}
                </div>
              </div>

              {/* Title & Variety Classification */}
              <div className="space-y-1.5">
                <h1 className="font-serif-brand font-light text-3xl sm:text-4xl text-[#174A32] leading-tight">
                  {product.name}
                </h1>
                
                {/* Variety Tag */}
                <div className="flex items-center gap-2 flex-wrap pt-0.5">
                  <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-[#916E14] bg-[#C9A227]/10 px-2.5 py-0.5 rounded-xs border border-[#C9A227]/30">
                    <Sparkles className="w-3 h-3 text-[#C9A227]" />
                    <span>Variety: {product.grainSpecs.variety}</span>
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-medium text-[#5F806D] pt-0.5">
                  {product.subTitle}
                </p>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#5F806D] leading-relaxed">
                {product.longDescription}
              </p>

              {/* Pack Size Selector */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#174A32] uppercase tracking-wider">Select Pack / Order Size:</span>
                  <span className="text-xs font-medium text-[#5F806D]">{currentPack.packagingType}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {product.packOptions.map((pack) => {
                    const isSelected = selectedPackSize === pack.size;
                    return (
                      <button
                        key={pack.size}
                        type="button"
                        onClick={() => setSelectedPackSize(pack.size)}
                        className={`py-3 px-2 rounded-xs border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#174A32] bg-[#174A32] text-white shadow-xs'
                            : 'border-gray-200 bg-[#F8F5EA]/60 text-gray-800 hover:border-[#C9A227]'
                        }`}
                      >
                        <span className="font-bold text-xs block truncate">{pack.size}</span>
                        <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-[#E7D59A]' : 'text-gray-500'}`}>
                          ₹{pack.retailPrice}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Calculation & Quantity Counter */}
              <div className="pt-4 border-t border-[#C9A227]/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 block font-bold">Retail Price</span>
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-serif-brand font-bold text-3xl text-[#174A32]">
                      ₹{(currentPack.retailPrice * quantity).toLocaleString('en-IN')}
                    </span>
                    {currentPack.mrp > currentPack.retailPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        ₹{(currentPack.mrp * quantity).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Stepper */}
                <div className="flex items-center border border-[#C9A227]/30 rounded-xs overflow-hidden bg-white p-0.5">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center text-[#174A32] hover:bg-[#F8F5EA] transition-colors font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-3 text-sm font-bold text-[#174A32]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-[#174A32] hover:bg-[#F8F5EA] transition-colors font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-3 sm:py-3.5 px-2 sm:px-4 rounded-xs bg-[#174A32] text-white font-bold uppercase tracking-wider text-[11px] sm:text-xs shadow-xs hover:bg-[#1a5a3d] transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer border border-[#174A32] whitespace-nowrap"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C9A227] shrink-0" />
                    <span className="truncate">Add to Cart</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="w-full py-3 sm:py-3.5 px-2 sm:px-4 rounded-xs bg-[#C9A227] text-[#174A32] font-bold uppercase tracking-wider text-[11px] sm:text-xs shadow-xs hover:bg-[#E7D59A] transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <span className="truncate">Buy Now</span>
                  </button>
                </div>

                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full py-3 px-3 rounded-xs bg-[#25D366] text-white font-bold uppercase tracking-wider text-[11px] sm:text-xs shadow-xs hover:bg-[#1ebd5a] transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>Order Directly on WhatsApp</span>
                </button>
              </div>

              {/* Commercial Tabs Triggers */}
              <div className="pt-3 border-t border-[#C9A227]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                <button
                  onClick={() => onNavigate('wholesale')}
                  className="font-bold uppercase tracking-wider text-[11px] text-[#174A32] hover:text-[#C9A227] flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Boxes className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                  <span>Wholesale Lots (26kg Multi-Bags)</span>
                </button>
                <button
                  onClick={() => onNavigate('export')}
                  className="font-bold uppercase tracking-wider text-[11px] text-[#174A32] hover:text-[#C9A227] flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Globe className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                  <span>Container Export Quote</span>
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* Detailed Information Tabs Section */}
        <div className="bg-white border-t-4 border-[#C9A227] border-x border-b border-[#C9A227]/20 p-4 sm:p-8 shadow-clean rounded-sm space-y-6">
          
          {/* Tab Navigation with horizontal scroll on mobile */}
          <div className="border-b border-[#C9A227]/20 -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex overflow-x-auto gap-4 sm:gap-8 scrollbar-none pb-0.5">
              {[
                { id: 'specs', label: 'Grain Specs', fullLabel: 'Grain Specifications' },
                { id: 'cooking', label: 'Cooking & Water', fullLabel: 'Cooking & Water Ratio' },
                { id: 'nutrition', label: 'Nutrition', fullLabel: 'Nutritional Profile' },
                { id: 'commercial', label: 'Wholesale & Pack', fullLabel: 'Packaging & Wholesale Availability' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3 font-bold uppercase tracking-wider text-xs whitespace-nowrap transition-all cursor-pointer relative shrink-0 ${
                    activeTab === tab.id
                      ? 'text-[#174A32]'
                      : 'text-gray-400 hover:text-gray-800'
                  }`}
                >
                  <span className="inline sm:hidden">{tab.label}</span>
                  <span className="hidden sm:inline">{tab.fullLabel}</span>
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#C9A227]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Contents */}
          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-xs bg-[#F8F5EA] border border-[#C9A227]/20 space-y-1">
                <span className="text-gray-500 uppercase text-[10px] font-bold block">Variety:</span>
                <span className="font-bold text-[#174A32] text-sm">{product.grainSpecs.variety}</span>
              </div>
              <div className="p-4 rounded-xs bg-[#F8F5EA] border border-[#C9A227]/20 space-y-1">
                <span className="text-gray-500 uppercase text-[10px] font-bold block">Grain Length:</span>
                <span className="font-bold text-[#174A32] text-sm">{product.grainSpecs.grainLength}</span>
              </div>
              <div className="p-4 rounded-xs bg-[#F8F5EA] border border-[#C9A227]/20 space-y-1">
                <span className="text-gray-500 uppercase text-[10px] font-bold block">Aging:</span>
                <span className="font-bold text-[#174A32] text-sm">{product.grainSpecs.aging}</span>
              </div>
              <div className="p-4 rounded-xs bg-[#F8F5EA] border border-[#C9A227]/20 space-y-1">
                <span className="text-gray-500 uppercase text-[10px] font-bold block">Moisture Content:</span>
                <span className="font-bold text-[#174A32] text-sm">{product.grainSpecs.moistureContent}</span>
              </div>
              <div className="p-4 rounded-xs bg-[#F8F5EA] border border-[#C9A227]/20 space-y-1">
                <span className="text-gray-500 uppercase text-[10px] font-bold block">Broken Grain:</span>
                <span className="font-bold text-[#174A32] text-sm">{product.grainSpecs.brokenGrainPercentage}</span>
              </div>
              <div className="p-4 rounded-xs bg-[#F8F5EA] border border-[#C9A227]/20 space-y-1">
                <span className="text-gray-500 uppercase text-[10px] font-bold block">Color & Appearance:</span>
                <span className="font-bold text-[#174A32] text-sm">{product.grainSpecs.color}</span>
              </div>
              <div className="p-4 rounded-xs bg-[#F8F5EA] border border-[#C9A227]/20 space-y-1">
                <span className="text-gray-500 uppercase text-[10px] font-bold block">Milling Finish:</span>
                <span className="font-bold text-[#174A32] text-sm">{product.grainSpecs.polish}</span>
              </div>
              <div className="p-4 rounded-xs bg-[#F8F5EA] border border-[#C9A227]/20 space-y-1">
                <span className="text-gray-500 uppercase text-[10px] font-bold block">Sortex Cleaned:</span>
                <span className="font-bold text-[#174A32] text-sm">100% Optical Sorted ✓</span>
              </div>
            </div>
          )}

          {activeTab === 'cooking' && (
            <div className="space-y-4 text-xs sm:text-sm text-gray-700">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-[#F8F5EA] border border-[#C9A227]/20 rounded-xs">
                  <span className="text-xs text-gray-500 uppercase font-bold block">Water to Rice Ratio</span>
                  <span className="font-serif-brand font-bold text-[#174A32] text-lg">{product.cookingGuide.waterRatio}</span>
                </div>
                <div className="p-4 bg-[#F8F5EA] border border-[#C9A227]/20 rounded-xs">
                  <span className="text-xs text-gray-500 uppercase font-bold block">Soaking Time</span>
                  <span className="font-serif-brand font-bold text-[#174A32] text-lg">{product.cookingGuide.soakingTime}</span>
                </div>
                <div className="p-4 bg-[#F8F5EA] border border-[#C9A227]/20 rounded-xs">
                  <span className="text-xs text-gray-500 uppercase font-bold block">Cooking Time</span>
                  <span className="font-serif-brand font-bold text-[#174A32] text-lg">{product.cookingGuide.cookingTime}</span>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xs border border-[#C9A227]/30 space-y-2">
                <h4 className="font-bold text-[#174A32] text-sm flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-[#C9A227]" /> Chef's Tip for Ideal Fluffiness
                </h4>
                <p className="text-xs leading-relaxed text-[#5F806D]">{product.cookingGuide.tips}</p>
              </div>

              <div>
                <span className="font-bold text-xs uppercase tracking-wider text-[#174A32] block mb-2">Recommended Dishes:</span>
                <div className="flex flex-wrap gap-2">
                  {product.cookingGuide.idealDishes.map((dish, i) => (
                    <span key={i} className="px-3 py-1 bg-[#F8F5EA] border border-[#C9A227]/30 text-xs font-bold text-[#174A32] rounded-xs">
                      {dish}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'nutrition' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center text-xs">
              {Object.entries(product.nutritionalInfo).map(([key, val]) => (
                <div key={key} className="p-3.5 bg-[#F8F5EA] border border-[#C9A227]/20 rounded-xs">
                  <span className="text-gray-500 uppercase text-[10px] font-bold block mb-1">{key}</span>
                  <span className="font-serif-brand font-bold text-[#174A32] text-base block">{val}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'commercial' && (
            <div className="space-y-4 text-xs sm:text-sm text-gray-700">
              <p className="text-[#5F806D]">
                LG Gold rice is packaged in standardized 26kg heavy-duty PP bags to meet the requirements of retail consumers, retail store owners, commercial catering businesses, and international commodity importers.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-[#F8F5EA] border border-[#C9A227]/20 rounded-xs">
                  <h4 className="font-serif-brand font-bold text-[#174A32] mb-1">Standard 26kg Mill Bag</h4>
                  <p className="text-xs text-[#5F806D]">Single 26kg Heavy-Duty woven PP bags with tamper-evident stitching for household & kitchen use.</p>
                </div>
                <div className="p-4 bg-[#F8F5EA] border border-[#C9A227]/20 rounded-xs">
                  <h4 className="font-serif-brand font-bold text-[#174A32] mb-1">Wholesale Multi-Bag Lots</h4>
                  <p className="text-xs text-[#5F806D]">5 to 50+ Bags of 26kg each with direct mill-gate trade pricing for caterers & retailers.</p>
                </div>
                <div className="p-4 bg-[#F8F5EA] border border-[#C9A227]/20 rounded-xs">
                  <h4 className="font-serif-brand font-bold text-[#174A32] mb-1">Container Export Pallets</h4>
                  <p className="text-xs text-[#5F806D]">26 MT (1,000 bags of 26kg) container loads with palletization, fumigation, and custom private labeling.</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Grain Variety Comparison */}
        <GrainComparison onNavigate={onNavigate} />

        {/* Linked Recipes Section ("Made with LG Gold [Product]") */}
        {linkedRecipes.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A227]">
                  From Our Kitchen
                </span>
                <h2 className="font-serif-brand font-light text-2xl sm:text-3xl text-[#174A32] mt-1">
                  Delicious Recipes Made with {product.shortName}
                </h2>
              </div>
              <button
                onClick={() => onNavigate('recipes')}
                className="text-xs font-bold uppercase tracking-wider text-[#174A32] hover:text-[#C9A227] flex items-center gap-1 cursor-pointer"
              >
                <span>All Recipes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {linkedRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onViewRecipe={(slug) => onNavigate('recipe-detail', slug)}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
