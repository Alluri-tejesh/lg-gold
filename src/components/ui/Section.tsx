import React from 'react';
import { useInView } from '../common/motion';

type Tone = 'cream' | 'paper' | 'white' | 'forest' | 'forest-deep';

const TONES: Record<Tone, string> = {
  cream: 'bg-cream text-ink',
  paper: 'bg-paper text-ink',
  white: 'bg-white text-ink',
  forest: 'bg-forest-800 text-cream',
  'forest-deep': 'bg-forest-950 text-cream',
};

export const Container: React.FC<{ className?: string; children: React.ReactNode; narrow?: boolean }> = ({
  className = '',
  children,
  narrow,
}) => <div className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${narrow ? 'max-w-4xl' : 'max-w-7xl'} ${className}`}>{children}</div>;

/** A full-width band of the page with consistent vertical rhythm. */
export const Section: React.FC<{
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
  id?: string;
  grain?: boolean;
  tight?: boolean;
}> = ({ tone = 'cream', className = '', children, id, grain, tight }) => {
  const dark = tone === 'forest' || tone === 'forest-deep';
  return (
    <section
      id={id}
      // overflow-x-clip trims decorative glows at the screen edge without breaking position: sticky inside
      className={`relative overflow-x-clip ${TONES[tone]} ${tight ? 'py-12 sm:py-16' : 'py-16 sm:py-24'} ${
        grain ? (dark ? 'bg-grain-light' : 'bg-grain') : ''
      } ${className}`}
    >
      {children}
    </section>
  );
};

/** Small label above a heading: "OUR RICE", "FROM THE MILL"... */
export const Eyebrow: React.FC<{ children: React.ReactNode; dark?: boolean; className?: string }> = ({ children, dark, className = '' }) => (
  <p
    className={`inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.16em] ${
      dark ? 'text-gold-400' : 'text-gold-700'
    } ${className}`}
  >
    <span aria-hidden="true" className={`h-px w-6 ${dark ? 'bg-gold-400' : 'bg-gold-500'}`} />
    {children}
  </p>
);

/** A heading's words rise into place one after another the first time it scrolls into view. */
const SplitTitle: React.FC<{ text: string }> = ({ text }) => {
  const [ref, seen] = useInView<HTMLSpanElement>(0.4);
  return (
    <span ref={ref} className={seen ? 'split-in' : ''}>
      {text.split(' ').map((word, i, all) => (
        <React.Fragment key={i}>
          <span className="split-word">
            <span style={{ ['--i' as string]: i }}>{word}</span>
          </span>
          {i < all.length - 1 ? ' ' : ''}
        </React.Fragment>
      ))}
    </span>
  );
};

/** Eyebrow + heading + intro, the same everywhere. */
export const SectionHeader: React.FC<{
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  align?: 'left' | 'center';
  dark?: boolean;
  action?: React.ReactNode;
  as?: 'h1' | 'h2';
  className?: string;
}> = ({ eyebrow, title, intro, align = 'left', dark, action, as: Tag = 'h2', className = '' }) => {
  const center = align === 'center';
  return (
    <div
      className={`flex flex-col gap-6 ${center ? 'items-center text-center' : 'sm:flex-row sm:items-end sm:justify-between'} mb-10 sm:mb-14 ${className}`}
    >
      <div className={center ? 'max-w-2xl' : 'max-w-2xl'}>
        {eyebrow && <Eyebrow dark={dark}>{eyebrow}</Eyebrow>}
        <Tag
          className={`mt-3 font-display font-medium tracking-tight text-[2rem] leading-[1.1] sm:text-[2.6rem] ${
            dark ? 'text-white' : 'text-forest-800'
          }`}
        >
          {typeof title === 'string' ? <SplitTitle text={title} /> : title}
        </Tag>
        {intro && <p className={`mt-4 text-base sm:text-lg leading-relaxed ${dark ? 'text-cream/80' : 'text-muted'}`}>{intro}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

/** A rounded surface. `interactive` adds the hover lift used for clickable cards. */
export const Card: React.FC<{
  className?: string;
  children: React.ReactNode;
  interactive?: boolean;
  as?: 'div' | 'article' | 'li';
}> = ({ className = '', children, interactive, as: Tag = 'div' }) => (
  <Tag className={`rounded-2xl bg-white ring-1 ring-line shadow-soft ${interactive ? 'lift' : ''} ${className}`}>{children}</Tag>
);

type BadgeTone = 'cream' | 'gold' | 'forest' | 'outline' | 'danger' | 'glass';
const BADGES: Record<BadgeTone, string> = {
  cream: 'bg-cream text-forest-800 ring-1 ring-inset ring-line',
  gold: 'bg-gold-100 text-gold-700 ring-1 ring-inset ring-gold-300',
  forest: 'bg-forest-800 text-gold-300',
  outline: 'bg-transparent text-forest-800 ring-1 ring-inset ring-forest-800/25',
  danger: 'bg-danger-50 text-danger ring-1 ring-inset ring-danger/25',
  glass: 'bg-white/10 text-cream ring-1 ring-inset ring-white/20 backdrop-blur',
};

export const Badge: React.FC<{ tone?: BadgeTone; icon?: React.ReactNode; children: React.ReactNode; className?: string }> = ({
  tone = 'cream',
  icon,
  children,
  className = '',
}) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-semibold ${BADGES[tone]} ${className}`}>
    {icon}
    {children}
  </span>
);
