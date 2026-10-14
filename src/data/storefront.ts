import { BRAND_CONFIG } from '../config/brandConfig';
import { applyCatalog, Catalog, loadCatalog } from './catalog';
import { applyPrices, loadPrices, PriceTable } from './prices';

/** Delivery and payment settings the admin page can change without a deploy. */
export interface StoreSettings {
  delivery: { freeFromOrderValue: number; charge: number };
  cashOnDelivery: boolean;
  upiId: string;
  upiPayeeName: string;
  /** Customers may sign in with an SMS code. Off: password sign-in only. */
  smsLogin?: boolean;
}

export interface Storefront {
  catalog: Catalog;
  prices: PriceTable;
  settings: StoreSettings;
  version: number;
  updatedAt?: string;
}

const applySettings = (s: StoreSettings) => {
  BRAND_CONFIG.delivery.freeFromOrderValue = s.delivery.freeFromOrderValue;
  BRAND_CONFIG.delivery.charge = s.delivery.charge;
  BRAND_CONFIG.payments.cashOnDelivery = s.cashOnDelivery;
  BRAND_CONFIG.payments.upiId = s.upiId;
  BRAND_CONFIG.payments.upiPayeeName = s.upiPayeeName;
};

/**
 * Loads products, today's prices and shop settings from the server: whatever the admin page last saved.
 * If the server cannot be reached quickly, the files in public/ are used so the shop still opens.
 */
export const loadStorefront = async (): Promise<void> => {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 2500);
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}api/storefront`, { cache: 'no-store', signal: ctrl.signal });
    if (!res.ok) throw new Error(String(res.status));
    const store = (await res.json()) as Storefront;
    applyCatalog(store.catalog);
    applyPrices(store.prices);
    applySettings(store.settings);
  } catch {
    await loadCatalog();
    await loadPrices();
  } finally {
    clearTimeout(timer);
  }
};
