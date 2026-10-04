import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Utensils, Package, Globe, Tag } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { RECIPES } from '../../data/recipes';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string, param?: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();

  const filteredProducts = PRODUCTS.filter(
    p =>
      p.name.toLowerCase().includes(normalizedQuery) ||
      p.shortName.toLowerCase().includes(normalizedQuery) ||
      p.description.toLowerCase().includes(normalizedQuery) ||
      p.tags.some(t => t.toLowerCase().includes(normalizedQuery))
  );

  const filteredRecipes = RECIPES.filter(
    r =>
      r.title.toLowerCase().includes(normalizedQuery) ||
      r.categories.some(c => c.toLowerCase().includes(normalizedQuery)) ||
      r.shortDescription.toLowerCase().includes(normalizedQuery)
  );

  const quickSearches = [
    { label: 'HMT Rice', route: 'product-detail', param: 'hmt-rice' },
    { label: 'JSR Rice', route: 'product-detail', param: 'jsr-rice' },
    { label: 'Biryani Rice', route: 'recipe-detail', param: 'hmt-rice-biryani' },
    { label: 'Export Pricing', route: 'export' },
    { label: 'Wholesale Quote', route: 'wholesale' },
    { label: 'Sortex Quality', route: 'quality' },
  ];

  const handleSelect = (route: string, param?: string) => {
    onNavigate(route, param);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start justify-center pt-16 px-4 pb-20 animate-fadeIn">
      <div className="bg-[#FFFFFF] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#E7D59A] overflow-hidden">
        
        {/* Search Header */}
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center gap-3">
          <Search className="w-6 h-6 text-[#174A32] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search LG Gold rice, recipes, pack sizes, wholesale or export..."
            className="flex-1 text-base sm:text-lg outline-none text-[#202522] placeholder:text-gray-400 font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-bold text-gray-500 hover:text-[#174A32] px-2 py-1 bg-gray-100 rounded-md"
          >
            ESC
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-3 bg-[#F8F5EA] border-b border-[#E7D59A]/30 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#5F806D] flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" /> Popular:
          </span>
          {quickSearches.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(item.route, item.param)}
              className="text-xs px-2.5 py-1 rounded-full bg-white text-[#174A32] border border-[#C9A227]/30 hover:border-[#C9A227] hover:bg-[#C9A227]/10 font-medium transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Search Results Area */}
        <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto space-y-6">
          
          {/* Products Results */}
          {filteredProducts.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#174A32] mb-3">
                <Package className="w-4 h-4 text-[#C9A227]" />
                <span>Rice Products ({filteredProducts.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleSelect('product-detail', p.slug)}
                    className="p-3 rounded-xl border border-gray-200 hover:border-[#C9A227] hover:shadow-md transition-all flex items-center gap-3 cursor-pointer bg-white group"
                  >
                    <img
                      src={p.images.primary}
                      alt={p.name}
                      className="w-14 h-14 rounded-lg object-cover border border-gray-100 group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-[#174A32] truncate group-hover:text-[#C9A227]">
                        {p.name}
                      </h4>
                      <p className="text-xs text-gray-500 truncate">{p.subTitle}</p>
                      <span className="text-xs font-bold text-[#C9A227] mt-0.5 inline-block">
                        From ₹{p.packOptions[0].retailPrice}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#174A32] group-hover:translate-x-0.5 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recipes Results */}
          {filteredRecipes.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#174A32] mb-3">
                <Utensils className="w-4 h-4 text-[#C9A227]" />
                <span>Recipes ({filteredRecipes.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredRecipes.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => handleSelect('recipe-detail', r.slug)}
                    className="p-3 rounded-xl border border-gray-200 hover:border-[#C9A227] hover:shadow-md transition-all flex items-center gap-3 cursor-pointer bg-white group"
                  >
                    <img
                      src={r.image}
                      alt={r.title}
                      className="w-14 h-14 rounded-lg object-cover border border-gray-100 group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-[#202522] truncate group-hover:text-[#174A32]">
                        {r.title}
                      </h4>
                      <p className="text-xs text-gray-500 truncate">{r.shortDescription}</p>
                      <span className="text-[11px] text-[#5F806D] font-medium">
                        {r.totalTimeMinutes} mins • {r.difficulty}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#174A32] group-hover:translate-x-0.5 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Commercial Inquiries Links */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#174A32] mb-3">
              <Globe className="w-4 h-4 text-[#C9A227]" />
              <span>Commercial & Export Services</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => handleSelect('export')}
                className="p-3 rounded-xl bg-[#174A32]/5 border border-[#174A32]/15 hover:bg-[#174A32] hover:text-white transition-all text-left flex items-center justify-between cursor-pointer group"
              >
                <div>
                  <span className="font-bold text-xs sm:text-sm text-[#174A32] group-hover:text-white block">
                    Export Desk & Container Shipping
                  </span>
                  <span className="text-[11px] text-gray-600 group-hover:text-[#E7D59A]">
                    20ft/40ft FCL • Middle East & Global
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#C9A227] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => handleSelect('wholesale')}
                className="p-3 rounded-xl bg-[#C9A227]/10 border border-[#C9A227]/30 hover:bg-[#C9A227] hover:text-[#174A32] transition-all text-left flex items-center justify-between cursor-pointer group"
              >
                <div>
                  <span className="font-bold text-xs sm:text-sm text-[#174A32] block">
                    Wholesale & Bulk Orders
                  </span>
                  <span className="text-[11px] text-gray-700">
                    50kg Bags • Supermarkets & Caterers
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#174A32] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* No results message */}
          {filteredProducts.length === 0 && filteredRecipes.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">
                No exact match found for "{query}". You can explore all our products or contact our team directly.
              </p>
              <div className="mt-4 flex justify-center gap-3">
                <button
                  onClick={() => handleSelect('products')}
                  className="px-4 py-2 bg-[#174A32] text-white text-xs font-bold rounded-lg"
                >
                  View All Products
                </button>
                <button
                  onClick={() => handleSelect('contact')}
                  className="px-4 py-2 bg-[#C9A227] text-[#174A32] text-xs font-bold rounded-lg"
                >
                  Contact Mill Desk
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
