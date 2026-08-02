import mongoose, { Schema, Document } from 'mongoose';

export interface IAccessoryItem {
  id: string;
  name: string;
  emoji: string;
  price: number;
  active: boolean;
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
    isSeeded: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
