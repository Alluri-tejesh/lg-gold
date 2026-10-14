import React from 'react';
import { Plus } from 'lucide-react';

/** Questions and answers. Built on <details>, so it works with keyboard, screen readers and even without JavaScript. */
export const Faq: React.FC<{ items: { question: string; answer: React.ReactNode }[]; dark?: boolean }> = ({ items, dark }) => (
  <div className="space-y-3">
    {items.map((f) => (
      <details
        key={f.question}
        className={`group rounded-2xl ring-1 transition-colors open:shadow-soft ${
          dark ? 'bg-white/5 ring-white/10 open:bg-white/8' : 'bg-white ring-line open:ring-gold-300'
        }`}
      >
        <summary
          className={`flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold [&::-webkit-details-marker]:hidden ${
            dark ? 'text-white' : 'text-forest-800'
          }`}
        >
          {f.question}
          <Plus className={`h-5 w-5 shrink-0 transition-transform duration-300 group-open:rotate-45 ${dark ? 'text-gold-400' : 'text-gold-600'}`} aria-hidden="true" />
        </summary>
        <div className={`px-5 pb-5 leading-relaxed ${dark ? 'text-cream/80' : 'text-ink-soft'}`}>{f.answer}</div>
      </details>
    ))}
  </div>
);
