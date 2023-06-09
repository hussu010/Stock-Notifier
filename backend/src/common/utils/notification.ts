import Order from '../../orders/orders.model';
import Alert from '../../alerts/alerts.model';
import { getStockPrice } from './stock';
import { sendMessageToDiscord } from './discord';
import { error } from 'console';

const scanNotificationTriggers = async () => {
  try {
    const orders = await Order.find({ isDeleted: false, status: 'OPEN' });
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



//For sending the notification of user created notes as alert
const NotificationTriggers = async () => {
  try {
    const alerts = await Alert.find();
    for (let i = 0; i < alerts.length; i++) {
      var alert = alerts[i];
      const currentStockPrice = await getStockPrice(alert.symbol);
      const alerType = alert.type;
      console.log(alerType);
      // if the user select the GREATER_THAN option, when the price will cross the target and becomes greater than the system will use this message
      if (alerType === 'GREATER_THAN') {
        const { notificationTriggered, notificationType } =
          checkNotificationGreater(currentStockPrice, alert.target);

        if (notificationTriggered) {
          const notificationMessage = `
          Symbol:  ${alert.symbol}\n
          Title: ${alert.title}\n
          Current Price: Rs. ${currentStockPrice}\n
          Target: Rs. ${alert.target}\n
          Notes: ${alert.notes}\n
          Expire At: ${alert.expiresAt}`;

          sendMessageToDiscord(
            `${notificationType} alert for ${alert.symbol}`,
            notificationMessage
          );
        }
      }
      // if the user select the LESSER_THAN option, when the price will below the target and becomes lesser than the system will use this message
      else if (alerType === 'LESS_THAN') {
        const { notificationTriggered, notificationType } =
          checkNotificationLesser(currentStockPrice, alert.target);

        if (notificationTriggered) {
          const notificationMessage = `
        Symbol:  ${alert.symbol}\n
        Title: ${alert.title}\n
        Current Price: Rs. ${currentStockPrice}\n
        Target: Rs. ${alert.target}\n
        Notes: ${alert.notes}\n
        Expire At: ${alert.expiresAt}`;

          sendMessageToDiscord(
            `${notificationType} alert for ${alert.symbol}`,
            notificationMessage
          );
        }
      }
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

//if the target price will become greater than current price
const checkNotificationGreater = (current: number, target: number) => {
  if (current > target) {
    return { notificationTriggered: true, notificationType: 'INCREASED TARGET PRICE' };
  } 
  return { notificationTriggered: false, notificationType: '' };
};

//if the target price will below than current price
const checkNotificationLesser = (current: number, target: number) => {
  if (current < target) {
    return { notificationTriggered: true, notificationType: 'DECREASED TARGET PRICE' };
  } 
  return { notificationTriggered: false, notificationType: '' };
};
export { scanNotificationTriggers, NotificationTriggers };
