import mongoose, { Schema, Document } from 'mongoose';

export interface IAccessoryItem {
  id: string;
  name: string;
  emoji: string;
  price: number;
  active: boolean;
}

export interface IOurStory {
  badgeTagline?: string;
  title?: string;
  description?: string;
  bakerName?: string;
  image1?: string;
  image2?: string;
}

export interface ISiteSettings extends Document {
  key: string; // Always 'main' — single settings document
  siteName: string;
  whatsappNumber: string;
  supportEmail: string;
  boutiqueAddress: string;
  openingHours: string;
  instagram: string;
  facebook: string;
  accessories: IAccessoryItem[];
  ourStory?: IOurStory;
  isSeeded?: boolean;
  updatedAt: Date;
}

const SiteSettingsSchema: Schema = new Schema(
  {
    key: { type: String, default: 'main', unique: true, index: true },
    siteName: { type: String, default: 'Lush Layers (Made With Love)' },
    whatsappNumber: { type: String, default: '918768388868' },
    supportEmail: { type: String, default: 'concierge@lushlayers.com' },
    boutiqueAddress: { type: String, default: 'PB Road, Behala, Kolkata-41' },
    openingHours: { type: String, default: 'Tuesday - Sunday: 10:00 AM - 08:00 PM' },
    instagram: { type: String, default: '@lushlayers.cakes' },
    facebook: { type: String, default: 'facebook.com/lushlayers.cakes' },
    accessories: {
      type: [
        {
          id: String,
          name: String,
          emoji: String,
          price: Number,
          active: { type: Boolean, default: true },
        },
      ],
      default: [
        { id: 'candles', name: 'Birthday Candles Pack', emoji: '🎂', price: 50, active: true },
        { id: 'knife', name: 'Premium Cake Knife / Server', emoji: '🔪', price: 40, active: true },
        { id: 'balloons', name: 'Party Balloons (Pack of 5)', emoji: '🎈', price: 100, active: true },
        { id: 'sparklers', name: 'Golden Party Sparklers (Pack of 2)', emoji: '💖', price: 80, active: true },
        { id: 'crown', name: 'Birthday Crown / Sash', emoji: '👑', price: 120, active: true },
      ],
    },
    ourStory: {
      badgeTagline: { type: String, default: 'Made With Love & Passion' },
      title: { type: String, default: 'Artisanal Ingredients & 24K Gold Leafing' },
      description: { type: String, default: 'Freshly baked to order using authentic gourmet baking techniques, Valrhona single-origin chocolate, Madagascar bourbon vanilla pods, and organic berries.' },
      bakerName: { type: String, default: 'Tina Manna (Owner & Pastry Chef)' },
      image1: { type: String, default: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=600&q=85' },
      image2: { type: String, default: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=600&q=85' },
    },
    isSeeded: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
