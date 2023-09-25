import express from 'express';
const router = express.Router();

import { validateRequest } from '../common/middlewares/validateRequest';
import { tmsAuthSchema } from './tms.schema';
import { get, update } from './tms.controller';

router.get('/', get);
router.patch('/', tmsAuthSchema, validateRequest, update);

export default router;
