import React from 'react';
import { Home, Store, UtensilsCrossed, ShoppingBag, UserRound } from 'lucide-react';
import { useCustomer } from '../../customer/CustomerContext';
import { useCart } from '../../context/CartContext';
import { createWhatsAppUrl } from '../../config/brandConfig';
import { AppLink } from '../ui/AppLink';

/** Thumb-reach navigation for phones. Hidden on large screens, where the header has everything. */
export const MobileBottomNav: React.FC<{ currentRoute: string }> = ({ currentRoute }) => {
  const { totalItems, setIsCartOpen } = useCart();
  const { user } = useCustomer();

  const item = 'relative flex flex-col items-center justify-center gap-1 text-[12px] font-semibold min-h-14 transition-colors';
  const tabs = [
    { to: 'home', label: 'Home', icon: Home, active: currentRoute === 'home' },
    { to: 'products', label: 'Shop', icon: Store, active: ['products', 'product-detail'].includes(currentRoute) },
    { to: 'recipes', label: 'Recipes', icon: UtensilsCrossed, active: ['recipes', 'recipe-detail'].includes(currentRoute) },
  ];

  return (
    <nav
      aria-label="Quick links"
      className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/92 backdrop-blur-xl pb-safe shadow-[0_-8px_24px_-12px_rgb(23_74_50/0.2)] lg:hidden"
    >
      <div className="mx-auto grid max-w-lg grid-cols-5">
        {tabs.map(({ to, label, icon: Icon, active }) => (
          <AppLink key={to} to={to} aria-current={active ? 'page' : undefined} className={`${item} ${active ? 'text-forest-800' : 'text-muted'}`}>
            <span className={`grid h-7 w-12 place-items-center rounded-full transition-colors ${active ? 'bg-gold-100' : ''}`}>
              <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.9} />
            </span>
            {label}
          </AppLink>
        ))}
        <button type="button" onClick={() => setIsCartOpen(true)} className={`${item} text-muted cursor-pointer`} aria-label={`Cart, ${totalItems} packs`}>
          <span className="relative grid h-7 w-12 place-items-center">
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 right-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-gold-500 px-1 text-[11px] font-bold text-forest-900 ring-2 ring-paper">
                {totalItems}
              </span>
            )}
          </span>
          Cart
        </button>
        <AppLink to={user ? 'account' : 'login'} className={`${item} text-forest-800`}>
          <span className="grid h-7 w-12 place-items-center">
            <UserRound className="h-5 w-5" />
          </span>
          Account
        </AppLink>
      </div>
    </nav>
  );
};
