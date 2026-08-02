export interface HeroSlideData {
  id: string;
  cakeName: string;
  badgeTagline: string;
  category: string;
  priceStartingFrom: number;
  description: string;
  image: string;
  ctaLink: string;
  orderIndex: number;
  active: boolean;
}

export const DEFAULT_HERO_SLIDES: HeroSlideData[] = [
  {
    id: 'hero-1',
    cakeName: 'Aurora 3-Tier Pearl Velvet Wedding Cake',
    badgeTagline: 'Bespoke Wedding Collection',
    category: 'Wedding Tier',
    priceStartingFrom: 6500,
    description: '100% Eggless 3-tier luxury wedding cake with handcrafted edible sugar pearls and gold leaf accents.',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=1200&q=80',
    ctaLink: '/cake/aurora-wedding-tier',
    orderIndex: 0,
    active: true,
  },
  {
    id: 'hero-2',
    cakeName: 'Velvet Noir Belgian Truffle Cake',
    badgeTagline: 'Most Loved Bestseller',
    category: 'Signature Truffle',
    priceStartingFrom: 1850,
    description: 'Decadent 70% dark Belgian chocolate truffle cake with silk ganache finish. 100% Eggless.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80',
    ctaLink: '/cake/velvet-noir-truffle',
    orderIndex: 1,
    active: true,
  },
  {
    id: 'hero-3',
    cakeName: 'Rose Champagne Floral Bloom Cake',
    badgeTagline: 'Artisanal Flower Atelier',
    category: 'Birthday Special',
    priceStartingFrom: 2200,
    description: 'Elegant champagne sponge infused with organic rose water and edible pressed flowers.',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1200&q=80',
    ctaLink: '/cake/rose-champagne-bliss',
    orderIndex: 2,
    active: true,
  },
  {
    id: 'hero-4',
    cakeName: 'Minimalist Japanese Concrete Flora',
    badgeTagline: 'Contemporary Modern Design',
    category: 'Novelty Design',
    priceStartingFrom: 1950,
    description: 'Modern minimalist grey concrete buttercream finish with gold leaf accents.',
    image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=1200&q=80',
    ctaLink: '/cake/minimalist-concrete-flora',
    orderIndex: 3,
    active: true,
  },
];
