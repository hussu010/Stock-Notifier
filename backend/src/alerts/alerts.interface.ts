interface IAlert extends Document {
  _id: string;
  symbol: string;
  title: string;
  target: number;
  type: String;
  notes: string;
  expiresAt: Date;
  status: String;
}

const AlertTypeEnum = ['GREATER_THAN', 'LESS_THAN'];
const AlertStatusEnum = ['OPEN', 'EXPIRED'];
export { IAlert, AlertTypeEnum, AlertStatusEnum };
