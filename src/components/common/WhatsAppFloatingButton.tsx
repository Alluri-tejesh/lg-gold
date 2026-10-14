import React from 'react';
import { MessageCircle } from 'lucide-react';
import { createWhatsAppUrl } from '../../config/brandConfig';

/** Desktop only: phones have WhatsApp in the bottom bar. Pulses three times when the page opens, then stays still. */
export const WhatsAppFloatingButton: React.FC = () => (
  <aside aria-label="Chat">
  <a
    href={createWhatsAppUrl('Hi LG Gold Team, I would like to inquire about your rice, wholesale rates or export pricing.')}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat with the mill on WhatsApp"
    className="no-print group fixed bottom-6 right-6 z-40 hidden items-center gap-3 lg:flex"
  >
    <span className="pointer-events-none translate-x-2 rounded-full bg-forest-900 px-4 py-2 text-sm font-semibold text-cream opacity-0 shadow-lift transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
      Chat with the mill
    </span>
    <span className="ring-pulse grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-white shadow-lift transition-transform duration-300 group-hover:scale-105">
      <MessageCircle className="h-7 w-7 fill-white" />
    </span>
  </a>
  </aside>
);
