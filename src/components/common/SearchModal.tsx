import React, { useState, useMemo } from 'react';
import { Search, X, ArrowRight, Utensils, Sparkles, Tag } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { RECIPES } from '../../data/recipes';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string, param?: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return { products: [], recipes: [] };

    const q = query.toLowerCase();

    const matchedProducts = PRODUCTS.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.shortName.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.grainSpecs.variety.toLowerCase().includes(q)
    );

    const matchedRecipes = RECIPES.filter(
      r =>
        r.title.toLowerCase().includes(q) ||
        r.shortDescription.toLowerCase().includes(q) ||
        r.categories.some(c => c.toLowerCase().includes(q)) ||
        r.ingredients.some(i => i.item.toLowerCase().includes(q))
    );

    return { products: matchedProducts, recipes: matchedRecipes };
  }, [query]);

  if (!isOpen) return null;

  const handleSelectProduct = (slug: string) => {
    onClose();
    onNavigate('product-detail', slug);
  };

  const handleSelectRecipe = (slug: string) => {
    onClose();
    onNavigate('recipe-detail', slug);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24 animate-fadeIn">
      <div className="bg-[#FFFFFF] w-full max-w-2xl rounded-sm shadow-clean border-t-4 border-[#C9A227] border-x border-b border-[#C9A227]/20 overflow-hidden">
        
        {/* Search Header Input */}
        <div className="p-4 sm:p-6 border-b border-[#C9A227]/30 flex items-center gap-3 bg-[#F8F5EA]/60">
          <Search className="w-5 h-5 text-[#174A32] shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search LG Gold HMT / JSR rice, recipes, pack sizes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm sm:text-base text-[#202522] placeholder-[#5F806D]/60 outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded-xs bg-[#174A32]/10 text-[#174A32] text-[10px] font-bold uppercase tracking-wider hover:bg-[#174A32]/20 transition-colors cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 space-y-6">
          {!query.trim() ? (
            <div className="space-y-4 text-xs">
              <div>
                <span className="font-bold text-[#174A32] uppercase tracking-wider text-[10px] block mb-2">
                  Popular Searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {['HMT Rice', 'JSR Rice', 'Hyderabadi Biryani', '25kg Bags', 'Export Quote', 'Sortex Cleaned', 'Lemon Rice'].map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1.5 rounded-xs bg-[#F8F5EA] border border-[#C9A227]/30 text-[#174A32] text-xs font-semibold hover:border-[#C9A227] transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Tag className="w-3 h-3 text-[#C9A227]" />
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-[#C9A227]/20 flex items-center justify-between text-[#5F806D] text-[11px]">
                <span>Sri Lakshmi Ganapathi Trading Company • Telangana</span>
                <span className="text-[#174A32] font-bold">100% Sortex Optical Checked</span>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Product Results */}
              {searchResults.products.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#174A32] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                    Rice Varieties ({searchResults.products.length})
                  </span>
                  <div className="space-y-2">
                    {searchResults.products.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleSelectProduct(product.slug)}
                        className="p-3 rounded-xs bg-[#F8F5EA]/50 border border-[#C9A227]/30 hover:bg-white hover:border-[#C9A227] hover:shadow-xs transition-all flex items-center justify-between cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images.primary}
                            alt={product.name}
                            className="w-12 h-12 rounded-xs object-cover border border-gray-100"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h4 className="font-serif-brand font-bold text-sm text-[#174A32] group-hover:text-[#C9A227] transition-colors">
                              {product.name}
                            </h4>
                            <p className="text-xs text-[#5F806D]">
                              {product.grainSpecs.variety} • {product.grainSpecs.aging}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#174A32]">
                            From ₹{product.packOptions[0]?.retailPrice}
                          </span>
                          <ArrowRight className="w-4 h-4 text-[#C9A227] group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recipe Results */}
              {searchResults.recipes.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#174A32] uppercase tracking-wider flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-[#C9A227]" />
                    Recipes ({searchResults.recipes.length})
                  </span>
                  <div className="space-y-2">
                    {searchResults.recipes.map((recipe) => (
                      <div
                        key={recipe.id}
                        onClick={() => handleSelectRecipe(recipe.slug)}
                        className="p-3 rounded-xs bg-[#F8F5EA]/50 border border-[#C9A227]/30 hover:bg-white hover:border-[#C9A227] hover:shadow-xs transition-all flex items-center justify-between cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={recipe.image}
                            alt={recipe.title}
                            className="w-12 h-12 rounded-xs object-cover border border-gray-100"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h4 className="font-serif-brand font-bold text-sm text-[#202522] group-hover:text-[#174A32] transition-colors">
                              {recipe.title}
                            </h4>
                            <p className="text-xs text-[#5F806D]">
                              {recipe.totalTimeMinutes} mins • {recipe.difficulty}
                            </p>
                          </div>
                        </div>

                        <ArrowRight className="w-4 h-4 text-[#C9A227] group-hover:translate-x-0.5 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results Fallback */}
              {searchResults.products.length === 0 && searchResults.recipes.length === 0 && (
                <div className="py-8 text-center text-xs text-[#5F806D] space-y-2">
                  <p>No results found for "{query}".</p>
                  <p>Try searching for "HMT", "JSR", "Biryani", "Wholesale", or "Export".</p>
                </div>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
