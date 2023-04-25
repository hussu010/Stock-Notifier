import mongoose from 'mongoose';
import { body, param } from 'express-validator';
import { NotificationTypeEnum } from './notifications.interface';
import { stockSymbolData } from '../common/config/constants';
import { binarySearchStockArray } from './notifications.utils';
import { errorMessages } from '../common/config/messages';

const createNotificationSchema = [
  body('symbol').custom((value, { req }) => {
    const { id, name } = binarySearchStockArray(stockSymbolData, value);
    if (id === 0) {
      throw new Error('Invalid stock symbol');
    }

    req.body.stockId = id;
    req.body.title = name;

    return true;
  }),
  body('price').isNumeric(),
  body('type')
    .isIn(NotificationTypeEnum)
    .withMessage(
      `Invalid type. Valid values are: ${NotificationTypeEnum.join(', ')}`
    ),
];

const updateNotificationSchema = [
  body('price').isNumeric(),
  body('type')
    .isIn(NotificationTypeEnum)
    .withMessage(
      `Invalid type. Valid values are: ${NotificationTypeEnum.join(', ')}`
    ),
  param('id', errorMessages.INVALID_OBJECT_ID).custom((value) => {
    return mongoose.Types.ObjectId.isValid(value);
  }),
];

const deleteNotificationSchema = [
  param('id', errorMessages.INVALID_OBJECT_ID).custom((value) => {
    return mongoose.Types.ObjectId.isValid(value);
  }),
];

export {
  createNotificationSchema,
  updateNotificationSchema,
  deleteNotificationSchema,
};
