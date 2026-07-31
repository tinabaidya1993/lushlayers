import mongoose, { Schema, Document } from 'mongoose';

export interface IMedia extends Document {
  public_id: string;
  url: string;
  secure_url: string;
  filename: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  folder: string;
  altText?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema: Schema = new Schema(
  {
    public_id: { type: String, required: true, unique: true, index: true },
    url: { type: String, required: true },
    secure_url: { type: String, required: true },
    filename: { type: String, required: true },
    format: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    bytes: { type: Number, required: true },
    folder: { type: String, default: 'lush_layers_cakes' },
    altText: { type: String, default: '' },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Media || mongoose.model<IMedia>('Media', MediaSchema);
