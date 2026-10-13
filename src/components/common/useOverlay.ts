import { RefObject, useEffect, useRef } from 'react';

// Several overlays can be open at once (cart, then checkout), so count them and unlock scrolling only when the last one closes.
let openCount = 0;

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Shared behaviour for modals and drawers while they are open:
 * Escape closes them, the page behind stops scrolling, and when a container is given,
 * keyboard focus moves into it, cannot Tab out of it, and returns to where it was on close.
 */
export function useOverlay(isOpen: boolean, onClose: () => void, containerRef?: RefObject<HTMLElement | null>): void {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Only the top-most overlay closes.
        const el = containerRef?.current;
        if (!el || isTopMost(el)) closeRef.current();
        return;
      }
      if (e.key !== 'Tab' || !containerRef?.current || !isTopMost(containerRef.current)) return;
      const nodes = [...containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((n) => n.offsetParent !== null);
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      } else if (!containerRef.current.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    openCount++;
    document.body.style.overflow = 'hidden';

    // Move focus inside, unless something inside already took it (an autofocus search box).
    const raf = requestAnimationFrame(() => {
      const el = containerRef?.current;
      if (el && !el.contains(document.activeElement)) {
        const target = el.querySelector<HTMLElement>('[data-autofocus]') ?? el.querySelector<HTMLElement>(FOCUSABLE) ?? el;
        target.focus({ preventScroll: true });
      }
    });

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKeyDown);
      openCount--;
      if (openCount === 0) document.body.style.overflow = '';
      if (previouslyFocused && document.contains(previouslyFocused)) previouslyFocused.focus({ preventScroll: true });
    };
  }, [isOpen, containerRef]);
}

/** True when no other open dialog sits above this one in the page. */
function isTopMost(el: HTMLElement): boolean {
  const dialogs = [...document.querySelectorAll<HTMLElement>('[aria-modal="true"]')];
  return dialogs[dialogs.length - 1]?.contains(el) || dialogs[dialogs.length - 1] === el || dialogs.length === 0;
}
