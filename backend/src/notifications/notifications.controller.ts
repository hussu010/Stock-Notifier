import { NextFunction, Request, Response } from 'express';

import Notification from './notifications.model';
import { errorMessages } from '../common/config/messages';
import { createNotification } from './notifications.service';

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notifications = await Notification.find({}).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { symbol, price, type, stockId, title } = req.body;
    const notification = await createNotification(
      stockId,
      symbol,
      title,
      price,
      type
    );
    res.status(201).json(notification);
  } catch (error) {
    next(error);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { price, type } = req.body;
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      throw new Error(errorMessages.OBJECT_WITH_ID_NOT_FOUND);
    }

    notification.price = price;
    notification.type = type;
    await notification.save();

    res.status(200).json(notification);
  } catch (error: any) {
    if (error.message === errorMessages.OBJECT_WITH_ID_NOT_FOUND) {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export { getAll, create, update, remove };
