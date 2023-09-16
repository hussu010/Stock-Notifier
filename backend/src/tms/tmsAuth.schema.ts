import { body } from 'express-validator';

const tmsAuthSchema = [
  body('_rid').isString(),
  body('_aid').isString(),
  body('xsrfToken').isString(),
];

export { tmsAuthSchema };
