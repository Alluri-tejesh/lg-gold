/**
 * Helpers for the recipe page: scaling ingredient amounts to a different number of servings,
 * and finding cooking times in a step ("simmer for 10 minutes") so the page can offer a timer.
 */

const FRACTIONS: [number, string][] = [
  [0.125, '⅛'],
  [0.25, '¼'],
  [1 / 3, '⅓'],
  [0.5, '½'],
  [2 / 3, '⅔'],
  [0.75, '¾'],
];

const UNICODE: Record<string, number> = { '⅛': 0.125, '¼': 0.25, '½': 0.5, '¾': 0.75, '⅓': 1 / 3, '⅔': 2 / 3 };

/** 1.5 -> "1½", 0.25 -> "¼", 12.4 -> "12", 2.3 -> "2.3" */
export const formatQuantity = (n: number): string => {
  if (n >= 10) return String(Math.round(n));
  const whole = Math.floor(n);
  const rest = n - whole;
  for (const [v, sym] of FRACTIONS) {
    if (Math.abs(rest - v) < 0.06) return `${whole || ''}${sym}`;
  }
  if (rest < 0.06) return String(whole);
  if (rest > 0.94) return String(whole + 1);
  return String(Math.round(n * 10) / 10);
};

// A number: "1 1/2", "3/4", "1.5", "2", "½", "1½". Not part of a word, and not inside "(...)".
const NUMBER = /(\d+\s+\d+\/\d+|\d+\/\d+|\d*\.\d+|\d+[⅛¼½¾⅓⅔]?|[⅛¼½¾⅓⅔])/g;

const parseNumber = (s: string): number => {
  s = s.trim();
  const mixed = s.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixed) return Number(mixed[1]) + Number(mixed[2]) / Number(mixed[3]);
  const frac = s.match(/^(\d+)\/(\d+)$/);
  if (frac) return Number(frac[1]) / Number(frac[2]);
  const uni = s.match(/^(\d*)([⅛¼½¾⅓⅔])$/);
  if (uni) return Number(uni[1] || 0) + UNICODE[uni[2]];
  return Number(s);
};

/**
 * Scales the quantities in an ingredient amount, e.g. "2 cups (soaked 20 mins)" × 1.5 -> "3 cups (soaked 20 mins)".
 * Numbers inside brackets and times ("20 mins") are left alone, as is "to taste".
 */
export const scaleAmount = (amount: string, factor: number): string => {
  if (factor === 1) return amount;
  let depth = 0;
  let out = '';
  const parts = amount.split(/([()])/);
  for (const part of parts) {
    if (part === '(') depth++;
    if (part === ')') depth = Math.max(0, depth - 1);
    if (depth > 0 || part === '(' || part === ')') {
      out += part;
      continue;
    }
    out += part.replace(NUMBER, (m, _g, offset: number, whole: string) => {
      const after = whole.slice(offset + m.length);
      if (/^\s*(min|mins|minute|minutes|hr|hrs|hour|hours|sec|°|%)/i.test(after)) return m;
      const n = parseNumber(m);
      return Number.isFinite(n) && n > 0 ? formatQuantity(n * factor) : m;
    });
  }
  return out;
};

/** Cooking times mentioned in a step, in minutes: "cook for 30 minutes" -> [30], "6 to 8 minutes" -> [8]. */
export const findTimers = (text: string): { minutes: number; label: string }[] => {
  const found: { minutes: number; label: string }[] = [];
  const re = /(\d+)(?:\s*(?:to|-|–)\s*(\d+))?\s*(minutes?|mins?|hours?|hrs?)\b/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const n = Number(m[2] ?? m[1]);
    const minutes = /^h/i.test(m[3]) ? n * 60 : n;
    if (minutes >= 1 && minutes <= 240 && !found.some((f) => f.minutes === minutes)) {
      found.push({ minutes, label: m[0] });
    }
  }
  return found;
};

/** "1:05:09" or "4:09" */
export const formatClock = (seconds: number): string => {
  const s = Math.max(0, Math.ceil(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`;
};
