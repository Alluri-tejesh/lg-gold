import React from 'react';
import { ChevronRight } from 'lucide-react';
import { routeHref } from '../../router';

interface BreadcrumbItem {
  label: string;
  route?: string;
  param?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (route: string, param?: string) => void;
  variant?: 'light' | 'dark';
}

/** Home › Section › Page. Real links, so they can be opened in a new tab. */
export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigate, variant = 'light' }) => {
  const dark = variant === 'dark';
  const all = [{ label: 'Home', route: 'home' } as BreadcrumbItem, ...items];
  return (
    <nav aria-label="Breadcrumb">
      <ol className={`flex flex-wrap items-center gap-1 text-sm ${dark ? 'text-cream/70' : 'text-muted'}`}>
        {all.map((item, i) => {
          const last = i === all.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="inline-flex items-center gap-1 min-w-0">
              {i > 0 && <ChevronRight className={`h-3.5 w-3.5 shrink-0 ${dark ? 'text-gold-400' : 'text-gold-600'}`} aria-hidden="true" />}
              {last || !item.route ? (
                <span aria-current={last ? 'page' : undefined} className={`truncate font-semibold ${dark ? 'text-cream' : 'text-forest-800'}`}>
                  {item.label}
                </span>
              ) : (
                <a
                  href={routeHref(item.route, item.param)}
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                    e.preventDefault();
                    onNavigate(item.route!, item.param);
                  }}
                  className={`rounded px-0.5 font-medium underline-offset-4 hover:underline ${dark ? 'hover:text-white' : 'hover:text-forest-800'}`}
                >
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
