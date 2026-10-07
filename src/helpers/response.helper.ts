import { Response } from 'express';

/**
 * ============================================================================
 * TYPED API RESPONSE HELPERS (Standardized from mapanytime-api)
 * ============================================================================
 *
 * Usage:
 *   responseSuccess(res, 200, user, "Profile fetched");
 *   responseSuccess(res, 201, newUser, "User registered successfully");
 *   responseSuccess(res, 200, buildPage(items, total, params));
 *
 *   responseError(res, 400, "Invalid input credentials");
 *   responseError(res, 404, "Resource not found");
 *   responseError(res, 409, "Email is already taken", { code: "EMAIL_CONFLICT" });
 */

export type SuccessStatus = 200 | 201 | 202 | 204;
export type ErrorStatus = 400 | 401 | 403 | 404 | 409 | 422 | 429 | 500;

export type ApiResponse<T> = {
  status: 'success';
  statusCode: SuccessStatus;
  data: T;
  message?: string;
};

export type ApiError = {
  status: 'error';
  statusCode: ErrorStatus;
  message: string;
  code?: string;
  details?: unknown;
};

export function responseSuccess<T>(
  res: Response,
  statusCode: SuccessStatus,
  data: T,
  message?: string,
) {
  const body: ApiResponse<T> = {
    status: 'success',
    statusCode,
    data,
    ...(message && { message }),
  };
  return res.status(statusCode).json(body);
}

export function responseError(
  res: Response,
  statusCode: ErrorStatus,
  message: string,
  extra?: { code?: string; details?: unknown },
) {
  const body: ApiError = {
    status: 'error',
    statusCode,
    message,
    ...(extra || {}),
  };
  return res.status(statusCode).json(body);
}
