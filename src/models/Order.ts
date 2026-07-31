import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  orderId: string;
  customerDetails: {
    customerName: string;
    phoneNumber: string;
    deliveryAddress: string;
    deliveryDate: string;
    deliveryTime: string;
  };
  cakeSnapshot: {
    cakeId?: string;
    cakeName: string;
    cakeCategory: string;
    image: string;
  };
  selectedOptions: {
    weight: string;
    flavor: string;
    shape: string;
    creamType: string;
    themeColor: string;
    cakeMessage?: string;
    referenceImageUrl?: string;
    specialNotes?: string;
  };
  estimatedPrice: number;
  generatedWhatsAppMessage: string;
  status: 'New' | 'Confirmed' | 'Preparing' | 'Out for Delivery' | 'Completed' | 'Cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    customerDetails: {
      customerName: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      deliveryAddress: { type: String, required: true },
      deliveryDate: { type: String, required: true },
      deliveryTime: { type: String, required: true },
    },
    cakeSnapshot: {
      cakeId: { type: String },
      cakeName: { type: String, required: true },
      cakeCategory: { type: String, default: 'signature' },
      image: { type: String, required: true },
    },
    selectedOptions: {
      weight: { type: String, required: true },
      flavor: { type: String, required: true },
      shape: { type: String, default: 'Round' },
      creamType: { type: String, default: 'Swiss Meringue Buttercream' },
      themeColor: { type: String, default: 'Ivory & Gold' },
      cakeMessage: { type: String, default: '' },
      referenceImageUrl: { type: String, default: '' },
      specialNotes: { type: String, default: '' },
    },
    estimatedPrice: { type: Number, required: true },
    generatedWhatsAppMessage: { type: String, required: true },
    status: {
      type: String,
      enum: ['New', 'Confirmed', 'Preparing', 'Out for Delivery', 'Completed', 'Cancelled'],
      default: 'New',
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
