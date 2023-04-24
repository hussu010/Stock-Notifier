import Notification from './notifications.model';
import { sendMessageToDiscord } from '../common/utils/discord';

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

export { createNotification };
