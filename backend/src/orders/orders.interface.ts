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

export { IOrder, OrderStatus, OrderStatusEnum };
