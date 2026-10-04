export const BRAND_CONFIG = {
  brandName: 'LG GOLD',
  tagline: 'Quality Rice for India & Global Markets',
  supportingTagline: 'Carefully selected and processed rice for everyday meals, retail, wholesale, bulk and export markets.',
  parentCompany: 'Sri Lakshmi Ganapathi Trading Company',
  
  // Location & Contact
  location: {
    address: 'VG3P+G6, Venkatadri Palem',
    city: 'Venkatadri Palem',
    state: 'Telangana',
    country: 'India',
    plusCode: 'VG3P+G6, Venkatadri Palem, Telangana',
    googleMapsEmbedQuery: 'Venkatadri+Palem+Telangana+India',
    googleMapsUrl: 'https://maps.google.com/?q=VG3P%2BG6,+Venkatadri+Palem,+Telangana,+India',
  },
  
  contact: {
    primaryPhone: '+91 97015 35231',
    secondaryPhone: '+91 97015 35231',
    whatsappNumber: '+919701535231',
    displayWhatsapp: '+91 97015 35231',
    emailRetail: 'care@lggoldrice.com',
    emailWholesale: 'wholesale@lggoldrice.com',
    emailExport: 'exports@lggoldrice.com',
    operatingHours: 'Mon - Sat: 8:00 AM – 7:30 PM IST',
  },

  announcement: {
    text: 'EXPORT QUALITY | EXPORT ORDERS ACCEPTED | WHOLESALE & BULK ORDERS',
    ctaLabel: 'Request Quote',
    targetRoute: 'export',
  },

  commercialBadges: [
    { title: 'Export Quality', desc: '100% Sortex Silky Finish' },
    { title: 'Export Orders Accepted', desc: 'Worldwide Container Loads' },
    { title: 'Wholesale Supply', desc: 'Consistent B2B Mill Pricing' },
    { title: 'Bulk Orders', desc: '50kg Bags to Metric Tons' },
  ],

  colors: {
    primaryGreen: '#174A32',
    premiumGold: '#C9A227',
    riceCream: '#F8F5EA',
    white: '#FFFFFF',
    charcoal: '#202522',
    mutedGreen: '#5F806D',
    softGold: '#E7D59A',
  }
};

export const createWhatsAppUrl = (message: string): string => {
  const cleanNumber = BRAND_CONFIG.contact.whatsappNumber.replace(/[^0-9]/g, '');
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedMsg}`;
};

export const getProductWhatsAppMessage = (productName: string, packSize?: string): string => {
  if (packSize) {
    return `Hi LG Gold Team, I am interested in purchasing ${productName} (${packSize}). Please share current pricing, stock availability, and delivery options.`;
  }
  return `Hi LG Gold Team, I am interested in LG Gold ${productName}. Please share product details, pack sizes, and pricing.`;
};

export const getWholesaleWhatsAppMessage = (variety: string = 'HMT / JSR'): string => {
  return `Hi LG Gold, I would like to inquire about WHOLESALE & BULK supply for ${variety} Rice. Please share minimum order quantities, trade rates, and dispatch timelines.`;
};

export const getExportWhatsAppMessage = (variety: string = 'HMT / JSR'): string => {
  return `Hello LG Gold International Trade Desk, I am requesting an EXPORT QUOTE for ${variety} Rice. Please share CIF/FOB terms, container capacity, and specifications.`;
};
