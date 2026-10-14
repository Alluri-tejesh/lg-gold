import React, { useEffect, useState } from 'react';
import { ShoppingBag, Search, Menu, Phone, MessageCircle, ArrowRight, UserRound } from 'lucide-react';
import { useCustomer } from '../../customer/CustomerContext';
import { useCart } from '../../context/CartContext';
import { BRAND_CONFIG, createWhatsAppUrl, phoneTelHref } from '../../config/brandConfig';
import { Logo } from '../ui/Logo';
import { AppLink } from '../ui/AppLink';
import { Dialog } from '../ui/Dialog';
import { buttonClass } from '../ui/Button';

interface HeaderProps {
  currentRoute: string;
  onOpenSearch: () => void;
}

export const NAV_LINKS = [
  { label: 'Shop', route: 'products', match: ['products', 'product-detail'] },
  { label: 'Wholesale', route: 'wholesale', match: ['wholesale', 'bulk'] },
  { label: 'Export', route: 'export', match: ['export'] },
  { label: 'Recipes', route: 'recipes', match: ['recipes', 'recipe-detail'] },
  { label: 'Our Mill', route: 'about', match: ['about', 'quality'] },
  { label: 'Contact', route: 'contact', match: ['contact'] },
];

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

export const Header: React.FC<HeaderProps> = ({ currentRoute, onOpenSearch }) => {
  const { totalItems, setIsCartOpen } = useCart();
  const { user } = useCustomer();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [bump, setBump] = useState(false);

  // The header slims down and gains a shadow once the page scrolls.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // The cart badge gives a little bump whenever something is added.
  useEffect(() => {
    if (totalItems === 0) return;
    setBump(true);
    const t = setTimeout(() => setBump(false), 450);
    return () => clearTimeout(t);
  }, [totalItems]);

  useEffect(() => setMenuOpen(false), [currentRoute]);

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        scrolled ? 'bg-paper/85 backdrop-blur-xl shadow-[0_1px_0_rgb(231_223_198),0_8px_24px_-12px_rgb(23_74_50/0.18)]' : 'bg-paper'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between gap-4 transition-[height] duration-300 ${scrolled ? 'h-16' : 'h-20'}`}>
          <AppLink to="home" title="LG Gold home" className="shrink-0 rounded-lg">
            <Logo compact={scrolled} taglineOnPhones={false} />
          </AppLink>

          {/* Desktop navigation */}
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const active = link.match.includes(currentRoute);
                return (
                  <li key={link.route}>
                    <AppLink
                      to={link.route}
                      aria-current={active ? 'page' : undefined}
                      className={`relative block whitespace-nowrap rounded-full px-3 py-2 text-[15px] font-medium transition-colors xl:px-3.5 ${
                        active ? 'text-forest-800' : 'text-ink-soft hover:text-forest-800 hover:bg-forest-800/5'
                      }`}
                    >
                      {link.label}
                      <span
                        aria-hidden="true"
                        className={`absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-gold-500 transition-transform duration-300 origin-left ${
                          active ? 'scale-x-100' : 'scale-x-0'
                        }`}
                      />
                    </AppLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search: a wide pill with the shortcut on desktop, an icon on phones */}
            <button
              type="button"
              onClick={onOpenSearch}
              aria-label="Search rice and recipes"
              aria-keyshortcuts={isMac ? 'Meta+K' : 'Control+K'}
              className="group flex h-11 items-center gap-2 rounded-full px-3 text-muted transition-colors hover:bg-forest-800/5 hover:text-forest-800 2xl:w-52 2xl:bg-cream 2xl:ring-1 2xl:ring-line cursor-pointer"
            >
              <Search className="h-5 w-5 shrink-0" />
              <span className="hidden 2xl:inline text-[15px]">Search</span>
              <kbd className="ml-auto hidden 2xl:inline rounded-md bg-white px-1.5 py-0.5 text-xs font-semibold text-muted ring-1 ring-line">
                {isMac ? '⌘' : 'Ctrl'} K
              </kbd>
            </button>

            <button
              type="button"
              data-cart-target
              onClick={() => setIsCartOpen(true)}
              aria-label={`Cart, ${totalItems} ${totalItems === 1 ? 'pack' : 'packs'}`}
              className="relative grid h-11 w-11 place-items-center rounded-full text-forest-800 transition-colors hover:bg-forest-800/5 cursor-pointer"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span
                  className={`absolute right-0.5 top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-gold-500 px-1 text-[11px] font-bold text-forest-900 ring-2 ring-paper ${
                    bump ? 'bump' : ''
                  }`}
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            <span className="hidden sm:block"><AppLink to={user ? 'account' : 'login'} aria-label={user ? 'My account' : 'Sign in'} className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-forest-800 hover:bg-gold-50"><UserRound className="h-5 w-5" /></AppLink></span>
            {/* Wrapped so the button style cannot override "hidden" on phones (the bottom bar has Shop there) */}
            <span className="hidden sm:block">
              <AppLink to="products" className={buttonClass('primary', 'sm')}>
                Shop Rice
              </AppLink>
            </span>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="grid h-11 w-11 place-items-center rounded-full text-forest-800 hover:bg-forest-800/5 lg:hidden cursor-pointer"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Phone and tablet menu: a panel from the right with big, easy targets */}
      <Dialog open={menuOpen} onClose={() => setMenuOpen(false)} label="Menu" placement="right" className="bg-paper">
        <div className="flex h-full flex-col overflow-y-auto pb-safe">
          <div className="border-b border-line px-5 py-4">
            <Logo compact />
          </div>
          <nav aria-label="Main" className="flex-1 px-3 py-4">
            <ul className="space-y-1">
              {[{ label: 'Home', route: 'home', match: ['home'] }, ...NAV_LINKS, { label: user ? 'My account' : 'Sign in', route: user ? 'account' : 'login', match: ['account', 'orders', 'profile', 'addresses', 'security', 'login'] }].map((link, i) => {
                const active = link.match.includes(currentRoute);
                return (
                  <li key={link.route} className="animate-slide-up" style={{ animationDelay: `${60 + i * 35}ms` }}>
                    <AppLink
                      to={link.route}
                      onClick={() => setMenuOpen(false)}
                      aria-current={active ? 'page' : undefined}
                      className={`flex min-h-13 items-center justify-between rounded-2xl px-4 font-display text-2xl ${
                        active ? 'bg-forest-800 text-white' : 'text-forest-800 hover:bg-forest-800/5'
                      }`}
                    >
                      {link.label}
                      <ArrowRight className={`h-5 w-5 ${active ? 'text-gold-400' : 'text-gold-600'}`} />
                    </AppLink>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="space-y-3 border-t border-line bg-cream px-5 py-5">
            <a
              href={createWhatsAppUrl('Hi LG Gold Team, I would like to know more about your rice.')}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass('whatsapp', 'md', true)}
            >
              <MessageCircle className="h-5 w-5" /> WhatsApp the mill
            </a>
            <a href={phoneTelHref()} className={buttonClass('outline', 'md', true)}>
              <Phone className="h-5 w-5" /> Call {BRAND_CONFIG.contact.primaryPhone}
            </a>
            <p className="text-center text-sm text-muted">{BRAND_CONFIG.contact.operatingHours}</p>
          </div>
        </div>
      </Dialog>
    </header>
  );
};
