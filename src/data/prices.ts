import { PRODUCTS } from './products';
import { BRAND_CONFIG } from '../config/brandConfig';

/**
 * Daily prices live outside the code, so changing them never needs a developer:
 *   1. public/prices.json (edit the file, the site picks it up on the next visit after deploy), or
 *   2. a published Google Sheet (set BRAND_CONFIG.pricesCsvUrl), which updates the site instantly.
 * If neither can be loaded, the prices written in products.ts are used.
 * See docs/updating-prices.md.
 */

export interface PriceEntry {
  price: number;
  mrp: number;
}

export interface PriceTable {
  updated?: string;
  prices: Record<string, Record<string, PriceEntry>>;
}

/** Date of the prices currently shown, as YYYY-MM-DD. Null when the built-in defaults are in use. */
export const priceInfo: { updated: string | null } = { updated: null };

const isPositive = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n) && n > 0;

export const formatPriceDate = (iso: string | null): string | null => {
  if (!iso) return null;
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

/** Writes the table's prices into the product catalogue. Ignores unknown products, packs and bad numbers. */
export const applyPrices = (table: PriceTable): number => {
  let applied = 0;
  for (const product of PRODUCTS) {
    const forProduct = table.prices[product.slug];
    if (!forProduct) continue;
    for (const pack of product.packOptions) {
      const entry = forProduct[pack.size];
      if (entry && isPositive(entry.price)) {
        pack.retailPrice = entry.price;
        pack.mrp = isPositive(entry.mrp) && entry.mrp >= entry.price ? entry.mrp : entry.price;
        applied++;
      }
    }
  }
  if (applied > 0 && table.updated) priceInfo.updated = table.updated;
  return applied;
};

/** Parses a Google Sheet exported as CSV. Columns: slug, pack, price, mrp. A row "updated,2026-10-12" sets the date. */
export const parsePriceCsv = (csv: string): PriceTable => {
  const table: PriceTable = { prices: {} };
  for (const line of csv.split(/\r?\n/)) {
    const cells = line.split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
    if (cells.length < 2) continue;
    const [slug, pack, price, mrp] = cells;
    if (slug.toLowerCase() === 'updated') {
      table.updated = pack;
      continue;
    }
    const p = Number(price.replace(/[^0-9.]/g, ''));
    const m = Number((mrp ?? '').replace(/[^0-9.]/g, ''));
    if (!slug || !pack || !isPositive(p)) continue;
    (table.prices[slug] ??= {})[pack] = { price: p, mrp: isPositive(m) ? m : p };
  }
  return table;
};

const fetchWithTimeout = async (url: string, ms: number): Promise<Response> => {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { cache: 'no-store', signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
};

/** Loads today's prices. Never throws: on any failure the built-in prices stay. */
export const loadPrices = async (): Promise<void> => {
  const csvUrl = BRAND_CONFIG.pricesCsvUrl;
  if (csvUrl) {
    try {
      const res = await fetchWithTimeout(csvUrl, 2500);
      if (res.ok && applyPrices(parsePriceCsv(await res.text())) > 0) return;
    } catch {
      /* fall through to prices.json */
    }
  }
  try {
    const res = await fetchWithTimeout(`${import.meta.env.BASE_URL}prices.json?t=${Date.now()}`, 2500);
    if (res.ok) applyPrices((await res.json()) as PriceTable);
  } catch {
    /* keep the prices written in products.ts */
  }
};
