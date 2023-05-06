import mongoose from 'mongoose';
import { Ialert } from './alert.interface';

const alertSchema = new mongoose.Schema<Ialert>(

    {
        symbol: {type: String, required: true},
        title: {type: String, required:true},
        price: {type: Number, required: true},
        target: {type: Number, required: true},
        alertname: {type: String, required: true},
        notes: {type: String, required: true},
        expiresAt: {type: Number, required: true},
    },
    {
        timestamps: true,
    }

);

const Alert = mongoose.model<Ialert>('alert', alertSchema);
export default Alert;