import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '../utils/prisma';
import { COOKIE_SECRET, CORS_ORIGINS, PORT } from '../config';
import { hashPassword, verifyPassword } from '../utils/password.util';

const secret =
  process.env.BETTER_AUTH_SECRET ||
  COOKIE_SECRET ||
  'dev-only-secret-key-must-be-at-least-32-chars-long';

const baseURL =
  process.env.BETTER_AUTH_URL ||
  `http://localhost:${PORT || 3002}`;

const defaultTrusted = [
  'http://localhost:3000',
  'http://localhost:4200',
  'http://localhost:5173',
  'http://localhost:8080',
];

const trustedOrigins = Array.from(
  new Set([
    ...defaultTrusted,
    ...(CORS_ORIGINS || []),
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
  ]),
);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  secret,
  baseURL,
  trustedOrigins,
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
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'USER',
      },
      tenantId: {
        type: 'string',
        required: false,
      },
      isActive: {
        type: 'boolean',
        required: false,
        defaultValue: true,
      },
      username: {
        type: 'string',
        required: false,
      },
      isDeleted: {
        type: 'boolean',
        required: false,
        defaultValue: false,
      },
      onboardingCompleted: {
        type: 'boolean',
        required: false,
        defaultValue: false,
      },
    },
  },
});

export type Auth = typeof auth;
