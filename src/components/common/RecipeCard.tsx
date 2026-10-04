import React from 'react';
import { Clock, ChefHat, ArrowRight, Utensils } from 'lucide-react';
import { Recipe } from '../../types';
import { PRODUCTS } from '../../data/products';

interface RecipeCardProps {
  recipe: Recipe;
  onViewRecipe: (slug: string) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onViewRecipe }) => {
  const matchedProduct = PRODUCTS.find(p => p.id === recipe.recommendedProductId);

  return (
    <div
      onClick={() => onViewRecipe(recipe.slug)}
      className="bg-[#FFFFFF] border-t-4 border-[#C9A227] border-x border-b border-[#C9A227]/20 shadow-clean hover:border-[#C9A227] transition-all duration-200 flex flex-col justify-between overflow-hidden group cursor-pointer rounded-sm"
    >
      {/* Recipe Food Image */}
      <div className="relative aspect-16/10 bg-[#F8F5EA] overflow-hidden border-b border-[#C9A227]/20">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />

        {/* Highlight Badge */}
        <div className="absolute top-3.5 left-3.5 bg-[#174A32] text-[#F8F5EA] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 shadow-xs border border-[#C9A227]/40 flex items-center gap-1.5 rounded-xs">
          <Utensils className="w-3 h-3 text-[#C9A227]" />
          <span>{matchedProduct ? matchedProduct.shortName : 'LG Gold Rice'}</span>
        </div>

        {/* Time and difficulty badge */}
        <div className="absolute bottom-3 right-3 bg-black/80 text-white text-[11px] font-semibold px-2 py-0.5 rounded-xs flex items-center gap-2">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#C9A227]" />
            {recipe.totalTimeMinutes}m
          </span>
          <span className="text-white/40">•</span>
          <span className="flex items-center gap-1">
            <ChefHat className="w-3 h-3 text-[#C9A227]" />
            {recipe.difficulty}
          </span>
        </div>
      </div>

      {/* Recipe Info */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            {recipe.categories.slice(0, 2).map((cat, idx) => (
              <span
                key={idx}
                className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-xs bg-[#F8F5EA] text-[#5F806D] border border-[#C9A227]/20"
              >
                {cat}
              </span>
            ))}
          </div>

          <h3 className="font-serif-brand font-light text-xl text-[#174A32] group-hover:text-[#C9A227] transition-colors leading-snug">
            {recipe.title}
          </h3>

          <p className="text-xs text-[#5F806D] mt-2 line-clamp-2 leading-relaxed">
            {recipe.shortDescription}
          </p>
        </div>

        {/* Footer Conversion Link */}
        <div className="pt-3 border-t border-[#C9A227]/20 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#174A32] group-hover:text-[#C9A227] flex items-center gap-1 transition-colors">
            <span>View Recipe</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>

          <span className="text-[11px] font-bold text-[#5F806D]">
            Serves {recipe.servings}
          </span>
        </div>
      </div>
    </div>
  );
};
