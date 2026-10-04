import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { BRAND_CONFIG, createWhatsAppUrl } from '../../config/brandConfig';

export const WhatsAppFloatingButton: React.FC = () => {
  const [isOpenTooltip, setIsOpenTooltip] = useState(false);

  const handleQuickChat = () => {
    const url = createWhatsAppUrl('Hi LG Gold Team, I would like to inquire about your rice varieties, wholesale rates, or export pricing.');
    window.open(url, '_blank');
  };

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end group">
      {/* Floating Tooltip Message */}
      {isOpenTooltip && (
        <div className="mb-3 max-w-xs bg-white p-3.5 rounded-xs shadow-clean border-t-4 border-[#C9A227] border-x border-b border-[#C9A227]/20 animate-fadeIn text-xs relative">
          <button
            onClick={() => setIsOpenTooltip(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <p className="font-serif-brand font-bold text-sm text-[#174A32] mb-1">LG Gold Mill Support Desk</p>
          <p className="text-[#5F806D] mb-2 leading-relaxed">Have a question about HMT/JSR rice, wholesale orders, or container export?</p>
          <button
            onClick={handleQuickChat}
            className="w-full py-1.5 bg-[#25D366] text-white font-bold uppercase tracking-wider text-[11px] rounded-xs hover:bg-[#1ebd5a] transition-colors cursor-pointer shadow-xs"
          >
            Start WhatsApp Chat
          </button>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={handleQuickChat}
        onMouseEnter={() => setIsOpenTooltip(true)}
        aria-label="Chat on WhatsApp"
        className="w-14 h-14 bg-[#25D366] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-108 active:scale-95 transition-all duration-300 border-2 border-white cursor-pointer relative"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#C9A227] rounded-full border-2 border-white animate-ping" />
        <MessageCircle className="w-7 h-7 fill-white" />
      </button>
    </div>
  );
};
