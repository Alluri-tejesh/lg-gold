/**
 * Business details used across the site. Change them here and every page, form and WhatsApp message follows.
 */
export const BRAND_CONFIG = {
  brandName: 'LG GOLD',
  parentCompany: 'Sri Lakshmi Ganapathi Trading Company',

  location: {
    address: 'VG3P+G6, Venkatadri Palem',
    city: 'Venkatadri Palem',
    state: 'Telangana',
    country: 'India',
    plusCode: 'VG3P+G6, Venkatadri Palem, Telangana',
    googleMapsUrl: 'https://maps.google.com/?q=VG3P%2BG6,+Venkatadri+Palem,+Telangana,+India',
  },

  contact: {
    primaryPhone: '+91 97015 35231',
    // Email addresses are shown on the site only when filled in. Leave them empty until the mailbox really
    // works (e.g. 'care@lggoldrice.com' once the domain and its email are set up), so no message gets lost.
    emailRetail: '',
    emailWholesale: '',
    emailExport: '',
    operatingHours: 'Mon – Sat: 8:00 AM – 8:00 PM IST',
  },

  /**
   * FSSAI food licence. The website shows "FSSAI Certified" everywhere it builds trust.
   * Fill in the 14-digit licence number: FSSAI rules require it to be displayed by food businesses selling online.
   */
  fssai: {
    licenseNumber: '',
  },

  /** Doorstep delivery is free once the rice in the order reaches `freeFromOrderValue`. Below that, `charge` is added. */
  delivery: {
    freeFromOrderValue: 2500,
    charge: 50,
  },

  /**
   * How customers can pay at checkout. A method only appears once it is set up here.
   *
   *   upiId           The business UPI ID (for example "lggold@okhdfcbank"). Turns on UPI: on phones it opens
   *                   GPay / PhonePe / Paytm with the amount filled in; on computers it shows a QR code to scan.
   *                   Direct transfers have no payment-status callback. The mill verifies receipt on WhatsApp.
   *   upiPayeeName    The name customers see in their UPI app.
   *   razorpayKeyId   Public "Key Id" from a Razorpay account (Dashboard → Settings → API keys), e.g. "rzp_live_…".
   *                   Turns on cards, net banking and wallets. The payment id goes into the WhatsApp order;
   *                   check it in the Razorpay dashboard before dispatch. Never put the Key Secret here.
   *   cashOnDelivery  Offer "pay when the rice arrives".
   */
  payments: {
    // VITE_UPI_ID / VITE_RAZORPAY_KEY_ID can also be set at build time (for example to try the payment screens).
    upiId: (import.meta.env.VITE_UPI_ID as string | undefined) || '9542505456-2@ybl',
    upiPayeeName: 'LG Gold Rice',
    razorpayKeyId: (import.meta.env.VITE_RAZORPAY_KEY_ID as string | undefined) || '',
    cashOnDelivery: true,
  },

};

/** A tap-to-call link for the main number, without spaces so every phone dials it correctly. */
export const phoneTelHref = (): string => `tel:${BRAND_CONFIG.contact.primaryPhone.replace(/\s/g, '')}`;

/** "FSSAI Certified", plus the licence number once it is filled in above. */
export const fssaiLabel = (): string =>
  BRAND_CONFIG.fssai.licenseNumber ? `FSSAI Lic. No. ${BRAND_CONFIG.fssai.licenseNumber}` : 'FSSAI Certified';

/** Phones and tablets open the WhatsApp app directly; computers are better served by WhatsApp Web. */
const onPhone = (): boolean =>
  typeof navigator !== 'undefined' &&
  (/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent)));

/**
 * A link that opens a WhatsApp chat with the mill (or with `to`, e.g. a customer), with `message` already typed.
 * Phones: wa.me, which opens the app straight away.
 * Computers: WhatsApp Web, which skips WhatsApp's "Open WhatsApp?" landing page.
 */
export const createWhatsAppUrl = (message: string, to: string = BRAND_CONFIG.contact.primaryPhone): string => {
  // Indian numbers: 10 digits get the 91 country code in front.
  const digits = to.replace(/[^0-9]/g, '');
  const phone = digits.length === 10 ? `91${digits}` : digits;
  const text = encodeURIComponent(message);
  return onPhone() ? `https://wa.me/${phone}?text=${text}` : `https://web.whatsapp.com/send?phone=${phone}&text=${text}`;
};

/**
 * A tidy WhatsApp enquiry: a greeting line, then one "Label: value" line per filled-in field, then a closing line.
 * Plain text on purpose: WhatsApp's *bold* and ---- markers show up as raw symbols in the message box.
 * Empty fields are left out so the message stays short.
 */
export const createEnquiryWhatsAppUrl = (heading: string, fields: [label: string, value: string][], closing: string): string => {
  const lines = fields.filter(([, value]) => value.trim()).map(([label, value]) => `${label}: ${value.trim()}`);
  return createWhatsAppUrl(`Hello LG Gold, ${heading}\n\n${lines.join('\n')}\n\n${closing}`);
};

/** Opens WhatsApp in a new tab. Call it straight from a click or submit so the browser does not block it as a pop-up. */
export const openWhatsApp = (url: string): void => {
  window.open(url, '_blank', 'noopener,noreferrer');
};

export const getProductWhatsAppMessage = (productName: string, packSize?: string): string =>
  packSize
    ? `Hello LG Gold, I have a question before ordering ${productName}, ${packSize}. Please share stock and delivery details.`
    : `Hello LG Gold, I am interested in ${productName}. Please share pack sizes and prices.`;
