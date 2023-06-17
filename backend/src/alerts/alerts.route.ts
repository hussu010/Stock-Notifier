import express from 'express';
const router = express.Router();
import { validateRequest } from '../common/middlewares/validateRequest';

import {
  createalertSchema,
  deletealertSchema,
  updatealertSchema,
} from './alerts.schema';
import { getAll, create, update, remove } from './alerts.controller';

router.get('/', getAll);
router.post('/', createalertSchema, validateRequest, create);
router.patch('/:id', updatealertSchema, validateRequest, update);
router.delete('/:id', deletealertSchema, validateRequest, remove);
export default router;
