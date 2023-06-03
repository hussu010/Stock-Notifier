interface IAlert extends Document {
  _id: string;
  symbol: string;
  title: string;
  price: number;
  target: number;
  type: number;
  alertName: string;
  notes: string;
  expiresAt: Date;
}

export { IAlert };
