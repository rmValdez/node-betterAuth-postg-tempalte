import express from 'express';
import AuthController from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

/**
 * Sign-up, sign-in, sign-out and session handling live in Better Auth under
 * /api/auth/* (see src/auth/better-auth.ts). This router only adds app-level
 * profile data on top of the Better Auth session.
 */
const router = express.Router();

router.get('/me', authenticate, AuthController.me);

export default router;
