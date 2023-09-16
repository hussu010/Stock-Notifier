import { NextFunction, Request, Response } from 'express';

import TmsAuth from './tmsAuth.model';
import { getTmsAuth, updateTmsAuth } from './tmsAuth.service';
import { ITmsAuth } from './tmsAuth.interface';

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
    const { xsrfToken, _aid, _rid } = authBody;
    const tmsAuth = await updateTmsAuth({ xsrfToken, _aid, _rid });
    res.status(200).json(tmsAuth);
  } catch (error) {
    next(error);
  }
};

export { get, update };
