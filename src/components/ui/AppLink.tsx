import React from 'react';
import { navigate, routeHref } from '../../router';

type Props = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  to: string;
  param?: string;
};

/**
 * A link to a page of this site. A plain click navigates in place (with the page transition);
 * Ctrl/Cmd/middle click still opens a new tab because it is a real <a href>.
 */
export const AppLink = React.forwardRef<HTMLAnchorElement, Props>(({ to, param, onClick, children, ...rest }, ref) => (
  <a
    ref={ref}
    href={routeHref(to, param)}
    onClick={(e) => {
      onClick?.(e);
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      navigate(to, param);
    }}
    {...rest}
  >
    {children}
  </a>
));
AppLink.displayName = 'AppLink';
