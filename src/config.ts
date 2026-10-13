import dotenv from 'dotenv';
dotenv.config();

/**
 * Reads a required, security-sensitive env var and throws a clear startup
 * error if it is missing — in every environment, not just production. This
 * repo is a template that gets copied, so it must fail loud rather than
 * silently falling back to a well-known default secret.
 */
function requireSecret(value: string | undefined, names: string): string {
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${names}. Set it in your .env file ` +
        `(see .env.example) — there is no default fallback for this value because ` +
        `it is security-sensitive (used to sign session cookies).`,
    );
  }
  return value;
}

export const PORT = process.env.PORT || 4009;
export const NODE_ENV = process.env.NODE_ENV || 'development';

// Better Auth signs session cookies with this secret.
export const BETTER_AUTH_SECRET = requireSecret(
  process.env.BETTER_AUTH_SECRET,
  'BETTER_AUTH_SECRET',
);
export const BETTER_AUTH_URL = process.env.BETTER_AUTH_URL || `http://localhost:${PORT}`;

export const DATABASE_URL = process.env.DATABASE_URL;

// Redis
export const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
export const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379');
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD || undefined;
export const REDIS_TTL_SECONDS = parseInt(process.env.REDIS_TTL_SECONDS || '3600');
export const REDIS_TLS = process.env.REDIS_TLS === 'true';

// RabbitMQ & Worker
export const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
export const WORKER_HEALTH_PORT = parseInt(process.env.WORKER_HEALTH_PORT || '8080');

// Service-to-Service API Keys ("clientName:key,client2:key2")
export const API_KEYS: ReadonlyMap<string, string> = new Map(
  (process.env.API_KEYS || '')
    .split(',')
    .map((pair) => pair.trim())
    .filter(Boolean)
    .map((pair) => {
      const [name, key] = pair.split(':');
      return [key, name] as [string, string];
    }),
);

// CORS
export const CORS_ORIGINS = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Sentry Error Tracking
export const SENTRY_DSN = process.env.SENTRY_DSN || '';

// AWS S3 / Cloudflare R2 File Storage
export const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || '';
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || '';
export const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || '';
export const S3_CDN_URL = process.env.S3_CDN_URL || '';

// SMTP / Nodemailer Email Service
export const MAILER_EMAIL = process.env.MAILER_EMAIL || process.env.SMTP_USER || '';
export const MAILER_PASSWORD = process.env.MAILER_PASSWORD || process.env.SMTP_PASS || '';
export const MAILER_FROM_NAME = process.env.MAILER_FROM_NAME || 'System';
export const MAILER_TRANSPORT_HOST =
  process.env.MAILER_TRANSPORT_HOST || process.env.SMTP_HOST || 'smtp.gmail.com';
export const MAILER_TRANSPORT_PORT = parseInt(
  process.env.MAILER_TRANSPORT_PORT || process.env.SMTP_PORT || '587',
);
export const MAILER_TRANSPORT_SECURE = process.env.MAILER_TRANSPORT_SECURE === 'true';

// Backward-compatible SMTP aliases
export const SMTP_HOST = MAILER_TRANSPORT_HOST;
export const SMTP_PORT = MAILER_TRANSPORT_PORT;
export const SMTP_USER = MAILER_EMAIL;
export const SMTP_PASS = MAILER_PASSWORD;

export const isDev = NODE_ENV === 'development';
export const isProd = NODE_ENV === 'production';
