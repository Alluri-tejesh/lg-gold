import { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'lg-gold-hmt-rice',
    slug: 'hmt-rice',
    name: 'LG Gold HMT Rice',
    shortName: 'HMT Rice',
    subTitle: 'Premium Aged Medium-Slender Grain with Silky Luster',
    description: 'LG Gold HMT Rice is celebrated across South India for its delicate slender grain, fluffy non-sticky texture after cooking, and appetizing natural aroma. Perfectly aged for over 12 months, it is the ideal choice for everyday family meals, festive biryanis, lemon rice, and bagara rice.',
    longDescription: 'Sourced from the fertile paddy plains of Telangana by Sri Lakshmi Ganapathi Trading Company, LG Gold HMT Rice undergoes rigorous multi-stage cleaning and 100% Sortex optical color sorting. Each grain retains its wholesome natural goodness, offering superior expansion during cooking without becoming mushy or clumped. Whether you are preparing a quick lemon rice on a weekday morning or an elaborate festive biryani for the family, LG Gold HMT guarantees consistent texture and authentic taste in every single grain.',
    featured: true,
    images: {
      primary: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1000&q=85',
      packaging: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      rawGrain: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=800&q=80',
      cookedDish: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80'
      ]
    },
    packOptions: [
      {
        size: '26kg Bag',
        weightKg: 26,
        retailPrice: 1650,
        mrp: 1850,
        inStock: true,
        isPopular: true,
        packagingType: 'Heavy Duty PP Bag'
      },
      {
        size: '26kg x 5 Bags (130kg)',
        weightKg: 130,
        retailPrice: 8000,
        mrp: 9250,
        inStock: true,
        isPopular: false,
        packagingType: 'Heavy Duty PP Bag'
      },
      {
        size: '26kg x 10 Bags (260kg)',
        weightKg: 260,
        retailPrice: 15500,
        mrp: 18500,
        inStock: true,
        isPopular: false,
        packagingType: 'Heavy Duty PP Bag'
      }
    ],
    grainSpecs: {
      variety: 'HMT (Hybrid Medium-Slender)',
      grainLength: '5.2 mm – 5.6 mm (Medium Slender)',
      aging: '12+ Months Naturally Aged',
      moistureContent: '< 13.0% (Export Compliant)',
      brokenGrainPercentage: '< 2.0% (Sortex Grade A)',
      color: 'Pearly White Translucent',
      polish: 'Silky Double Polished & Air Cleaned',
      sortexCleaned: true
    },
    cookingGuide: {
      waterRatio: '1 : 2 (1 cup rice to 2 cups fresh water)',
      soakingTime: '15 to 20 minutes before cooking',
      cookingTime: '12 to 14 minutes on medium flame',
      idealDishes: ['Daily Steamed Rice with Sambar/Rasam', 'Hyderabadi Dum Biryani', 'South Indian Lemon Rice', 'Vegetable Pulao', 'Curd Rice'],
      tips: 'For maximum grain elongation, soak for 20 minutes in clean water. Let rest covered for 5 minutes after cooking before gently fluffing with a fork.'
    },
    nutritionalInfo: {
      calories: '356 kcal / 100g',
      carbohydrates: '79.2 g',
      protein: '7.8 g',
      fat: '0.5 g',
      fiber: '1.4 g',
      iron: '1.2 mg'
    },
    availability: {
      retail: true,
      wholesale: true,
      export: true
    },
    tags: ['Aged Rice', 'Non-Sticky', 'Fluffy', 'Sortex Cleaned', 'Daily Table Rice', 'Export Quality'],
    rating: 4.9,
    reviewCount: 148
  },
  {
    id: 'lg-gold-jsr-rice',
    slug: 'jsr-rice',
    name: 'LG Gold JSR Rice',
    shortName: 'JSR Rice',
    subTitle: 'Super-Fine Slender Grain with Delicate Softness & Easy Digestibility',
    description: 'LG Gold JSR Rice is an elite, super-fine grain variety prized for its feather-light feel, rapid cooking, and exceptional softness on the palate. A beloved staple in traditional households and top-tier catering, JSR rice delivers immaculate white grains with effortless digestion.',
    longDescription: 'Known for its signature fine grain morphology and tender mouthfeel, LG Gold JSR Rice is processed under state-of-the-art temperature and humidity controls at Sri Lakshmi Ganapathi Trading Company in Telangana. Its fine grains absorb curries and broths beautifully while remaining completely non-clumpy and delightfully light on the stomach. JSR rice is highly favored for traditional festive feasts, daily comforting meals, rasam sadam, and delicate pulaos.',
    featured: true,
    images: {
      primary: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=1000&q=85',
      packaging: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=800&q=80',
      rawGrain: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      cookedDish: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80'
      ]
    },
    packOptions: [
      {
        size: '26kg Bag',
        weightKg: 26,
        retailPrice: 1820,
        mrp: 2050,
        inStock: true,
        isPopular: true,
        packagingType: 'Heavy Duty PP Bag'
      },
      {
        size: '26kg x 5 Bags (130kg)',
        weightKg: 130,
        retailPrice: 8850,
        mrp: 10250,
        inStock: true,
        isPopular: false,
        packagingType: 'Heavy Duty PP Bag'
      },
      {
        size: '26kg x 10 Bags (260kg)',
        weightKg: 260,
        retailPrice: 17200,
        mrp: 20500,
        inStock: true,
        isPopular: false,
        packagingType: 'Heavy Duty PP Bag'
      }
    ],
    grainSpecs: {
      variety: 'JSR (Jeera Sanna Rice / Premium Fine Grain)',
      grainLength: '4.8 mm – 5.2 mm (Super-Fine Slender)',
      aging: '12+ Months Controlled Aging',
      moistureContent: '< 12.8% (Export Compliant)',
      brokenGrainPercentage: '< 1.8% (Sortex Grade A+)',
      color: 'Brilliant Silky White',
      polish: 'Ultra-Fine Silky Polished',
      sortexCleaned: true
    },
    cookingGuide: {
      waterRatio: '1 : 2.25 (1 cup rice to 2.25 cups fresh water)',
      soakingTime: '15 minutes',
      cookingTime: '10 to 12 minutes',
      idealDishes: ['Traditional Andhra Meals', 'Ven Pongal', 'Bagara Rice', 'Comfort Curd Rice', 'Mild Fried Rice'],
      tips: 'JSR cooks quickly. Do not over-boil; allow gentle simmering with a tight lid for the softest, fluffiest grain texture.'
    },
    nutritionalInfo: {
      calories: '352 kcal / 100g',
      carbohydrates: '78.5 g',
      protein: '7.4 g',
      fat: '0.4 g',
      fiber: '1.2 g',
      iron: '1.4 mg'
    },
    availability: {
      retail: true,
      wholesale: true,
      export: true
    },
    tags: ['Fine Grain', 'Light & Digestible', 'Silky Polish', 'Premium Table Rice', 'Bulk Ready'],
    rating: 4.9,
    reviewCount: 119
  }
];

export const getProductBySlug = (slug: string): Product | undefined => {
  return PRODUCTS.find(p => p.slug === slug || p.id === slug);
};
