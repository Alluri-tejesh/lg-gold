import React from 'react';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { Container, Eyebrow } from './Section';

interface PageHeroProps {
  crumbs: { label: string; route?: string; param?: string }[];
  onNavigate: (route: string, param?: string) => void;
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  actions?: React.ReactNode;
  /** Optional panel on the right on wide screens (a summary card, a photo...). */
  aside?: React.ReactNode;
}

/** The green band at the top of every inner page. */
export const PageHero: React.FC<PageHeroProps> = ({ crumbs, onNavigate, eyebrow, title, intro, actions, aside }) => (
  <header className="relative overflow-hidden bg-forest-800 text-cream bg-grain-light">
    {/* soft gold glow in the corner */}
    <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-40 h-96 w-96 rounded-full bg-gold-500/20 blur-3xl" />
    <Container className="relative py-10 sm:py-14 lg:py-16">
      <Breadcrumbs items={crumbs} onNavigate={onNavigate} variant="dark" />
      <div className={`mt-6 grid gap-10 ${aside ? 'lg:grid-cols-12 lg:items-center' : ''}`}>
        <div className={aside ? 'lg:col-span-7' : 'max-w-3xl'}>
          {eyebrow && <Eyebrow dark className="fade-up">{eyebrow}</Eyebrow>}
          <h1
            className="fade-up mt-3 font-display font-medium tracking-tight text-white text-[2.4rem] leading-[1.05] sm:text-5xl lg:text-[3.5rem]"
            style={{ ['--d' as string]: '60ms' }}
          >
            {title}
          </h1>
          {intro && (
            <p className="fade-up mt-5 max-w-2xl text-lg leading-relaxed text-cream/80" style={{ ['--d' as string]: '120ms' }}>
              {intro}
            </p>
          )}
          {actions && (
            <div className="fade-up mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap" style={{ ['--d' as string]: '180ms' }}>
              {actions}
            </div>
          )}
        </div>
        {aside && (
          <div className="fade-up lg:col-span-5" style={{ ['--d' as string]: '200ms' }}>
            {aside}
          </div>
        )}
      </div>
    </Container>
  </header>
);
