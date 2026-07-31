import mongoose, { Schema, Document } from 'mongoose';

export interface ICake extends Document {
  id: string;
  name: string;
  subtitle?: string;
  category: string;
  priceStartingFrom: number;
  description: string;
  shortDescription: string;
  image: string; // Featured Cloudinary CDN URL
  additionalImages: string[]; // Cloudinary CDN URLs array
  servings: string;
  flavors: string[];
  eggless: boolean;
  bestseller: boolean;
  newArrival: boolean;
  featured: boolean;
  tags: string[];
  customizable: boolean;
  prepTimeHours: number;
  availabilityStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

const CakeSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    subtitle: { type: String, default: '' },
    category: { type: String, required: true, index: true },
    priceStartingFrom: { type: Number, required: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    image: { type: String, required: true }, // Cloudinary URL
    additionalImages: [{ type: String }], // Cloudinary URLs
    servings: { type: String, required: true },
    flavors: [{ type: String }],
    eggless: { type: Boolean, default: true },
    bestseller: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    tags: [{ type: String }],
    customizable: { type: Boolean, default: true },
    prepTimeHours: { type: Number, default: 24 },
    availabilityStatus: { type: String, default: '24 Hours Advance' },
  },
  { timestamps: true }
);

export default mongoose.models.Cake || mongoose.model<ICake>('Cake', CakeSchema);
