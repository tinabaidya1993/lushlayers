import { CakeItem, CategoryInfo } from '@/types';

export const CATEGORIES: CategoryInfo[] = [
  // 🎂 Celebration Cakes
  {
    id: 'birthday-cakes',
    name: 'Birthday Cakes',
    group: 'Celebration Cakes',
    tagline: 'Make Birthday Milestones Magical',
    description: 'Customized birthday cakes with delightful flavors, pastel palettes, and personalized plaques.',
    heroImage: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1200&q=80',
    badge: 'Bestseller'
  },
  {
    id: 'anniversary-cakes',
    name: 'Anniversary Cakes',
    group: 'Celebration Cakes',
    tagline: 'Celebrate Years of Love & Togetherness',
    description: 'Romantic heart-shaped and metallic accent cakes designed for couples and anniversary milestones.',
    heroImage: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=1200&q=80',
    badge: 'Romantic'
  },
  {
    id: 'wedding-cakes',
    name: 'Wedding Cakes',
    group: 'Celebration Cakes',
    tagline: 'Grand Tiered Masterpieces for Your Special Day',
    description: 'Multi-tiered luxury wedding cakes adorned with fine Belgian chocolate, 24k gold leafing, and handcrafted sugar blooms.',
    heroImage: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=1200&q=80',
    badge: 'Grand Tier'
  },
  {
    id: 'baby-shower-cakes',
    name: 'Baby Shower Cakes',
    group: 'Celebration Cakes',
    tagline: 'Sweet Welcome for the Little One',
    description: 'Whimsical pastel cakes, gender reveal designs, and adorable handcrafted fondant decorations.',
    heroImage: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=1200&q=80',
    badge: 'Pastel'
  },
  {
    id: 'annaprashan-cakes',
    name: 'Rice Feeding Ceremony (Annaprashan) Cakes',
    group: 'Celebration Cakes',
    tagline: 'Traditional & Blessings Infused First Rice Ceremony Cakes',
    description: 'Cultural themed cakes with traditional rice feeding motifs and golden touches for baby\'s first rice ceremony.',
    heroImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80',
    badge: 'Traditional'
  },
  {
    id: 'engagement-cakes',
    name: 'Ring Ceremony / Engagement Cakes',
    group: 'Celebration Cakes',
    tagline: 'Elegant Creations for Your Engagement Day',
    description: 'Classy ring box cakes, edible pearl decorations, and minimalist satin frosting finishes.',
    heroImage: 'https://images.unsplash.com/photo-1562440499-64c9a111f713?auto=format&fit=crop&w=1200&q=80',
    badge: 'Elegance'
  },
  {
    id: 'bhai-dooj-cakes',
    name: 'Bhai Dooj Celebration Cakes',
    group: 'Celebration Cakes',
    tagline: 'Honoring the Special Sibling Bond',
    description: 'Festive sibling celebration cakes crafted with rich chocolate, dry fruits, and festive motifs.',
    heroImage: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=1200&q=80',
    badge: 'Festive'
  },
  {
    id: 'valentines-couple-cakes',
    name: 'Valentine\'s Day & Couple Celebration Cakes',
    group: 'Celebration Cakes',
    tagline: 'Romantic & Heartfelt Delight for Couples',
    description: 'Red velvet, dark chocolate truffle, and strawberry rose cakes with romantic finishes.',
    heroImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80',
    badge: 'Love & Romance'
  },
  {
    id: 'rakhi-special-cakes',
    name: 'Rakhi Special Cakes',
    group: 'Celebration Cakes',
    tagline: 'Sweeten the Festival of Protection & Love',
    description: 'Special Raksha Bandhan cakes with handcrafted rakhi fondant toppers and festive flavors.',
    heroImage: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=1200&q=80',
    badge: 'Festive'
  },

  // 🎉 Special Occasion Cakes
  {
    id: 'any-day-celebration-cakes',
    name: 'Any Day Celebration Cakes',
    group: 'Special Occasion Cakes',
    tagline: 'Independence, Children\'s, Father\'s, Mother\'s & Friendship Day Special Cakes',
    description: 'Themed cakes for year-round special days like Independence Day, Children\'s Day, Father\'s Day, Mother\'s Day, and Friendship Day.',
    heroImage: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1200&q=80',
    badge: 'Multi-Occasion',
    subcategories: ['Independence Day', "Children's Day", "Father's Day", "Mother's Day", 'Friendship Day']
  },
  {
    id: 'farewell-success-cakes',
    name: 'Farewell & Success Party Cakes',
    group: 'Special Occasion Cakes',
    tagline: 'Cheers to New Beginnings and Remarkable Success',
    description: 'Corporate achievement, graduation, job promotion, and farewell custom message cakes.',
    heroImage: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=1200&q=80',
    badge: 'Success'
  },

  // 🍰 Signature Collection
  {
    id: 'bento-message-cakes',
    name: 'Mini Bento Cakes & Message Inside Cakes',
    group: 'Signature Collection',
    tagline: 'Cute Bento Box & Hidden Message Surprise Cakes',
    description: 'Adorable 250g-350g Korean bento cakes and secret pull-out message surprise cakes.',
    heroImage: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=1200&q=80',
    badge: 'Trending'
  },
  {
    id: 'premium-tub-cakes',
    name: 'Premium Tub Cakes',
    group: 'Signature Collection',
    tagline: 'Decadent Spoonfuls of Gourmet Layers in a Tub',
    description: 'Rich layered chocolate, tiramisu, and lotus biscoff dessert tubs ready for instant enjoyment.',
    heroImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80',
    badge: 'Gourmet Tubs'
  },
  {
    id: 'pastries',
    name: 'Pastries',
    group: 'Signature Collection',
    tagline: 'Single-Serve Artisanal Slice Delights',
    description: 'Freshly baked single-serve pastry slices featuring Belgian chocolate, cheesecake, and fruit tarts.',
    heroImage: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=1200&q=80',
    badge: 'Single Slices'
  }
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
