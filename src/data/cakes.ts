import { CakeItem, CategoryInfo } from '@/types';

export const CATEGORIES: CategoryInfo[] = [];

export const CAKES_DATA: CakeItem[] = [
  {
    id: 'aurora-wedding-tier',
    name: 'The Golden Aurora Tier',
    subtitle: '3-Tiered Wedding Masterpiece',
    category: 'wedding',
    priceStartingFrom: 18500,
    description: 'An architectural 3-tiered wedding cake draped in soft ivory Swiss meringue buttercream, embellished with hand-painted 24K gold foil details and delicate white sugar gardenias.',
    shortDescription: '3-Tiered ivory wedding cake adorned with 24k gold leafing and sugar florals.',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=1200&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1562440499-64c9a111f713?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=1000&q=80'
    ],
    servings: '60 - 80 Guests (3 Tiers / 5 kg)',
    weightOptions: [
      { weightKg: 3, label: '3 kg (40-50 Guests)', price: 18500 },
      { weightKg: 5, label: '5 kg (60-80 Guests)', price: 28000 },
      { weightKg: 8, label: '8 kg (100-120 Guests)', price: 42000 },
    ],
    flavors: ['Madagascar Vanilla Bean & Raspberry Coulis', 'Belgian Dark Chocolate Ganache'],
    eggless: true,
    bestseller: true,
    newArrival: false,
    featured: true,
    tags: ['Wedding', '24K Gold', 'Multi-Tier', 'Luxury', 'Eggless'],
    customizable: true,
    prepTimeHours: 48,
    availabilityStatus: '48 Hours Advance'
  },
  {
    id: 'velvet-noir-truffle',
    name: 'Velvet Noir Truffle',
    subtitle: '70% Valrhona Dark Chocolate Cake',
    category: 'signature',
    priceStartingFrom: 4800,
    description: 'Rich dark chocolate cake layers soaked in espresso syrup, filled with silky Valrhona chocolate mousse, and crowned with fresh organic blackberries and edible gold dust.',
    shortDescription: 'Decadent 70% dark chocolate sponge with espresso infusion and berry garnishes.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=1000&q=80'
    ],
    servings: '12 - 16 Guests (1.5 kg)',
    weightOptions: [
      { weightKg: 1, label: '1 kg (8-10 Guests)', price: 3400 },
      { weightKg: 1.5, label: '1.5 kg (12-16 Guests)', price: 4800 },
      { weightKg: 2, label: '2 kg (18-22 Guests)', price: 6200 },
    ],
    flavors: ['70% Dark Chocolate Mousse', 'Espresso Salted Caramel'],
    eggless: true,
    bestseller: true,
    newArrival: false,
    featured: true,
    tags: ['Signature', 'Dark Chocolate', 'Gourmet', 'Eggless'],
    customizable: true,
    prepTimeHours: 24,
    availabilityStatus: '24 Hours Advance'
  },
  {
    id: 'rose-champagne-bliss',
    name: 'Rosé Champagne & Pistachio',
    subtitle: 'Contemporary Birthday Elegance',
    category: 'birthday',
    priceStartingFrom: 5200,
    description: 'Moist rosé champagne infused sponge, paired with Iranian pistachio praline paste and layered with velvety white chocolate whipped cream.',
    shortDescription: 'Rosé champagne infused sponge with roasted pistachio praline and rose petals.',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1200&q=80',
    servings: '10 - 14 Guests (1.5 kg)',
    weightOptions: [
      { weightKg: 1, label: '1 kg (8-10 Guests)', price: 3600 },
      { weightKg: 1.5, label: '1.5 kg (10-14 Guests)', price: 5200 },
      { weightKg: 2, label: '2 kg (15-20 Guests)', price: 6800 },
    ],
    flavors: ['Rosé Champagne', 'Pistachio Praline', 'White Chocolate'],
    eggless: false,
    bestseller: false,
    newArrival: true,
    featured: true,
    tags: ['Birthday', 'Celebration', 'Champagne', 'Pistachio'],
    customizable: true,
    prepTimeHours: 24,
    availabilityStatus: '24 Hours Advance'
  },
  {
    id: 'minimalist-concrete-flora',
    name: 'Minimalist Stone & Flora',
    subtitle: 'Artisanal Concrete Texture Finish',
    category: 'artisanal',
    priceStartingFrom: 5500,
    description: 'A striking modern cake featuring textured concrete-style charcoal and cream buttercream palette, complemented with dried white pampas grass and eucalyptus.',
    shortDescription: 'Modern sculptural cake with concrete buttercream texture and dried botanicals.',
    image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=1200&q=80',
    servings: '15 - 20 Guests (2 kg)',
    weightOptions: [
      { weightKg: 1.5, label: '1.5 kg (10-14 Guests)', price: 4200 },
      { weightKg: 2, label: '2 kg (15-20 Guests)', price: 5500 },
      { weightKg: 3, label: '3 kg (25-30 Guests)', price: 7900 },
    ],
    flavors: ['Earl Grey & Lavender', 'Lemon Curd & Vanilla Bean'],
    eggless: true,
    bestseller: false,
    newArrival: true,
    featured: true,
    tags: ['Artisanal', 'Minimalist', 'Botanical', 'Eggless'],
    customizable: true,
    prepTimeHours: 24,
    availabilityStatus: '24 Hours Advance'
  },
  {
    id: 'berry-chiffon-velour',
    name: 'Wild Berry Chiffon Velour',
    subtitle: 'Fresh Berry Harvest',
    category: 'signature',
    priceStartingFrom: 4200,
    description: 'Feather-light vanilla bean chiffon layered with house-made wild berry compote, mascarpone cream, and topped with fresh strawberries, raspberries, and edible violets.',
    shortDescription: 'Light vanilla chiffon cake filled with wild berry compote and mascarpone.',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=1200&q=80',
    servings: '10 - 12 Guests (1.2 kg)',
    weightOptions: [
      { weightKg: 1, label: '1 kg (8-10 Guests)', price: 3400 },
      { weightKg: 1.5, label: '1.5 kg (12-15 Guests)', price: 4800 },
    ],
    flavors: ['Mascarpone Berry', 'Vanilla Bean Chiffon'],
    eggless: true,
    bestseller: true,
    newArrival: false,
    featured: false,
    tags: ['Fresh Fruit', 'Berry', 'Light', 'Eggless'],
    customizable: true,
    prepTimeHours: 12,
    availabilityStatus: 'Available Today'
  },
  {
    id: 'vegan-salted-caramel-pecan',
    name: 'Vegan Salted Caramel & Pecan',
    subtitle: '100% Organic Plant-Based Luxury',
    category: 'vegan',
    priceStartingFrom: 4600,
    description: 'Gluten-free almond and oat flour sponge drizzled with artisanal coconut milk salted caramel and sprinkled with toasted pecans and sea salt flakes.',
    shortDescription: 'Gluten-free almond cake with homemade coconut salted caramel and pecans.',
    image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=1200&q=80',
    servings: '12 - 15 Guests (1.5 kg)',
    weightOptions: [
      { weightKg: 1, label: '1 kg (8-10 Guests)', price: 3200 },
      { weightKg: 1.5, label: '1.5 kg (12-15 Guests)', price: 4600 },
      { weightKg: 2, label: '2 kg (16-20 Guests)', price: 5900 },
    ],
    flavors: ['Coconut Salted Caramel', 'Toasted Pecan Almond Sponge'],
    eggless: true,
    bestseller: false,
    newArrival: true,
    featured: true,
    tags: ['Vegan', 'Gluten-Free', 'Plant-Based', 'Organic', 'Eggless'],
    customizable: true,
    prepTimeHours: 24,
    availabilityStatus: '24 Hours Advance'
  },
  {
    id: 'pearl-monogram-crown',
    name: 'The Pearl Monogram Crown',
    subtitle: 'Custom Luxury Celebration Cake',
    category: 'birthday',
    priceStartingFrom: 6500,
    description: 'Draped in lustrous pearlized buttercream with delicate hand-piped pearl borders, customized acrylic gold lettering plaque, and gold sugar pearls.',
    shortDescription: 'Lustrous pearlized celebration cake with custom monogram acrylic plaque.',
    image: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=1200&q=80',
    servings: '15 - 18 Guests (2 kg)',
    weightOptions: [
      { weightKg: 1.5, label: '1.5 kg (10-14 Guests)', price: 5000 },
      { weightKg: 2, label: '2 kg (15-18 Guests)', price: 6500 },
      { weightKg: 3, label: '3 kg (22-28 Guests)', price: 9200 },
    ],
    flavors: ['Hazelnut Praline', 'Dark Chocolate Ganache'],
    eggless: true,
    bestseller: false,
    newArrival: false,
    featured: false,
    tags: ['Monogram', 'Pearl', 'Birthday', 'Custom', 'Eggless'],
    customizable: true,
    prepTimeHours: 24,
    availabilityStatus: '24 Hours Advance'
  },
  {
    id: 'botanical-botanica-wedding',
    name: 'Botanica 2-Tier Garden Wedding',
    subtitle: 'Semi-Naked Floral Elegance',
    category: 'wedding',
    priceStartingFrom: 13500,
    description: 'A romantic semi-naked two-tiered cake showcasing delicate sponge texture, infused with elderflower cordial, whipped vanilla buttercream, and fresh organic garden roses.',
    shortDescription: '2-Tier semi-naked cake infused with elderflower and organic fresh roses.',
    image: 'https://images.unsplash.com/photo-1562440499-64c9a111f713?auto=format&fit=crop&w=1200&q=80',
    servings: '35 - 45 Guests (2 Tiers / 3.5 kg)',
    weightOptions: [
      { weightKg: 3, label: '3 kg (30-40 Guests)', price: 13500 },
      { weightKg: 5, label: '5 kg (50-70 Guests)', price: 21000 },
    ],
    flavors: ['Elderflower & Lemon', 'Vanilla Bean & Passionfruit'],
    eggless: true,
    bestseller: true,
    newArrival: false,
    featured: false,
    tags: ['Wedding', 'Semi-Naked', 'Floral', 'Fresh Roses', 'Eggless'],
    customizable: true,
    prepTimeHours: 48,
    availabilityStatus: '48 Hours Advance'
  }
];

export function getCakeById(id: string): CakeItem | undefined {
  return CAKES_DATA.find((cake) => cake.id === id);
}

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
