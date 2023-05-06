import express from 'express';
const router = express.Router();
import { validateRequest } from '../common/middlewares/validateRequest';

import { createalertSchema } from './alert.schema';
import { createnewalert } from './alert.controller';

router.post('/', createalertSchema, validateRequest, createnewalert);

export default router;