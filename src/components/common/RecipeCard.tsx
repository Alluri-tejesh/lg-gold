import React from 'react';
import { Clock, Users, Gauge } from 'lucide-react';
import { Recipe } from '../../types';
import { RecipeImage } from './RecipeArt';
import { AppLink } from '../ui/AppLink';

interface RecipeCardProps {
  recipe: Recipe;
  /** Kept for callers that still pass it; the card links to the recipe itself. */
  onViewRecipe?: (slug: string) => void;
}

const RICE_LABEL: Record<string, string> = { 'lg-gold-hmt-rice': 'HMT Rice', 'lg-gold-jsr-rice': 'JSR Rice' };

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => (
  <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-line shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift has-[a:focus-visible]:outline-3 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-gold-500">
    <div className="relative aspect-[16/11] overflow-hidden bg-cream">
      <RecipeImage recipe={recipe} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]" />
      <span className="absolute left-3 top-3 rounded-full bg-forest-900/85 px-3 py-1 text-xs font-semibold text-gold-300 backdrop-blur">
        {RICE_LABEL[recipe.recommendedProductId] ?? 'LG Gold Rice'}
      </span>
    </div>
    <div className="flex flex-1 flex-col p-5">
      <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-gold-700">{recipe.categories[0]}</p>
      <h3 className="mt-1 font-display text-xl leading-snug text-forest-800">
        <AppLink
          to="recipe-detail"
          param={recipe.slug}
          className="after:absolute after:inset-0 after:content-[''] group-hover:text-forest-700 focus-visible:outline-none"
        >
          {recipe.title}
        </AppLink>
      </h3>
      <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-muted">{recipe.shortDescription}</p>
      <ul className="mt-auto flex flex-wrap gap-x-4 gap-y-1 border-t border-line pt-4 text-sm text-ink-soft">
        <li className="inline-flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-gold-600" aria-hidden="true" />
          {recipe.totalTimeMinutes} min
        </li>
        <li className="inline-flex items-center gap-1.5">
          <Gauge className="h-4 w-4 text-gold-600" aria-hidden="true" />
          {recipe.difficulty}
        </li>
        <li className="inline-flex items-center gap-1.5">
          <Users className="h-4 w-4 text-gold-600" aria-hidden="true" />
          Serves {recipe.servings}
        </li>
      </ul>
    </div>
  </article>
);
