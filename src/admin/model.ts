import { BUILT_IN_BASE } from '../data/products';
import type { Catalog, CatalogPack, CatalogProduct } from '../data/catalog';
import type { PriceTable } from '../data/prices';

/**
 * The admin page edits one list of products. It is built from three places and saved back into two files:
 *   - HMT and JSR as written in products.ts (BUILT_IN_BASE)
 *   - public/catalog.json: products added later, extra pack sizes, and name or picture changes
 *   - public/prices.json:  today's price, MRP and stock for every pack of every product
 */

export interface EditPack {
  size: string;
  weightKg: number;
  /** Text while typing, so an empty box stays empty instead of turning into 0. */
  price: string;
  mrp: string;
  inStock: boolean;
  /** One of HMT or JSR's own packs: can be repriced but not removed. */
  builtIn: boolean;
}

export interface NewImage {
  /** Path inside the website, e.g. "products/basmati-rice-202610131045.webp". */
  sitePath: string;
  base64: string;
  previewUrl: string;
}

export interface EditProduct {
  slug: string;
  builtIn: boolean;
  name: string;
  shortName: string;
  subTitle: string;
  description: string;
  /** As stored: "products/x.jpg", a full https address, or HMT/JSR's bundled picture. */
  image: string;
  imageFit: 'cover' | 'contain';
  newImage?: NewImage;
  inStock: boolean;
  packs: EditPack[];
}

export const PACK_CHOICES = ['5kg Bag', '10kg Bag', '26kg Bag', '50kg Bag'];

/** "5 kg", "5KG bag" and "5kg Bag" all become "5kg Bag". Anything else is kept as typed. */
export const tidyPackSize = (raw: string): string => {
  const s = raw.trim().replace(/\s+/g, ' ');
  const kg = s.match(/^(\d+(?:\.\d+)?)\s*kg\s*(?:bags?)?$/i);
  return kg ? `${kg[1]}kg Bag` : s;
};

/** Weight used to sort packs: the total in brackets for lots ("26kg x 5 Bags (130kg)"), else the first number. */
export const packWeight = (size: string): number => {
  const total = size.match(/\((\d+(?:\.\d+)?)\s*kg\)/i);
  const first = size.match(/(\d+(?:\.\d+)?)\s*kg/i);
  return Number(total?.[1] ?? first?.[1] ?? 0);
};

/** "LG Gold Basmati Rice" -> "basmati-rice". */
export const slugFromName = (name: string): string =>
  name
    .replace(/^\s*lg\s*gold\s*/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const num = (s: string): number => Number(s.replace(/[^0-9.]/g, ''));

const sortPacks = (packs: EditPack[]) => packs.sort((a, b) => a.weightKg - b.weightKg);

export function buildModel(catalog: Catalog, prices: PriceTable): EditProduct[] {
  const out = new Set(prices.outOfStock ?? []);
  const entries = new Map((catalog.products ?? []).filter((c) => c?.slug).map((c) => [c.slug, c]));

  const withPrice = (slug: string, size: string, fallback: { price: number; mrp: number }, builtIn: boolean, weightKg: number): EditPack => {
    const p = prices.prices?.[slug]?.[size];
    const price = p?.price && p.price > 0 ? p.price : fallback.price;
    const mrp = p?.mrp && p.mrp >= price ? p.mrp : Math.max(fallback.mrp, price);
    return { size, weightKg: weightKg || packWeight(size), price: String(price), mrp: String(mrp), inStock: p?.inStock !== false, builtIn };
  };

  const products: EditProduct[] = BUILT_IN_BASE.map((base) => {
    const c = entries.get(base.slug);
    const packs = base.packs.map((o) => withPrice(base.slug, o.size, o, true, o.weightKg));
    for (const extra of c?.packs ?? []) {
      if (packs.some((p) => p.size === extra.size)) continue;
      packs.push(withPrice(base.slug, extra.size, { price: extra.price, mrp: extra.mrp ?? extra.price }, false, extra.weightKg ?? 0));
    }
    return {
      slug: base.slug,
      builtIn: true,
      name: c?.name || base.name,
      shortName: c?.shortName || base.shortName,
      subTitle: c?.subTitle ?? base.subTitle,
      description: c?.description || base.description,
      image: c?.image || base.image,
      imageFit: c?.imageFit ?? base.imageFit,
      inStock: !out.has(base.slug),
      packs: sortPacks(packs),
    };
  });

  for (const c of catalog.products ?? []) {
    if (!c?.slug || BUILT_IN_BASE.some((b) => b.slug === c.slug)) continue;
    products.push({
      slug: c.slug,
      builtIn: false,
      name: c.name ?? '',
      shortName: c.shortName ?? '',
      subTitle: c.subTitle ?? '',
      description: c.description ?? '',
      image: c.image ?? '',
      imageFit: c.imageFit ?? 'contain',
      inStock: !out.has(c.slug),
      packs: sortPacks(
        (c.packs ?? []).map((p) => withPrice(c.slug, p.size, { price: p.price, mrp: p.mrp ?? p.price }, false, p.weightKg ?? 0)),
      ),
    });
  }
  return products;
}

/** Problems that stop a save, keyed by product slug. An empty object means everything is fine. */
export function validate(products: EditProduct[]): Record<string, string[]> {
  const problems: Record<string, string[]> = {};
  const add = (slug: string, msg: string) => (problems[slug] ??= []).push(msg);
  const slugs = new Set<string>();

  for (const p of products) {
    if (!p.name.trim()) add(p.slug, 'The product needs a name.');
    if (!p.image && !p.newImage) add(p.slug, 'The product needs a photo.');
    if (slugs.has(p.slug)) add(p.slug, `Two products have the web address "${p.slug}". Change one of the names.`);
    slugs.add(p.slug);
    if (p.packs.length === 0) add(p.slug, 'The product needs at least one pack size with a price.');

    const sizes = new Set<string>();
    for (const pack of p.packs) {
      const key = pack.size.toLowerCase();
      if (sizes.has(key)) add(p.slug, `"${pack.size}" is listed twice.`);
      sizes.add(key);
      const price = num(pack.price);
      if (!pack.price.trim() || !Number.isFinite(price) || price < 10 || price > 500000) {
        add(p.slug, `Enter a price in rupees for ${pack.size} (between ₹10 and ₹5,00,000).`);
      } else if (pack.mrp.trim() && num(pack.mrp) < price) {
        add(p.slug, `${pack.size}: the MRP (crossed-out price) cannot be lower than the price.`);
      }
    }
  }
  return problems;
}

const todayInIndia = () =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

/**
 * Turns the edited list back into catalog.json and prices.json.
 * Fields the page does not know about are kept, so files written by the GitHub forms survive a save.
 */
export function serialize(products: EditProduct[], original: { catalog: Catalog; prices: PriceTable }): { catalog: Catalog; prices: PriceTable } {
  const origEntries = new Map((original.catalog.products ?? []).map((c) => [c.slug, c]));
  const catalogProducts: CatalogProduct[] = [];
  const priceTable: PriceTable['prices'] = {};
  const outOfStock: string[] = [];

  for (const p of products) {
    const packs = p.packs.map((pack) => {
      const price = num(pack.price);
      const mrp = pack.mrp.trim() ? Math.max(num(pack.mrp), price) : price;
      return { pack, price, mrp };
    });

    // Every pack's price, MRP and stock go into prices.json, the one place the site and the price form both read.
    priceTable[p.slug] = Object.fromEntries(
      packs.map(({ pack, price, mrp }) => [pack.size, pack.inStock ? { price, mrp } : { price, mrp, inStock: false }]),
    );
    if (!p.inStock) outOfStock.push(p.slug);

    const entry: CatalogProduct = { ...(origEntries.get(p.slug) ?? {}), slug: p.slug };
    const base = BUILT_IN_BASE.find((b) => b.slug === p.slug);
    const setText = (key: 'name' | 'shortName' | 'subTitle' | 'description', value: string) => {
      // For HMT and JSR only differences from products.ts are stored; added products store everything.
      if (base && value === base[key]) delete entry[key];
      else if (value.trim() || !base) entry[key] = value.trim();
    };
    setText('name', p.name);
    setText('shortName', p.shortName || p.name);
    setText('subTitle', p.subTitle);
    setText('description', p.description);

    if (p.newImage) entry.image = p.newImage.sitePath;
    else if (!base || p.image !== base.image) entry.image = p.image;
    else delete entry.image;
    if (base && p.imageFit === base.imageFit) delete entry.imageFit;
    else entry.imageFit = p.imageFit;

    const extraPacks: CatalogPack[] = packs
      .filter(({ pack }) => !pack.builtIn)
      .map(({ pack, price, mrp }) => ({ size: pack.size, weightKg: pack.weightKg, price, mrp }));
    if (extraPacks.length) entry.packs = extraPacks;
    else delete entry.packs;

    // HMT and JSR with nothing changed need no catalog entry at all.
    const onlySlug = Object.keys(entry).length === 1;
    if (!(base && onlySlug)) catalogProducts.push(entry);
  }

  return {
    catalog: { ...original.catalog, products: catalogProducts },
    prices: { updated: todayInIndia(), outOfStock, prices: priceTable },
  };
}

/** The two files as they will be written, for comparing and saving. `updated` is left out so a save-less reload is not "a change". */
export const fileText = (data: unknown): string => JSON.stringify(data, null, 2) + '\n';

export const hasChanges = (products: EditProduct[], original: { catalog: Catalog; prices: PriceTable }): boolean => {
  if (products.some((p) => p.newImage)) return true;
  const now = serialize(products, original);
  const before = serialize(buildModel(original.catalog, original.prices), original);
  return fileText(now.catalog) !== fileText(before.catalog) || fileText({ ...now.prices, updated: '' }) !== fileText({ ...before.prices, updated: '' });
};
