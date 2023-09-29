import axios from 'axios';
const { v4: uuidv4 } = require('uuid');

import { getTmsAuth } from './tms.service';
import { ClientCollateralDetails } from './tms.interface';

const getClientCollateralDetails: () => Promise<ClientCollateralDetails> =
  async () => {
    try {
      const tmsAuth = await getTmsAuth();
      if (tmsAuth === null) throw new Error('No TMS Auth credentials found.');

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
      console.error(`Error in getClientCollateralDetails: ${error}`);
      throw error;
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
    console.error(`Error in refreshTmsAuth: ${error}`);
    throw error;
  }
};

export { getClientCollateralDetails, refreshTmsAuth };
