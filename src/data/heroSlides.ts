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
    id: 'hero-default-1',
    cakeName: 'Aurora 3-Tier Pearl Velvet Wedding Cake',
    badgeTagline: 'Bespoke Wedding Collection',
    category: 'Wedding Tier',
    priceStartingFrom: 6500,
    description: '100% Eggless 3-tier luxury wedding cake with handcrafted edible sugar pearls and 24K gold leaf accents.',
    image: 'https://images.pexels.com/photos/1702373/pexels-photo-1702373.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ctaLink: '/catalog',
    orderIndex: 0,
    active: true,
  },
  {
    id: 'hero-default-2',
    cakeName: 'Velvet Noir Belgian Truffle Cake',
    badgeTagline: 'Most Loved Bestseller',
    category: 'Signature Truffle',
    priceStartingFrom: 1850,
    description: 'Decadent 70% dark Belgian chocolate truffle cake with silk ganache finish. 100% Eggless.',
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ctaLink: '/catalog',
    orderIndex: 1,
    active: true,
  },
  {
    id: 'hero-default-3',
    cakeName: 'Rose Champagne Floral Bloom Cake',
    badgeTagline: 'Artisanal Flower Atelier',
    category: 'Birthday Special',
    priceStartingFrom: 2200,
    description: 'Elegant champagne sponge infused with organic rose water and edible pressed flowers.',
    image: 'https://images.pexels.com/photos/1775035/pexels-photo-1775035.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ctaLink: '/catalog',
    orderIndex: 2,
    active: true,
  },
];
