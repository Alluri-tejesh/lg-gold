import React from 'react';
import { ArrowLeft, Store, UtensilsCrossed } from 'lucide-react';
import { AppLink } from '../components/ui/AppLink';
import { buttonClass } from '../components/ui/Button';

/** Shown for links to pages that do not exist (an old bookmark, a typo). */
export const NotFoundView: React.FC = () => (
  <section className="bg-grain">
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 py-20 text-center">
      <p className="font-display text-[7rem] leading-none text-gold-500/70">404</p>
      <h1 className="mt-4 font-display text-4xl text-forest-800">This page has wandered off the farm</h1>
      <p className="mt-4 text-lg text-muted">The link may be old or mistyped. Everything else is just where you left it.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <AppLink to="home" className={buttonClass('primary', 'lg')}>
          <ArrowLeft className="h-5 w-5" /> Back to home
        </AppLink>
        <AppLink to="products" className={buttonClass('outline', 'lg')}>
          <Store className="h-5 w-5" /> Shop rice
        </AppLink>
        <AppLink to="recipes" className={buttonClass('ghost', 'lg')}>
          <UtensilsCrossed className="h-5 w-5" /> Recipes
        </AppLink>
      </div>
    </div>
  </section>
);
