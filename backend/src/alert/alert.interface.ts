interface IAlert extends Document {
  _id: string;
  symbol: string;
  title: string;
  target: number;
  type: string;
  alertName: string;
  notes: string;
  expiresAt: Date;
}

type typeAlert = 'Greater'|'Lesser';
const typeAlertEnum = ['Greater','Lesser'];

export { IAlert,typeAlert,typeAlertEnum };
