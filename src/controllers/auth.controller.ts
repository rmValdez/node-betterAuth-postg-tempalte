import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import AuthSvc from '../services/auth.service';
import {
  COOKIE_NAMES,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  getClearCookieOptions,
} from '../constants/cookie.constant';

export default class AuthController {
  /**
   * Register a new user
   */
  static async register(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      username: Joi.string().required(),
      name: Joi.string().optional(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    try {
      const data = await AuthSvc.register(value);

      if (data.accessToken) {
        res.cookie(COOKIE_NAMES.ACCESS_TOKEN, data.accessToken, getAccessTokenCookieOptions());
      }
      if (data.refreshToken) {
        res.cookie(COOKIE_NAMES.REFRESH_TOKEN, data.refreshToken, getRefreshTokenCookieOptions());
      }

      return res.status(201).json({ message: 'User created successfully', data });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login with email/password
   */
  static async login(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    try {
      const data = await AuthSvc.login(value);

      if (data.accessToken) {
        res.cookie(COOKIE_NAMES.ACCESS_TOKEN, data.accessToken, getAccessTokenCookieOptions());
      }
      if (data.refreshToken) {
        res.cookie(COOKIE_NAMES.REFRESH_TOKEN, data.refreshToken, getRefreshTokenCookieOptions());
      }

      return res.json({ message: 'Login successful', data });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh access token
   */
  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    const incomingToken =
      req.body?.refreshToken ||
      req.cookies?.[COOKIE_NAMES.REFRESH_TOKEN] ||
      req.cookies?.refresh_token;

    if (!incomingToken || typeof incomingToken !== 'string') {
      return res.status(400).json({ message: '"refreshToken" is required' });
    }

    try {
      const data = await AuthSvc.refreshToken(incomingToken);

      if (data.accessToken) {
        res.cookie(COOKIE_NAMES.ACCESS_TOKEN, data.accessToken, getAccessTokenCookieOptions());
      }
      if ((data as any).refreshToken) {
        res.cookie(COOKIE_NAMES.REFRESH_TOKEN, (data as any).refreshToken, getRefreshTokenCookieOptions());
      }

      return res.json({ message: 'Token refreshed successfully', data });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current authenticated user profile
   */
  static async me(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      if (!userId)
        return res.status(401).json({ status: 'error', statusCode: 401, message: 'Unauthorized' });

      const user = (req as any).user?.email
        ? (req as any).user
        : await AuthSvc.getCurrentUser(userId);
      return res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: 'User profile retrieved',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout
   */
  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken =
        req.body?.refreshToken ||
        req.cookies?.[COOKIE_NAMES.REFRESH_TOKEN] ||
        req.cookies?.refresh_token;
      const userId = (req as any).user?.id;
      if (!userId)
        return res.status(401).json({ status: 'error', statusCode: 401, message: 'Unauthorized' });

      const result = await AuthSvc.logout(userId, refreshToken);

      res.clearCookie(COOKIE_NAMES.ACCESS_TOKEN, getClearCookieOptions());
      res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN, getClearCookieOptions());

      return res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
