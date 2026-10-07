import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import AuthRepo from '../repositories/auth.repository';
import { ACCESS_TOKEN_SECRET } from '../config';
import { COOKIE_NAMES } from '../constants/cookie.constant';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
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
    next();
  } catch (_error: any) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
