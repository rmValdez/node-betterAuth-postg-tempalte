import express from 'express';
import { liveness, readiness } from '../controllers/health.controller';

const healthRouter = express.Router();

/**
 * @swagger
 * /health/live:
 *   get:
 *     summary: Liveness check — is the process alive?
 *     tags: [Health]
 *     security: []
 *     responses:
 *       200:
 *         description: Process is alive
 */
healthRouter.get('/live', liveness);

/**
 * @swagger
 * /health/ready:
 *   get:
 *     summary: Readiness check — are all dependencies (DB, Redis, RabbitMQ) up?
 *     tags: [Health]
 *     security: []
 *     responses:
 *       200:
 *         description: All dependencies are up
 *       503:
 *         description: One or more dependencies are down
 */
healthRouter.get('/ready', readiness);

export default healthRouter;
