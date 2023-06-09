interface IAlert extends Document {
  _id: string;
  symbol: string;
  title: string;
  target: number;
  type: AlertType;
  notes: string;
  expiresAt: Date;
}

type AlertType = 'GREATER_THAN' | 'LESS_THAN';
const AlertTypeEnum = ['GREATER_THAN', 'LESS_THAN'];
export { IAlert, AlertType,AlertTypeEnum };
