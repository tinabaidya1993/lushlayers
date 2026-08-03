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

export const DEFAULT_HERO_SLIDES: HeroSlideData[] = [];
