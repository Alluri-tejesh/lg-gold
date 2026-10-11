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
      <div className="bg-[#FFFFFF] w-full max-w-2xl rounded-sm shadow-clean border-t-4 border-[#E0A21A] border-x border-b border-[#E0A21A]/20 overflow-hidden">
        
        {/* Search Header Input */}
        <div className="p-4 sm:p-6 border-b border-[#E0A21A]/30 flex items-center gap-3 bg-[#F3F4EC]/60">
          <Search className="w-5 h-5 text-[#0B3B2C] shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search LG Gold HMT / JSR rice, recipes, pack sizes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm sm:text-base text-[#15231C] placeholder-[#4C6358]/60 outline-none font-medium"
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
            className="px-2.5 py-1 rounded-xs bg-[#0B3B2C]/10 text-[#0B3B2C] text-[10px] font-bold hover:bg-[#0B3B2C]/20 transition-colors cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 space-y-6">
          {!query.trim() ? (
            <div className="space-y-4 text-xs">
              <div>
                <span className="font-bold text-[#0B3B2C] text-[10px] block mb-2">
                  Popular Searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {['HMT Rice', 'JSR Rice', 'Hyderabadi Biryani', '25kg Bags', 'Export Quote', 'Sortex Cleaned', 'Lemon Rice'].map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1.5 rounded-xs bg-[#F3F4EC] border border-[#E0A21A]/30 text-[#0B3B2C] text-xs font-semibold hover:border-[#E0A21A] transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Tag className="w-3 h-3 text-[#E0A21A]" />
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-[#E0A21A]/20 flex items-center justify-between text-[#4C6358] text-[11px]">
                <span>Sri Lakshmi Ganapathi Trading Company • Telangana</span>
                <span className="text-[#0B3B2C] font-bold">100% Sortex Optical Checked</span>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Product Results */}
              {searchResults.products.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#0B3B2C] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#E0A21A]" />
                    Rice Varieties ({searchResults.products.length})
                  </span>
                  <div className="space-y-2">
                    {searchResults.products.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleSelectProduct(product.slug)}
                        className="p-3 rounded-xs bg-[#F3F4EC]/50 border border-[#E0A21A]/30 hover:bg-white hover:border-[#E0A21A] hover:shadow-xs transition-all flex items-center justify-between cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images.primary}
                            alt={product.name}
                            className="w-12 h-12 rounded-xs object-cover border border-gray-100"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h4 className="font-serif-brand font-bold text-sm text-[#0B3B2C] group-hover:text-[#E0A21A] transition-colors">
                              {product.name}
                            </h4>
                            <p className="text-xs text-[#4C6358]">
                              {product.grainSpecs.variety} • {product.grainSpecs.aging}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#0B3B2C]">
                            From ₹{product.packOptions[0]?.retailPrice}
                          </span>
                          <ArrowRight className="w-4 h-4 text-[#E0A21A] group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recipe Results */}
              {searchResults.recipes.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#0B3B2C] flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-[#E0A21A]" />
                    Recipes ({searchResults.recipes.length})
                  </span>
                  <div className="space-y-2">
                    {searchResults.recipes.map((recipe) => (
                      <div
                        key={recipe.id}
                        onClick={() => handleSelectRecipe(recipe.slug)}
                        className="p-3 rounded-xs bg-[#F3F4EC]/50 border border-[#E0A21A]/30 hover:bg-white hover:border-[#E0A21A] hover:shadow-xs transition-all flex items-center justify-between cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={recipe.image}
                            alt={recipe.title}
                            className="w-12 h-12 rounded-xs object-cover border border-gray-100"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h4 className="font-serif-brand font-bold text-sm text-[#15231C] group-hover:text-[#0B3B2C] transition-colors">
                              {recipe.title}
                            </h4>
                            <p className="text-xs text-[#4C6358]">
                              {recipe.totalTimeMinutes} mins • {recipe.difficulty}
                            </p>
                          </div>
                        </div>

                        <ArrowRight className="w-4 h-4 text-[#E0A21A] group-hover:translate-x-0.5 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results Fallback */}
              {searchResults.products.length === 0 && searchResults.recipes.length === 0 && (
                <div className="py-8 text-center text-xs text-[#4C6358] space-y-2">
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
