import React, { useId } from 'react';

/** Grain positions (x) inside the coin; each falls on its own beat (see .bl-grain in index.html). */
const GRAINS = [46, 58, 70, 52, 64, 75];
/** One wave period is 60 units; the path runs from -60 to 240 so it can slide left forever without a seam. */
const wave = (y: number, up: boolean) => `M-60 ${y} q15 ${up ? -5 : 5} 30 0${' t30 0'.repeat(9)} V240 H-60 Z`;

/**
 * "Grain to Gold": rice grains fall into the LG Gold coin while liquid gold rises inside it.
 * The same drawing is in index.html as the first-load screen; its CSS (the .bl-* classes) lives there too,
 * so it is ready before any script runs. Respects "reduce motion".
 */
export const BrandLoader: React.FC<{ small?: boolean; label?: string }> = ({ small, label = 'Loading' }) => {
  const id = useId().replace(/:/g, '');
  return (
    <div role="status" aria-label={label} className={`bl-wrap ${small ? 'bl-sm' : ''}`}>
      <svg className="bl" viewBox="0 0 120 120" aria-hidden="true">
        <defs>
          <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F2D46B" />
            <stop offset="0.6" stopColor="#D8B23A" />
            <stop offset="1" stopColor="#B38A17" />
          </linearGradient>
          <clipPath id={`${id}c`}>
            <circle cx="60" cy="60" r="43" />
          </clipPath>
        </defs>
        <circle cx="60" cy="60" r="43" fill="#FFFAF0" />
        <g clipPath={`url(#${id}c)`}>
          <g>
            {GRAINS.map((x) => (
              <ellipse key={x} className="bl-grain" cx={x} cy="24" rx="1.7" ry="4.2" fill="#FFFFFF" stroke="#B9922A" strokeWidth="0.9" />
            ))}
          </g>
          <g className="bl-fill">
            <path className="bl-wave2" fill={`url(#${id}g)`} d={wave(104, true)} />
            <path className="bl-wave" fill={`url(#${id}g)`} d={wave(106, false)} />
          </g>
        </g>
        <circle cx="60" cy="60" r="43" fill="none" stroke="#174A32" strokeWidth="2.2" />
        <circle cx="60" cy="60" r="51" fill="none" stroke="#EFE3BF" strokeWidth="3" />
        <circle className="bl-ring" cx="60" cy="60" r="51" fill="none" stroke="#D8B23A" strokeWidth="3" strokeLinecap="round" pathLength="100" />
        <g className="bl-mono">
          <g transform="translate(60 60) scale(1.25) translate(-30 -32)" fill="#174A32">
            <path d="M18 20h5.2v19.4h9.4V44H18z" />
            <path
              d="M41.5 33.6h-7v4.1h3.2c-.6 1.8-2.1 2.8-4.1 2.8-2.9 0-4.8-2.3-4.8-5.6s1.9-5.6 4.7-5.6c1.6 0 2.8.7 3.6 1.9l3.8-2.4c-1.6-2.5-4.2-3.9-7.4-3.9-5.7 0-9.7 4.1-9.7 10s3.9 10 9.6 10c5.6 0 8.9-3.9 8.9-9.7z"
              transform="translate(2 -1.5) scale(0.92)"
            />
          </g>
        </g>
      </svg>
      <p className="bl-word">
        LG <span>GOLD</span>
      </p>
      <p className="bl-tag">Fresh from our mill</p>
    </div>
  );
};
