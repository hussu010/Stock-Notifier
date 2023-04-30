import axios from 'axios';
import jwt, { JwtPayload } from 'jsonwebtoken';
import Chukul from '../../notifications/chukul.model';

type stockSymbolData = {
  id: number;
  symbol: string;
  name: string;
  type: string;
  sector_id: number;
};

type ChukulAuthenticateResponse = {
  access: string;
  refresh: string;
};

type IChukul = {
  _id: string;
  key: string;
  accessToken: string;
  refreshToken: string;
};

const binarySearchStockArray = (
  stockSymbolData: stockSymbolData[],
  symbol: string
): stockSymbolData => {
  let min = 0;
  let max = stockSymbolData.length - 1;
  let mid = 0;
  while (min <= max) {
    mid = Math.floor((min + max) / 2);
    if (stockSymbolData[mid].symbol === symbol) {
      return stockSymbolData[mid];
    } else if (stockSymbolData[mid].symbol < symbol) {
      min = mid + 1;
    } else {
      max = mid - 1;
    }
  }
  return { id: 0, symbol: '', name: '', type: '', sector_id: 0 };
};

const getChukulAccessRefreshToken = async () => {
  try {
    const { data } = await axios.post(
      `https://chukul.com/api/authenticate/token/`,
      {
        phone_number: process.env.CHUKUL_PHONE_NUMBER,
        password: process.env.CHUKUL_PASSWORD,
        device: 'web',
        medium: 'chukul',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
          Origin: 'https://chukul.com',
          Referer: 'https://chukul.com/',
        },
      }
    );

    const { access, refresh } = data;

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
  try {
    // const accessToken = await getValidAccessToken();

    const { data } = await axios.get(
      `https://chukul.com/api/data/historydata/?symbol=${symbol}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent':
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
          Origin: 'https://chukul.com',
          Referer: 'https://chukul.com/',
        },
      }
    );

    const latestPrice = data[0].close;
    return latestPrice;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export { binarySearchStockArray, getStockPrice };
