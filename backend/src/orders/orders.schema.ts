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
  body('entry')
    .isNumeric()
    .custom((value, { req }) => {
      if (value > req.body.target || value < req.body.stopLoss) {
        throw new Error('Entry price must be between target and stop loss');
      }
      return true;
    }),
  body('target')
    .isNumeric()
    .custom((value, { req }) => {
      if (value < req.body.entry || value < req.body.stopLoss) {
        throw new Error(
          'Target price must be greater than entry and stop loss'
        );
      }
      return true;
    }),
  body('stopLoss')
    .isNumeric()
    .custom((value, { req }) => {
      if (value > req.body.entry || value > req.body.target) {
        throw new Error('Stop loss price must be less than entry and target');
      }
      return true;
    }),
];

const updateOrderSchema = [
  body('entry')
    .isNumeric()
    .custom((value, { req }) => {
      if (value > req.body.target || value < req.body.stopLoss) {
        throw new Error('Entry price must be between target and stop loss');
      }
      return true;
    }),
  body('target')
    .isNumeric()
    .custom((value, { req }) => {
      if (value < req.body.entry || value < req.body.stopLoss) {
        throw new Error(
          'Target price must be greater than entry and stop loss'
        );
      }
      return true;
    }),
  body('stopLoss')
    .isNumeric()
    .custom((value, { req }) => {
      if (value > req.body.entry || value > req.body.target) {
        throw new Error('Stop loss price must be less than entry and target');
      }
      return true;
    }),
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
