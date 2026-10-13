import React from 'react';
import { CheckCircle2, MessageCircle, Phone } from 'lucide-react';
import { BRAND_CONFIG, openWhatsApp, phoneTelHref } from '../../config/brandConfig';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';

interface QuoteSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  quoteType: 'Export' | 'Wholesale' | 'Bulk' | 'Contact';
  /** The WhatsApp link that was just opened, so the buyer can open it again if they closed the tab. */
  whatsappUrl: string;
}

/**
 * Shown after an enquiry form opens WhatsApp. Nothing is sent from the website itself:
 * the enquiry only reaches the mill once the buyer presses Send in WhatsApp, so the wording says exactly that.
 */
export const QuoteSuccessModal: React.FC<QuoteSuccessModalProps> = ({ isOpen, onClose, quoteType, whatsappUrl }) => (
  <Dialog open={isOpen} onClose={onClose} label={quoteType === 'Contact' ? 'Message ready' : `${quoteType} enquiry ready`}>
    <div className="overflow-y-auto px-6 pb-8 pt-12 text-center sm:px-10">
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-whatsapp/15 animate-pop-in">
        <CheckCircle2 className="h-11 w-11 text-whatsapp-ink" />
      </div>
      <h2 className="mt-5 font-display text-3xl text-forest-800">Your enquiry is ready on WhatsApp</h2>
      <p className="mx-auto mt-3 max-w-md text-lg leading-relaxed text-ink-soft">
        WhatsApp has opened with your details filled in. <strong>Press Send there</strong> and our trade desk will reply on WhatsApp with
        current mill rates.
      </p>
      <p className="mt-3 text-sm text-muted">
        WhatsApp didn&apos;t open? Use the button below, or call {BRAND_CONFIG.contact.primaryPhone}.
      </p>
      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
        <Button variant="whatsapp" icon={<MessageCircle className="h-5 w-5" />} onClick={() => openWhatsApp(whatsappUrl)}>
          Open WhatsApp again
        </Button>
        <Button href={phoneTelHref()} variant="outline" icon={<Phone className="h-5 w-5" />}>
          Call the mill
        </Button>
        <Button onClick={onClose}>Done</Button>
      </div>
      <p className="mt-6 text-sm text-muted">{BRAND_CONFIG.contact.operatingHours}</p>
    </div>
  </Dialog>
);
