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
            ? 'bg-black/30 backdrop-blur-xs border-white/15 text-[#F8F5EA]/85 shadow-xs'
            : 'bg-white/90 border-[#C9A227]/30 text-gray-700 shadow-xs'
        }`}
      >
        <li className="inline-flex items-center">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className={`inline-flex items-center gap-1.5 font-medium transition-colors cursor-pointer ${
              isDark ? 'text-[#F8F5EA]/90 hover:text-white' : 'text-[#174A32] hover:text-[#C9A227]'
            }`}
          >
            <Home className={`w-3.5 h-3.5 ${isDark ? 'text-[#C9A227]' : 'text-[#174A32]'}`} />
            <span>Home</span>
          </button>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="inline-flex items-center">
              <ChevronRight
                className={`w-3 h-3 mx-1 shrink-0 ${isDark ? 'text-[#C9A227]' : 'text-[#C9A227]'}`}
              />
              {isLast || !item.route ? (
                <span
                  className={`font-bold truncate max-w-xs ${
                    isDark ? 'text-[#E7D59A]' : 'text-[#174A32]'
                  }`}
                >
                  {item.label}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onNavigate(item.route!, item.param)}
                  className={`transition-colors cursor-pointer font-medium ${
                    isDark ? 'text-[#F8F5EA]/90 hover:text-[#E7D59A]' : 'text-gray-600 hover:text-[#174A32]'
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

