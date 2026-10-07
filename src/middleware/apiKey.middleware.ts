import { Request, Response, NextFunction } from 'express';
import { API_KEYS } from '../config';
import { responseError } from '../helpers/response.helper';

declare global {
   
  namespace Express {
    interface Request {
      /** Name of the calling service, resolved from its X-API-Key. */
      apiClient?: string;
    }
  }
}

/**
 * Authenticates server-to-server requests via the `x-api-key` header.
 *
 * Unlike `authenticate` (user JWTs), this identifies *which backend* is
 * calling — not which user — so partner integrations can be issued, tracked,
 * and revoked independently of any user session.
 */
export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  const key = req.headers['x-api-key'];

  if (!key || typeof key !== 'string') {
    return responseError(res, 401, 'Missing x-api-key header');
  }

  const clientName = API_KEYS.get(key);
  if (!clientName) {
    return responseError(res, 401, 'Invalid API key');
  }

  req.apiClient = clientName;
  next();
};
