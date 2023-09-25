import Order from './orders.model';

const createOrder = async (
  symbol: string,
  title: string,
  entry: number,
  target: number,
  stopLoss: number,
  exit: number,
  quantity: number,
  type: string
) => {
  const order = new Order({
    symbol,
    title,
    entry,
    target,
    stopLoss,
    exit,
    quantity,
    type,
  });
  return await order.save();
};

export { createOrder };
