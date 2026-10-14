import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, CornerDownLeft, Clock, Store, UtensilsCrossed, FileText, ArrowRight, X } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { RECIPES } from '../../data/recipes';
import { RecipeImage } from './RecipeArt';
import { Dialog } from '../ui/Dialog';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string, param?: string) => void;
}

interface Hit {
  key: string;
  kind: 'product' | 'recipe' | 'page';
  title: string;
  meta: string;
  route: string;
  param?: string;
  thumb?: React.ReactNode;
  score: number;
}

const PAGES = [
  { title: 'Wholesale supply', meta: 'Trade rates for shops, hotels and caterers', route: 'wholesale', words: 'wholesale trade bulk shop retailer supermarket hotel catering' },
  { title: 'Truckloads & bulk', meta: 'Tonnes and truckloads', route: 'bulk', words: 'bulk tonnes ton truck lorry' },
  { title: 'Export enquiries', meta: '20ft and 40ft containers, FOB and CIF', route: 'export', words: 'export container fcl fob cif international import' },
  { title: 'Quality process', meta: 'Sortex cleaning, ageing and packing', route: 'quality', words: 'quality sortex aged ageing moisture fssai process mill' },
  { title: 'Our mill', meta: 'Sri Lakshmi Ganapathi Trading Company', route: 'about', words: 'about company mill family history story' },
  { title: 'Contact & directions', meta: 'Phone, WhatsApp, map and hours', route: 'contact', words: 'contact phone call whatsapp address map directions hours location' },
  { title: 'All products & prices', meta: 'Today’s rates for every pack', route: 'products', words: 'products price rate buy shop 26kg bag' },
  { title: 'All recipes', meta: 'Biryani, pulao, curd rice and more', route: 'recipes', words: 'recipes cook cooking dishes' },
];

const SUGGESTIONS = ['HMT', 'JSR', 'Biryani', 'Curd rice', 'Wholesale', 'Export', '26kg'];
const RECENT_KEY = 'lg_gold_recent_searches';

const loadRecent = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]').slice(0, 5);
  } catch {
    return [];
  }
};

/** Scores how well every search word matches some text. 0 means at least one word is missing. */
const scoreText = (words: string[], fields: { text: string; weight: number }[]): number => {
  let total = 0;
  for (const w of words) {
    let best = 0;
    for (const f of fields) {
      const t = f.text.toLowerCase();
      const i = t.indexOf(w);
      if (i === -1) continue;
      const startsWord = i === 0 || /\W/.test(t[i - 1]);
      best = Math.max(best, f.weight * (startsWord ? 2 : 1));
    }
    if (!best) return 0;
    total += best;
  }
  return total;
};

/** Wraps the parts of `text` that match a search word in a highlight. */
const Highlight: React.FC<{ text: string; words: string[] }> = ({ text, words }) => {
  if (!words.length) return <>{text}</>;
  const re = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'ig');
  return (
    <>
      {text.split(re).map((part, i) =>
        i % 2 ? (
          <mark key={i} className="rounded bg-gold-100 px-0.5 text-forest-900">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
};

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [recent, setRecent] = useState<string[]>(loadRecent);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActive(0);
    }
  }, [isOpen]);

  const words = useMemo(() => query.toLowerCase().split(/\s+/).filter(Boolean), [query]);

  const hits = useMemo<Hit[]>(() => {
    if (!words.length) return [];
    const products: Hit[] = PRODUCTS.map((p) => ({
      key: `p-${p.slug}`,
      kind: 'product' as const,
      title: p.name,
      meta: `${p.packOptions.length} packs · from ₹${Math.min(...p.packOptions.map((o) => o.retailPrice)).toLocaleString('en-IN')}`,
      route: 'product-detail',
      param: p.slug,
      thumb: <img src={p.images.primary} alt="" className="h-full w-full object-contain" referrerPolicy="no-referrer" />,
      score:
        3 *
        scoreText(words, [
          { text: p.name, weight: 5 },
          { text: p.shortName, weight: 5 },
          { text: p.grainSpecs.variety, weight: 3 },
          { text: p.packOptions.map((o) => o.size).join(' '), weight: 2 },
          { text: p.tags.join(' '), weight: 2 },
          { text: p.description, weight: 1 },
        ]),
    }));
    const recipes: Hit[] = RECIPES.map((r) => ({
      key: `r-${r.slug}`,
      kind: 'recipe' as const,
      title: r.title,
      meta: `${r.totalTimeMinutes} min · ${r.difficulty} · serves ${r.servings}`,
      route: 'recipe-detail',
      param: r.slug,
      thumb: <RecipeImage recipe={r} className="h-full w-full object-cover" />,
      score: scoreText(words, [
        { text: r.title, weight: 5 },
        { text: r.categories.join(' '), weight: 3 },
        { text: r.cuisine, weight: 2 },
        { text: r.ingredients.map((i) => i.item).join(' '), weight: 1 },
        { text: r.shortDescription, weight: 1 },
      ]),
    }));
    const pages: Hit[] = PAGES.map((pg) => ({
      key: `pg-${pg.route}`,
      kind: 'page' as const,
      title: pg.title,
      meta: pg.meta,
      route: pg.route,
      score: 2 * scoreText(words, [
        { text: pg.title, weight: 5 },
        { text: pg.words, weight: 3 },
      ]),
    }));
    const by = (list: Hit[], n: number) => list.filter((h) => h.score > 0).sort((a, b) => b.score - a.score).slice(0, n);
    return [...by(products, 4), ...by(pages, 3), ...by(recipes, 8)];
  }, [words]);

  useEffect(() => setActive(0), [query]);

  // Keep the highlighted result in view while arrowing through the list.
  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const choose = (h: Hit) => {
    if (query.trim()) {
      const next = [query.trim(), ...recent.filter((r) => r.toLowerCase() !== query.trim().toLowerCase())].slice(0, 5);
      setRecent(next);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {
        /* recent searches are a nicety */
      }
    }
    onClose();
    onNavigate(h.route, h.param);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!hits.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => (a + 1) % hits.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => (a - 1 + hits.length) % hits.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      choose(hits[active]);
    }
  };

  const groupLabel = { product: 'Rice', recipe: 'Recipes', page: 'Pages' };
  const groupIcon = { product: Store, recipe: UtensilsCrossed, page: FileText };

  return (
    <Dialog open={isOpen} onClose={onClose} label="Search" placement="top" closeButton={false}>
      <div className="flex items-center gap-3 border-b border-line px-5">
        <Search className="h-5 w-5 shrink-0 text-forest-800" aria-hidden="true" />
        <input
          data-autofocus
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search rice, recipes, wholesale, export…"
          aria-label="Search"
          role="combobox"
          aria-expanded={hits.length > 0}
          aria-controls="search-results"
          aria-activedescendant={hits.length ? `search-hit-${active}` : undefined}
          className="h-16 flex-1 bg-transparent text-lg text-ink placeholder:text-muted/70 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="grid h-10 w-10 place-items-center rounded-full text-muted hover:bg-forest-800/5 cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-2 py-1 text-xs font-semibold text-muted ring-1 ring-line hover:text-forest-800 cursor-pointer"
        >
          Esc
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {!words.length ? (
          <div className="space-y-6 p-5">
            {recent.length > 0 && (
              <div>
                <p className="mb-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-muted">Recent</p>
                <div className="flex flex-wrap gap-2">
                  {recent.map((r) => (
                    <button key={r} type="button" onClick={() => setQuery(r)} className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-cream px-3.5 text-sm font-medium text-forest-800 ring-1 ring-line hover:ring-forest-700 cursor-pointer">
                      <Clock className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <p className="mb-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-muted">Try</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" onClick={() => setQuery(s)} className="min-h-10 rounded-full bg-white px-3.5 text-sm font-medium text-forest-800 ring-1 ring-line-strong hover:bg-gold-50 hover:ring-gold-500 cursor-pointer">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : hits.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <p className="font-display text-2xl text-forest-800">Nothing found for “{query}”</p>
            <p className="mt-2 text-muted">Try a dish like “biryani”, a rice like “JSR”, or “wholesale”.</p>
          </div>
        ) : (
          <ul id="search-results" role="listbox" ref={listRef} className="p-2">
            {hits.map((h, i) => {
              const showGroup = i === 0 || hits[i - 1].kind !== h.kind;
              const Icon = groupIcon[h.kind];
              return (
                <React.Fragment key={h.key}>
                  {showGroup && (
                    <li role="presentation" className="flex items-center gap-2 px-3 pb-1.5 pt-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-muted">
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" /> {groupLabel[h.kind]}
                    </li>
                  )}
                  <li
                    id={`search-hit-${i}`}
                    data-index={i}
                    role="option"
                    aria-selected={i === active}
                    onMouseMove={() => setActive(i)}
                    onClick={() => choose(h)}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 ${i === active ? 'bg-forest-800 text-white' : 'text-ink'}`}
                  >
                    {h.thumb ? (
                      <span className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-cream">{h.thumb}</span>
                    ) : (
                      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-lg ${i === active ? 'bg-white/10' : 'bg-cream'}`}>
                        <ArrowRight className={`h-5 w-5 ${i === active ? 'text-gold-400' : 'text-gold-600'}`} />
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">
                        <Highlight text={h.title} words={words} />
                      </span>
                      <span className={`block truncate text-sm ${i === active ? 'text-cream/75' : 'text-muted'}`}>{h.meta}</span>
                    </span>
                    {i === active && <CornerDownLeft className="h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />}
                  </li>
                </React.Fragment>
              );
            })}
          </ul>
        )}
      </div>

      <div className="hidden items-center gap-4 border-t border-line bg-cream px-5 py-2.5 text-xs text-muted sm:flex">
        <span><kbd className="rounded bg-white px-1.5 py-0.5 ring-1 ring-line">↑</kbd> <kbd className="rounded bg-white px-1.5 py-0.5 ring-1 ring-line">↓</kbd> to move</span>
        <span><kbd className="rounded bg-white px-1.5 py-0.5 ring-1 ring-line">Enter</kbd> to open</span>
        <span><kbd className="rounded bg-white px-1.5 py-0.5 ring-1 ring-line">Esc</kbd> to close</span>
      </div>
    </Dialog>
  );
};
