import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  id: string;
  name: string;
  group: string;
  tagline: string;
  description: string;
  heroImage: string;
  badge?: string;
  subcategories?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    group: { type: String, default: 'Celebration Cakes', index: true },
    tagline: { type: String, required: true },
    description: { type: String, required: true },
    heroImage: { type: String, required: true }, // Cloudinary URL
    badge: { type: String, default: 'Collection' },
    subcategories: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
