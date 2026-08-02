import { CakeItem, CategoryInfo } from '@/types';

export const CATEGORIES: CategoryInfo[] = [];

export const CAKES_DATA: CakeItem[] = [];

export const CAKE_FLAVORS = [
  'Belgian Dark Chocolate Truffle',
  'Classic Vanilla Bean & Berry',
  'Red Velvet Cream Cheese',
  'Biscoff Caramel Crunch',
  'Ferrero Rocher Hazelnut',
  'Mango Passion Fruit',
  'Pistachio Rose & Cardamom',
  'Black Forest Classic',
];

export const CAKE_SIZES = [
  { label: '0.5 kg (Serves 4-6)', weightKg: 0.5, priceMultiplier: 0.6 },
  { label: '1.0 kg (Serves 8-10)', weightKg: 1.0, priceMultiplier: 1.0 },
  { label: '1.5 kg (Serves 12-15)', weightKg: 1.5, priceMultiplier: 1.4 },
  { label: '2.0 kg (Serves 18-20)', weightKg: 2.0, priceMultiplier: 1.8 },
  { label: '3.0 kg (Serves 25-30)', weightKg: 3.0, priceMultiplier: 2.6 },
];
