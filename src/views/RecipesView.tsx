import React, { useState } from 'react';
import { ChefHat, Sparkles, Clock, Utensils, ArrowRight, Search, Heart } from 'lucide-react';
import { RECIPES, RECIPE_CATEGORIES } from '../data/recipes';
import { RecipeCard } from '../components/common/RecipeCard';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

interface RecipesViewProps {
  onNavigate: (route: string, param?: string) => void;
}

export const RecipesView: React.FC<RecipesViewProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // "What can I cook today" interactive tool state
  const [mealTimeFilter, setMealTimeFilter] = useState<'any' | 'quick' | 'special' | 'comfort'>('any');

  const filteredRecipes = RECIPES.filter((r) => {
    const matchesCategory = selectedCategory === 'All' || r.categories.includes(selectedCategory);
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.categories.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));

    let matchesMealTime = true;
    if (mealTimeFilter === 'quick') {
      matchesMealTime = r.totalTimeMinutes <= 25;
    } else if (mealTimeFilter === 'special') {
      matchesMealTime = r.categories.includes('Festive') || r.categories.includes('Biryani');
    } else if (mealTimeFilter === 'comfort') {
      matchesMealTime = r.categories.includes('South Indian') || r.categories.includes('Everyday Meals');
    }

    return matchesCategory && matchesSearch && matchesMealTime;
  });

  return (
    <div className="bg-[#F8F5EA] min-h-screen pb-24">
      
      {/* Header Banner */}
      <div className="bg-[#174A32] text-white py-10 sm:py-14 border-b-4 border-[#C9A227]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Breadcrumbs items={[{ label: 'Recipes' }]} onNavigate={onNavigate} variant="dark" />
          
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227] flex items-center gap-1.5">
              <ChefHat className="w-4 h-4" />
              LG Gold Culinary Kitchen
            </span>
            <h1 className="font-serif-brand font-extrabold text-3xl sm:text-5xl text-white">
              Cook Something Delicious
            </h1>
            <p className="text-sm sm:text-base text-[#F8F5EA]/85 leading-relaxed">
              Unlock the full culinary potential of LG Gold HMT and JSR rice. From aromatic Hyderabadi biryanis and fluffy South Indian bagara rice to comforting curd rice and lemon rice.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-12">
        
        {/* "What Can I Cook Today?" Interactive Tool */}
        <div className="bg-white rounded-3xl border border-[#E7D59A] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-[#C9A227] text-xs font-bold uppercase">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Kitchen Assistant</span>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif-brand font-bold text-2xl text-[#174A32]">
                What Can I Cook Today?
              </h2>
              <p className="text-xs text-gray-600 mt-1">
                Filter by occasion or cooking mood to discover the best match for your pantry.
              </p>
            </div>

            {/* Quick Mood Filter */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'any', label: 'All Moods' },
                { id: 'quick', label: '⚡ Under 25 Mins' },
                { id: 'special', label: '👑 Festive & Biryani' },
                { id: 'comfort', label: '🍲 Daily Comfort' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMealTimeFilter(m.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    mealTimeFilter === m.id
                      ? 'bg-[#174A32] text-white shadow-xs'
                      : 'bg-[#F8F5EA] text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search recipes by name, ingredient (e.g. biryani, ghee, lemon, curd)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#174A32] outline-none"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {RECIPE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#174A32] text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-[#E7D59A]/80 hover:border-[#C9A227]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Recipes Grid */}
        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onViewRecipe={(slug) => onNavigate('recipe-detail', slug)}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-gray-300 space-y-3">
            <ChefHat className="w-10 h-10 text-gray-400 mx-auto" />
            <h3 className="font-bold text-lg text-gray-700">No recipes matched your criteria</h3>
            <p className="text-xs text-gray-500">Try resetting filters or searching for different ingredients.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setMealTimeFilter('any');
              }}
              className="px-4 py-2 bg-[#174A32] text-white text-xs font-bold rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
