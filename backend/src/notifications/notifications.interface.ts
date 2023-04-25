interface INotification extends Document {
  _id: string;
  stockId: number;
  symbol: string;
  title: string;
  price: number;
  type: NotificationType;
}

type NotificationType = 'TARGET' | 'STOP_LOSS';
const NotificationTypeEnum = ['TARGET', 'STOP_LOSS'];

type stockSymbolData = {
  id: number;
  symbol: string;
  name: string;
  type: string;
  sector_id: number;
};

type ChukulAuthenticateResponse = {
  access: string;
  refresh: string;
};

type IChukul = {
  _id: string;
  key: string;
  accessToken: string;
  refreshToken: string;
};

export {
  INotification,
  IChukul,
  NotificationType,
  NotificationTypeEnum,
  stockSymbolData,
  ChukulAuthenticateResponse,
};
