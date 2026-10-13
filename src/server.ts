import http from 'http';
import dotenv from 'dotenv';
import app from './app';
import setup from './setup';
import logger from './utils/logger';
import { PORT, NODE_ENV } from './config';
import { initSocket } from './infrastructure/socket';

dotenv.config();

// Connect Redis / verify mailer here rather than in app.ts, so importing the
// app (e.g. in tests) has no infrastructure side effects.
setup().catch((err) => {
  logger.error('Setup failed:', err);
});

const server = http.createServer(app);

// Initialize Socket.IO gateway
initSocket(server);

server.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT} in ${NODE_ENV} mode`);
});
