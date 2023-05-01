interface IOrder extends Document {
  _id: string;
  symbol: string;
  title: string;
  entry: number;
  target: number;
  stopLoss: number;
  exit: number;
  status: OrderStatus;
  isDeleted: boolean;
}

type OrderStatus = 'OPEN' | 'CANCELLED' | 'COMPLETED';
const OrderStatusEnum = ['OPEN', 'COMPLETED', 'CANCELLED'];

type IChukul = {
  _id: string;
  key: string;
  accessToken: string;
  refreshToken: string;
};

export { IOrder, OrderStatus, OrderStatusEnum, IChukul };
