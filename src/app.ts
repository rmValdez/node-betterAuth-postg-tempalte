import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import router from './routes';
import { isDev, COOKIE_SECRET } from './config';
import setup from './setup';
import { corsMiddleware } from './middleware/cors.middleware';
import { tenantMiddleware } from './middleware/tenant.middleware';
import { errorHandler } from './middleware/error.middleware';
import { correlationMiddleware } from './middleware/correlation.middleware';
import { setupSwagger } from './swagger';

const app = express();

app.set('trust proxy', 1);

app.use(correlationMiddleware);
app.use(corsMiddleware);
app.options('*', corsMiddleware);
app.use(cookieParser(COOKIE_SECRET));
app.use(tenantMiddleware);

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

// Run setup
setup().catch((err) => {
  console.log('Setup failed:', err);
});

export default app;
