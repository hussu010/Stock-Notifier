interface IAlert extends Document {
  _id: string;
  symbol: string;
  title: string;
  price: number;
  target: number;
  alertName: string;
  notes: string;
  expiresAt: number;
  isDeleted: boolean;
}

export { IAlert };
