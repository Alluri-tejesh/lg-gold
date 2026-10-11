import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

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

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigate, variant = 'light' }) => {
  const isDark = variant === 'dark';

  return (
    <nav aria-label="Breadcrumb" className="inline-block">
      <ol
        className={`inline-flex items-center flex-wrap gap-1 text-xs py-1.5 px-3 rounded-full border transition-all ${
          isDark
            ? 'bg-black/30 backdrop-blur-xs border-white/15 text-[#F3F4EC]/85 shadow-xs'
            : 'bg-white/90 border-[#E0A21A]/30 text-gray-700 shadow-xs'
        }`}
      >
        <li className="inline-flex items-center">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className={`inline-flex items-center gap-1.5 font-medium transition-colors cursor-pointer ${
              isDark ? 'text-[#F3F4EC]/90 hover:text-white' : 'text-[#0B3B2C] hover:text-[#E0A21A]'
            }`}
          >
            <Home className={`w-3.5 h-3.5 ${isDark ? 'text-[#E0A21A]' : 'text-[#0B3B2C]'}`} />
            <span>Home</span>
          </button>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="inline-flex items-center">
              <ChevronRight
                className={`w-3 h-3 mx-1 shrink-0 ${isDark ? 'text-[#E0A21A]' : 'text-[#E0A21A]'}`}
              />
              {isLast || !item.route ? (
                <span
                  className={`font-bold truncate max-w-xs ${
                    isDark ? 'text-[#F0D890]' : 'text-[#0B3B2C]'
                  }`}
                >
                  {item.label}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onNavigate(item.route!, item.param)}
                  className={`transition-colors cursor-pointer font-medium ${
                    isDark ? 'text-[#F3F4EC]/90 hover:text-[#F0D890]' : 'text-gray-600 hover:text-[#0B3B2C]'
                  }`}
                >
                  {item.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

