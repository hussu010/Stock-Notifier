import jwt, { JwtPayload } from 'jsonwebtoken';
import Notification from './notifications.model';
import Chukul from './chukul.model';
import { sendMessageToDiscord } from '../common/utils/discord';
import {
  NotificationType,
  ChukulAuthenticateResponse,
} from './notifications.interface';

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
    for (let i = 0; i < notifications.length; i++) {
      var notification = notifications[i];
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
    }
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

const getChukulAccessRefreshToken = async () => {
  try {
    const response = await fetch(`https://chukul.com/api/authenticate/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
        Origin: 'https://chukul.com',
        Referer: 'https://chukul.com/',
      },
      body: JSON.stringify({
        phone_number: process.env.CHUKUL_PHONE_NUMBER,
        password: process.env.CHUKUL_PASSWORD,
        device: 'web',
        medium: 'chukul',
      }),
    });

    const responseObject =
      response.json() as Promise<ChukulAuthenticateResponse>;

    const { access, refresh } = await responseObject;

    await Chukul.findOneAndUpdate(
      {
        key: 'default',
      },
      {
        accessToken: access,
        refreshToken: refresh,
      },
      {
        $setOnInsert: {
          key: 'default',
          accessToken: access,
          refreshToken: refresh,
        },
        upsert: true,
      }
    );

    return { accessToken: access, refreshToken: refresh };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const isTokenExpired = async (token: string) => {
  try {
    const decoded = jwt.decode(token, { complete: true }) as JwtPayload;
    const expirationTime = decoded.payload.exp;
    const currentTime = Math.floor(Date.now() / 1000);
    return expirationTime < currentTime;
  } catch (error) {
    return true;
  }
};

const getValidAccessToken = async () => {
  const chukulTokenPairs = await Chukul.findOne({
    key: 'default',
  });

  if (!chukulTokenPairs) {
    const { accessToken } = await getChukulAccessRefreshToken();
    return accessToken;
  } else {
    const { accessToken } = chukulTokenPairs;
    const isAccessTokenExpired = await isTokenExpired(accessToken);
    if (isAccessTokenExpired) {
      const { accessToken } = await getChukulAccessRefreshToken();
      return accessToken;
    }
    return accessToken;
  }
};

const getStockPrice = async (symbol: string) => {
  const accessToken = await getValidAccessToken();
  const response = await fetch(
    `https://chukul.com/api/data/historydata/?symbol=${symbol}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent':
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
        Origin: 'https://chukul.com',
        Referer: 'https://chukul.com/',
      },
    }
  );

  const responseObject = await response.json();
  const latestPrice = responseObject[0].close;
  return latestPrice;
};

export { createNotification, scanNotificationTriggers };
