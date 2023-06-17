import Order from '../../orders/orders.model';
import Alert from '../../alerts/alerts.model';
import { getStockPrice } from './stock';
import { sendMessageToDiscord } from './discord';
import { errorMessages } from '../config/messages';

const scanNotificationTriggers = async () => {
  try {
    const orders = await Order.find({ isDeleted: false, status: 'OPEN' });
    for (let i = 0; i < orders.length; i++) {
      var order = orders[i];
      const { success, latestPrice } = await getStockPrice(order.symbol);

      if (success) {
        const { notificationTriggered, notificationType } =
          checkNotificationTriggered(latestPrice, order.target, order.stopLoss);

        if (notificationTriggered) {
          const profitLoss = ((latestPrice - order.entry) / order.entry) * 100;
          const notificationMessage = `
            Entry: Rs. ${order.entry}\n
            Target: Rs. ${order.target}
            Stop Loss: Rs. ${order.stopLoss}\n
            Current Price: Rs. ${latestPrice}\n
            P/L: ${profitLoss.toFixed(2)}%`;

          sendMessageToDiscord(
            `${notificationType} alert for ${order.symbol}`,
            notificationMessage
          );
        }
      } else {
        sendMessageToDiscord(`Error!`, `No data found for ${order.symbol}`);
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

//For sending the notification of user created notes as alert
const scanAlertTriggers = async () => {
  try {
    const alerts = await Alert.find({ status: 'OPEN' });
    for (let i = 0; i < alerts.length; i++) {
      var alert = alerts[i];

      if (new Date() > alert.expiresAt) {
        alert.status = 'EXPIRED';
        alert.save();
      } else {
        const { success, latestPrice } = await getStockPrice(alert.symbol);

        if (success) {
          const { notificationTriggered, notificationType } = isAlertTriggered(
            alert.type,
            latestPrice,
            alert.target
          );

          if (notificationTriggered) {
            const notificationMessage = `
            Title: ${alert.title}\n
            Current Price: Rs. ${latestPrice}\n
            Target: Rs. ${alert.target}\n
            Notes: ${alert.notes}\n
            Expire At: ${alert.expiresAt}`;

            sendMessageToDiscord(
              `${notificationType} alert for ${alert.symbol}`,
              notificationMessage
            );
          }
        } else {
          sendMessageToDiscord(`Error!`, `No data found for ${alert.symbol}`);
        }
      }
    }
  } catch (error: any) {
    throw new Error(errorMessages.DATA_NOT_FOUND);
  }
};

const isAlertTriggered = (type: String, current: number, target: number) => {
  if (type === 'GREATER_THAN') {
    if (current > target) {
      return {
        notificationTriggered: true,
        notificationType: 'Greater than',
      };
    }
  } else if (type === 'LESSER_THAN') {
    if (current < target) {
      return {
        notificationTriggered: true,
        notificationType: 'Less than',
      };
    }
  }

  return { notificationTriggered: false, notificationType: '' };
};

export { scanNotificationTriggers, scanAlertTriggers };
