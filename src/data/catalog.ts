import { PRODUCTS } from './products';
import { Product, PackOption } from '../types';

/**
 * Products added later, extra pack sizes and photo changes: the admin page saves them to the database in this shape.
 * public/catalog.json holds the same shape as the starting data for a new database and the offline fallback.
 */

export interface CatalogPack {
  size: string;
  weightKg?: number;
  price: number;
  mrp?: number;
  packaging?: string;
}

export interface CatalogProduct {
  slug: string;
  name?: string;
  shortName?: string;
  subTitle?: string;
  description?: string;
  /** Path under public/ (for example "products/basmati.jpg") or a full https address. */
  image?: string;
  imageFit?: 'cover' | 'contain';
  packs?: CatalogPack[];
}

export interface Catalog {
  products: CatalogProduct[];
}

const isPositive = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n) && n > 0;

/** Turns "products/x.jpg" into a path that works wherever the site is hosted. */
export const resolveImage = (path: string): string =>
  /^(https?:)?\/\//.test(path) || path.startsWith('data:') ? path : `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;

const toPack = (p: CatalogPack): PackOption | null => {
  if (!p.size || !isPositive(p.price)) return null;
  const kg = p.weightKg ?? Number(p.size.match(/(\d+(?:\.\d+)?)\s*kg/i)?.[1] ?? 0);
  return {
    size: p.size,
    weightKg: kg,
    retailPrice: p.price,
    mrp: isPositive(p.mrp) && p.mrp >= p.price ? p.mrp : p.price,
    inStock: true,
    isPopular: false,
    packagingType: p.packaging || 'Heavy Duty PP Bag',
  };
};

const mergePacks = (product: Product, packs: CatalogPack[] | undefined) => {
  for (const raw of packs ?? []) {
    const pack = toPack(raw);
    if (!pack) continue;
    const existing = product.packOptions.find((o) => o.size === pack.size);
    if (existing) Object.assign(existing, { retailPrice: pack.retailPrice, mrp: pack.mrp, weightKg: pack.weightKg || existing.weightKg });
    else product.packOptions.push(pack);
  }
};

const setImage = (product: Product, image: string, fit?: 'cover' | 'contain') => {
  const src = resolveImage(image);
  product.images.primary = src;
  product.images.packaging = src;
  if (product.images.gallery.length > 0) product.images.gallery[0] = src;
  else product.images.gallery = [src];
  if (fit) product.images.primaryFit = fit;
};

const buildProduct = (c: CatalogProduct): Product | null => {
  if (!c.name || !c.image || !c.packs?.some((p) => isPositive(p.price))) return null;
  const src = resolveImage(c.image);
  const product: Product = {
    id: c.slug,
    slug: c.slug,
    detailed: false,
    name: c.name,
    shortName: c.shortName || c.name,
    subTitle: c.subTitle ?? '',
    description: c.description ?? '',
    longDescription: c.description ?? '',
    featured: true,
    images: {
      primary: src,
      primaryFit: c.imageFit ?? 'contain',
      packaging: src,
      rawGrain: src,
      cookedDish: src,
      gallery: [src],
    },
    packOptions: [],
    grainSpecs: {
      variety: c.shortName || c.name,
      grainLength: '',
      aging: '',
      moistureContent: '',
      brokenGrainPercentage: '',
      color: '',
      polish: '',
      sortexCleaned: false,
    },
    cookingGuide: { waterRatio: '', soakingTime: '', cookingTime: '', idealDishes: [], tips: '' },
    nutritionalInfo: { calories: '', carbohydrates: '', protein: '', fat: '', fiber: '', iron: '' },
    availability: { retail: true, wholesale: true, export: true },
    tags: [],
    rating: 0,
    reviewCount: 0,
  };
  mergePacks(product, c.packs);
  return product.packOptions.length > 0 ? product : null;
};

/** Merges the catalog into PRODUCTS in place. Bad entries are skipped, never fatal. */
export const applyCatalog = (catalog: Catalog): number => {
  let changed = 0;
  for (const entry of catalog.products ?? []) {
    if (!entry?.slug) continue;
    const existing = PRODUCTS.find((p) => p.slug === entry.slug);
    if (existing) {
      if (entry.name) existing.name = entry.name;
      if (entry.shortName) existing.shortName = entry.shortName;
      if (entry.subTitle) existing.subTitle = entry.subTitle;
      if (entry.description) {
        existing.description = entry.description;
        existing.longDescription = entry.description;
      }
      if (entry.image) setImage(existing, entry.image, entry.imageFit);
      mergePacks(existing, entry.packs);
      changed++;
    } else {
      const product = buildProduct(entry);
      if (product) {
        PRODUCTS.push(product);
        changed++;
      }
    }
  }
  // Packs added later (a 5kg bag next to the 26kg one) appear in size order: 5kg, 10kg, 26kg, 26kg x 5 ...
  for (const product of PRODUCTS) product.packOptions.sort((a, b) => a.weightKg - b.weightKg);
  return changed;
};

export const loadCatalog = async (): Promise<void> => {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 1500);
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}catalog.json?t=${Date.now()}`, { cache: 'no-store', signal: ctrl.signal });
    if (res.ok) applyCatalog((await res.json()) as Catalog);
  } catch {
    /* keep the built-in products */
  } finally {
    clearTimeout(timer);
  }
};
