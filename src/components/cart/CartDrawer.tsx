import React from 'react';
import { Trash2, Plus, Minus, ShoppingBag, MessageCircle, ArrowRight, Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { BRAND_CONFIG, fssaiLabel, openWhatsApp } from '../../config/brandConfig';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { RollingNumber } from '../fx/RollingNumber';

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export const CartDrawer: React.FC<{ onNavigate: (route: string) => void }> = ({ onNavigate }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    totalItems,
    totalAmount,
    totalSavings,
    isFreeDelivery,
    deliveryCharge,
    amountForFreeDelivery,
    grandTotal,
    getQuickOrderUrl,
    lastOrder,
    reorder,
  } = useCart();

  const close = () => setIsCartOpen(false);
  const { freeFromOrderValue } = BRAND_CONFIG.delivery;
  const progress = isFreeDelivery ? 100 : Math.min(100, (totalAmount / freeFromOrderValue) * 100);

  return (
    <Dialog open={isCartOpen} onClose={close} label="Your cart" placement="right">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="border-b border-line px-5 pb-4 pt-5 pr-16">
          <h2 className="font-display text-2xl text-forest-800">Your cart</h2>
          <p className="text-sm text-muted">
            {totalItems === 0 ? 'Nothing here yet' : `${totalItems} ${totalItems === 1 ? 'pack' : 'packs'}`}
          </p>
        </div>

        {/* Free delivery meter */}
        {cart.length > 0 && (
          <div className="border-b border-line bg-cream px-5 py-4">
            <p className="flex items-center gap-2 text-[15px] font-medium text-forest-800">
              <Truck className="h-5 w-5 shrink-0 text-gold-600" aria-hidden="true" />
              {isFreeDelivery ? (
                <span>
                  <strong>Free doorstep delivery</strong> on this order
                </span>
              ) : (
                <span>
                  Add <strong className="tabular">{inr(amountForFreeDelivery)}</strong> more for free delivery
                </span>
              )}
            </p>
            <div
              className="mt-3 h-2 overflow-hidden rounded-full bg-cream-deep"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress)}
              aria-label="Progress to free delivery"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-400 transition-[width] duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-10 text-center">
              <div className="grid h-20 w-20 place-items-center rounded-full bg-gold-100 text-gold-700">
                <ShoppingBag className="h-9 w-9" />
              </div>
              <h3 className="mt-5 font-display text-2xl text-forest-800">Your cart is empty</h3>
              <p className="mt-2 max-w-xs text-muted">Aged HMT and JSR rice, straight from our mill in 26kg bags.</p>
              <div className="mt-6 flex w-full max-w-xs flex-col gap-3">
                <Button
                  size="lg"
                  block
                  onClick={() => {
                    close();
                    onNavigate('products');
                  }}
                  iconRight={<ArrowRight className="h-5 w-5" />}
                >
                  Shop rice
                </Button>
                {lastOrder.length > 0 && (
                  <Button variant="outline" size="lg" block icon={<RotateCcw className="h-5 w-5" />} onClick={reorder}>
                    Order again ({lastOrder.reduce((n, i) => n + i.quantity, 0)} packs)
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <ul className="space-y-3">
              {cart.map((item) => (
                <li key={item.id} className="flex gap-4 rounded-2xl bg-white p-3 ring-1 ring-line animate-pop-in">
                  <img
                    src={item.image}
                    alt=""
                    className="h-20 w-20 shrink-0 rounded-xl bg-cream object-contain"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-forest-800">{item.productName}</p>
                        <p className="text-sm text-muted">{item.packSize}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Remove ${item.productName} ${item.packSize}`}
                        className="-mr-1 -mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full text-muted hover:bg-danger-50 hover:text-danger cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-end justify-between gap-2 pt-2">
                      <div className="tabular">
                        <p className="font-semibold text-ink">{inr(item.price * item.quantity)}</p>
                        {item.mrp > item.price && <p className="text-xs text-muted line-through">{inr(item.mrp * item.quantity)}</p>}
                      </div>
                      <div className="flex items-center rounded-full bg-cream ring-1 ring-line" role="group" aria-label="Quantity">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="One less"
                          className="grid h-10 w-10 place-items-center rounded-full text-forest-800 hover:bg-white cursor-pointer"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-semibold tabular" aria-live="polite">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="One more"
                          className="grid h-10 w-10 place-items-center rounded-full text-forest-800 hover:bg-white cursor-pointer"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Totals and actions */}
        {cart.length > 0 && (
          <div className="border-t border-line bg-white px-5 pb-5 pt-4 pb-safe">
            <dl className="space-y-1.5 text-[15px]">
              <div className="flex justify-between text-muted">
                <dt>Rice</dt>
                <dd className="tabular text-ink">{inr(totalAmount)}</dd>
              </div>
              {totalSavings > 0 && (
                <div className="flex justify-between text-forest-700">
                  <dt>You save on MRP</dt>
                  <dd className="tabular">−{inr(totalSavings)}</dd>
                </div>
              )}
              <div className="flex justify-between text-muted">
                <dt>Doorstep delivery</dt>
                <dd className={`tabular ${isFreeDelivery ? 'font-semibold text-forest-700' : 'text-ink'}`}>
                  {isFreeDelivery ? 'FREE' : inr(deliveryCharge)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-line pt-3">
                <dt className="font-semibold text-forest-800">Total</dt>
                <dd className="text-2xl font-bold tracking-tight text-forest-800">
                  <RollingNumber value={grandTotal} />
                </dd>
              </div>
            </dl>
            <div className="mt-4 space-y-2.5">
              <Button
                size="lg"
                block
                onClick={() => {
                  close();
                  onNavigate('checkout');
                }}
                iconRight={<ArrowRight className="h-5 w-5 text-gold-400" />}
              >
                Checkout
              </Button>
            </div>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-muted">
              <ShieldCheck className="h-4 w-4 text-gold-600" aria-hidden="true" />
              Track your order in your account · {fssaiLabel()}
            </p>
          </div>
        )}
      </div>
    </Dialog>
  );
};
