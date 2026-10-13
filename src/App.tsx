import React, { Suspense, lazy, useEffect, useState } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { ScrollProgress } from './components/common/motion';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { CartDrawer } from './components/cart/CartDrawer';
import { WhatsAppFloatingButton } from './components/common/WhatsAppFloatingButton';
import { Toaster } from './components/ui/Toast';
import { NotFoundView } from './views/NotFoundView';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { navigate, setPageMeta, useLocation } from './router';
import { CustomerProvider } from './customer/CustomerContext';

// Each page is downloaded only when it is first visited, so the home page loads fast.
// A failed download (a flaky connection) is retried once before the error boundary takes over.
const named = <K extends string>(loader: () => Promise<Record<K, React.ComponentType<any>>>, name: K) =>
  lazy(() =>
    loader()
      .catch(() => new Promise<Record<K, React.ComponentType<any>>>((res) => setTimeout(() => res(loader()), 800)))
      .then((m) => ({ default: m[name] })),
  );

const pages = {
  home: () => import('./views/HomeView'),
  products: () => import('./views/ProductsView'),
  'product-detail': () => import('./views/ProductDetailView'),
  recipes: () => import('./views/RecipesView'),
  'recipe-detail': () => import('./views/RecipeDetailView'),
  export: () => import('./views/ExportView'),
  wholesale: () => import('./views/WholesaleView'),
  mill: () => import('./views/MillView'),
  contact: () => import('./views/ContactView'),
  checkout: () => import('./views/CheckoutView'),
};

const HomeView = named(pages.home, 'HomeView');
const ProductsView = named(pages.products, 'ProductsView');
const ProductDetailView = named(pages['product-detail'], 'ProductDetailView');
const RecipesView = named(pages.recipes, 'RecipesView');
const RecipeDetailView = named(pages['recipe-detail'], 'RecipeDetailView');
const ExportView = named(pages.export, 'ExportView');
const WholesaleView = named(pages.wholesale, 'WholesaleView');
const MillView = named(pages.mill, 'MillView');
const ContactView = named(pages.contact, 'ContactView');
const CheckoutView = named(pages.checkout, 'CheckoutView');
const AdminView = named(() => import('./admin/AdminView'), 'AdminView');
const SearchModal = named(() => import('./components/common/SearchModal'), 'SearchModal');
const AuthView = named(() => import('./customer/AuthView'), 'AuthView');
const CustomerView = named(() => import('./customer/CustomerView'), 'CustomerView');
const AdminOrdersView = named(() => import('./customer/AdminOrdersView'), 'AdminOrdersView');

/** While a page downloads (usually a few milliseconds), keep the layout steady instead of flashing white. */
const PageFallback = () => (
  <div className="min-h-[70vh] grid place-items-center" aria-busy="true" aria-label="Loading">
    <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-gold-300 border-t-forest-800" />
  </div>
);

export function AppContent() {
  const loc = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchLoaded, setSearchLoaded] = useState(false);
  const { setIsCartOpen } = useCart();

  const openSearch = () => {
    setSearchLoaded(true);
    setIsSearchOpen(true);
  };

  // A new page never opens with an old overlay still covering it (this also covers the browser Back button).
  useEffect(() => {
    setIsSearchOpen(false);
    setIsCartOpen(false);
    // Product and recipe pages set their own title from the product or recipe name.
    if (loc.route !== 'product-detail' && loc.route !== 'recipe-detail') setPageMeta(loc);
  }, [loc.route, loc.param]);

  // Ctrl+K / Cmd+K opens search from anywhere, like most modern sites.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearch();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // After the first page is on screen, fetch the other pages quietly so later clicks feel instant.
  useEffect(() => {
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => void }).requestIdleCallback ?? ((cb) => setTimeout(cb, 1500));
    idle(() => Object.values(pages).forEach((load) => load().catch(() => {})));
  }, []);

  if (loc.route === 'admin') {
    return (
      <ErrorBoundary resetKey="admin">
        <Suspense fallback={<PageFallback />}>
          <AdminView />
          <Toaster />
        </Suspense>
      </ErrorBoundary>
    );
  }

  const go = (route: string, param?: string) => navigate(route, param);

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <a
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('main')?.focus();
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-forest-800 focus:px-5 focus:py-3 focus:text-white"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <AnnouncementBar />
      <Header currentRoute={loc.route} onOpenSearch={openSearch} />

      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        <ErrorBoundary resetKey={`${loc.route}/${loc.param ?? ''}`}>
        <Suspense fallback={<PageFallback />}>
          {loc.route === 'home' && <HomeView onNavigate={go} />}
          {loc.route === 'products' && <ProductsView onNavigate={go} />}
          {loc.route === 'product-detail' && <ProductDetailView key={loc.param} productSlug={loc.param || 'hmt-rice'} onNavigate={go} />}
          {loc.route === 'recipes' && <RecipesView onNavigate={go} />}
          {loc.route === 'recipe-detail' && <RecipeDetailView key={loc.param} recipeSlug={loc.param || ''} onNavigate={go} />}
          {loc.route === 'export' && <ExportView onNavigate={go} />}
          {/* Bulk, Quality and About were merged into Wholesale and Our Mill; old links land on the right section. */}
          {(loc.route === 'wholesale' || loc.route === 'bulk') && (
            <WholesaleView onNavigate={go} section={loc.route === 'bulk' ? 'truckloads' : undefined} />
          )}
          {(loc.route === 'about' || loc.route === 'quality') && (
            <MillView onNavigate={go} section={loc.route === 'quality' ? 'process' : undefined} />
          )}
          {loc.route === 'contact' && <ContactView onNavigate={go} />}
          {loc.route === 'checkout' && <CheckoutView onNavigate={go} />}
          {['login', 'register', 'forgot-password', 'reset-password', 'verify-email'].includes(loc.route) && <AuthView key={`${loc.route}/${loc.param || ''}`} route={loc.route} param={loc.param} />}
          {['account', 'orders', 'order-detail', 'addresses', 'profile', 'security', 'support'].includes(loc.route) && <CustomerView key={loc.route} route={loc.route} param={loc.param} />}
          {loc.route === 'admin-orders' && <AdminOrdersView />}
          {loc.route === 'not-found' && <NotFoundView />}
        </Suspense>
        </ErrorBoundary>
      </main>

      <Footer />
      {/* Checkout has its own sticky pay bar on phones, so the bottom bar and chat button step aside there */}
      {loc.route !== 'checkout' && <MobileBottomNav currentRoute={loc.route} />}
      {loc.route !== 'checkout' && <WhatsAppFloatingButton />}

      {searchLoaded && (
        <Suspense fallback={null}>
          <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onNavigate={go} />
        </Suspense>
      )}
      <CartDrawer onNavigate={go} />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <CustomerProvider><CartProvider>
      <AppContent />
    </CartProvider></CustomerProvider>
  );
}
