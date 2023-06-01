import mongoose from 'mongoose';
import { IAlert } from './alert.interface';

const alertSchema = new mongoose.Schema<IAlert>(
  {
    symbol: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    target: { type: Number, required: true },
    alertName: { type: String, required: true },
    notes: { type: String, required: true },
    expiresAt: { type: Number, required: true },
    
  },
  {
    timestamps: true,
  }
);

const Alert = mongoose.model<IAlert>('alert', alertSchema);
export default Alert;
