import express from 'express';
import UserController from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = express.Router();

router.get('/me', authenticate, UserController.getMe);
router.get('/', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), UserController.index);

export default router;
