import mongoose from 'mongoose';

interface ITmsAuthDoc extends Document {
  _rid: string;
  _aid: string;
  xsrfToken: string;
  clientId: string;
  userId: string;
  userName: string;
}

const tmsAuthSchema = new mongoose.Schema<ITmsAuthDoc>(
  {
    _rid: { type: String, required: true },
    _aid: { type: String, required: true },
    xsrfToken: { type: String, required: true },
    clientId: { type: String, required: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const TmsAuth = mongoose.model<ITmsAuthDoc>('TmsAuth', tmsAuthSchema);
export default TmsAuth;
