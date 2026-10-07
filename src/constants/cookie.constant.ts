import { CookieOptions } from 'express';
import { isProd, COOKIE_DOMAIN, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from '../config';

export const COOKIE_NAMES = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
} as const;

/**
 * Parses time strings like '15m', '1d', '7d' into milliseconds.
 */
export function parseDurationToMs(duration: string | number | undefined, defaultMs: number): number {
  if (typeof duration === 'number') return duration;
  if (!duration || typeof duration !== 'string') return defaultMs;
  const match = duration.trim().match(/^(\d+)([smhd])$/);
  if (!match) return defaultMs;
  const value = parseInt(match[1], 10);
  const unit = match[2];
  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };
  return value * (multipliers[unit] || defaultMs);
}

/**
 * Base cookie options for security:
 * - httpOnly: prevents client-side JS access (XSS mitigation)
 * - secure: true in production (HTTPS required)
 * - sameSite: 'none' for cross-domain in prod, 'lax' for local dev
 */
export const getBaseCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: isProd,
  sameSite: (process.env.COOKIE_SAME_SITE as 'lax' | 'strict' | 'none') || (isProd ? 'none' : 'lax'),
  domain: COOKIE_DOMAIN || undefined,
  path: '/',
});

export const getAccessTokenCookieOptions = (): CookieOptions => ({
  ...getBaseCookieOptions(),
  maxAge: parseDurationToMs(ACCESS_TOKEN_EXPIRY, 24 * 60 * 60 * 1000),
});

export const getRefreshTokenCookieOptions = (): CookieOptions => ({
  ...getBaseCookieOptions(),
  maxAge: parseDurationToMs(REFRESH_TOKEN_EXPIRY, 7 * 24 * 60 * 60 * 1000),
});

export const getClearCookieOptions = (): CookieOptions => ({
  ...getBaseCookieOptions(),
});
