import Notification from './notifications.model';
import { sendMessageToDiscord } from '../common/utils/discord';
import { NotificationType } from './notifications.interface';

const createNotification = async (
  stockId: number,
  symbol: string,
  title: string,
  price: string,
  type: string
) => {
  try {
    const notification = await Notification.create({
      stockId,
      symbol,
      title,
      price,
      type,
    });
    const notificationMessage = `${title}\nAlert Type: ${type}\nPrice: Rs. ${price}`;
    sendMessageToDiscord(`Created alert for ${symbol}`, notificationMessage);
    return notification;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const scanNotificationTriggers = async () => {
  try {
    const notifications = await Notification.find();
    notifications.map(async (notification) => {
      const currentStockPrice = await getStockPrice(notification.symbol);
      const priceReachedLevel = hasPriceReachedLevel(
        currentStockPrice,
        notification.price,
        notification.type
      );
      if (priceReachedLevel) {
        const notificationMessage = `${notification.title}\nTrigger Price: Rs. ${notification.price}\nCurrent Price: Rs. ${currentStockPrice}`;
        sendMessageToDiscord(
          `${notification.type} alert for ${notification.symbol}`,
          notificationMessage
        );
      }
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const hasPriceReachedLevel = (
  currentPrice: number,
  triggerPrice: number,
  type: NotificationType
) => {
  if (type === 'TARGET') {
    return currentPrice >= triggerPrice;
  } else if (type === 'STOP_LOSS') {
    return currentPrice <= triggerPrice;
  }
  return false;
};

const getStockPrice = async (symbol: string) => {
  return 456;
};

export { createNotification, scanNotificationTriggers };
