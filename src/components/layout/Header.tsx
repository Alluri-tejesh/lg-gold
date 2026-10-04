import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, Globe, PhoneCall } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { BRAND_CONFIG } from '../../config/brandConfig';

interface HeaderProps {
  currentRoute: string;
  onNavigate: (route: string, param?: string) => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, onNavigate, onOpenSearch }) => {
  const { totalItems, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Products', route: 'products' },
    { label: 'Wholesale', route: 'wholesale' },
    { label: 'Global Export', route: 'export', isSpecial: true },
    { label: 'Recipes', route: 'recipes' },
    { label: 'Quality & Mill', route: 'quality' },
    { label: 'About Us', route: 'about' },
    { label: 'Contact', route: 'contact' },
  ];

  const handleNavClick = (route: string) => {
    onNavigate(route);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-[#C9A227]/20 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Corporate Subtitle */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3.5 cursor-pointer group select-none"
          >
            <div className="flex flex-col">
              <span className="font-serif-brand font-bold text-2xl sm:text-3xl tracking-tighter text-[#174A32] group-hover:text-[#C9A227] transition-colors leading-none">
                LG GOLD
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#5F806D] font-semibold mt-1">
                Sri Lakshmi Ganapathi Trading Company
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[13px] font-semibold uppercase tracking-tight text-[#174A32]">
            {navLinks.map((link) => {
              const isActive = currentRoute === link.route;
              return (
                <button
                  key={link.route}
                  onClick={() => handleNavClick(link.route)}
                  className={`py-2 transition-all duration-150 cursor-pointer relative ${
                    isActive
                      ? 'text-[#174A32] font-bold border-b-2 border-[#C9A227]'
                      : 'text-[#174A32]/80 hover:text-[#174A32] hover:border-b-2 hover:border-[#C9A227]/50'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {link.isSpecial && <Globe className="w-3.5 h-3.5 text-[#C9A227]" />}
                    {link.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              aria-label="Search rice and recipes"
              className="p-2 text-[#174A32] hover:text-[#C9A227] transition-colors cursor-pointer"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="View Shopping Cart"
              className="relative p-2 text-[#174A32] hover:text-[#C9A227] transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C9A227] text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Primary CTA - Buy Rice */}
            <button
              onClick={() => handleNavClick('products')}
              className="hidden sm:inline-flex items-center justify-center bg-[#174A32] text-white px-6 py-2.5 rounded-sm text-[13px] font-bold uppercase tracking-wider hover:bg-[#1a5a3d] transition-all cursor-pointer shadow-xs border border-[#174A32]"
            >
              Buy Rice
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="lg:hidden p-2 text-[#174A32] hover:text-[#C9A227] transition-colors cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#FFFFFF] border-b border-[#C9A227]/30 px-6 pt-3 pb-6 shadow-lg animate-fadeIn">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = currentRoute === link.route;
              return (
                <button
                  key={link.route}
                  onClick={() => handleNavClick(link.route)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold uppercase tracking-tight transition-colors text-left cursor-pointer ${
                    isActive
                      ? 'text-[#174A32] border-l-3 border-[#C9A227] bg-[#F8F5EA] pl-4 font-bold'
                      : 'text-[#202522]/80 hover:text-[#174A32] hover:bg-[#F8F5EA]/50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {link.isSpecial && <Globe className="w-4 h-4 text-[#C9A227]" />}
                    {link.label}
                  </span>
                  {link.isSpecial && (
                    <span className="text-[10px] bg-[#C9A227] text-[#174A32] px-2 py-0.5 font-bold uppercase">
                      Global
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-[#C9A227]/20 flex flex-col gap-3">
            <button
              onClick={() => handleNavClick('products')}
              className="w-full py-3 bg-[#174A32] text-white font-bold uppercase tracking-wider text-xs text-center shadow-xs cursor-pointer"
            >
              Shop Rice Collection
            </button>
            <div className="flex items-center justify-between text-xs text-[#5F806D] px-1">
              <span className="flex items-center gap-1 font-medium">
                <PhoneCall className="w-3.5 h-3.5 text-[#C9A227]" />
                {BRAND_CONFIG.contact.displayWhatsapp}
              </span>
              <span className="uppercase text-[10px] font-bold tracking-wider">{BRAND_CONFIG.location.city}, Telangana</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
