import React from 'react';

/**
 * A price whose digits roll like an odometer when the value changes (a new pack size, a new quantity).
 * Screen readers get the plain number; the rolling digits are decoration.
 */
export const RollingNumber: React.FC<{ value: number; prefix?: string; className?: string }> = ({ value, prefix = '₹', className = '' }) => {
  const text = value.toLocaleString('en-IN');
  // Key digits from the right, so "1,650" -> "15,500" keeps the units column in place while new columns appear.
  const chars = text.split('');
  return (
    <span className={`relative inline-flex items-baseline tabular ${className}`}>
      <span className="sr-only">
        {prefix}
        {text}
      </span>
      <span aria-hidden="true" className="inline-flex">
        {prefix}
        {chars.map((ch, i) => {
          const fromRight = chars.length - i;
          if (!/\d/.test(ch)) {
            return <span key={`s${fromRight}`}>{ch}</span>;
          }
          const d = Number(ch);
          return (
            <span key={`d${fromRight}`} className="relative inline-block h-[1.1em] overflow-hidden leading-[1.1]">
              {/* invisible digit keeps the column width */}
              <span className="invisible">0</span>
              <span
                className="absolute inset-x-0 top-0 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none"
                style={{ transform: `translateY(${-d * 10}%)` }}
              >
                {Array.from({ length: 10 }, (_, n) => (
                  <span key={n} className="h-[1.1em] leading-[1.1]">
                    {n}
                  </span>
                ))}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
};
