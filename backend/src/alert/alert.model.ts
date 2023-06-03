import mongoose from 'mongoose';
import { IAlert } from './alert.interface';

//default value for expire date of 1 year from today date
const aYearFromNow = new Date();
aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);

const alertSchema = new mongoose.Schema<IAlert>(
  {
    symbol: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    target: { type: Number, required: true },
    type: {type: Number, required: true},
    alertName: { type: String, required: true },
    notes: { type: String, required: true },
    expiresAt: { type: Date, required: true, default: aYearFromNow },
  },
  {
    timestamps: true,
  }
);

const Alert = mongoose.model<IAlert>('alert', alertSchema);
export default Alert;
