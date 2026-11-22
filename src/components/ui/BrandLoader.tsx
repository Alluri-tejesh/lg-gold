import React from 'react';

/**
 * The official logo with a gold ring sweeping round it, shown while a page loads.
 * The same markup is in index.html as the first-load screen; its CSS (the .bl-* classes) lives there too,
 * so it is ready before any script runs. Respects "reduce motion".
 */
export const BrandLoader: React.FC<{ small?: boolean; label?: string }> = ({ small, label = 'Loading' }) => (
  <div role="status" aria-label={label} className={`bl-wrap ${small ? 'bl-sm' : ''}`}>
    <div className="bl">
      <img src="/logo.jpg" alt="" width={500} height={500} />
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle className="bl-ring" cx="60" cy="60" r="49" fill="none" stroke="#D8B23A" strokeWidth="2.4" strokeLinecap="round" pathLength="100" />
      </svg>
    </div>
    <p className="bl-word">
      LG <span>GOLD</span>
    </p>
    <p className="bl-tag">Fresh from our mill</p>
  </div>
);
