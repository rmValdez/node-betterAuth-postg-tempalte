import swaggerJsdoc from 'swagger-jsdoc';
import { PORT } from '../config';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node PostgreSQL Backend Template API',
      version: '1.0.0',
      description:
        'Enterprise-grade Node.js/TypeScript backend boilerplate with Prisma ORM, PostgreSQL, Redis caching, RBAC permissions, and multi-tenancy.',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}/api`,
        description: 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT access token.',
        },
        TenantHeader: {
          type: 'apiKey',
          in: 'header',
          name: 'x-tenant-id',
          description: 'Optional tenant slug header (e.g., "angular-v4", "vue-v3", "default")',
        },
      },
      schemas: {
        SuccessResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            statusCode: { type: 'integer', example: 200 },
            message: { type: 'string', example: 'Operation completed successfully' },
            data: { type: 'object' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            statusCode: { type: 'integer', example: 400 },
            message: { type: 'string', example: 'Validation failed or resource not found' },
            code: { type: 'string', example: 'VALIDATION_ERROR' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/routes/**/*.ts', './src/swagger/docs/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
