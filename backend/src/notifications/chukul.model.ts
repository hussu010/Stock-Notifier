import mongoose from 'mongoose';
import { IChukul } from './notifications.interface';

const chukulSchema = new mongoose.Schema<IChukul>(
  {
    key: { type: String, required: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Chukul = mongoose.model<IChukul>('Chukul', chukulSchema);
export default Chukul;
