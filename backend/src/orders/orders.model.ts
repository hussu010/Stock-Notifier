import mongoose from 'mongoose';
import { IOrder } from './orders.interface';

const orderSchema = new mongoose.Schema<IOrder>(
  {
    symbol: { type: String, required: true },
    title: { type: String, required: true },
    entry: { type: Number, required: true },
    target: { type: Number, required: true },
    stopLoss: { type: Number, required: true },
    exit: { type: Number },
    status: { type: String, required: true, default: 'OPEN' },
    isDeleted: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model<IOrder>('Order', orderSchema);
export default Order;
