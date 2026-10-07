import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { responseError } from '../helpers/response.helper';

/**
 * Restricts a route to specific `UserRole`s. Must run after `authenticate`
 * (needs `req.user` populated).
 *
 * Usage: router.get('/', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), Controller.index);
 */
export const requireRole = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.user?.role;
    if (!role) return responseError(res, 401, 'Unauthorized');

    if (!roles.includes(role)) {
      return responseError(res, 403, 'Forbidden: insufficient role');
    }

    next();
  };
};
