import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

/** Anything thrown or passed to next(): Errors and `{ status, message }` objects alike. */
type HttpError = { status?: number; message?: string; stack?: string };

export const errorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  logger.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
  );

  const status = err.status || 500;
  const isDev = process.env.NODE_ENV === 'development';
  // 5xx messages can expose internals (e.g. Prisma query errors); only
  // intentional 4xx messages are safe to show clients outside development.
  const message =
    status >= 500 && !isDev ? 'Internal Server Error' : err.message || 'Internal Server Error';

  res.status(status).json({
    status: 'error',
    statusCode: status,
    message: message,
    ...(isDev && { stack: err.stack }),
  });
};
