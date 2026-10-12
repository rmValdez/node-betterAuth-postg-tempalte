import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../auth/better-auth';
import AuthRepo from '../repositories/auth.repository';
import { ACCESS_TOKEN_SECRET } from '../config';
import { COOKIE_NAMES } from '../constants/cookie.constant';

declare global {
  namespace Express {
    interface Request {
      user?: any;
      session?: any;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Try resolving session via Better Auth (cookies or Authorization: Bearer <session_token>)
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (session && session.user) {
      if ((session.user as any).isDeleted || session.user.isActive === false) {
        return res.status(403).json({ message: 'Forbidden: Account has been deactivated' });
      }
      req.user = session.user;
      req.session = session.session;
      return next();
    }
  } catch (_sessionErr) {
    // Better Auth session lookup error, fallback to legacy token check
  }

  // 2. Legacy fallback: Check for custom JWT token in cookies or Bearer header
  const cookieToken =
    req.cookies?.[COOKIE_NAMES.ACCESS_TOKEN] ||
    req.cookies?.access_token ||
    req.signedCookies?.[COOKIE_NAMES.ACCESS_TOKEN] ||
    req.signedCookies?.access_token;
  const headerToken = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7).trim()
    : req.headers.authorization?.split(' ')[1];

  const token = cookieToken || headerToken;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as {
      userId: string;
    };
    const user = await AuthRepo.findUserById(decoded.userId);
    if (!user || (user as any).isDeleted) {
      return res.status(404).json({ message: 'User not found' });
    }
    req.user = user;
    return next();
  } catch (_error: any) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const requireAuth = authenticate;

