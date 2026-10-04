import React from 'react';
import { Home, Package, UtensilsCrossed, ShoppingBag, MessageCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { BRAND_CONFIG, createWhatsAppUrl } from '../../config/brandConfig';

interface MobileBottomNavProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentRoute, onNavigate }) => {
  const { totalItems, setIsCartOpen } = useCart();

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      action: () => onNavigate('home'),
      isActive: currentRoute === 'home',
    },
    {
      id: 'products',
      label: 'Products',
      icon: Package,
      action: () => onNavigate('products'),
      isActive: currentRoute === 'products' || currentRoute === 'product-detail',
    },
    {
      id: 'recipes',
      label: 'Recipes',
      icon: UtensilsCrossed,
      action: () => onNavigate('recipes') || currentRoute === 'recipe-detail',
      isActive: currentRoute === 'recipes' || currentRoute === 'recipe-detail',
    },
    {
      id: 'cart',
      label: 'Cart',
      icon: ShoppingBag,
      action: () => setIsCartOpen(true),
      isActive: false,
      badge: totalItems > 0 ? totalItems : undefined,
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: MessageCircle,
      action: () => {
        const url = createWhatsAppUrl(`Hi LG Gold Team, I am browsing your website from my mobile phone and would like to inquire about your rice products.`);
        window.open(url, '_blank');
      },
      isActive: false,
      isHighlight: true,
    }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FFFFFF] border-t border-[#E7D59A]/60 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] backdrop-blur-md bg-white/95 safe-area-pb">
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={item.action}
              className={`flex flex-col items-center justify-center relative py-1 px-1 transition-colors cursor-pointer ${
                item.isActive
                  ? 'text-[#174A32] font-bold'
                  : item.isHighlight
                  ? 'text-[#128C7E] font-semibold'
                  : 'text-[#202522]/70 hover:text-[#174A32]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${item.isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 bg-[#C9A227] text-[#174A32] font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight truncate max-w-full">
                {item.label}
              </span>
              {item.isActive && (
                <span className="absolute bottom-1 w-6 h-0.5 bg-[#C9A227] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
