import React, { useState } from 'react';
import {
  Clock,
  ChefHat,
  Users,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Share2,
  Printer,
  Utensils,
  Check,
} from 'lucide-react';
import { RECIPES, getRecipeBySlug } from '../data/recipes';
import { PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

interface RecipeDetailViewProps {
  recipeSlug: string;
  onNavigate: (route: string, param?: string) => void;
}

export const RecipeDetailView: React.FC<RecipeDetailViewProps> = ({ recipeSlug, onNavigate }) => {
  const recipe = getRecipeBySlug(recipeSlug) || RECIPES[0];
  const matchedProduct = PRODUCTS.find(p => p.id === recipe.recommendedProductId) || PRODUCTS[0];
  const { addToCart } = useCart();

  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [checkedIngredients, setCheckedIngredients] = useState<number[]>([]);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const toggleStep = (stepIdx: number) => {
    if (completedSteps.includes(stepIdx)) {
      setCompletedSteps(completedSteps.filter(s => s !== stepIdx));
    } else {
      setCompletedSteps([...completedSteps, stepIdx]);
    }
  };

  const toggleIngredient = (idx: number) => {
    if (checkedIngredients.includes(idx)) {
      setCheckedIngredients(checkedIngredients.filter(i => i !== idx));
    } else {
      setCheckedIngredients([...checkedIngredients, idx]);
    }
  };

  const handleAddToCart = () => {
    addToCart(matchedProduct, '10kg', 1);
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[#F8F5EA] min-h-screen pb-24">
      
      {/* Breadcrumb Nav */}
      <div className="bg-white/80 backdrop-blur-xs border-b border-[#C9A227]/20 py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Recipes', route: 'recipes' },
              { label: recipe.title },
            ]}
            onNavigate={onNavigate}
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        
        {/* Recipe Title & Meta Header */}
        <div className="bg-white rounded-3xl border border-[#E7D59A] p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {recipe.categories.map((cat, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-xs font-bold bg-[#F8F5EA] text-[#5F806D] border border-[#E7D59A]"
                >
                  {cat}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>{isCopied ? 'Link Copied!' : 'Share'}</span>
              </button>
              <button
                onClick={handlePrint}
                className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
            </div>
          </div>

          <div>
            <h1 className="font-serif-brand font-extrabold text-3xl sm:text-5xl text-[#174A32] leading-tight">
              {recipe.title}
            </h1>
            <p className="text-sm sm:text-base text-gray-700 mt-2 leading-relaxed">
              {recipe.shortDescription}
            </p>
          </div>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-gray-100 text-xs">
            <div className="p-3 bg-[#F8F5EA] rounded-xl border border-[#E7D59A]/60 flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#174A32]" />
              <div>
                <span className="text-gray-500 block text-[10px]">Prep Time</span>
                <span className="font-bold text-[#174A32]">{recipe.prepTimeMinutes} mins</span>
              </div>
            </div>

            <div className="p-3 bg-[#F8F5EA] rounded-xl border border-[#E7D59A]/60 flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#174A32]" />
              <div>
                <span className="text-gray-500 block text-[10px]">Cook Time</span>
                <span className="font-bold text-[#174A32]">{recipe.cookTimeMinutes} mins</span>
              </div>
            </div>

            <div className="p-3 bg-[#F8F5EA] rounded-xl border border-[#E7D59A]/60 flex items-center gap-2.5">
              <Users className="w-4 h-4 text-[#174A32]" />
              <div>
                <span className="text-gray-500 block text-[10px]">Servings</span>
                <span className="font-bold text-[#174A32]">{recipe.servings} People</span>
              </div>
            </div>

            <div className="p-3 bg-[#F8F5EA] rounded-xl border border-[#E7D59A]/60 flex items-center gap-2.5">
              <ChefHat className="w-4 h-4 text-[#174A32]" />
              <div>
                <span className="text-gray-500 block text-[10px]">Difficulty</span>
                <span className="font-bold text-[#174A32]">{recipe.difficulty}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Recipe Image */}
        <div className="rounded-3xl overflow-hidden shadow-md border-4 border-white aspect-16/9 bg-[#F8F5EA] relative">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* "Made with LG Gold [Product] Rice" Conversion Box */}
        <div className="bg-[#174A32] text-white rounded-3xl p-6 sm:p-8 border-2 border-[#C9A227] shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white p-1 shrink-0 overflow-hidden">
              <img
                src={matchedProduct.images.primary}
                alt={matchedProduct.name}
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A227] block">
                Recommended Authentic Ingredient
              </span>
              <h3 className="font-serif-brand font-bold text-xl sm:text-2xl text-white">
                Made with {matchedProduct.name}
              </h3>
              <p className="text-xs text-[#F8F5EA]/85 mt-0.5">
                Sortex optical cleaned, aged grains with guaranteed moisture stability.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
            <button
              onClick={handleAddToCart}
              className={`w-full md:w-auto px-6 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isAddedToCart
                  ? 'bg-[#226444] text-white'
                  : 'bg-[#C9A227] text-[#174A32] hover:bg-[#E7D59A]'
              }`}
            >
              {isAddedToCart ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Buy This Rice (10kg Pack)</span>
                </>
              )}
            </button>

            <button
              onClick={() => onNavigate('product-detail', matchedProduct.slug)}
              className="px-4 py-3 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/20 transition-colors"
            >
              Details
            </button>
          </div>
        </div>

        {/* Ingredients & Cooking Steps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Ingredients Column (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E7D59A] p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="font-serif-brand font-bold text-xl text-[#174A32] flex items-center gap-2">
                <Utensils className="w-5 h-5 text-[#C9A227]" />
                <span>Ingredients</span>
              </h2>
              <span className="text-xs text-gray-500">{recipe.ingredients.length} items</span>
            </div>

            <p className="text-[11px] text-gray-400">
              Tip: Click ingredients as you prep them!
            </p>

            <div className="space-y-2.5">
              {recipe.ingredients.map((ing, idx) => {
                const isChecked = checkedIngredients.includes(idx);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleIngredient(idx)}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-gray-50 border-gray-200 text-gray-400 line-through'
                        : 'bg-[#F8F5EA]/50 border-[#E7D59A]/60 text-gray-800 hover:border-[#C9A227]'
                    }`}
                  >
                    <span className="font-medium">{ing.item}</span>
                    <span className="font-bold text-[#174A32] shrink-0 ml-2">
                      {ing.amount}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Instructions Column (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E7D59A] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="font-serif-brand font-bold text-xl text-[#174A32] flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-[#C9A227]" />
                <span>Step-by-Step Instructions</span>
              </h2>
              <span className="text-xs font-bold text-[#174A32]">
                {completedSteps.length} of {recipe.instructions.length} completed
              </span>
            </div>

            <div className="space-y-4">
              {recipe.instructions.map((step) => {
                const isCompleted = completedSteps.includes(step.stepNumber);
                return (
                  <div
                    key={step.stepNumber}
                    onClick={() => toggleStep(step.stepNumber)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isCompleted
                        ? 'bg-green-50/60 border-green-200 opacity-80'
                        : 'bg-[#F8F5EA]/40 border-[#E7D59A]/70 hover:border-[#C9A227]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                          isCompleted
                            ? 'bg-[#174A32] text-[#C9A227]'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {isCompleted ? '✓' : step.stepNumber}
                      </span>
                      <p className={`text-xs sm:text-sm leading-relaxed ${isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {step.instruction}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chef's Tips */}
            {recipe.chefTips && (
              <div className="p-4 rounded-2xl bg-[#F8F5EA] border border-[#E7D59A] space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#174A32]">
                  <Sparkles className="w-4 h-4 text-[#C9A227]" />
                  <span>Chef's Grain Secret</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {recipe.chefTips}
                </p>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
