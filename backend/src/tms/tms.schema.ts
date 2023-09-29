import { body } from 'express-validator';

const tmsAuthSchema = [
  body('_rid').isString(),
  body('_aid').isString(),
  body('xsrfToken').isString(),
  body('clientId').isString(),
  body('userId').isString(),
  body('userName').isString(),
];

export { tmsAuthSchema };
