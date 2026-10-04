export type PackSize = '26kg Bag' | '26kg x 5 Bags (130kg)' | '26kg x 10 Bags (260kg)' | '26 MT (1000 Bags)';

export interface PackOption {
  size: PackSize;
  weightKg: number;
  retailPrice: number; // in INR
  mrp: number; // in INR
  wholesalePrice?: number;
  inStock: boolean;
  isPopular?: boolean;
  packagingType: 'Heavy Duty PP Bag' | 'Non-Woven Handle Bag' | 'Laminated Jute Bag' | 'Container Export Pallet';
}

export interface GrainSpecs {
  variety: string;
  grainLength: string;
  aging: string;
  moistureContent: string;
  brokenGrainPercentage: string;
  color: string;
  polish: string;
  sortexCleaned: boolean;
}

export interface CookingGuide {
  waterRatio: string;
  soakingTime: string;
  cookingTime: string;
  idealDishes: string[];
  tips: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  subTitle: string;
  description: string;
  longDescription: string;
  featured: boolean;
  images: {
    primary: string;
    packaging: string;
    rawGrain: string;
    cookedDish: string;
    gallery: string[];
  };
  packOptions: PackOption[];
  grainSpecs: GrainSpecs;
  cookingGuide: CookingGuide;
  nutritionalInfo: {
    calories: string;
    carbohydrates: string;
    protein: string;
    fat: string;
    fiber: string;
    iron: string;
  };
  availability: {
    retail: boolean;
    wholesale: boolean;
    export: boolean;
  };
  tags: string[];
  rating: number;
  reviewCount: number;
}

export interface RecipeIngredient {
  item: string;
  amount: string;
  isLGGoldRice?: boolean;
}

export interface RecipeStep {
  stepNumber: number;
  instruction: string;
  tip?: string;
}

export interface Recipe {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  totalTimeMinutes: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  categories: string[];
  recommendedProductId: string;
  recommendedPackSize: PackSize;
  ingredients: RecipeIngredient[];
  instructions: RecipeStep[];
  cuisine: string;
  nutritionPerServing?: string;
  chefTips?: string[];
  featured?: boolean;
}

export interface CartItem {
  id: string; // unique combo of product.id + packSize
  productId: string;
  productSlug: string;
  productName: string;
  image: string;
  packSize: PackSize;
  price: number;
  mrp: number;
  quantity: number;
}

export interface ExportEnquiryForm {
  companyName: string;
  contactPerson: string;
  country: string;
  email: string;
  phoneWhatsapp: string;
  riceVariety: string;
  requiredQuantity: string;
  packagingRequirement: string;
  destinationPort: string;
  message: string;
}

export interface WholesaleEnquiryForm {
  businessName: string;
  contactPerson: string;
  businessType: 'Retailer' | 'Supermarket' | 'Distributor' | 'Hotel / Restaurant' | 'Catering' | 'Institutional Buyer' | 'Other';
  cityState: string;
  phoneWhatsapp: string;
  email: string;
  riceVariety: string;
  monthlyRequirement: string;
  message: string;
}

export interface Review {
  id: string;
  author: string;
  role: string;
  location: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  productTarget?: string;
}

export type PageRoute = 
  | 'home'
  | 'products'
  | 'product-detail'
  | 'recipes'
  | 'recipe-detail'
  | 'quality'
  | 'wholesale'
  | 'bulk'
  | 'export'
  | 'about'
  | 'contact';
