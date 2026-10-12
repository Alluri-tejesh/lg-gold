import { Recipe, RecipeArtSpec } from '../types';

export const HMT_ID = 'lg-gold-hmt-rice';
export const JSR_ID = 'lg-gold-jsr-rice';

// Topping colours reused by the dish illustrations.
export const C = {
  green: '#2F7D4F',
  lime: '#8DBB45',
  gold: '#E0A21A',
  red: '#C8283C',
  brown: '#7A3E22',
  tan: '#C58A4A',
  orange: '#F2994A',
  white: '#FFFFFF',
  pink: '#E8879F',
  dark: '#3A2A22',
};

type Row = [item: string, amount: string];

/** Compact authoring format. Everything a recipe page needs, without the boilerplate. */
export interface RecipeSeed {
  id: string;
  title: string;
  short: string;
  /** Optional longer description. Defaults to the short one plus a line about the rice. */
  full?: string;
  prep: number;
  cook: number;
  serves: number;
  level: 'Easy' | 'Medium' | 'Advanced';
  cats: string[];
  rice: 'hmt' | 'jsr';
  /** Amount of LG Gold rice, e.g. "1.5 cups (washed and soaked 20 mins)". */
  amount: string;
  cuisine: string;
  /** Rough calories per serving. Shown as an estimate. */
  kcal: number;
  art: RecipeArtSpec;
  ing: Row[];
  steps: string[];
  tips?: string[];
  featured?: boolean;
}

const RICE_LINE: Record<'hmt' | 'jsr', string> = {
  hmt: 'Made with LG Gold HMT Rice, aged 12 months or more so every grain cooks separate and fluffy.',
  jsr: 'Made with LG Gold JSR Rice, a fine, soft grain that cooks quickly and stays light on the stomach.',
};

export const buildRecipe = (s: RecipeSeed): Recipe => ({
  id: s.id,
  slug: s.id,
  title: s.title,
  shortDescription: s.short,
  fullDescription: s.full ?? `${s.short} ${RICE_LINE[s.rice]}`,
  art: s.art,
  prepTimeMinutes: s.prep,
  cookTimeMinutes: s.cook,
  totalTimeMinutes: s.prep + s.cook,
  servings: s.serves,
  difficulty: s.level,
  categories: s.cats,
  recommendedProductId: s.rice === 'hmt' ? HMT_ID : JSR_ID,
  recommendedPackSize: '26kg Bag',
  cuisine: s.cuisine,
  nutritionPerServing: `About ${s.kcal} kcal per serving (estimate)`,
  chefTips: s.tips,
  ingredients: [
    { item: s.rice === 'hmt' ? 'LG Gold HMT Rice' : 'LG Gold JSR Rice', amount: s.amount, isLGGoldRice: true },
    ...s.ing.map(([item, amount]) => ({ item, amount })),
  ],
  instructions: s.steps.map((instruction, i) => ({ stepNumber: i + 1, instruction })),
  featured: s.featured,
});
