import * as Sentry from '@sentry/node';
import { SENTRY_DSN, NODE_ENV, isDev } from './config';

/**
 * Must be imported before anything else (express, routes, etc.) so Sentry's
 * auto-instrumentation can patch modules before they're required. Both
 * server.ts and worker.ts import this file as their very first line.
 *
 * No-op when SENTRY_DSN is unset — nothing is sent anywhere until configured.
 */
if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: NODE_ENV,
    tracesSampleRate: isDev ? 1.0 : 0.1,
  });
}

export { Sentry };
