import mongoose from 'mongoose';
import { INotification } from './notifications.interface';

const notificationSchema = new mongoose.Schema<INotification>(
  {
    stockId: { type: Number, required: true },
    symbol: { type: String, required: true },
    price: { type: Number, required: true },
    title: { type: String, required: true },
    type: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model<INotification>(
  'Notification',
  notificationSchema
);
export default Notification;
