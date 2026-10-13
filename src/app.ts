import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import router from './routes';
import { isDev } from './config';
import { corsMiddleware } from './middleware/cors.middleware';
import { errorHandler } from './middleware/error.middleware';
import { correlationMiddleware } from './middleware/correlation.middleware';
import { setupSwagger } from './swagger';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth/better-auth';

const app = express();

app.set('trust proxy', 1);

app.use(correlationMiddleware);
app.use(corsMiddleware);
app.options('*', corsMiddleware);

// Better Auth endpoint (handles /api/auth/sign-in, sign-up, session, etc.)
app.all(['/api/auth', '/api/auth/*'], toNodeHandler(auth));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

if (!isDev) app.use(limiter);

// Set up security headers
app.use(helmet());
app.disable('x-powered-by');

// Setup Swagger API Documentation
setupSwagger(app);

// Use router for routing
app.use('/api', router);

// Error Handling
app.use(errorHandler);

export default app;
