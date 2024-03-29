import axios, { AxiosError } from 'axios';
const { v4: uuidv4 } = require('uuid');
import fs from 'fs';

import { getTmsAuth } from './tms.service';
import {
  ClientCollateralDetails,
  DPHolding,
  TmsApiStockSecurity,
} from './tms.interface';
import securities from '../common/config/securities';

const getClientCollateralDetails: () => Promise<ClientCollateralDetails> =
  async () => {
    try {
      const tmsAuth = await getTmsAuth();
      if (tmsAuth === null)
        throw new Error('No TMS Auth credentials found, rerun login script...');

      const uuid = uuidv4();
      const base64EncodedHostSessionId = Buffer.from(`MIT=-${uuid}`).toString(
        'base64'
      );
      console.log(base64EncodedHostSessionId);
      // TODO: Figure out how to get the Host-Session-Id if it can't be hardcoded

      const { data } = await axios.get(
        `${process.env.TMS_URL}/tmsapi/fundApi/net-settlement/client/${tmsAuth.clientId}`,
        {
          headers: {
            Cookie: `_rid=${tmsAuth._rid}; _aid=${tmsAuth._aid}; XSRF-TOKEN=${tmsAuth.xsrfToken}`,
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)',
            Referer: `${process.env.TMS_URL}/tms/member/search/client-search/${tmsAuth.clientId}`,
            Host: process.env.TMS_URL?.split('//')[1],
            'X-Xsrf-Token': tmsAuth.xsrfToken,
            'Host-Session-Id':
              'TVRJPS1lMDEzMzFhNi04OGRhLTRiMDEtOTk5Zi03YzE3M2Q1MzhkNGY=',
            'Request-Owner': tmsAuth.userId,
          },
        }
      );
      return {
        totalCashCollateral: data.totalCashCollateral,
        utilizedCollateral: data.utilizedCollateral,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          console.log('TMS Auth credentials expired. Refreshing...');
          await refreshTmsAuth();
        }
      }
      throw Error(`Error in getClientCollateralDetails: ${error}`);
    }
  };

const refreshTmsAuth: () => Promise<void> = async () => {
  try {
    const tmsAuth = await getTmsAuth();
    if (tmsAuth === null) throw new Error('No TMS Auth credentials found.');

    const { headers } = await axios.post(
      `${process.env.TMS_URL}/tmsapi/authApi/authenticate/refresh`,
      {},
      {
        headers: {
          Host: process.env.TMS_URL?.split('//')[1],
          Cookie: `_rid=${tmsAuth._rid}; _aid=${tmsAuth._aid}; XSRF-TOKEN=${tmsAuth.xsrfToken}`,
          'X-Xsrf-Token': tmsAuth.xsrfToken,
          'Request-Owner': Number(tmsAuth.userId),
          'Host-Session-Id':
            'TVRJPS1lMDEzMzFhNi04OGRhLTRiMDEtOTk5Zi03YzE3M2Q1MzhkNGY=',
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)',
          Referer: `${process.env.TMS_URL}/tms/member/search/client-search/${tmsAuth.clientId}`,
          Origin: process.env.TMS_URL,
          'Content-Type': 'application/json',
        },
      }
    );

    const responseCookies = headers['set-cookie'] || [];

    const ridMatch = responseCookies[0].match(/_aid=([^;]*)/);
    const rid = ridMatch ? ridMatch[1] : null;

    const aidMatch = responseCookies[1].match(/_rid=([^;]*)/);
    const aid = aidMatch ? aidMatch[1] : null;

    const xsrfTokenMatch = responseCookies[2].match(/XSRF-TOKEN=([^;]*)/);
    const xsrfToken = xsrfTokenMatch ? xsrfTokenMatch[1] : null;

    if (aid && rid && xsrfToken) {
      tmsAuth._rid = rid;
      tmsAuth._aid = aid;
      tmsAuth.xsrfToken = xsrfToken;
      tmsAuth.save();
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw Error('Invalid Refresh Token, rerun login script...');
      } else if (error.response?.status === 403) {
        throw Error('Access Token Not Expired, please try again...');
      }
    }
    throw Error(`Error in refreshTmsAuth: ${error}`);
  }
};

const getDailyOrderBook: () => Promise<void> = async () => {
  try {
    const tmsAuth = await getTmsAuth();
    if (tmsAuth === null) throw new Error('No TMS Auth credentials found.');

    const { data } = await axios.get(
      `${process.env.TMS_URL}/tmsapi/orderTradeApi/orderbook-v2/client/${tmsAuth.clientId}?&activeStatus=OPEN&
      activeStatus=PARTIALLY_TRADED&activeStatus=PENDING&activeStatus=MODIFIED&activeStatus=COMPLETED&
      activeStatus=CANCELLED&activeStatus=REJECTED&activeStatus=TMS_REJECTED&activeStatus=PARTIALLY_CANCELLED&
      activeStatus=MODIFIED_CANCELLED`,
      {
        headers: {
          Cookie: `_rid=${tmsAuth._rid}; _aid=${tmsAuth._aid}; XSRF-TOKEN=${tmsAuth.xsrfToken}`,
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)',
          Referer: `${process.env.TMS_URL}/tms/member/search/client-search/${tmsAuth.clientId}`,
          Host: process.env.TMS_URL?.split('//')[1],
          'X-Xsrf-Token': tmsAuth.xsrfToken,
          'Host-Session-Id':
            'TVRJPS1lMDEzMzFhNi04OGRhLTRiMDEtOTk5Zi03YzE3M2Q1MzhkNGY=',
          'Request-Owner': tmsAuth.userId,
        },
      }
    );

    console.log('Daily Order Book', data);
  } catch (error) {
    throw Error(`Error in getDailyOrderBook: ${error}`);
  }
};

const isOrderEngineOpen: () => Promise<boolean> = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.TMS_URL}/tmsapi/metadata/serverTime`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)',
          Referer: `${process.env.TMS_URL}/tms/client/dashboard`,
          Host: process.env.TMS_URL?.split('//')[1],
        },
      }
    );

    const serverTime = data.message;

    let timeParts = serverTime.split(' ')[1].split(':');
    let hour = parseInt(timeParts[0]);

    if (hour === 11 || hour === 12 || hour === 13 || hour === 14) {
      return true;
    }

    return false;
  } catch (error) {
    throw Error(`Error in getServerTime: ${error}`);
  }
};

const seedSecurities: () => Promise<TmsApiStockSecurity[]> = async () => {
  try {
    const tmsAuth = await getTmsAuth();
    if (tmsAuth === null) throw new Error('No TMS Auth credentials found.');

    const { data } = await axios.get(
      `${process.env.TMS_URL}/tmsapi/stock/securities`,
      {
        headers: {
          Cookie: `_rid=${tmsAuth._rid}; _aid=${tmsAuth._aid}; XSRF-TOKEN=${tmsAuth.xsrfToken}`,
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)',
          Referer: `${process.env.TMS_URL}/tms/client/dashboard`,
          Host: process.env.TMS_URL?.split('//')[1],
          'X-Xsrf-Token': tmsAuth.xsrfToken,
          'Host-Session-Id':
            'TVRJPS1lMDEzMzFhNi04OGRhLTRiMDEtOTk5Zi03YzE3M2Q1MzhkNGY=',
          'Request-Owner': tmsAuth.userId,
        },
      }
    );

    const securities: TmsApiStockSecurity[] = data.map((security: any) => {
      return {
        exchangeSecurityId: security.exchangeSecurityId,
        symbol: security.symbol,
        securityName: security.securityName,
      };
    });

    const jsData =
      'export default ' + JSON.stringify(securities, null, 2) + ';';

    fs.writeFile('src/common/config/securities.ts', jsData, (err) => {
      if (err) {
        console.error('There was an error writing the file:', err);
      } else {
        console.log('File has been written successfully!');
      }
    });

    return securities;
  } catch (error) {
    throw Error(`Error in seedSecurities: ${error}`);
  }
};

const getDPHoldings: () => Promise<DPHolding[]> = async () => {
  try {
    const tmsAuth = await getTmsAuth();
    if (tmsAuth === null) throw new Error('No TMS Auth credentials found.');

    const { data } = await axios.get(
      `${process.env.TMS_URL}/tmsapi/dp-holding/client/freebalance/${tmsAuth.clientId}/CLI`,
      {
        headers: {
          Cookie: `_rid=${tmsAuth._rid}; _aid=${tmsAuth._aid}; XSRF-TOKEN=${tmsAuth.xsrfToken}`,
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)',
          Referer: `${process.env.TMS_URL}/tms/client/dashboard`,
          Host: process.env.TMS_URL?.split('//')[1],
          'X-Xsrf-Token': tmsAuth.xsrfToken,
          'Host-Session-Id':
            'TVRJPS1lMDEzMzFhNi04OGRhLTRiMDEtOTk5Zi03YzE3M2Q1MzhkNGY=',
          'Request-Owner': tmsAuth.userId,
        },
      }
    );

    const holdings: DPHolding[] = data.map((holding: any) => {
      return {
        scrip: holding.scrip,
        currentBalance: holding.currentBalance,
        previousCloseprice: holding.previousCloseprice,
        ltp: holding.ltp,
        cdsFreeBalance: holding.cdsFreeBalance,
        cdsTotalBalance: holding.cdsTotalBalance,
        symbolName: holding.symbolName,
      };
    });

    return holdings;
  } catch (error) {
    throw Error(`Error in getDPHoldings: ${error}`);
  }
};

const getStockQuote: (symbol: string) => Promise<any> = async (symbol) => {
  try {
    const security = securities.find((security) => security.symbol === symbol);
    if (!security) throw Error(`Security ${symbol} not found.`);

    const tmsAuth = await getTmsAuth();
    if (tmsAuth === null) throw new Error('No TMS Auth credentials found.');

    const { data } = await axios.get(
      `${process.env.TMS_URL}/tmsapi/rtApi/ws/stockQuote/${security.exchangeSecurityId}`,
      {
        headers: {
          Cookie: `_rid=${tmsAuth._rid}; _aid=${tmsAuth._aid}; XSRF-TOKEN=${tmsAuth.xsrfToken}`,
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)',
          Referer: `${process.env.TMS_URL}/tms/member/search/client-search/${tmsAuth.clientId}`,
          Host: process.env.TMS_URL?.split('//')[1],
          'X-Xsrf-Token': tmsAuth.xsrfToken,
          'Host-Session-Id':
            'TVRJPS1lMDEzMzFhNi04OGRhLTRiMDEtOTk5Zi03YzE3M2Q1MzhkNGY=',
          'Request-Owner': tmsAuth.userId,
        },
      }
    );

    console.log(data.payload.data);
  } catch (error) {
    throw Error(`Error in getStockQuote: ${error}`);
  }
};

export {
  getClientCollateralDetails,
  refreshTmsAuth,
  getDailyOrderBook,
  isOrderEngineOpen,
  seedSecurities,
  getDPHoldings,
  getStockQuote,
};
