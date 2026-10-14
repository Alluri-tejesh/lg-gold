import React, { useEffect, useRef, useState } from 'react';
import { Home, Store, UtensilsCrossed, ShoppingBag, UserRound } from 'lucide-react';
import { useCustomer } from '../../customer/CustomerContext';
import { useCart } from '../../context/CartContext';
import { AppLink } from '../ui/AppLink';
import { navigate } from '../../router';

const ACCOUNT_ROUTES = ['account', 'orders', 'order-detail', 'addresses', 'profile', 'security', 'support', 'login', 'register', 'forgot-password', 'reset-password', 'verify-email'];

/** Which tab a page belongs to (-1: none, e.g. Wholesale; the pill then fades away). */
const tabForRoute = (route: string) =>
  route === 'home' ? 0 : ['products', 'product-detail'].includes(route) ? 1 : ['recipes', 'recipe-detail'].includes(route) ? 2 : ACCOUNT_ROUTES.includes(route) ? 4 : -1;

/** A finger has to travel this far sideways before a press becomes a slide. */
const DRAG_START = 8;

/**
 * Thumb-reach navigation for phones, with an iOS-style selection pill:
 *  - tapping a tab sends the pill gliding there on a spring, stretching a little on the way;
 *  - pressing and sliding along the bar lifts the pill like a lens under the finger; letting go opens that tab.
 * Hidden on large screens, where the header has everything.
 */
export const MobileBottomNav: React.FC<{ currentRoute: string }> = ({ currentRoute }) => {
  const { totalItems, isCartOpen, setIsCartOpen } = useCart();
  const { user } = useCustomer();
  const bar = useRef<HTMLDivElement>(null);
  const press = useRef<{ x: number; id: number; dragging: boolean } | null>(null);
  // After a slide, the browser may send one stray tap to the link under the finger; ignore taps briefly.
  const swallowUntil = useRef(0);

  const tabs = [
    { label: 'Home', icon: Home, to: 'home' },
    { label: 'Shop', icon: Store, to: 'products' },
    { label: 'Recipes', icon: UtensilsCrossed, to: 'recipes' },
    { label: 'Cart', icon: ShoppingBag, to: '' },
    { label: 'Account', icon: UserRound, to: user ? 'account' : 'login' },
  ];

  const routeTab = isCartOpen ? 3 : tabForRoute(currentRoute);
  // The pill moves the moment a tab is touched, before the new page has finished loading.
  const [pending, setPending] = useState<number | null>(null);
  const [drag, setDrag] = useState<{ x: number; tab: number } | null>(null);
  useEffect(() => setPending(null), [currentRoute, isCartOpen]);

  const active = drag ? drag.tab : pending ?? routeTab;
  const [lastShown, setLastShown] = useState(Math.max(0, active));
  if (active >= 0 && active !== lastShown) setLastShown(active);

  const open = (i: number) => {
    setPending(i);
    if (i === 3) setIsCartOpen(true);
    else {
      if (isCartOpen) setIsCartOpen(false);
      navigate(tabs[i].to);
    }
  };

  /* ---------- press and slide ---------- */
  const tabAt = (clientX: number) => {
    const r = bar.current!.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - r.left, 0), r.width - 1);
    return { x, tab: Math.floor((x / r.width) * tabs.length) };
  };
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    press.current = { x: e.clientX, id: e.pointerId, dragging: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const p = press.current;
    if (!p || p.id !== e.pointerId) return;
    if (!p.dragging) {
      if (Math.abs(e.clientX - p.x) < DRAG_START) return;
      p.dragging = true;
      bar.current?.setPointerCapture(e.pointerId);
    }
    const at = tabAt(e.clientX);
    setDrag((d) => {
      // A light tick each time the lens crosses into another tab (Android; iPhones ignore it).
      if (d && d.tab !== at.tab) navigator.vibrate?.(6);
      return at;
    });
  };
  const endPress = (e: React.PointerEvent, cancelled = false) => {
    const p = press.current;
    press.current = null;
    if (!p?.dragging) return;
    swallowUntil.current = Date.now() + 350;
    const { tab } = tabAt(e.clientX);
    setDrag(null);
    if (!cancelled && tab !== routeTab) open(tab);
  };

  /* ---------- pill position ---------- */
  const width = bar.current?.clientWidth ?? 0;
  const slot = width / tabs.length;
  const pillStyle: React.CSSProperties = drag
    ? { transform: `translateX(${Math.min(Math.max(drag.x - slot / 2, 0), width - slot)}px)` }
    : { transform: `translateX(${lastShown * 100}%)` };

  const item = 'relative z-10 flex flex-col items-center justify-center gap-1 text-[12px] font-semibold min-h-14 select-none transition-colors duration-300';

  return (
    <nav
      aria-label="Quick links"
      className="mobile-tabbar no-print fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/92 backdrop-blur-xl pb-safe shadow-[0_-8px_24px_-12px_rgb(23_74_50/0.2)] lg:hidden"
    >
      <div
        ref={bar}
        className="relative mx-auto grid max-w-lg grid-cols-5 touch-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(e) => endPress(e)}
        onPointerCancel={(e) => endPress(e, true)}
        onClickCapture={(e) => {
          if (Date.now() < swallowUntil.current) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        {/* The pill: one shape that travels between tabs. */}
        <span
          aria-hidden="true"
          className={`tab-pill pointer-events-none absolute inset-y-1 left-0 w-1/5 px-1.5 ${drag ? 'is-dragging' : ''} ${active < 0 ? 'is-hidden' : ''}`}
          style={pillStyle}
        >
          <span key={drag ? 'drag' : lastShown} className={`tab-pill-shape block h-full w-full rounded-2xl ${drag ? '' : 'tab-pill-stretch'}`} />
        </span>

        {tabs.map(({ label, icon: Icon, to }, i) => {
          const on = active === i;
          const content = (
            <>
              <span className={`tab-icon relative grid h-7 w-12 place-items-center ${on ? 'is-on' : ''}`}>
                <Icon className="h-5 w-5" strokeWidth={on ? 2.4 : 1.9} />
                {i === 3 && totalItems > 0 && (
                  <span className="absolute -top-1 right-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-gold-500 px-1 text-[11px] font-bold text-forest-900 ring-2 ring-paper">
                    {totalItems}
                  </span>
                )}
              </span>
              {label}
            </>
          );
          const cls = `${item} ${on ? 'text-forest-800' : 'text-muted'}`;
          return i === 3 ? (
            <button key={label} type="button" onClick={() => open(3)} className={`${cls} cursor-pointer`} aria-label={`Cart, ${totalItems} packs`} aria-pressed={isCartOpen}>
              {content}
            </button>
          ) : (
            <AppLink
              key={label}
              to={to}
              aria-current={routeTab === i ? 'page' : undefined}
              className={cls}
              onClick={() => {
                setPending(i);
                if (isCartOpen) setIsCartOpen(false);
              }}
            >
              {content}
            </AppLink>
          );
        })}
      </div>
    </nav>
  );
};
