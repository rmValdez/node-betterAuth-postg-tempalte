import cors from 'cors';
import logger from '../utils/logger';

/**
 * Shared CORS Allowlist module for HTTP and Socket.IO
 * Extracted and production-hardened from mapanytime-api architecture.
 */

export const ORIGIN_SHAPE = /^https?:\/\/[^/]+$/;

/**
 * ============================================================================
 * DEFAULT ALLOWED ORIGINS (Ecosystem Mapping & Architectural Rationale)
 * ============================================================================
 *
 * 1. WHY ARE THERE DIFFERENT PORTS?
 *    In modern fullstack architectures, different frontend frameworks default to
 *    their own local dev server ports:
 *    - Port 4200 -> Angular Dev Server (Angular CLI default)
 *    - Port 3000 -> Next.js / Nuxt 3 Dev Server (Node/Nitro default)
 *    - Port 5173 -> Vue 3 / React Vite Server (Vite default)
 *    - Port 8080 -> Secondary Client / Mobile Emulator / Micro-frontend Preview
 *
 *    Additionally, real-world systems often have MULTIPLE DISTINCT FRONTENDS
 *    talking to the SAME backend simultaneously:
 *    Example from `mapanytime`:
 *      - Customer Web App: running on http://localhost:5173
 *      - Admin / Merchant Portal: running on http://localhost:4200 (or 3000)
 *      - Mobile / Hybrid Shell: running on http://localhost:8080
 *
 * 2. WHAT IF WE USE A SINGLE FRONTEND ONLY?
 *    - If your project only uses ONE frontend (for example, Angular 19 only),
 *      you simply set `CORS_ORIGIN=http://localhost:4200` in your `.env` file!
 *    - In production, you will set `CORS_ORIGIN=https://app.yourdomain.com`.
 *    - The `DEFAULT_ORIGINS` array below is provided as a starter convenience
 *      so that any frontend in this workspace can connect immediately in local dev
 *      without requiring manual `.env` tweaks.
 *
 * 3. WHY A UNIFIED ALLOWLIST FOR BOTH HTTP & SOCKET.IO?
 *    - Modeled after `mapanytime-api`: Having both HTTP and WebSockets share
 *      the exact same origin allowlist prevents "split-brain" CORS bugs (where
 *      REST API login works, but realtime WebSocket connections fail with 403).
 *    - Strict Spec Compliance: Modern browsers disallow wildcard `origin: "*"`
 *      when `credentials: true` is enabled. Explicit origin matching prevents
 *      browser CORS blocking.
 * ============================================================================
 */
const DEFAULT_ORIGINS = [
  'http://localhost:4200', // Angular 19 Client (angular-template-v4)
  'http://localhost:3000', // Next.js / Nuxt 3 Client (next-template-v1 / nuxt-template-v2)
  'http://localhost:5173', // Vue 3 / Vite Client (vue-template-v3 / mapanytime-market-web)
  'http://localhost:8080', // Secondary frontend / Mobile dev preview
  'http://localhost:8085', // Flutter Web Client (flutter_template_v1)
  'http://127.0.0.1:8085', // Flutter Web Client (127.0.0.1)
];

/**
 * Splits CORS_ORIGIN into array of trimmed origins with trailing slashes removed
 */
export function parseAllowedOrigins(raw: string | undefined = process.env.CORS_ORIGIN): string[] {
  if (!raw || raw.trim() === '') {
    return DEFAULT_ORIGINS;
  }
  return raw
    .split(',')
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean);
}

export const allowedOrigins = parseAllowedOrigins();

/**
 * Validates whether an origin is permitted by the allowlist
 */
export function isOriginAllowed(
  origin: string | undefined,
  allowed: string[] = allowedOrigins,
): boolean {
  // Allow curl, Postman, mobile apps, or same-origin server-to-server requests without Origin header
  if (!origin) return true;
  if (process.env.NODE_ENV === 'development') return true;
  if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) return true;
  return allowed.includes(origin);
}

/**
 * Returns a typed 403 error for unallowed CORS origins
 */
export function rejectOrigin(origin: string): Error & { status: number } {
  logger.warn(`[CORS] Rejected origin: ${origin} — Allowed: ${allowedOrigins.join(', ')}`);
  return Object.assign(new Error(`Origin not allowed by CORS: ${origin}`), { status: 403 });
}

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (isOriginAllowed(origin, allowedOrigins)) {
      return callback(null, true);
    }
    return callback(rejectOrigin(origin as string));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'x-tenant-id',
    'X-Tenant-Id',
    'x-tenant-slug',
    'X-Tenant-Slug',
    'x-session-id',
    'X-Session-Id',
    'x-correlation-id',
    'X-Correlation-Id',
  ],
});
