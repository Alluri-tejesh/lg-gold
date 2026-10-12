// Contact details match the main LG Gold site (src/config/brandConfig.ts). Keep one phone number only.
export const BRAND = {
  company: 'Sri Lakshmi Ganapathi Trading Company',
  product: 'JSR Lachkari Kolam Rice',
  phoneDisplay: '+91 97015 35231',
  phoneDigits: '919701535231',
  emailWholesale: 'wholesale@lggoldrice.com',
  address: 'Shed No. E-18, IDA, V.T. Palem, Miryalaguda, Nalgonda Dist., Telangana',
  hours: 'Mon to Sat, 8:00 AM to 7:30 PM IST',
  mainSite: 'https://alluri-tejesh.github.io/lg-gold/',
};

export const whatsappUrl = (message: string) =>
  `https://wa.me/${BRAND.phoneDigits}?text=${encodeURIComponent(message)}`;
