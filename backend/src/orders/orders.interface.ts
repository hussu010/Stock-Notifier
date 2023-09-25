interface IOrder extends Document {
  _id: string;
  symbol: string;
  title: string;
  entry: number;
  target: number;
  stopLoss: number;
  exit: number;
  status: OrderStatus;
  type: OrderType;
  quantity: number;
  isDeleted: boolean;
}

type OrderStatus = 'OPEN' | 'CANCELLED' | 'COMPLETED';
const OrderStatusEnum = ['OPEN', 'COMPLETED', 'CANCELLED'];
type OrderType = 'BUY' | 'SELL';
const OrderTypeEnum = ['BUY', 'SELL'];

type IChukul = {
  _id: string;
  key: string;
  accessToken: string;
  refreshToken: string;
};

export { IOrder, OrderStatus, OrderStatusEnum, IChukul, OrderTypeEnum };
