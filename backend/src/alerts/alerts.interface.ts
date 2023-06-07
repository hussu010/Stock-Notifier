interface IAlert extends Document {
  _id: string;
  symbol: string;
  title: string;
  target: number;
  type: string;
  notes: string;
  expiresAt: Date;
}

const alertTypeEnum = ['GREATER_THAN', 'LESS_THAN'];

export { IAlert, alertTypeEnum };
