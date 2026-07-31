import mongoose, { Schema, Document } from 'mongoose';

export interface IAdminUser extends Document {
  email: string;
  password: string;
  name: string;
  role: 'Super Admin' | 'Admin' | 'Manager' | 'Staff';
  loginAttempts: number;
  lockUntil?: Date;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdminUserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true },
    name: { type: String, required: true, default: 'Head Pastry Chef' },
    role: {
      type: String,
      enum: ['Super Admin', 'Admin', 'Manager', 'Staff'],
      default: 'Admin',
    },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.AdminUser || mongoose.model<IAdminUser>('AdminUser', AdminUserSchema);
