import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Clock,
  ChefHat,
  Users,
  Flame,
  Printer,
  Share2,
  ShoppingBag,
  Timer,
  Check,
  Minus,
  Plus,
  ChefHat as CookIcon,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  ArrowRight,
  Utensils,
} from 'lucide-react';
import { RECIPES, getRecipeBySlug } from '../data/recipes';
import { PRODUCTS } from '../data/products';
import { scaleAmount, findTimers } from '../data/recipeTools';
import { useCart } from '../context/CartContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { RecipeImage } from '../components/common/RecipeArt';
import { RecipeCard } from '../components/common/RecipeCard';
import { useKitchenTimers, TimerTray } from '../components/common/KitchenTimers';
import { setPageMeta } from '../router';
import { Container, Section, Badge } from '../components/ui/Section';
import { Button } from '../components/ui/Button';
import { Dialog } from '../components/ui/Dialog';
import { AppLink } from '../components/ui/AppLink';
import { toast } from '../components/ui/Toast';
import { NotFoundView } from './NotFoundView';
import { flyToCart } from '../components/fx/flyToCart';

interface RecipeDetailViewProps {
  recipeSlug: string;
  onNavigate: (route: string, param?: string) => void;
}

export const RecipeDetailView: React.FC<RecipeDetailViewProps> = ({ recipeSlug, onNavigate }) => {
  const recipe = getRecipeBySlug(recipeSlug);
  if (!recipe) return <NotFoundView />;
  return <RecipePage recipeSlug={recipe.slug} onNavigate={onNavigate} />;
};

/** Keeps the phone screen on while cooking (where the browser supports it). */
function useWakeLock(on: boolean) {
  useEffect(() => {
    if (!on) return;
    type Sentinel = { release: () => Promise<void> };
    let lock: Sentinel | null = null;
    const nav = navigator as Navigator & { wakeLock?: { request: (t: 'screen') => Promise<Sentinel> } };
    const request = () => nav.wakeLock?.request('screen').then((l) => (lock = l)).catch(() => {});
    request();
    // The lock is dropped when the tab is hidden; take it again when the cook comes back.
    const onVisible = () => document.visibilityState === 'visible' && request();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      lock?.release().catch(() => {});
    };
  }, [on]);
}

const RecipePage: React.FC<RecipeDetailViewProps> = ({ recipeSlug, onNavigate }) => {
  const recipe = getRecipeBySlug(recipeSlug)!;
  const product = PRODUCTS.find((p) => p.id === recipe.recommendedProductId) || PRODUCTS[0];
  const { addToCart } = useCart();
  const { timers, start, cancel } = useKitchenTimers();

  const [servings, setServings] = useState(recipe.servings);
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [done, setDone] = useState<Set<number>>(new Set());
  const [cookMode, setCookMode] = useState(false);
  const [cookStep, setCookStep] = useState(0);
  useWakeLock(cookMode);

  const factor = servings / recipe.servings;
  const stepsRef = useRef<HTMLOListElement>(null);
  const related = useMemo(
    () => RECIPES.filter((r) => r.id !== recipe.id && r.categories.some((c) => recipe.categories.includes(c))).slice(0, 3),
    [recipe.id],
  );

  useEffect(() => {
    setPageMeta({ route: 'recipe-detail', param: recipe.slug }, { title: `${recipe.title} Recipe`, description: recipe.shortDescription });
    // Recipe details for search engines (cooking time, servings, ingredients, steps).
    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: recipe.title,
      description: recipe.shortDescription,
      recipeCuisine: recipe.cuisine,
      recipeCategory: recipe.categories[0],
      prepTime: `PT${recipe.prepTimeMinutes}M`,
      cookTime: `PT${recipe.cookTimeMinutes}M`,
      totalTime: `PT${recipe.totalTimeMinutes}M`,
      recipeYield: `${recipe.servings} servings`,
      recipeIngredient: recipe.ingredients.map((i) => `${i.amount} ${i.item}`),
      recipeInstructions: recipe.instructions.map((s) => ({ '@type': 'HowToStep', text: s.instruction })),
      author: { '@type': 'Organization', name: 'LG Gold Rice' },
    });
    document.head.appendChild(ld);
    return () => ld.remove();
  }, [recipe.slug]);

  const toggle = (set: Set<number>, setter: (s: Set<number>) => void, i: number) => {
    const next = new Set(set);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    setter(next);
  };

  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: recipe.title, text: recipe.shortDescription, url: window.location.href });
      else {
        await navigator.clipboard.writeText(window.location.href);
        toast({ message: 'Recipe link copied.' });
      }
    } catch {
      /* closed the share sheet */
    }
  };

  const meta = [
    { icon: Clock, label: 'Prep', value: `${recipe.prepTimeMinutes} min` },
    { icon: Flame, label: 'Cook', value: `${recipe.cookTimeMinutes} min` },
    { icon: Utensils, label: 'Total', value: `${recipe.totalTimeMinutes} min` },
    { icon: ChefHat, label: 'Level', value: recipe.difficulty },
  ];

  const StepTimers: React.FC<{ text: string; n: number; dark?: boolean }> = ({ text, n, dark }) => {
    const found = findTimers(text);
    if (!found.length) return null;
    return (
      <div className="mt-3 flex flex-wrap gap-2">
        {found.map((t) => (
          <button
            key={t.minutes}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              start(t.minutes, `Step ${n}: ${t.minutes} min`);
            }}
            className={`no-print inline-flex min-h-10 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold transition-colors cursor-pointer ${
              dark ? 'bg-gold-500 text-forest-900 hover:bg-gold-400' : 'bg-gold-100 text-gold-700 ring-1 ring-gold-300 hover:bg-gold-300/60'
            }`}
          >
            <Timer className="h-4 w-4" /> Start {t.minutes}-min timer
          </button>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="no-print border-b border-line bg-paper">
        <Container className="py-3">
          <Breadcrumbs items={[{ label: 'Recipes', route: 'recipes' }, { label: recipe.title }]} onNavigate={onNavigate} />
        </Container>
      </div>

      {/* Hero */}
      <section className="bg-paper">
        <Container className="grid items-center gap-10 py-8 lg:grid-cols-2 lg:py-12">
          <div>
            <div className="flex flex-wrap gap-2">
              {recipe.categories.slice(0, 4).map((c) => (
                <Badge key={c} tone="cream">
                  {c}
                </Badge>
              ))}
            </div>
            <h1 className="mt-4 font-display text-4xl font-medium leading-[1.08] text-forest-800 sm:text-5xl">{recipe.title}</h1>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">{recipe.fullDescription}</p>
            <dl className="mt-6 grid grid-cols-4 divide-x divide-line rounded-2xl bg-cream ring-1 ring-line">
              {meta.map((m) => (
                <div key={m.label} className="px-2 py-3 text-center sm:px-4">
                  <m.icon className="mx-auto h-5 w-5 text-gold-600" aria-hidden="true" />
                  <dt className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted">{m.label}</dt>
                  <dd className="font-semibold text-forest-800">{m.value}</dd>
                </div>
              ))}
            </dl>
            <div className="no-print mt-6 flex flex-wrap gap-3">
              <Button
                size="lg"
                icon={<CookIcon className="h-5 w-5 text-gold-400" />}
                onClick={() => {
                  setCookStep(0);
                  setCookMode(true);
                }}
              >
                Start cook mode
              </Button>
              <Button variant="outline" icon={<Printer className="h-4 w-4" />} onClick={() => window.print()}>
                Print
              </Button>
              <Button variant="outline" icon={<Share2 className="h-4 w-4" />} onClick={share}>
                Share
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl ring-1 ring-line shadow-lift">
            <RecipeImage recipe={recipe} className="aspect-[4/3] h-full w-full object-cover" />
          </div>
        </Container>
      </section>

      <Section tone="cream" tight>
        <Container className="grid gap-8 lg:grid-cols-12">
          {/* Ingredients */}
          <aside className="lg:col-span-5">
            <div className="rounded-3xl bg-white p-6 ring-1 ring-line shadow-soft lg:sticky lg:top-24">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display text-3xl text-forest-800">Ingredients</h2>
                {/* Servings scaler: amounts below update as it changes */}
                <div className="no-print flex items-center gap-2">
                  <Users className="h-4 w-4 text-gold-600" aria-hidden="true" />
                  <div className="flex items-center rounded-full bg-cream ring-1 ring-line" role="group" aria-label="Servings">
                    <button type="button" aria-label="Fewer servings" onClick={() => setServings(Math.max(1, servings - 1))} className="grid h-10 w-10 place-items-center rounded-full text-forest-800 hover:bg-white cursor-pointer">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-16 text-center text-sm font-semibold tabular" aria-live="polite">
                      Serves {servings}
                    </span>
                    <button type="button" aria-label="More servings" onClick={() => setServings(Math.min(50, servings + 1))} className="grid h-10 w-10 place-items-center rounded-full text-forest-800 hover:bg-white cursor-pointer">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              {factor !== 1 && (
                <p className="mt-2 text-sm text-muted">
                  Amounts adjusted from {recipe.servings} to {servings} servings.{' '}
                  <button type="button" onClick={() => setServings(recipe.servings)} className="font-semibold text-forest-800 underline underline-offset-2 cursor-pointer">
                    Reset
                  </button>
                </p>
              )}
              <ul className="mt-5 space-y-2">
                {recipe.ingredients.map((ing, i) => {
                  const on = checked.has(i);
                  return (
                    <li key={i}>
                      <label className={`flex min-h-12 cursor-pointer items-start gap-3 rounded-2xl px-3 py-2.5 transition-colors ${on ? 'bg-cream/60' : 'hover:bg-cream/60'} ${ing.isLGGoldRice ? 'ring-1 ring-gold-300 bg-gold-50' : ''}`}>
                        <input type="checkbox" checked={on} onChange={() => toggle(checked, setChecked, i)} className="mt-1 h-5 w-5 shrink-0 accent-forest-800" />
                        <span className={on ? 'text-muted line-through' : ''}>
                          <span className="block font-semibold text-ink">{ing.item}</span>
                          <span className="block text-[15px] text-ink-soft">{scaleAmount(ing.amount, factor)}</span>
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>

              {/* The rice in this recipe */}
              <div className="no-print mt-6 flex items-center gap-4 rounded-2xl bg-forest-800 p-4 text-cream">
                <img
                  src={product.images.primary}
                  alt=""
                  className={`h-16 w-16 shrink-0 rounded-xl bg-white ${product.images.primaryFit === 'contain' ? 'object-contain p-1' : 'object-cover'}`}
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-400">Made with</p>
                  <AppLink to="product-detail" param={product.slug} className="block truncate font-display text-xl text-white hover:underline">
                    {product.name}
                  </AppLink>
                </div>
                <Button variant="gold" size="sm" icon={<ShoppingBag className="h-4 w-4" />} onClick={(e) => {
                    addToCart(product, '26kg Bag', 1);
                    flyToCart(e.currentTarget);
                  }}>
                  Add 26kg
                </Button>
              </div>
            </div>
          </aside>

          {/* Steps */}
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="font-display text-3xl text-forest-800">Method</h2>
              <p className="text-sm font-semibold text-muted" aria-live="polite">
                {done.size} of {recipe.instructions.length} steps done
              </p>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-cream-deep" aria-hidden="true">
              <div className="h-full rounded-full bg-gold-500 transition-[width] duration-500" style={{ width: `${(done.size / recipe.instructions.length) * 100}%` }} />
            </div>
            <ol ref={stepsRef} className="mt-6 space-y-4">
              {recipe.instructions.map((s, i) => {
                const on = done.has(i);
                return (
                  <li key={s.stepNumber} className={`rounded-3xl p-5 ring-1 transition-colors sm:p-6 ${on ? 'bg-forest-50 ring-forest-200' : 'bg-white ring-line shadow-soft'}`}>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => toggle(done, setDone, i)}
                        aria-pressed={on}
                        aria-label={on ? `Mark step ${s.stepNumber} not done` : `Mark step ${s.stepNumber} done`}
                        className={`grid h-11 w-11 shrink-0 place-items-center rounded-full font-display text-lg tabular transition-colors cursor-pointer ${
                          on ? 'bg-forest-700 text-white' : 'bg-cream text-forest-800 ring-1 ring-line hover:ring-forest-700'
                        }`}
                      >
                        {on ? <Check className="h-5 w-5" /> : s.stepNumber}
                      </button>
                      <div className="min-w-0 flex-1 pt-1.5">
                        <p className={`text-[17px] leading-relaxed ${on ? 'text-muted' : 'text-ink'}`}>{s.instruction}</p>
                        {!on && <StepTimers text={s.instruction} n={s.stepNumber} />}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>

            {recipe.chefTips && recipe.chefTips.length > 0 && (
              <div className="mt-8 rounded-3xl bg-gold-50 p-6 ring-1 ring-gold-300">
                <p className="flex items-center gap-2 font-semibold text-gold-700">
                  <Lightbulb className="h-5 w-5" aria-hidden="true" /> Tips from the mill kitchen
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-ink-soft">
                  {recipe.chefTips.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            )}
            {recipe.nutritionPerServing && <p className="mt-6 text-sm text-muted">Nutrition: {recipe.nutritionPerServing}.</p>}
          </div>
        </Container>
      </Section>

      {related.length > 0 && (
        <Section tone="paper" className="no-print">
          <Container>
            <div className="mb-8 flex items-end justify-between gap-4">
              <h2 className="font-display text-3xl text-forest-800">You might also like</h2>
              <AppLink to="recipes" className="inline-flex items-center gap-1.5 font-semibold text-forest-800 hover:underline">
                All recipes <ArrowRight className="h-4 w-4" />
              </AppLink>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <RecipeCard key={r.id} recipe={r} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Cook mode: one big step at a time, screen kept awake */}
      <Dialog open={cookMode} onClose={() => setCookMode(false)} label="Cook mode" dark className="!fixed !inset-0 !m-0 !h-[100dvh] !max-h-none !w-full !max-w-none !rounded-none !bg-forest-950 text-cream">
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-4 border-b border-white/10 px-5 py-4 pr-16">
            <CookIcon className="h-6 w-6 text-gold-400" aria-hidden="true" />
            <div className="min-w-0">
              <p className="truncate font-display text-xl text-white">{recipe.title}</p>
              <p className="text-sm text-cream/60">
                Step {cookStep + 1} of {recipe.instructions.length} · screen stays on
              </p>
            </div>
          </div>
          <div className="h-1 bg-white/10">
            <div className="h-full bg-gold-500 transition-[width] duration-500" style={{ width: `${((cookStep + 1) / recipe.instructions.length) * 100}%` }} />
          </div>
          <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-10 text-center">
            <p className="font-display text-7xl text-gold-500/60">{cookStep + 1}</p>
            <p key={cookStep} className="mt-6 max-w-3xl animate-slide-up text-2xl leading-relaxed text-white sm:text-3xl">
              {recipe.instructions[cookStep].instruction}
            </p>
            <StepTimers text={recipe.instructions[cookStep].instruction} n={cookStep + 1} dark />
          </div>
          <div className="flex gap-3 border-t border-white/10 p-4 pb-safe">
            <Button variant="outline-light" size="lg" className="flex-1" disabled={cookStep === 0} icon={<ChevronLeft className="h-5 w-5" />} onClick={() => setCookStep(cookStep - 1)}>
              Back
            </Button>
            {cookStep < recipe.instructions.length - 1 ? (
              <Button variant="gold" size="lg" className="flex-[2]" iconRight={<ChevronRight className="h-5 w-5" />} onClick={() => setCookStep(cookStep + 1)}>
                Next step
              </Button>
            ) : (
              <Button
                variant="gold"
                size="lg"
                className="flex-[2]"
                icon={<Check className="h-5 w-5" />}
                onClick={() => {
                  setDone(new Set(recipe.instructions.map((_, i) => i)));
                  setCookMode(false);
                  toast({ message: 'Enjoy your meal!' });
                }}
              >
                Finish
              </Button>
            )}
          </div>
        </div>
        <TimerTray timers={timers} onCancel={cancel} />
      </Dialog>

      {!cookMode && <TimerTray timers={timers} onCancel={cancel} />}
    </>
  );
};
