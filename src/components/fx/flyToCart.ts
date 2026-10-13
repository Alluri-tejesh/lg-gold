/**
 * A small gold bag arcs from the button that was pressed to the cart icon in the header,
 * so it is obvious where the item went. Purely visual; skipped for reduced motion.
 */
export function flyToCart(from: Element | null) {
  if (!from || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const target = [...document.querySelectorAll<HTMLElement>('[data-cart-target]')].find((el) => el.offsetParent !== null);
  if (!target || !('animate' in HTMLElement.prototype)) return;

  const a = from.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  const sx = a.left + a.width / 2;
  const sy = a.top + a.height / 2;
  const ex = b.left + b.width / 2;
  const ey = b.top + b.height / 2;

  const dot = document.createElement('div');
  dot.setAttribute('aria-hidden', 'true');
  dot.style.cssText = `position:fixed;left:0;top:0;width:34px;height:34px;margin:-17px 0 0 -17px;z-index:90;pointer-events:none;border-radius:999px;
    background:radial-gradient(circle at 35% 30%,#F2D46B,#C9A227 60%,#A4811B);box-shadow:0 8px 20px -4px rgba(23,74,50,.45);
    display:grid;place-items:center;`;
  dot.innerHTML =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#174A32" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>';
  document.body.appendChild(dot);

  // An arc: up and over, then down into the cart.
  const midX = (sx + ex) / 2;
  const midY = Math.min(sy, ey) - 120;
  const anim = dot.animate(
    [
      { transform: `translate(${sx}px, ${sy}px) scale(0.6)`, opacity: 0 },
      { transform: `translate(${sx}px, ${sy - 10}px) scale(1.1)`, opacity: 1, offset: 0.12 },
      { transform: `translate(${midX}px, ${midY}px) scale(1)`, opacity: 1, offset: 0.55 },
      { transform: `translate(${ex}px, ${ey}px) scale(0.35)`, opacity: 0.6 },
    ],
    { duration: 750, easing: 'cubic-bezier(0.45, 0, 0.2, 1)' },
  );
  anim.onfinish = () => dot.remove();
  anim.oncancel = () => dot.remove();
}
