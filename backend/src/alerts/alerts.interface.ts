interface IAlert extends Document {
  _id: string;
  symbol: string;
  title: string;
  target: number;
  type: String;
  notes: string;
  expiresAt: Date;
}

const AlertTypeEnum = ['GREATER_THAN', 'LESS_THAN'];
export { IAlert, AlertTypeEnum };
