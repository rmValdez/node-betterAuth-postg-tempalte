import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { bearer } from 'better-auth/plugins';
import { prisma } from '../utils/prisma';
import { BETTER_AUTH_SECRET, BETTER_AUTH_URL, CORS_ORIGINS, isDev } from '../config';
import { hashPassword, verifyPassword } from '../utils/password.util';

const defaultTrusted = [
  'http://localhost:4010', // next-betterAuth-template-v1 (paired frontend)
  'http://localhost:3000',
  'http://localhost:4200',
  'http://localhost:5173',
  'http://localhost:8080',
];

// Local dev servers are only trusted in development; production must list
// its real frontend origins in CORS_ORIGIN / FRONTEND_URL.
const trustedOrigins = Array.from(
  new Set([
    ...(isDev ? defaultTrusted : []),
    ...(CORS_ORIGINS || []),
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
  ]),
);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  secret: BETTER_AUTH_SECRET,
  baseURL: BETTER_AUTH_URL,
  trustedOrigins,
  // Accept `Authorization: Bearer <session token>` (mobile apps, Postman, Swagger)
  // in addition to the session cookie browsers send.
  plugins: [bearer()],
  // /api/auth/* is mounted before the Express rate limiters in app.ts, so it
  // relies on Better Auth's own limiter (off outside production by default).
  // Credential endpoints match the legacy authLimiter: 10 attempts / 15 min / IP.
  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
    customRules: {
      '/sign-in/email': { window: 15 * 60, max: 10 },
      '/sign-up/email': { window: 15 * 60, max: 10 },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    password: {
      hash: async (password: string) => hashPassword(password),
      verify: async ({ password, hash }: { password: string; hash: string }) =>
        verifyPassword(password, hash),
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  user: {
    // `input: false` stops clients from setting a field via sign-up or
    // update-user (Better Auth accepts every additional field by default).
    // Anything that grants privileges or controls account state must be
    // server-managed only.
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'USER',
        input: false,
      },
      isActive: {
        type: 'boolean',
        required: false,
        defaultValue: true,
        input: false,
      },
      username: {
        type: 'string',
        required: false,
      },
      isDeleted: {
        type: 'boolean',
        required: false,
        defaultValue: false,
        input: false,
      },
      onboardingCompleted: {
        type: 'boolean',
        required: false,
        defaultValue: false,
        input: false,
      },
    },
  },
});

export type Auth = typeof auth;
