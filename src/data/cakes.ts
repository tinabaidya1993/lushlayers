import { CakeItem, CategoryInfo } from '@/types';

export const CATEGORIES: CategoryInfo[] = [];

export const CAKES_DATA: CakeItem[] = [];

export function getCakeById(id: string): CakeItem | undefined {
  return CAKES_DATA.find((cake) => cake.id === id);
}

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

export const CUSTOMIZER_OPTIONS = {
  occasions: [
    'Wedding / Reception',
    'Grand Birthday Celebration',
    'Anniversary Milestone',
    'Baby Shower / Gender Reveal',
    'Corporate Luxury Event',
    'Intimate Dinner Party'
  ],
  tierOptions: [
    { tiers: 1, servings: '8 - 12 Guests', multiplier: 1 },
    { tiers: 1.5, servings: '15 - 20 Guests (Tall 1-Tier)', multiplier: 1.35 },
    { tiers: 2, servings: '30 - 45 Guests (2 Tiers)', multiplier: 2.2 },
    { tiers: 3, servings: '60 - 85 Guests (3 Tiers)', multiplier: 3.8 },
  ],
  shapes: [
    { id: 'round', name: 'Classic Round', icon: 'Circle' },
    { id: 'square', name: 'Modern Square', icon: 'Square' },
    { id: 'heart', name: 'Romantic Heart', icon: 'Heart' },
    { id: 'hexagonal', name: 'Sculptural Hexagon', icon: 'Hexagon' },
  ],
  spongeFlavors: [
    { name: 'Madagascar Bourbon Vanilla Bean', desc: 'Moist vanilla sponge infused with authentic bean specks' },
    { name: '70% Valrhona Dark Chocolate', desc: 'Deep cocoa sponge with intense rich finish' },
    { name: 'Rosé Champagne & Strawberry', desc: 'Subtle champagne sparkle paired with berry essence' },
    { name: 'Earl Grey Tea & Bergamot', desc: 'Fragrant bergamot infused black tea sponge' },
    { name: 'Pistachio Almond Blossom', desc: 'Nutty, soft sponge made with real ground Iranian pistachios' },
    { name: 'Organic Coconut & Lime Zest', desc: 'Light tropical sponge with fresh citrus note' }
  ],
  fillingFlavors: [
    { name: 'Velvet Belgian Dark Chocolate Ganache', desc: 'Rich, smooth 60% ganache' },
    { name: 'Wild Berry & Raspberry Coulis', desc: 'Tart berry reduction cooked in-house' },
    { name: 'Salted Caramel & Roasted Hazelnut', desc: 'Slow-cooked caramel with sea salt flakes' },
    { name: 'Passionfruit & Mango Curd', desc: 'Bright, zesty tropical fruit curd' },
    { name: 'White Chocolate Mousse', desc: 'Silky smooth whipped white chocolate' }
  ],
  frostingStyles: [
    { name: 'Silk Smooth Buttercream', desc: 'Flawless satin smooth exterior' },
    { name: 'Artisanal Textured Palette Knife', desc: 'Modern sculptural butter strokes' },
    { name: 'Rustic Semi-Naked', desc: 'Subtle peeking cake layers with minimalist finish' },
    { name: 'Lustrous Fondant Shell', desc: 'Ultra-sleek luxury fondant casing' }
  ],
  colorPalettes: [
    { name: 'Pure White & 24K Gold Foil', colorHex: '#FAF6F0' },
    { name: 'Blush Pink & Rose Gold Accents', colorHex: '#F4E0E6' },
    { name: 'Earthy Cream & Terracotta', colorHex: '#EAE1D3' },
    { name: 'Charcoal Noir & Metallic Gold', colorHex: '#242424' },
    { name: 'Sage Green & Ivory', colorHex: '#D8E2DC' },
    { name: 'Midnight Navy & Silver Leaf', colorHex: '#1D2A44' }
  ],
  toppings: [
    'Handcrafted 24K Gold Leafing',
    'Organic Fresh Garden Roses',
    'Edible Sugar Flower Blooms',
    'Artisanal French Macarons',
    'Fresh Berry Cascade (Blackberries & Raspberries)',
    'Custom Monogram Acrylic Plaque',
    'Dried Pampas & Floral Arrangement'
  ]
};
