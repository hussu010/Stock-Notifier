import Order from '../../orders/orders.model';
import { getStockPrice } from './stock';
import { sendMessageToDiscord } from './discord';

const scanNotificationTriggers = async () => {
  try {
    const orders = await Order.find({ isDeleted: false });
    for (let i = 0; i < orders.length; i++) {
      var order = orders[i];
      const currentStockPrice = await getStockPrice(order.symbol);

      const { notificationTriggered, notificationType } =
        checkNotificationTriggered(
          currentStockPrice,
          order.target,
          order.stopLoss
        );

      if (notificationTriggered) {
        const profitLoss =
          ((currentStockPrice - order.entry) / order.entry) * 100;
        const notificationMessage = `
        Entry: Rs. ${order.entry}\n
        Target: Rs. ${order.target}
        Stop Loss: Rs. ${order.stopLoss}\n
        Current Price: Rs. ${currentStockPrice}\n
        P/L: ${profitLoss.toFixed(2)}%`;
        sendMessageToDiscord(
          `${notificationType} alert for ${order.symbol}`,
          notificationMessage
        );
      }
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const checkNotificationTriggered = (
  current: number,
  target: number,
  stopLoss: number
) => {
  if (current >= target) {
    return { notificationTriggered: true, notificationType: 'TARGET' };
  } else if (current <= stopLoss) {
    return { notificationTriggered: true, notificationType: 'STOP_LOSS' };
  }
  return { notificationTriggered: false, notificationType: '' };
};

export { scanNotificationTriggers };
