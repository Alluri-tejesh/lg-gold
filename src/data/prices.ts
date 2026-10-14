import { PRODUCTS } from './products';
import { BRAND_CONFIG } from '../config/brandConfig';

/**
 * Prices, MRPs and stock are set on the admin page and stored in the database (see data/storefront.ts).
 * When the shop server cannot be reached, these fallbacks are used instead:
 *   1. a published Google Sheet (BRAND_CONFIG.pricesCsvUrl), then
 *   2. public/prices.json, then
 *   3. the prices written in products.ts.
 */

export interface PriceEntry {
  price: number;
  mrp: number;
  /** Set to false to mark just this pack as out of stock. */
  inStock?: boolean;
}

export interface PriceTable {
  updated?: string;
  /** Product slugs that are out of stock in every pack, e.g. ["hmt-rice"]. */
  outOfStock?: string[];
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
  const outOfStock = new Set(table.outOfStock ?? []);
  for (const product of PRODUCTS) {
    const forProduct = table.prices?.[product.slug];
    for (const pack of product.packOptions) {
      const entry = forProduct?.[pack.size];
      if (entry && isPositive(entry.price)) {
        pack.retailPrice = entry.price;
        pack.mrp = isPositive(entry.mrp) && entry.mrp >= entry.price ? entry.mrp : entry.price;
        applied++;
      }
      // Stock: the whole product, or just this pack, can be switched off. Everything else is in stock.
      pack.inStock = !(outOfStock.has(product.slug) || entry?.inStock === false);
    }
  }
  if (table.updated) priceInfo.updated = table.updated;
  return applied + outOfStock.size;
};

/**
 * Parses a Google Sheet exported as CSV. Columns: slug, pack, price, mrp, stock.
 * Put "out" in the stock column to mark one pack out of stock.
 * Special rows: "updated,2026-10-12" sets the date, and "outofstock,hmt-rice" marks a whole product out of stock.
 */
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
    if (slug.toLowerCase() === 'outofstock') {
      (table.outOfStock ??= []).push(pack);
      continue;
    }
    const p = Number((price ?? '').replace(/[^0-9.]/g, ''));
    const m = Number((mrp ?? '').replace(/[^0-9.]/g, ''));
    if (!slug || !pack || !isPositive(p)) continue;
    const stock = (cells[4] ?? '').toLowerCase();
    (table.prices[slug] ??= {})[pack] = {
      price: p,
      mrp: isPositive(m) ? m : p,
      inStock: !['out', 'no', 'false', '0'].includes(stock),
    };
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
      const res = await fetchWithTimeout(csvUrl, 1500);
      if (res.ok && applyPrices(parsePriceCsv(await res.text())) > 0) return;
    } catch {
      /* fall through to prices.json */
    }
  }
  try {
    const res = await fetchWithTimeout(`${import.meta.env.BASE_URL}prices.json?t=${Date.now()}`, 1500);
    if (res.ok) applyPrices((await res.json()) as PriceTable);
  } catch {
    /* keep the prices written in products.ts */
  }
};
