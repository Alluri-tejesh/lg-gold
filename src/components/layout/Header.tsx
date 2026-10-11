import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { BRAND_CONFIG } from '../../config/brandConfig';

interface HeaderProps {
  currentRoute: string;
  onNavigate: (route: string, param?: string) => void;
  onOpenSearch: () => void;
}

const NAV_LINKS = [
  { label: 'Rice', route: 'products' },
  { label: 'Wholesale', route: 'wholesale' },
  { label: 'Bulk', route: 'bulk' },
  { label: 'Export', route: 'export' },
  { label: 'Quality', route: 'quality' },
  { label: 'Recipes', route: 'recipes' },
  { label: 'About', route: 'about' },
  { label: 'Contact', route: 'contact' },
];

export const Header: React.FC<HeaderProps> = ({ currentRoute, onNavigate, onOpenSearch }) => {
  const { totalItems, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const go = (route: string) => {
    onNavigate(route);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F3F4EC]/95 backdrop-blur-sm border-b border-[#0B3B2C]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[72px] gap-6">
          <button
            onClick={() => go('home')}
            aria-label="LG Gold home"
            className="flex flex-col items-start text-left cursor-pointer shrink-0"
          >
            <span className="font-serif-brand font-extrabold text-2xl leading-none text-[#0B3B2C]">
              LG Gold
            </span>
            <span className="hidden sm:block text-[11px] text-[#4C6358] mt-1 leading-none">
              {BRAND_CONFIG.parentCompany}
            </span>
          </button>

          <nav aria-label="Main" className="hidden lg:flex items-center gap-1 text-sm font-medium">
            {NAV_LINKS.map((link) => {
              const isActive =
                currentRoute === link.route ||
                (link.route === 'products' && currentRoute === 'product-detail') ||
                (link.route === 'recipes' && currentRoute === 'recipe-detail');
              return (
                <button
                  key={link.route}
                  onClick={() => go(link.route)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-3 py-2 cursor-pointer transition-colors border-b-2 ${
                    isActive
                      ? 'border-[#E0A21A] text-[#0B3B2C] font-semibold'
                      : 'border-transparent text-[#15231C]/75 hover:text-[#0B3B2C]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={onOpenSearch}
              aria-label="Search rice and recipes"
              className="p-2.5 text-[#0B3B2C] hover:text-[#8F6A0E] transition-colors cursor-pointer"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              aria-label={`Open cart, ${totalItems} items`}
              className="relative p-2.5 text-[#0B3B2C] hover:text-[#8F6A0E] transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="tnum absolute top-0.5 right-0.5 bg-[#E0A21A] text-[#0B3B2C] text-[10px] font-bold min-w-4 h-4 px-1 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => go('wholesale')}
              className="hidden sm:inline-flex ml-2 items-center bg-[#0B3B2C] text-[#F3F4EC] px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-[#14553F] transition-colors cursor-pointer"
            >
              Get a quote
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              className="lg:hidden p-2.5 text-[#0B3B2C] cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <nav aria-label="Mobile" className="lg:hidden bg-[#F3F4EC] border-t border-[#0B3B2C]/15 px-4 pb-6 pt-2 animate-fadeIn">
          <ul className="divide-y divide-[#0B3B2C]/10">
            {NAV_LINKS.map((link) => {
              const isActive = currentRoute === link.route;
              return (
                <li key={link.route}>
                  <button
                    onClick={() => go(link.route)}
                    className={`w-full text-left py-3.5 text-base cursor-pointer ${
                      isActive ? 'font-bold text-[#0B3B2C]' : 'font-medium text-[#15231C]/85'
                    }`}
                  >
                    {link.label}
                  </button>
                </li>
              );
            })}
          </ul>
          <button
            onClick={() => go('wholesale')}
            className="mt-4 w-full py-3.5 bg-[#0B3B2C] text-[#F3F4EC] rounded-md font-semibold text-sm cursor-pointer"
          >
            Get a quote
          </button>
        </nav>
      )}
    </header>
  );
};
