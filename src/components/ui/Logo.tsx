import React from 'react';

/**
 * The LG Gold mark, drawn after the logo on the bag: a gold coin with an LG monogram and a rice stalk.
 * Vector, so it is sharp at any size and costs no image download.
 */
export const LogoMark: React.FC<{ className?: string; title?: string }> = ({ className = 'w-10 h-10', title }) => (
  <svg viewBox="0 0 64 64" className={className} role={title ? 'img' : undefined} aria-hidden={title ? undefined : true}>
    {title && <title>{title}</title>}
    <defs>
      <linearGradient id="lg-coin" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#F2D46B" />
        <stop offset="0.55" stopColor="#D8B23A" />
        <stop offset="1" stopColor="#B38A17" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="31" fill="url(#lg-coin)" />
    <circle cx="32" cy="32" r="26.5" fill="none" stroke="#174A32" strokeWidth="2.2" />
    {/* rice stalk */}
    <path d="M44.5 15.5c-1.2 6-1 13 .6 19.5" fill="none" stroke="#174A32" strokeWidth="1.6" strokeLinecap="round" />
    {[0, 1, 2, 3].map((i) => (
      <ellipse key={i} cx={42.4 + (i % 2) * 4.2} cy={18 + i * 3.6} rx="2.1" ry="1" transform={`rotate(${i % 2 ? 35 : -35} ${42.4 + (i % 2) * 4.2} ${18 + i * 3.6})`} fill="#174A32" />
    ))}
    {/* L */}
    <path d="M18 20h5.2v19.4h9.4V44H18z" fill="#174A32" />
    {/* G */}
    <path
      d="M41.5 33.6h-7v4.1h3.2c-.6 1.8-2.1 2.8-4.1 2.8-2.9 0-4.8-2.3-4.8-5.6s1.9-5.6 4.7-5.6c1.6 0 2.8.7 3.6 1.9l3.8-2.4c-1.6-2.5-4.2-3.9-7.4-3.9-5.7 0-9.7 4.1-9.7 10s3.9 10 9.6 10c5.6 0 8.9-3.9 8.9-9.7z"
      fill="#174A32"
      transform="translate(2 -1.5) scale(0.92)"
    />
  </svg>
);

/** Mark + "LG GOLD" wordmark + company line. `dark` is for green backgrounds. */
export const Logo: React.FC<{ dark?: boolean; compact?: boolean; className?: string; taglineOnPhones?: boolean }> = ({
  dark,
  compact,
  className = '',
  taglineOnPhones = true,
}) => (
  <span className={`inline-flex items-center gap-3 ${className}`}>
    <LogoMark className="w-11 h-11 shrink-0 drop-shadow-sm" />
    <span className="flex flex-col leading-none">
      <span className={`font-display font-bold text-[1.55rem] tracking-tight ${dark ? 'text-white' : 'text-forest-800'}`}>
        LG <span className={dark ? 'text-gold-400' : 'text-gold-600'}>GOLD</span>
      </span>
      {!compact && (
        <span
          className={`mt-1 text-[11.5px] font-semibold tracking-[0.12em] uppercase ${taglineOnPhones ? '' : 'hidden sm:block'} ${
            dark ? 'text-cream/70' : 'text-muted'
          }`}
        >
          Sri Lakshmi Ganapathi Trading Co.
        </span>
      )}
    </span>
  </span>
);
