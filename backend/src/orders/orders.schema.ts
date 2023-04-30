import mongoose from 'mongoose';
import { body, param } from 'express-validator';
import { OrderStatusEnum } from './orders.interface';
import { stockSymbolData } from '../common/config/constants';
import { binarySearchStockArray } from '../common/utils/stock';
import { errorMessages } from '../common/config/messages';

const createOrderSchema = [
  body('symbol').custom((value, { req }) => {
    const { id, name } = binarySearchStockArray(stockSymbolData, value);
    if (id === 0) {
      throw new Error('Invalid stock symbol');
    }

    req.body.title = name;

    return true;
  }),
  body('entry').isNumeric(),
  body('target').isNumeric(),
  body('stopLoss').isNumeric(),
];

const updateOrderSchema = [
  body('entry').isNumeric(),
  body('target').isNumeric(),
  body('stopLoss').isNumeric(),
  body('exit').isNumeric(),
  body('status')
    .isIn(OrderStatusEnum)
    .withMessage(
      `Invalid type. Valid values are: ${OrderStatusEnum.join(', ')}`
    ),
  param('id', errorMessages.INVALID_OBJECT_ID).custom((value) => {
    return mongoose.Types.ObjectId.isValid(value);
  }),
];

const deleteOrderSchema = [
  param('id', errorMessages.INVALID_OBJECT_ID).custom((value) => {
    return mongoose.Types.ObjectId.isValid(value);
  }),
];

export { createOrderSchema, updateOrderSchema, deleteOrderSchema };
