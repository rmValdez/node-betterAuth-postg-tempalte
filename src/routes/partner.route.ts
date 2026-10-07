import express from 'express';
import UserController from '../controllers/user.controller';
import { apiKeyAuth } from '../middleware/apiKey.middleware';
import { responseSuccess } from '../helpers/response.helper';

/**
 * Routes intended for other backends, not end-user clients. Every route here
 * must be protected by `apiKeyAuth`, never `authenticate` (user JWT).
 */
const router = express.Router();

router.use(apiKeyAuth);

/**
 * @swagger
 * /v1/partner/ping:
 *   get:
 *     summary: Verify an X-API-Key and see which client it resolves to
 *     tags: [Partner]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: The calling client's name
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SuccessResponse' }
 *       401:
 *         description: Missing or invalid API key
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
router.get('/ping', (req, res) => {
  return responseSuccess(res, 200, { client: req.apiClient }, 'pong');
});

/**
 * @swagger
 * /v1/partner/users:
 *   get:
 *     summary: List all users (paginated) — for partner backends
 *     tags: [Partner]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Paginated list of users
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PageResult' }
 *       401:
 *         description: Missing or invalid API key
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
router.get('/users', UserController.index);

export default router;
