import http from 'http';
import dotenv from 'dotenv';
import app from './app';
import logger from './utils/logger';
import { PORT, NODE_ENV } from './config';
import { initSocket } from './infrastructure/socket';

dotenv.config();

const server = http.createServer(app);

// Initialize Socket.IO gateway
initSocket(server);

server.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT} in ${NODE_ENV} mode`);
});
