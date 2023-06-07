import { NextFunction, Request, Response } from 'express';

import Alert from './alerts.model';
import { createAlert } from './alerts.service';
import { errorMessages } from '../common/config/messages';

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { symbol, title, target, type, notes, expiresAt } = req.body;

    const alert = await createAlert(
      symbol,
      title,
      target,
      type,
      notes,
      expiresAt
    );

    res.status(201).json(alert);
  } catch (error) {
    next(error);
  }
};

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const alerts = await Alert.find();
    res.status(200).json(alerts);
  } catch (error) {
    next(error);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { symbol, title, notes, expiresAt } = req.body;

    const update = await Alert.findById(req.params.id);
    if (!update) {
      throw new Error(errorMessages.OBJECT_WITH_ID_NOT_FOUND);
    }

    update.symbol = symbol;
    update.title = title;
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

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) {
      throw new Error(errorMessages.OBJECT_WITH_ID_NOT_FOUND);
    }

    await alert.deleteOne();

    res.status(200).json({ message: 'Alert deleted successfully' });
  } catch (error: any) {
    if (error.message === errorMessages.OBJECT_WITH_ID_NOT_FOUND) {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

export { create, getAll, update, remove };
