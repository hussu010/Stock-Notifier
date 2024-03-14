import mongoose from 'mongoose';
import { IAlert } from './alerts.interface';
import { AlertTypeEnum, AlertStatusEnum } from './alerts.interface';

const alertSchema = new mongoose.Schema<IAlert>(
  {
    symbol: { type: String, required: true },
    title: { type: String, required: true },
    target: { type: Number, required: true },
    type: { type: String, required: true, enum: AlertTypeEnum },
    notes: { type: String },
    expiresAt: { type: Date },
    status: { type: String, default: 'OPEN', enum: AlertStatusEnum },
  },
  {
    timestamps: true,
  }
);

const Alert = mongoose.model<IAlert>('alert', alertSchema);
export default Alert;
