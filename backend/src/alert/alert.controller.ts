import { NextFunction, Request, Response } from 'express';

import Alert from './alert.model';
import { createAlert } from './alert.service';
import { errorMessages } from '../common/config/messages';

const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { symbol, title, price, target, alertName, notes, expiresAt } =
      req.body;

    const alert = await createAlert(
      symbol,
      title,
      price,
      target,
      alertName,
      notes,
      expiresAt
    );

    res.status(201);
    res.json(alert);
  } catch (error) {
    next(error);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { symbol, title, price, alertName, notes, expiresAt } = req.body;

    const update = await Alert.findById(req.params.id);
    if (!update) {
      throw new Error(errorMessages.OBJECT_WITH_ID_NOT_FOUND);
    }

    update.symbol = symbol;
    update.title = title;
    update.price = price;
    update.alertName = alertName;
    update.notes = notes;
    update.expiresAt = expiresAt;
    await update.save();

    res.status(200).json(update);
  } catch (error: any) {
    if (error.message === errorMessages.OBJECT_WITH_ID_NOT_FOUND) {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

export { create, update };
