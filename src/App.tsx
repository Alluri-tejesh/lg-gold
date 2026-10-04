import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/cart/CheckoutModal';
import { SearchModal } from './components/common/SearchModal';
import { WhatsAppFloatingButton } from './components/common/WhatsAppFloatingButton';

// Views
import { HomeView } from './views/HomeView';
import { ProductsView } from './views/ProductsView';
import { ProductDetailView } from './views/ProductDetailView';
import { RecipesView } from './views/RecipesView';
import { RecipeDetailView } from './views/RecipeDetailView';
import { ExportView } from './views/ExportView';
import { WholesaleView } from './views/WholesaleView';
import { BulkView } from './views/BulkView';
import { QualityView } from './views/QualityView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';

export function AppContent() {
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [routeParam, setRouteParam] = useState<string | undefined>(undefined);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Handle URL hash changes or internal state navigation
  const handleNavigate = (route: string, param?: string) => {
    setCurrentRoute(route);
    setRouteParam(param);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update browser hash for bookmarking & history
    if (param) {
      window.location.hash = `#${route}/${param}`;
    } else {
      window.location.hash = `#${route}`;
    }
  };

  // Sync with initial hash on mount
  useEffect(() => {
    const parseHash = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (!hash) return;
      const parts = hash.split('/');
      const route = parts[0];
      const param = parts[1];

      const validRoutes = [
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
      ];

      if (validRoutes.includes(route)) {
        setCurrentRoute(route);
        setRouteParam(param);
      }
    };

    parseHash();
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5EA] text-[#202522] font-sans antialiased selection:bg-[#C9A227]/30 selection:text-[#174A32]">
      
      {/* Top Sticky & Announcement Bars */}
      <AnnouncementBar onNavigate={handleNavigate} />
      
      <Header
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Page Route Views */}
      <main className="flex-1">
        {currentRoute === 'home' && (
          <HomeView onNavigate={handleNavigate} />
        )}

        {currentRoute === 'products' && (
          <ProductsView onNavigate={handleNavigate} />
        )}

        {currentRoute === 'product-detail' && (
          <ProductDetailView
            productSlug={routeParam || 'hmt-rice'}
            onNavigate={handleNavigate}
          />
        )}

        {currentRoute === 'recipes' && (
          <RecipesView onNavigate={handleNavigate} />
        )}

        {currentRoute === 'recipe-detail' && (
          <RecipeDetailView
            recipeSlug={routeParam || 'hyderabadi-hmt-biryani'}
            onNavigate={handleNavigate}
          />
        )}

        {currentRoute === 'export' && (
          <ExportView onNavigate={handleNavigate} />
        )}

        {currentRoute === 'wholesale' && (
          <WholesaleView onNavigate={handleNavigate} />
        )}

        {currentRoute === 'bulk' && (
          <BulkView onNavigate={handleNavigate} />
        )}

        {currentRoute === 'quality' && (
          <QualityView onNavigate={handleNavigate} />
        )}

        {currentRoute === 'about' && (
          <AboutView onNavigate={handleNavigate} />
        )}

        {currentRoute === 'contact' && (
          <ContactView onNavigate={handleNavigate} />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Mobile Bottom Quick Navigation */}
      <MobileBottomNav currentRoute={currentRoute} onNavigate={handleNavigate} />

      {/* Floating Global WhatsApp Support Button */}
      <WhatsAppFloatingButton />

      {/* Global Interactive Overlays */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />

      <CartDrawer onNavigate={handleNavigate} />
      <CheckoutModal />

    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
