import React from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'gold' | 'outline' | 'ghost' | 'whatsapp' | 'light' | 'outline-light' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-forest-800 text-white hover:bg-forest-700 shadow-soft',
  gold: 'bg-gold-500 text-forest-900 hover:bg-gold-400 shadow-soft',
  outline: 'bg-transparent text-forest-800 ring-1 ring-inset ring-forest-800/30 hover:ring-forest-800 hover:bg-forest-800/5',
  ghost: 'bg-transparent text-forest-800 hover:bg-forest-800/6',
  whatsapp: 'bg-whatsapp text-white hover:brightness-95 shadow-soft',
  light: 'bg-white text-forest-800 hover:bg-cream shadow-soft',
  'outline-light': 'bg-transparent text-white ring-1 ring-inset ring-white/40 hover:ring-white hover:bg-white/10',
  danger: 'bg-transparent text-danger ring-1 ring-inset ring-danger/40 hover:bg-danger-50',
};

// Every size is at least 44px tall on touch screens, the minimum comfortable tap target.
const SIZES: Record<Size, string> = {
  sm: 'min-h-10 px-4 text-sm gap-1.5',
  md: 'min-h-11 px-5 text-[15px] gap-2',
  lg: 'min-h-13 px-7 text-base gap-2.5',
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  block?: boolean;
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
}

type ButtonProps = CommonProps & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & { href?: undefined };
type LinkProps = CommonProps & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & { href: string };

export const buttonClass = (variant: Variant = 'primary', size: Size = 'md', block = false, extra = '') =>
  [
    'inline-flex items-center justify-center rounded-full font-semibold whitespace-nowrap select-none',
    'transition-all duration-200 active:scale-[0.97] cursor-pointer',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 disabled:shadow-none',
    VARIANTS[variant],
    SIZES[size],
    block ? 'w-full' : '',
    extra,
  ].join(' ');

/** The one button style for the whole site. Pass `href` to render a link that looks the same. */
export const Button: React.FC<ButtonProps | LinkProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  block,
  loading,
  className = '',
  children,
  ...rest
}) => {
  const cls = buttonClass(variant as Variant, size as Size, block, className);
  const content = (
    <>
      {loading ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : icon}
      {children}
      {iconRight}
    </>
  );
  if ('href' in rest && rest.href !== undefined) {
    const { href, ...a } = rest as LinkProps;
    const external = /^https?:/.test(href);
    return (
      <a href={href} className={cls} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...a}>
        {content}
      </a>
    );
  }
  const b = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button {...b} type={b.type ?? 'button'} className={cls} disabled={b.disabled || loading} aria-busy={loading || undefined}>
      {content}
    </button>
  );
};
