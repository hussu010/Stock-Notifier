import { NextFunction, Request, Response } from 'express';

import { getTmsAuth, updateTmsAuth } from './tms.service';
import { ITmsAuth } from './tms.interface';

const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tmsAuth = await getTmsAuth();
    res.status(200).json(tmsAuth);
  } catch (error) {
    next(error);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authBody: ITmsAuth = req.body;
    const { xsrfToken, _aid, _rid, clientId, userId, userName } = authBody;
    const tmsAuth = await updateTmsAuth({
      xsrfToken,
      _aid,
      _rid,
      clientId,
      userId,
      userName,
    });
    res.status(200).json(tmsAuth);
  } catch (error) {
    next(error);
  }
};

export { get, update };
