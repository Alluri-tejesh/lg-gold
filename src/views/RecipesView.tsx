import React, { useDeferredValue, useMemo, useState } from 'react';
import { Search, X, SlidersHorizontal, ChefHat } from 'lucide-react';
import { RECIPES, RECIPE_CATEGORIES } from '../data/recipes';
import { RecipeCard } from '../components/common/RecipeCard';
import { Reveal } from '../components/common/motion';
import { PageHero } from '../components/ui/PageHero';
import { Container, Section } from '../components/ui/Section';
import { Button } from '../components/ui/Button';

interface RecipesViewProps {
  onNavigate: (route: string, param?: string) => void;
}

type Quick = 'quick' | 'veg' | 'hmt' | 'jsr';
type Sort = 'featured' | 'quickest' | 'easiest';

const QUICK: { id: Quick; label: string; test: (r: (typeof RECIPES)[number]) => boolean }[] = [
  { id: 'quick', label: 'Under 30 min', test: (r) => r.totalTimeMinutes <= 30 },
  { id: 'veg', label: 'Vegetarian', test: (r) => r.categories.includes('Vegetarian') },
  { id: 'hmt', label: 'HMT rice', test: (r) => r.recommendedProductId === 'lg-gold-hmt-rice' },
  { id: 'jsr', label: 'JSR rice', test: (r) => r.recommendedProductId === 'lg-gold-jsr-rice' },
];

const LEVEL = { Easy: 0, Medium: 1, Advanced: 2 };
const PAGE = 12;

export const RecipesView: React.FC<RecipesViewProps> = ({ onNavigate }) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [quick, setQuick] = useState<Set<Quick>>(new Set());
  const [sort, setSort] = useState<Sort>('featured');
  const [visible, setVisible] = useState(PAGE);
  // Typing stays smooth: filtering 100+ recipes waits for a pause in typing.
  const q = useDeferredValue(query.trim().toLowerCase());

  const results = useMemo(() => {
    const words = q.split(/\s+/).filter(Boolean);
    const list = RECIPES.filter((r) => {
      if (category !== 'All' && !r.categories.includes(category)) return false;
      for (const f of QUICK) if (quick.has(f.id) && !f.test(r)) return false;
      if (!words.length) return true;
      const hay = `${r.title} ${r.shortDescription} ${r.categories.join(' ')} ${r.cuisine} ${r.ingredients.map((i) => i.item).join(' ')}`.toLowerCase();
      return words.every((w) => hay.includes(w));
    });
    if (sort === 'quickest') return [...list].sort((a, b) => a.totalTimeMinutes - b.totalTimeMinutes);
    if (sort === 'easiest') return [...list].sort((a, b) => LEVEL[a.difficulty] - LEVEL[b.difficulty] || a.totalTimeMinutes - b.totalTimeMinutes);
    return [...list].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  }, [q, category, quick, sort]);

  const reset = () => {
    setQuery('');
    setCategory('All');
    setQuick(new Set());
    setSort('featured');
    setVisible(PAGE);
  };
  const filtered = query || category !== 'All' || quick.size > 0;
  const counts = useMemo(() => {
    const c: Record<string, number> = { All: RECIPES.length };
    for (const r of RECIPES) for (const cat of r.categories) c[cat] = (c[cat] || 0) + 1;
    return c;
  }, []);

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Recipes' }]}
        onNavigate={onNavigate}
        eyebrow="From the mill kitchen"
        title="Cook something delicious"
        intro={`${RECIPES.length} recipes tested with LG Gold HMT and JSR rice, from Hyderabadi dum biryani to five-minute curd rice. Each one scales to your family size and has built-in timers.`}
        actions={
          <div className="relative w-full max-w-xl">
            <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisible(PAGE);
              }}
              placeholder="Search a dish or ingredient: biryani, ghee, curd…"
              aria-label="Search recipes"
              className="h-14 w-full rounded-full bg-white pl-13 pr-12 text-base text-ink shadow-lift placeholder:text-muted/70 focus:outline-none focus:ring-4 focus:ring-gold-500/40 [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-cream cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        }
      />

      {/* Filters, kept in reach while scrolling the list */}
      <div className="sticky top-16 z-20 border-b border-line bg-paper/90 backdrop-blur-xl">
        <Container className="py-3">
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none" role="radiogroup" aria-label="Category">
            {RECIPE_CATEGORIES.filter((c) => counts[c]).map((c) => (
              <button
                key={c}
                type="button"
                role="radio"
                aria-checked={category === c}
                onClick={() => {
                  setCategory(c);
                  setVisible(PAGE);
                }}
                className={`inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-colors cursor-pointer ${
                  category === c ? 'bg-forest-800 text-white' : 'bg-white text-forest-800 ring-1 ring-inset ring-line hover:ring-forest-700'
                }`}
              >
                {c}
                <span className={`text-xs ${category === c ? 'text-gold-300' : 'text-muted'}`}>{counts[c]}</span>
              </button>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted" aria-hidden="true" />
            {QUICK.map((f) => {
              const on = quick.has(f.id);
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    const next = new Set(quick);
                    if (on) next.delete(f.id);
                    else {
                      next.add(f.id);
                      // HMT and JSR exclude each other.
                      if (f.id === 'hmt') next.delete('jsr');
                      if (f.id === 'jsr') next.delete('hmt');
                    }
                    setQuick(next);
                    setVisible(PAGE);
                  }}
                  className={`min-h-9 rounded-full px-3.5 text-[13px] font-semibold transition-colors cursor-pointer ${
                    on ? 'bg-gold-500 text-forest-900' : 'bg-cream text-forest-800 ring-1 ring-inset ring-line hover:ring-gold-500'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
            <label className="ml-auto flex items-center gap-2 text-sm text-muted">
              Sort
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="min-h-9 rounded-full bg-white px-3 text-sm font-semibold text-forest-800 ring-1 ring-line focus:outline-none focus:ring-2 focus:ring-forest-700 cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="quickest">Quickest first</option>
                <option value="easiest">Easiest first</option>
              </select>
            </label>
          </div>
        </Container>
      </div>

      <Section tone="cream" tight>
        <Container>
          <div className="mb-6 flex items-center justify-between gap-4">
            <p className="text-[15px] text-muted" aria-live="polite">
              {results.length === RECIPES.length ? `All ${results.length} recipes` : `${results.length} of ${RECIPES.length} recipes`}
            </p>
            {filtered && (
              <button type="button" onClick={reset} className="text-sm font-semibold text-forest-800 underline underline-offset-4 cursor-pointer">
                Clear filters
              </button>
            )}
          </div>

          <h2 className="sr-only">Recipes</h2>
          {results.length > 0 ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {results.slice(0, visible).map((r, i) => (
                  <Reveal key={r.id} delay={(i % PAGE) * 40} className="h-full">
                    <RecipeCard recipe={r} />
                  </Reveal>
                ))}
              </div>
              {visible < results.length && (
                <div className="mt-10 text-center">
                  <Button variant="outline" size="lg" onClick={() => setVisible(visible + PAGE)}>
                    Show more ({results.length - visible} left)
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-3xl bg-white px-6 py-16 text-center ring-1 ring-line">
              <ChefHat className="mx-auto h-12 w-12 text-gold-500" aria-hidden="true" />
              <p className="mt-4 font-display text-2xl text-forest-800">No recipe matches yet</p>
              <p className="mt-2 text-muted">Try another ingredient, or clear the filters.</p>
              <Button className="mt-6" onClick={reset}>
                Show all recipes
              </Button>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
};
