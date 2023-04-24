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

export {
  INotification,
  NotificationType,
  NotificationTypeEnum,
  stockSymbolData,
};
