import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, PackSize } from '../types';
import { createWhatsAppUrl } from '../config/brandConfig';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, packSize: PackSize, quantity?: number) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
  totalMrp: number;
  totalSavings: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  notification: string | null;
  showNotification: (msg: string) => void;
  getWhatsAppOrderUrl: (customerDetails?: { name: string; address: string; phone: string }) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'lg_gold_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(prev => (prev === msg ? null : prev));
    }, 3500);
  };

  const addToCart = (product: Product, packSize: PackSize, quantity = 1) => {
    const packOption = product.packOptions.find(p => p.size === packSize) || product.packOptions[0];
    const itemId = `${product.id}-${packSize}`;

    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === itemId);
      if (existing) {
        return prevCart.map(item =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prevCart,
        {
          id: itemId,
          productId: product.id,
          productSlug: product.slug,
          productName: product.name,
          image: product.images.primary,
          packSize: packSize,
          price: packOption.retailPrice,
          mrp: packOption.mrp,
          quantity: quantity,
        }
      ];
    });

    showNotification(`Added ${product.shortName} (${packSize}) to your cart.`);
    setIsCartOpen(true);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
    showNotification('Item removed from cart');
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalMrp = cart.reduce((sum, item) => sum + item.mrp * item.quantity, 0);
  const totalSavings = Math.max(0, totalMrp - totalAmount);

  const getWhatsAppOrderUrl = (customerDetails?: { name: string; address: string; phone: string }) => {
    if (cart.length === 0) {
      return createWhatsAppUrl('Hi LG Gold Team, I would like to inquire about ordering rice.');
    }

    let message = `*NEW ORDER - LG GOLD RICE*\n`;
    message += `-------------------------\n`;
    cart.forEach((item, idx) => {
      message += `${idx + 1}. ${item.productName} (${item.packSize}) x ${item.quantity} = ₹${(item.price * item.quantity).toLocaleString('en-IN')}\n`;
    });
    message += `-------------------------\n`;
    message += `*Total Items:* ${totalItems}\n`;
    message += `*Total Order Value:* ₹${totalAmount.toLocaleString('en-IN')}\n\n`;

    if (customerDetails && customerDetails.name) {
      message += `*Delivery Details:*\n`;
      message += `Name: ${customerDetails.name}\n`;
      message += `Phone: ${customerDetails.phone}\n`;
      message += `Address: ${customerDetails.address}\n\n`;
    }

    message += `Please confirm my order and share delivery / payment details. Thank you!`;
    return createWhatsAppUrl(message);
  };

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
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        notification,
        showNotification,
        getWhatsAppOrderUrl,
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
