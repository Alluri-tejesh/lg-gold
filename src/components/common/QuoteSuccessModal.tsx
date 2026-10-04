import React from 'react';
import { CheckCircle, MessageCircle, X, ShieldCheck } from 'lucide-react';
import { BRAND_CONFIG, createWhatsAppUrl } from '../../config/brandConfig';

interface QuoteSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  quoteType: 'Export' | 'Wholesale' | 'Bulk';
  referenceId: string;
  data: any;
}

export const QuoteSuccessModal: React.FC<QuoteSuccessModalProps> = ({
  isOpen,
  onClose,
  quoteType,
  referenceId,
  data,
}) => {
  if (!isOpen) return null;

  const handleWhatsAppFollowUp = () => {
    let msg = `Hi LG Gold ${quoteType} Desk, I just submitted an RFQ #${referenceId} on your website.\n`;
    if (data?.companyName || data?.businessName) {
      msg += `Company: ${data.companyName || data.businessName}\n`;
    }
    if (data?.riceVariety) {
      msg += `Variety: ${data.riceVariety}\n`;
    }
    if (data?.requiredQuantity || data?.monthlyRequirement) {
      msg += `Quantity: ${data.requiredQuantity || data.monthlyRequirement}\n`;
    }
    msg += `Please expedite our trade quotation. Thank you!`;

    window.open(createWhatsAppUrl(msg), '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#FFFFFF] w-full max-w-lg rounded-sm shadow-clean border-t-4 border-[#C9A227] border-x border-b border-[#C9A227]/20 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-[#174A32] text-white flex items-center justify-between border-b border-[#C9A227]">
          <div className="flex items-center gap-2.5">
            <span className="font-serif-brand font-light text-lg text-[#C9A227]">{quoteType} Quote Request</span>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-xs hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-[#174A32]/10 rounded-full flex items-center justify-center mx-auto text-[#174A32]">
            <CheckCircle className="w-10 h-10 text-[#174A32]" />
          </div>

          <div>
            <h3 className="font-serif-brand font-light text-2xl text-[#174A32]">
              Inquiry Received
            </h3>
            <p className="text-xs text-[#5F806D] mt-1">
              Reference ID: <strong className="text-[#C9A227]">#{referenceId}</strong>
            </p>
          </div>

          <p className="text-xs sm:text-sm text-[#202522] leading-relaxed">
            Our trade desk at Sri Lakshmi Ganapathi Trading Company in Telangana has received your inquiry. A commercial specialist will review your specifications and contact you with current mill pricing within <strong>2 to 4 business hours</strong>.
          </p>

          <div className="p-3 bg-[#F8F5EA] rounded-xs border border-[#C9A227]/30 text-left text-xs text-[#202522] space-y-1">
            <div><span className="font-bold text-[#174A32]">Mill Desk:</span> Venkatadri Palem, Telangana</div>
            <div><span className="font-bold text-[#174A32]">Support Hotline:</span> {BRAND_CONFIG.contact.primaryPhone}</div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleWhatsAppFollowUp}
              className="px-5 py-2.5 bg-[#25D366] text-white text-xs font-bold uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 hover:bg-[#1ebd5a] transition-colors cursor-pointer shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Connect on WhatsApp</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-[#174A32] text-white text-xs font-bold uppercase tracking-wider rounded-xs hover:bg-[#1a5a3d] transition-colors cursor-pointer border border-[#174A32]"
            >
              Done
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#5F806D] pt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Sri Lakshmi Ganapathi Trading Company Commercial Desk</span>
          </div>
        </div>

      </div>
    </div>
  );
};
