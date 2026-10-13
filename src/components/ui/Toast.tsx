import React, { useSyncExternalStore } from 'react';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export interface ToastItem {
  id: number;
  message: string;
  tone?: 'success' | 'info' | 'error';
  action?: { label: string; onClick: () => void };
  duration?: number;
}

let items: ToastItem[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const dismissToast = (id: number) => {
  items = items.filter((t) => t.id !== id);
  emit();
};

/** Shows a short message at the bottom of the screen. Works from anywhere, no provider needed. */
export const toast = (t: Omit<ToastItem, 'id'>): number => {
  const id = nextId++;
  items = [...items.slice(-2), { ...t, id }]; // at most three at once
  emit();
  setTimeout(() => dismissToast(id), t.duration ?? 4000);
  return id;
};

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

const ICONS = { success: CheckCircle2, info: Info, error: AlertTriangle };

export const Toaster: React.FC = () => {
  const list = useSyncExternalStore(subscribe, () => items);
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-20 lg:bottom-6 z-[70] flex flex-col items-center gap-2 px-4"
    >
      {list.map((t) => {
        const Icon = ICONS[t.tone ?? 'success'];
        return (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto animate-pop-in flex w-full max-w-md items-center gap-3 rounded-2xl bg-forest-900 px-4 py-3 text-cream shadow-lift ring-1 ring-white/10"
          >
            <Icon className={`h-5 w-5 shrink-0 ${t.tone === 'error' ? 'text-red-300' : 'text-gold-400'}`} aria-hidden="true" />
            <p className="flex-1 text-[15px] leading-snug">{t.message}</p>
            {t.action && (
              <button
                type="button"
                onClick={() => {
                  t.action!.onClick();
                  dismissToast(t.id);
                }}
                className="shrink-0 rounded-full bg-gold-500 px-3.5 py-1.5 text-sm font-semibold text-forest-900 hover:bg-gold-400 cursor-pointer"
              >
                {t.action.label}
              </button>
            )}
            <button
              type="button"
              onClick={() => dismissToast(t.id)}
              aria-label="Dismiss"
              className="shrink-0 -mr-1 rounded-full p-1.5 text-cream/60 hover:text-white hover:bg-white/10 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
