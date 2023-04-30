import Order from './orders.model';

const createOrder = async (
  symbol: string,
  title: string,
  entry: number,
  target: number,
  stopLoss: number,
  exit: number
) => {
  const order = new Order({
    symbol,
    title,
    entry,
    target,
    stopLoss,
    exit,
  });
  return await order.save();
};

export { createOrder };
