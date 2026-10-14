import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

/**
 * Hash routing (#products, #product-detail/hmt-rice): one HTML page serves every address, on any host.
 * New pages start at the top; Back and Forward return to where the visitor was on that page.
 */

export const ROUTES = [
  'home',
  'products',
  'product-detail',
  'recipes',
  'recipe-detail',
  'export',
  'wholesale',
  'bulk',
  'quality',
  'about',
  'contact',
  'checkout',
  'admin',
  'login', 'register', 'forgot-password', 'reset-password', 'verify-email',
  'account', 'orders', 'order-detail', 'addresses', 'profile', 'security', 'support', 'admin-orders',
] as const;

export type Route = (typeof ROUTES)[number] | 'not-found';

export interface Location {
  route: Route;
  param?: string;
}

export const routeHref = (route: string, param?: string) => `#${route}${param ? `/${param}` : ''}`;

export const parseHash = (hash = window.location.hash): Location => {
  const [route, param] = decodeURIComponent(hash.replace(/^#\/?/, '')).split('/');
  if (!route) return { route: 'home' };
  return (ROUTES as readonly string[]).includes(route) ? { route: route as Route, param: param || undefined } : { route: 'not-found' };
};

const scrollMemory = new Map<string, number>();
let pushedByUs = false;
/**
 * The page actually on screen. Scroll positions are saved under this, not under location.hash:
 * the address changes a moment before the new page replaces the old one, and saving under the
 * address would record the old page's position against the new page.
 */
let shownHash = typeof window !== 'undefined' ? window.location.hash || '#home' : '#home';
let restoring = false;

/** Goes to a page. The hash change is picked up by useLocation below. */
export const navigate = (route: string, param?: string) => {
  const target = routeHref(route, param);
  if (target === window.location.hash) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  scrollMemory.set(shownHash, window.scrollY);
  pushedByUs = true;
  window.location.hash = target;
};

/** Smooth-scrolls to a section on the current page. (Plain #anchors would be read as a page address.) */
export const scrollToId = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

const withTransition = (update: () => void) => {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (doc.startViewTransition && !reduced) doc.startViewTransition(() => flushSync(update));
  else update();
};

export function useLocation(): Location {
  const [loc, setLoc] = useState<Location>(() => parseHash());

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    const onChange = () => {
      const next = parseHash();
      const byUs = pushedByUs;
      pushedByUs = false;
      shownHash = window.location.hash || '#home';
      withTransition(() => setLoc(next));
      // New page: top. Back/forward: where the visitor left it.
      const y = byUs ? 0 : scrollMemory.get(shownHash) ?? 0;
      // The page may still be laying out (images, lazy sections), so keep trying briefly until the spot exists.
      restoring = true;
      const restore = (tries = 0) => {
        window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
        if (Math.abs(window.scrollY - y) > 4 && tries < 20) setTimeout(() => restore(tries + 1), 50);
        else restoring = false;
      };
      requestAnimationFrame(() => restore());
    };
    const remember = () => {
      if (!restoring) scrollMemory.set(shownHash, window.scrollY);
    };
    window.addEventListener('hashchange', onChange);
    window.addEventListener('scroll', remember, { passive: true });
    return () => {
      window.removeEventListener('hashchange', onChange);
      window.removeEventListener('scroll', remember);
    };
  }, []);

  return loc;
}

const SITE = 'LG Gold Rice';

const META: Record<string, { title: string; description: string }> = {
  home: {
    title: SITE,
    description:
      'LG Gold by Sri Lakshmi Ganapathi Trading Company: aged, Sortex-cleaned HMT and JSR rice in 26kg bags for homes, wholesale, bulk and export. FSSAI certified.',
  },
  products: {
    title: `Buy HMT & JSR Rice, 26kg Bags | ${SITE}`,
    description: 'Compare LG Gold HMT and JSR rice, see today’s mill price and order 26kg bags on WhatsApp.',
  },
  recipes: {
    title: `Rice Recipes: Biryani, Pulao, Curd Rice and More | ${SITE}`,
    description: 'Over 100 recipes made with LG Gold HMT and JSR rice, from Hyderabadi biryani to quick lemon rice.',
  },
  export: {
    title: `Rice Exporter from India: HMT & JSR, 20ft/40ft FCL | ${SITE}`,
    description: 'Export enquiries for LG Gold HMT and JSR rice: container loads, private label 26kg bags, FOB and CIF terms.',
  },
  wholesale: {
    title: `Wholesale Rice Supplier in Telangana | ${SITE}`,
    description: 'Mill-direct wholesale rice for retailers, supermarkets, hotels and caterers. Estimate your order and get today’s trade rate.',
  },
  bulk: {
    title: `Bulk Rice by the Truckload | ${SITE}`,
    description: 'Bulk HMT and JSR rice by the tonne, dispatched in 26kg bags straight from the mill at Venkatadri Palem, Telangana.',
  },
  quality: {
    title: `Our Quality Process: Sortex Cleaned, 12+ Months Aged | ${SITE}`,
    description: 'How LG Gold rice is milled, optically sorted, aged and packed at our Telangana mill.',
  },
  about: {
    title: `Our Mill: Sri Lakshmi Ganapathi Trading Company | ${SITE}`,
    description: 'The mill behind LG Gold rice in Venkatadri Palem, Telangana, and how every grain is selected, sorted, aged and packed.',
  },
  contact: {
    title: `Contact the Mill | ${SITE}`,
    description: 'Call, WhatsApp or visit Sri Lakshmi Ganapathi Trading Company in Venkatadri Palem, Telangana.',
  },
  checkout: { title: `Checkout | ${SITE}`, description: '' },
  admin: { title: `Admin | ${SITE}`, description: '' },
  login: { title: `Sign in | ${SITE}`, description: '' },
  register: { title: `Create account | ${SITE}`, description: '' },
  'forgot-password': { title: `Account recovery | ${SITE}`, description: '' },
  'reset-password': { title: `Reset password | ${SITE}`, description: '' },
  'verify-email': { title: `Verify email | ${SITE}`, description: '' },
  account: { title: `My account | ${SITE}`, description: '' },
  orders: { title: `My orders | ${SITE}`, description: '' },
  'order-detail': { title: `Order tracking | ${SITE}`, description: '' },
  addresses: { title: `My addresses | ${SITE}`, description: '' },
  profile: { title: `My profile | ${SITE}`, description: '' },
  security: { title: `Account security | ${SITE}`, description: '' },
  support: { title: `Customer help | ${SITE}`, description: '' },
  'admin-orders': { title: `Admin | ${SITE}`, description: '' },
  'not-found': { title: `Page not found | ${SITE}`, description: '' },
};

/** Sets the browser tab title and the search/share description for the current page. */
export const setPageMeta = (loc: Location, named?: { title: string; description?: string }) => {
  const m = named ? { title: `${named.title} | ${SITE}`, description: named.description ?? META.home.description } : META[loc.route] ?? META.home;
  document.title = m.title;
  const desc = m.description || META.home.description;
  for (const sel of ['meta[name="description"]', 'meta[property="og:description"]']) {
    document.querySelector(sel)?.setAttribute('content', desc);
  }
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', m.title);
  // The admin page should never appear in search results.
  let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
  if (!robots) {
    robots = document.createElement('meta');
    robots.name = 'robots';
    document.head.appendChild(robots);
  }
  robots.content = ['admin', 'not-found', 'checkout', 'login', 'register', 'forgot-password', 'reset-password', 'verify-email', 'account', 'orders', 'order-detail', 'addresses', 'profile', 'security', 'support', 'admin-orders'].includes(loc.route) ? 'noindex' : 'index,follow';
};
