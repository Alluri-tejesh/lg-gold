import React, { useEffect, useRef, useState } from 'react';
import { Timer, X, BellRing } from 'lucide-react';
import { formatClock } from '../../data/recipeTools';
import { toast } from '../ui/Toast';

export interface KitchenTimer {
  id: number;
  label: string;
  total: number; // seconds
  endsAt: number; // ms timestamp
  done: boolean;
}

/** A short three-note chime, made in the browser so there is no sound file to download. */
const chime = () => {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    [880, 1175, 1568].forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = freq;
      const t = ctx.currentTime + i * 0.22;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.3, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + 0.55);
    });
    setTimeout(() => ctx.close(), 1500);
  } catch {
    /* no sound available; the toast and vibration still tell the cook */
  }
  navigator.vibrate?.([300, 120, 300, 120, 300]);
};

/** Several timers can run at once (rice on one burner, gravy on another). */
export function useKitchenTimers() {
  const [timers, setTimers] = useState<KitchenTimer[]>([]);
  const [, setTick] = useState(0);
  const nextId = useRef(1);
  const latest = useRef(timers);
  latest.current = timers;

  const running = timers.some((t) => !t.done);
  useEffect(() => {
    if (!running) return;
    const iv = setInterval(() => {
      const now = Date.now();
      // Ring outside the state update, so it rings exactly once per timer.
      const due = latest.current.filter((t) => !t.done && t.endsAt <= now);
      if (due.length) {
        chime();
        due.forEach((t) => toast({ message: `Timer done: ${t.label}`, tone: 'info', duration: 10000 }));
        setTimers((list) => list.map((t) => (due.some((d) => d.id === t.id) ? { ...t, done: true } : t)));
      }
      setTick((n) => n + 1);
    }, 1000);
    return () => clearInterval(iv);
  }, [running]);

  const start = (minutes: number, label: string) => {
    const id = nextId.current++;
    setTimers((list) => [...list, { id, label, total: minutes * 60, endsAt: Date.now() + minutes * 60_000, done: false }]);
    toast({ message: `${minutes}-minute timer started.`, tone: 'info', duration: 2500 });
  };
  const cancel = (id: number) => setTimers((list) => list.filter((t) => t.id !== id));

  return { timers, start, cancel };
}

/** The running timers, pinned to the corner of the screen while cooking. */
export const TimerTray: React.FC<{ timers: KitchenTimer[]; onCancel: (id: number) => void }> = ({ timers, onCancel }) => {
  if (!timers.length) return null;
  const now = Date.now();
  return (
    <div className="no-print fixed bottom-20 left-4 z-50 flex w-[min(20rem,calc(100vw-2rem))] flex-col gap-2 lg:bottom-6" aria-live="polite">
      {timers.map((t) => {
        const left = (t.endsAt - now) / 1000;
        const pct = t.done ? 100 : Math.min(100, ((t.total - left) / t.total) * 100);
        return (
          <div
            key={t.id}
            className={`animate-pop-in overflow-hidden rounded-2xl shadow-lift ring-1 ${t.done ? 'bg-gold-500 text-forest-900 ring-gold-600' : 'bg-forest-900 text-cream ring-white/10'}`}
          >
            <div className="flex items-center gap-3 px-4 py-3">
              {t.done ? <BellRing className="h-5 w-5 shrink-0 animate-bounce" /> : <Timer className="h-5 w-5 shrink-0 text-gold-400" />}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm opacity-80">{t.label}</p>
                <p className="font-display text-2xl leading-none tabular">{t.done ? 'Done!' : formatClock(left)}</p>
              </div>
              <button
                type="button"
                onClick={() => onCancel(t.id)}
                aria-label={t.done ? 'Dismiss timer' : 'Cancel timer'}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full hover:bg-black/10 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="h-1 bg-black/15">
              <div className="h-full bg-gold-400 transition-[width] duration-1000 ease-linear" style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
