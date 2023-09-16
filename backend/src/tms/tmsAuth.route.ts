import express from 'express';
const router = express.Router();

import { validateRequest } from '../common/middlewares/validateRequest';
import { tmsAuthSchema } from './tmsAuth.schema';
import { get, update } from './tmsAuth.controller';

router.get('/', get);
router.patch('/', tmsAuthSchema, validateRequest, update);

export default router;
