import mongoose, { Schema, Document } from 'mongoose';

export interface IHeroSlide extends Document {
  id: string;
  cakeName: string;
  badgeTagline: string;
  category: string;
  priceStartingFrom: number;
  description: string;
  image: string; // Cloudinary CDN URL
  ctaLink: string;
  orderIndex: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HeroSlideSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    cakeName: { type: String, required: true },
    badgeTagline: { type: String, default: 'Signature Artisanal' },
    category: { type: String, default: 'Featured Collection' },
    priceStartingFrom: { type: Number, required: true },
    description: { type: String, default: '' },
    image: { type: String, required: true },
    ctaLink: { type: String, default: '/catalog' },
    orderIndex: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

HeroSlideSchema.index({ active: 1, orderIndex: 1 });

export default mongoose.models.HeroSlide || mongoose.model<IHeroSlide>('HeroSlide', HeroSlideSchema);
