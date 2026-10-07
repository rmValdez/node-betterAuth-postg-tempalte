import express from 'express';
import rateLimit from 'express-rate-limit';
import AuthController from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Stricter, auth-specific rate limiter shared across /register and /login to
// slow down credential-stuffing / brute-force attempts. Unlike the global
// limiter in app.ts, this one is intentionally NOT disabled in dev/test
// environments — login attempts are security sensitive regardless of NODE_ENV.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 register/login attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts, please try again later.' },
});

router.post('/register', authLimiter, AuthController.register);
router.post('/login', authLimiter, AuthController.login);
router.post('/refresh', AuthController.refreshToken);
router.post('/refresh-token', AuthController.refreshToken);
// AuthController.me is the canonical "who am I" endpoint for the auth module
// (backed by AuthSvc.getCurrentUser -> AuthRepo). UserController.getMe is a
// separate, Redis-cached profile lookup mounted under /v1/users/me and is
// intentionally left as-is for that resource.
router.get('/me', authenticate, AuthController.me);
router.post('/logout', authenticate, AuthController.logout);

export default router;
