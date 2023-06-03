import mongoose from 'mongoose';
import { body, param } from 'express-validator';
import { binarySearchStockArray } from '../common/utils/stock';
import { stockSymbolData } from '../common/config/constants';
import { errorMessages } from '../common/config/messages';

const createalertSchema = [
  body('symbol').custom((value, { req }) => {
    const { id, name } = binarySearchStockArray(stockSymbolData, value);
    if (id === 0) {
      throw new Error('Invalid stock symbol');
    }

    req.body.title = name;

    return true;
  }),
  body('price')
    .isNumeric()
    .custom((value, { req }) => {
      if (value > req.body.target) {
        throw new Error(
          'The price should be greater than 0 and less than or equal to target value'
        );
      }
      return true;
    }),
  body('target')
    .isNumeric()
    .custom((value, { req }) => {
      if (value < req.body.price) {
        throw new Error('The target value should be greater than price.');
      }
      return true;
    }),
  body('expiresAt').custom((value, { req }) => {
    if (value <= 0 || value > 365) {
      throw new Error('The expire time should be between 1 to 365 days');
    }

    return true;
  }),
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
  body('price')
    .isNumeric()
    .custom((value, { req }) => {
      if (value > req.body.target) {
        throw new Error(
          'The price should be greater than 0 and less than or equal to target value'
        );
      }
      return true;
    }),
  body('target')
    .isNumeric()
    .custom((value, { req }) => {
      if (value < req.body.price) {
        throw new Error('The target value should be greater than price.');
      }
      return true;
    }),
  body('expiresAt').custom((value, { req }) => {
    //Regex to check date format
    var date_regex = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
    if (!date_regex.test(value)) {
      throw new Error('The expire date format is not matched "YYYY-MM-DD".');
    }
    // if (value <= 0 || value > 365) {
    //   throw new Error('The expire time should be between 1 to 365 days');
    // }

    return true;
  }),
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
