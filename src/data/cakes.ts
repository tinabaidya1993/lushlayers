import { CakeItem, CategoryInfo } from '@/types';

export const CATEGORIES: CategoryInfo[] = [
  // 🎂 Celebration Cakes Group
  {
    id: 'birthday-cakes',
    name: 'Birthday Cakes',
    parentGroup: 'Celebration Cakes',
    tagline: 'Make Birthdays Magical & Unforgettable',
    description: 'Customized luxury birthday cakes baked fresh with premium ingredients.',
    heroImage: 'https://images.pexels.com/photos/1702373/pexels-photo-1702373.jpeg?auto=compress&cs=tinysrgb&w=1200',
    badge: 'Popular',
    orderIndex: 1,
  },
  {
    id: 'anniversary-cakes',
    name: 'Anniversary Cakes',
    parentGroup: 'Celebration Cakes',
    tagline: 'Celebrate Milestones of Love & Togetherness',
    description: 'Romantic tiered and heart-shaped anniversary cakes for your special day.',
    heroImage: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=1200',
    badge: 'Romantic',
    orderIndex: 2,
  },
  {
    id: 'wedding-cakes',
    name: 'Wedding Cakes',
    parentGroup: 'Celebration Cakes',
    tagline: 'Bespoke Multi-Tiered Wedding Masterpieces',
    description: 'Couture architectural wedding cakes decorated with 24k gold leaf and handcrafted sugar flowers.',
    heroImage: 'https://images.pexels.com/photos/1775035/pexels-photo-1775035.jpeg?auto=compress&cs=tinysrgb&w=1200',
    badge: 'Luxury',
    orderIndex: 3,
  },
  {
    id: 'baby-shower-cakes',
    name: 'Baby Shower Cakes',
    parentGroup: 'Celebration Cakes',
    tagline: 'Welcome Little Blessings With Sweet Joy',
    description: 'Adorable pastel-themed baby shower and gender reveal cakes.',
    heroImage: 'https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg?auto=compress&cs=tinysrgb&w=1200',
    badge: 'Cute',
    orderIndex: 4,
  },
  {
    id: 'annaprashan-cakes',
    name: 'Rice Feeding Ceremony (Annaprashan) Cakes',
    parentGroup: 'Celebration Cakes',
    tagline: 'Traditional Rice Feeding Celebration',
    description: 'Custom traditional Annaprashan designs with gold motifs and auspicious themes.',
    heroImage: 'https://images.pexels.com/photos/1407305/pexels-photo-1407305.jpeg?auto=compress&cs=tinysrgb&w=1200',
    badge: 'Traditional',
    orderIndex: 5,
  },
  {
    id: 'engagement-cakes',
    name: 'Ring Ceremony / Engagement Cakes',
    parentGroup: 'Celebration Cakes',
    tagline: 'A Sweet Beginning to Forever',
    description: 'Elegant ring box and couple engagement cakes.',
    heroImage: 'https://images.pexels.com/photos/1702373/pexels-photo-1702373.jpeg?auto=compress&cs=tinysrgb&w=1200',
    badge: 'Elegant',
    orderIndex: 6,
  },
  {
    id: 'bhai-dooj-cakes',
    name: 'Bhai Dooj Celebration Cakes',
    parentGroup: 'Celebration Cakes',
    tagline: 'Celebrate Sibling Bonds With Love',
    description: 'Festive Bhai Dooj special cakes with traditional accents.',
    heroImage: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=1200',
    badge: 'Festive',
    orderIndex: 7,
  },
  {
    id: 'valentines-cakes',
    name: "Valentine's Day & Couple Celebration Cakes",
    parentGroup: 'Celebration Cakes',
    tagline: 'Express Heartfelt Romance With Fine Baking',
    description: 'Red velvet, chocolate truffle & heart-shaped romance cakes.',
    heroImage: 'https://images.pexels.com/photos/1775035/pexels-photo-1775035.jpeg?auto=compress&cs=tinysrgb&w=1200',
    badge: 'Romance',
    orderIndex: 8,
  },
  {
    id: 'rakhi-cakes',
    name: 'Rakhi Special Cakes',
    parentGroup: 'Celebration Cakes',
    tagline: 'Sweeten the Thread of Sisterly & Brotherly Love',
    description: 'Custom Raksha Bandhan special designer cakes.',
    heroImage: 'https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg?auto=compress&cs=tinysrgb&w=1200',
    badge: 'Festive',
    orderIndex: 9,
  },

  // 🎉 Special Occasion Cakes Group
  {
    id: 'anyday-cakes',
    name: 'Any Day Celebration Cakes',
    parentGroup: 'Special Occasion Cakes',
    tagline: 'Independence, Mothers, Fathers, Childrens & Friendship Day',
    description: "Special themed cakes for Independence Day, Children's Day, Father's Day, Mother's Day & Friendship Day.",
    heroImage: 'https://images.pexels.com/photos/1407305/pexels-photo-1407305.jpeg?auto=compress&cs=tinysrgb&w=1200',
    badge: 'Special',
    orderIndex: 10,
  },
  {
    id: 'farewell-cakes',
    name: 'Farewell & Success Party Cakes',
    parentGroup: 'Special Occasion Cakes',
    tagline: 'Cheers to New Beginnings & Achievements',
    description: 'Corporate success, promotion, and warm farewell party cakes.',
    heroImage: 'https://images.pexels.com/photos/1702373/pexels-photo-1702373.jpeg?auto=compress&cs=tinysrgb&w=1200',
    badge: 'Success',
    orderIndex: 11,
  },

  // 🍰 Signature Collection Group
  {
    id: 'bento-cakes',
    name: 'Mini Bento Cakes & Message Inside Cakes',
    parentGroup: 'Signature Collection',
    tagline: 'Adorable Bento & Secret Hidden Message Cakes',
    description: 'Trendy Korean Bento mini cakes and interactive hidden message pull-out cakes.',
    heroImage: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=1200',
    badge: 'Trending',
    orderIndex: 12,
  },
  {
    id: 'tub-cakes',
    name: 'Premium Tub Cakes',
    parentGroup: 'Signature Collection',
    tagline: 'Decadent Layered Dessert Tubs',
    description: 'Spoonable luxury dessert tubs overflowing with Belgian chocolate and mousse.',
    heroImage: 'https://images.pexels.com/photos/1775035/pexels-photo-1775035.jpeg?auto=compress&cs=tinysrgb&w=1200',
    badge: 'Bestseller',
    orderIndex: 13,
  },
  {
    id: 'pastries',
    name: 'Pastries',
    parentGroup: 'Signature Collection',
    tagline: 'Individual Slices of Artisan Heaven',
    description: 'Freshly sliced gourmet pastries for everyday cravings.',
    heroImage: 'https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg?auto=compress&cs=tinysrgb&w=1200',
    badge: 'Fresh',
    orderIndex: 14,
  },
];

export const CAKES_DATA: CakeItem[] = [];

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
