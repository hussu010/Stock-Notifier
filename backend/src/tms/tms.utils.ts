import axios from 'axios';
const { v4: uuidv4 } = require('uuid');

import { getTmsAuth } from './tms.service';
import { ClientCollateralDetails } from './tms.interface';

const getClientCollateralDetails: () => Promise<ClientCollateralDetails> =
  async () => {
    try {
      const tmsAuth = await getTmsAuth();

      const uuid = uuidv4();
      const base64EncodedHostSessionId = Buffer.from(`MIT=-${uuid}`).toString(
        'base64'
      );
      console.log(base64EncodedHostSessionId);

      const { data } = await axios.get(
        `${process.env.TMS_URL}/tmsapi/fundApi/net-settlement/client/${tmsAuth?.clientId}`,
        {
          headers: {
            Cookie: `_rid=${tmsAuth?._rid}; _aid=${tmsAuth?._aid}; XSRF-TOKEN=${tmsAuth?.xsrfToken}`,
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)',
            Referer: `${process.env.TMS_URL}/tms/member/search/client-search/${tmsAuth?.clientId}`,
            Host: process.env.TMS_URL?.split('//')[1],
            'X-Xsrf-Token': tmsAuth?.xsrfToken,
            'Host-Session-Id':
              'TVRJPS1lMDEzMzFhNi04OGRhLTRiMDEtOTk5Zi03YzE3M2Q1MzhkNGY=',
            'Request-Owner': tmsAuth?.userId,
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

export { getClientCollateralDetails };
