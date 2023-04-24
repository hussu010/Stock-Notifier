import express from 'express';
const router = express.Router();

import { validateRequest } from '../common/middlewares/validateRequest';
import {
  createNotificationSchema,
  updateNotificationSchema,
  deleteNotificationSchema,
} from './notifications.schema';
import { getAll, create, update, remove } from './notifications.controller';

router.get('/', getAll);
router.post('/', createNotificationSchema, validateRequest, create);
router.patch('/:id', updateNotificationSchema, validateRequest, update);
router.delete('/:id', deleteNotificationSchema, validateRequest, remove);

export default router;
