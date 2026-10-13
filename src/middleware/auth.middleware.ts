import { Request, Response, NextFunction } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../auth/better-auth';

/** Session returned by Better Auth, including our `additionalFields` (role, isActive, ...). */
type AuthSession = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;

declare global {
  namespace Express {
    interface Request {
      user?: AuthSession['user'];
      session?: AuthSession['session'];
    }
  }
}

/**
 * Resolves the Better Auth session from the session cookie or an
 * `Authorization: Bearer <session token>` header (bearer plugin).
 */
async function resolveSession(req: Request) {
  try {
    return await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
  } catch (_sessionErr) {
    return null;
  }
}

function isDisabled(user: { isActive?: boolean | null; isDeleted?: boolean | null }): boolean {
  return Boolean(user.isDeleted) || user.isActive === false;
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const session = await resolveSession(req);

  if (!session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  if (isDisabled(session.user)) {
    return res.status(403).json({ message: 'Forbidden: Account has been deactivated' });
  }

  req.user = session.user;
  req.session = session.session;
  return next();
};

export const requireAuth = authenticate;

/**
 * Attaches `req.user` when a valid Better Auth session exists, but never
 * rejects the request. For routes that serve both guests and signed-in users.
 */
export const optionalAuth = async (req: Request, _res: Response, next: NextFunction) => {
  const session = await resolveSession(req);
  if (session?.user && !isDisabled(session.user)) {
    req.user = session.user;
    req.session = session.session;
  }
  next();
};
