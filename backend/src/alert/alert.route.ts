import express from 'express';
const router = express.Router();
import { validateRequest } from '../common/middlewares/validateRequest';

import { createalertSchema } from './alert.schema';
import { create, update } from './alert.controller';
import { updateOrderSchema } from '../orders/orders.schema';

router.post('/', createalertSchema, validateRequest, create);
router.patch('/update/:id', updateOrderSchema, validateRequest, update);
export default router;
