import { NextFunction, Request, Response } from 'express';

import Alert from './alerts.model';
import { createAlert } from './alerts.service';
import { errorMessages, successMessages } from '../common/config/messages';

// create alert
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

// get all alerts
const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const alerts = await Alert.find();
    res.status(200).json(alerts);
  } catch (error) {
    next(error);
  }
};

// update alert by id
const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { symbol, title, target, type, notes, expiresAt } = req.body;

    const alert = await Alert.findById(req.params.id);
    if (!alert) {
      throw new Error(errorMessages.OBJECT_WITH_ID_NOT_FOUND);
    }

    alert.symbol = symbol;
    alert.title = title;
    alert.target = target;
    alert.type = type;
    alert.notes = notes;
    alert.expiresAt = expiresAt;
    await alert.save();

    res.status(200).json(alert);
  } catch (error: any) {
    if (error.message === errorMessages.OBJECT_WITH_ID_NOT_FOUND) {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

// Delete alert by id
const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) {
      throw new Error(errorMessages.OBJECT_WITH_ID_NOT_FOUND);
    }

    await alert.deleteOne();

    res
      .status(200)
      .json({ message: successMessages.ALERT_DELETE_SUCCESSFULLY });
  } catch (error: any) {
    if (error.message === errorMessages.OBJECT_WITH_ID_NOT_FOUND) {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

export { create, getAll, update, remove };
