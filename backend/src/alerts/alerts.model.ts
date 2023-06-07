import mongoose from 'mongoose';
import { IAlert } from './alerts.interface';

const alertSchema = new mongoose.Schema<IAlert>(
  {
    symbol: { type: String, required: true },
    title: { type: String, required: true },
    target: { type: Number, required: true },
    type: { type: String, required: true },
    notes: { type: String },
    expiresAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Alert = mongoose.model<IAlert>('alert', alertSchema);
export default Alert;
