import { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger.config';
import logger from '../utils/logger';

/**
 * Mounts Swagger UI and OpenAPI JSON spec routes onto the Express app.
 *
 * Endpoints:
 * - GET /api/docs     -> Interactive Swagger UI documentation
 * - GET /api/docs.json -> Raw OpenAPI 3.0.0 JSON specification
 */
export function setupSwagger(app: Application): void {
  // Serve raw OpenAPI JSON specification
  app.get('/api/docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Serve interactive Swagger UI documentation
  app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: 'Integrated Node.js & PostgreSQL API Docs',
      customCss: '.swagger-ui .topbar { display: none }',
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'list',
        filter: true,
      },
    }),
  );

  logger.info('[Swagger] Documentation initialized at /api/docs');
}

export * from './swagger.config';
