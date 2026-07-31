export interface CakeItem {
  id: string;
  name: string;
  subtitle?: string;
  category: 'wedding' | 'signature' | 'birthday' | 'artisanal' | 'vegan';
  priceStartingFrom: number;
  description: string;
  shortDescription: string;
  image: string;
  additionalImages?: string[];
  servings: string;
  weightOptions: { weightKg: number; label: string; price: number }[];
  flavors: string[];
  eggless: boolean;
  bestseller?: boolean;
  newArrival?: boolean;
  featured?: boolean;
  tags?: string[];
  customizable: boolean;
  prepTimeHours?: number;
  availabilityStatus?: 'Available Today' | '24 Hours Advance' | '48 Hours Advance' | '3 Days Advance';
}

export interface CustomizationSelection {
  occasion: string;
  tiers: number;
  shape: 'round' | 'square' | 'heart' | 'hexagonal';
  servings: number;
  spongeFlavor: string;
  fillingFlavor: string;
  frostingStyle: string;
  colorPalette: string;
  toppings: string[];
  customMessage?: string;
  deliveryDate?: string;
  notes?: string;
  referenceImageUrl?: string;
}

export interface OrderFormDetails {
  customerName: string;
  phoneNumber: string;
  deliveryAddress: string;
  deliveryDate: string;
  deliveryTime: string;
  cakeName: string;
  cakeCategory: string;
  selectedWeight: string;
  selectedPrice: number;
  selectedFlavor: string;
  selectedShape: string;
  selectedCreamType: string;
  selectedThemeColor: string;
  cakeMessage: string;
  referenceFileName?: string;
  specialNotes: string;
  eggless: boolean;
}

export interface CategoryInfo {
  id: string;
  name: string;
  tagline: string;
  description: string;
  heroImage: string;
  badge?: string;
}
