import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useOverlay } from '../common/useOverlay';

type Placement = 'center' | 'right' | 'top';

const PANEL: Record<Placement, string> = {
  // On phones the centred dialog becomes a bottom sheet, which is easier to reach with a thumb.
  center:
    'w-full sm:max-w-lg mt-auto sm:my-auto rounded-t-3xl sm:rounded-3xl max-h-[92dvh] animate-slide-up sm:animate-pop-in',
  right: 'ml-auto h-full w-full max-w-md animate-slide-in-right sm:rounded-l-3xl',
  top: 'w-full max-w-2xl mt-[8vh] mb-auto rounded-3xl max-h-[80dvh] animate-pop-in',
};

const BACKDROP: Record<Placement, string> = {
  center: 'flex items-end sm:items-center justify-center sm:p-6',
  right: 'flex',
  top: 'flex justify-center px-4',
};

interface DialogProps {
  open: boolean;
  onClose: () => void;
  /** Read out by screen readers when the dialog opens. */
  label: string;
  placement?: Placement;
  className?: string;
  children: React.ReactNode;
  /** Shows a round close button in the corner. Set false when the content has its own. */
  closeButton?: boolean;
  wide?: boolean;
  /** Light close button, for dialogs with a dark background. */
  dark?: boolean;
}

/** Every modal, drawer and sheet on the site. Handles Escape, outside click, focus and scroll locking. */
export const Dialog: React.FC<DialogProps> = ({ open, onClose, label, placement = 'center', className = '', children, closeButton = true, wide, dark }) => {
  const panel = useRef<HTMLDivElement>(null);
  useOverlay(open, onClose, panel);
  if (!open) return null;

  // Rendered at the end of <body>, so no parent (like the sticky header) can trap it under other layers.
  return createPortal(
    <div
      className={`fixed inset-0 z-[60] bg-forest-950/55 backdrop-blur-[2px] animate-fade-in ${BACKDROP[placement]}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={`relative flex flex-col overflow-hidden bg-paper shadow-lift focus:outline-none ${PANEL[placement]} ${
          wide && placement === 'center' ? 'sm:max-w-2xl' : ''
        } ${className}`}
      >
        {closeButton && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={`absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full cursor-pointer ${
              dark ? 'text-cream/80 hover:bg-white/10 hover:text-white' : 'text-muted hover:bg-forest-800/8 hover:text-forest-800'
            }`}
          >
            <X className="h-5 w-5" />
          </button>
        )}
        {children}
      </div>
    </div>,
    document.body,
  );
};
