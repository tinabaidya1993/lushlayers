import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  id: string;
  name: string;
  parentGroup: string;
  parentId?: string;
  isParent?: boolean;
  tagline: string;
  description: string;
  heroImage: string;
  badge?: string;
  orderIndex?: number;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    parentGroup: { type: String, required: true, default: 'Celebration Cakes', index: true },
    parentId: { type: String, default: '' },
    isParent: { type: Boolean, default: false },
    tagline: { type: String, default: '' },
    description: { type: String, default: '' },
    heroImage: { type: String, default: '' }, // Cloudinary URL
    badge: { type: String, default: 'Collection' },
    orderIndex: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
