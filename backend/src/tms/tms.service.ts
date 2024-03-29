import TmsAuth from './tmsAuth.model';

import { ITmsAuth } from './tms.interface';

const getTmsAuth = async () => {
  try {
    const tmsAuth = await TmsAuth.findOne();
    return tmsAuth;
  } catch (error) {
    throw error;
  }
};

const updateTmsAuth = async (credentials: ITmsAuth) => {
  try {
    const tmsAuth = await TmsAuth.findOne();
    if (!tmsAuth) {
      const newTmsAuth = new TmsAuth({
        xsrfToken: credentials.xsrfToken,
        _aid: credentials._aid,
        _rid: credentials._rid,
        clientId: credentials.clientId,
        userId: credentials.userId,
        userName: credentials.userName,
      });
      return await newTmsAuth.save();
    }

    tmsAuth.xsrfToken = credentials.xsrfToken;
    tmsAuth._aid = credentials._aid;
    tmsAuth._rid = credentials._rid;
    tmsAuth.clientId = credentials.clientId;
    tmsAuth.userId = credentials.userId;
    tmsAuth.userName = credentials.userName;

    return await tmsAuth.save();
  } catch (error) {
    throw error;
  }
};

export { getTmsAuth, updateTmsAuth };
