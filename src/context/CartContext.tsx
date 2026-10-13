import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, PackSize } from '../types';
import { BRAND_CONFIG, createWhatsAppUrl } from '../config/brandConfig';
import { PRODUCTS } from '../data/products';
import { buildOrderMessage } from '../data/order';
import { toast } from '../components/ui/Toast';

interface CartContextType {
  cart: CartItem[];
  /** Adds a pack. Shows a "View cart" toast unless `quiet` (Buy Now goes straight to checkout instead). */
  addToCart: (product: Product, packSize: PackSize, quantity?: number, options?: { quiet?: boolean }) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
  totalMrp: number;
  totalSavings: number;
  isFreeDelivery: boolean;
  /** 0 when delivery is free or the cart is empty. */
  deliveryCharge: number;
  /** How much more rice (in rupees) unlocks free delivery; 0 once it is free. */
  amountForFreeDelivery: number;
  /** Rice plus delivery. */
  grandTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  /** A WhatsApp link for a quick order of the current cart, without delivery details. */
  getQuickOrderUrl: () => string;
  /** The last order sent on WhatsApp, re-priced with today's rates, for one-tap re-ordering. */
  lastOrder: CartItem[];
  /** Remembers the current cart as "last order" and empties the cart. */
  completeOrder: () => void;
  reorder: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'lg_gold_cart_v1';
const LAST_ORDER_KEY = 'lg_gold_last_order_v1';

/** Prices change daily, so anything saved earlier is re-priced with today's rates. Packs no longer sold are dropped. */
const reprice = (items: CartItem[]): CartItem[] =>
  items.flatMap((item) => {
    const product = PRODUCTS.find((p) => p.id === item.productId);
    const pack = product?.packOptions.find((o) => o.size === item.packSize);
    if (!pack) return product ? [] : [item];
    return pack.inStock ? [{ ...item, price: pack.retailPrice, mrp: pack.mrp }] : [];
  });

const load = (key: string): CartItem[] => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? reprice(JSON.parse(saved)) : [];
  } catch {
    return [];
  }
};

const save = (key: string, items: CartItem[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch {
    /* private mode or storage full: the cart still works for this visit */
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => load(CART_STORAGE_KEY));
  const [lastOrder, setLastOrder] = useState<CartItem[]>(() => load(LAST_ORDER_KEY));
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => save(CART_STORAGE_KEY, cart), [cart]);

  const addToCart = (product: Product, packSize: PackSize, quantity = 1, { quiet = false }: { quiet?: boolean } = {}) => {
    const packOption = product.packOptions.find((p) => p.size === packSize) || product.packOptions[0];
    if (!packOption.inStock) {
      toast({ message: `${product.shortName} ${packOption.size} is out of stock right now.`, tone: 'error' });
      return;
    }
    const itemId = `${product.id}-${packSize}`;

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === itemId);
      if (existing) {
        return prevCart.map((item) => (item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item));
      }
      return [
        ...prevCart,
        {
          id: itemId,
          productId: product.id,
          productSlug: product.slug,
          productName: product.name,
          image: product.images.primary,
          packSize,
          price: packOption.retailPrice,
          mrp: packOption.mrp,
          quantity,
        },
      ];
    });

    if (!quiet) {
      toast({
        message: `${quantity > 1 ? `${quantity} × ` : ''}${product.shortName}, ${packSize} added to your cart.`,
        action: { label: 'View cart', onClick: () => setIsCartOpen(true) },
      });
    }
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) => prev.map((item) => (item.id === itemId ? { ...item, quantity: Math.min(quantity, 999) } : item)));
  };

  const removeFromCart = (itemId: string) => {
    const removed = cart.find((item) => item.id === itemId);
    const index = cart.findIndex((item) => item.id === itemId);
    setCart((prev) => prev.filter((item) => item.id !== itemId));
    if (removed) {
      toast({
        message: `${removed.productName} (${removed.packSize}) removed.`,
        tone: 'info',
        action: {
          label: 'Undo',
          onClick: () =>
            setCart((prev) => (prev.some((i) => i.id === removed.id) ? prev : [...prev.slice(0, index), removed, ...prev.slice(index)])),
        },
      });
    }
  };

  const clearCart = () => setCart([]);

  const completeOrder = () => {
    setLastOrder(cart);
    save(LAST_ORDER_KEY, cart);
    setCart([]);
  };

  const reorder = () => {
    const items = reprice(lastOrder);
    if (items.length === 0) {
      toast({ message: 'The packs from your last order are not available right now.', tone: 'error' });
      return;
    }
    setCart(items);
    toast({ message: 'Your last order is back in the cart, at today’s prices.' });
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalMrp = cart.reduce((sum, item) => sum + item.mrp * item.quantity, 0);
  const totalSavings = Math.max(0, totalMrp - totalAmount);

  // Free delivery once the order reaches the threshold in BRAND_CONFIG.delivery.
  const { freeFromOrderValue, charge } = BRAND_CONFIG.delivery;
  const isFreeDelivery = cart.length > 0 && totalAmount >= freeFromOrderValue;
  const deliveryCharge = cart.length === 0 || isFreeDelivery ? 0 : charge;
  const amountForFreeDelivery = isFreeDelivery ? 0 : Math.max(0, freeFromOrderValue - totalAmount);
  const grandTotal = totalAmount + deliveryCharge;

  const getQuickOrderUrl = () =>
    createWhatsAppUrl(
      cart.length === 0
        ? 'Hello LG Gold, I would like to order rice.'
        : buildOrderMessage({ items: cart, totals: { rice: totalAmount, delivery: deliveryCharge, total: grandTotal } }),
    );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        totalAmount,
        totalMrp,
        totalSavings,
        isFreeDelivery,
        deliveryCharge,
        amountForFreeDelivery,
        grandTotal,
        isCartOpen,
        setIsCartOpen,
        getQuickOrderUrl,
        lastOrder,
        completeOrder,
        reorder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
