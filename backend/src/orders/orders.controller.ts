import { NextFunction, Request, Response } from 'express';

import Order from './orders.model';
import { errorMessages } from '../common/config/messages';
import { createOrder } from './orders.service';

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await Order.find({ isDeleted: false, status: 'OPEN' }).sort({
      symbol: 1,
    });
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { symbol, title, entry, target, stopLoss, exit } = req.body;
    const order = await createOrder(
      symbol,
      title,
      entry,
      target,
      stopLoss,
      exit
    );
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { entry, target, stopLoss, exit, status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      throw new Error(errorMessages.OBJECT_WITH_ID_NOT_FOUND);
    }

    order.entry = entry;
    order.target = target;
    order.stopLoss = stopLoss;
    order.exit = exit;
    order.status = status;
    await order.save();

    res.status(200).json(order);
  } catch (error: any) {
    if (error.message === errorMessages.OBJECT_WITH_ID_NOT_FOUND) {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      throw new Error(errorMessages.OBJECT_WITH_ID_NOT_FOUND);
    }

    order.isDeleted = true;
    await order.save();

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error: any) {
    if (error.message === errorMessages.OBJECT_WITH_ID_NOT_FOUND) {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

export { getAll, create, update, remove };
