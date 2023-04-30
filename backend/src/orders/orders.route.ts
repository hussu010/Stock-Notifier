import express from 'express';
const router = express.Router();

import { validateRequest } from '../common/middlewares/validateRequest';
import {
  createOrderSchema,
  updateOrderSchema,
  deleteOrderSchema,
} from './orders.schema';
import { getAll, create, update, remove } from './orders.controller';

router.get('/', getAll);
router.post('/', createOrderSchema, validateRequest, create);
router.patch('/:id', updateOrderSchema, validateRequest, update);
router.delete('/:id', deleteOrderSchema, validateRequest, remove);

export default router;
