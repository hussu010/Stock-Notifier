import mongoose from 'mongoose';
import { body, param } from 'express-validator';
import { binarySearchStockArray } from '../common/utils/stock';
import { stockSymbolData } from '../common/config/constants';
import { errorMessages } from '../common/config/messages';
import { AlertTypeEnum } from './alerts.interface';

const createalertSchema = [
  body('symbol').custom((value, { req }) => {
    const { id, name } = binarySearchStockArray(stockSymbolData, value);

    if (id === 0) {
      throw new Error('Invalid stock symbol');
    }

    req.body.title = name;
    return true;
  }),
  body('target').isNumeric(),
  body('type')
    .isIn(AlertTypeEnum)
    .withMessage(
      `Invalid alert type. Valid values are: ${AlertTypeEnum.join(', ')}`
    ),
  body('expiresAt').isDate(),
];

const updatealertSchema = [
  body('symbol').custom((value, { req }) => {
    const { id, name } = binarySearchStockArray(stockSymbolData, value);
    if (id === 0) {
      throw new Error('Invalid stock symbol');
    }

    req.body.title = name;

    return true;
  }),
  body('target').isNumeric(),
  body('type')
    .isIn(AlertTypeEnum)
    .withMessage(
      `Invalid alert type. Valid values are: ${AlertTypeEnum.join(', ')}`
    ),
  body('expiresAt').isDate(),
  param('id', errorMessages.INVALID_OBJECT_ID).custom((value) => {
    return mongoose.Types.ObjectId.isValid(value);
  }),
];

const deletealertSchema = [
  param('id', errorMessages.INVALID_OBJECT_ID).custom((value) => {
    return mongoose.Types.ObjectId.isValid(value);
  }),
];

export { createalertSchema, updatealertSchema, deletealertSchema };
