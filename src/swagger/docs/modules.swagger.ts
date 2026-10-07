/**
 * @swagger
 * /v1/users:
 *   get:
 *     summary: List users with pagination and search
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Paginated users list
 *
 * /v1/quiz/questions:
 *   get:
 *     summary: Retrieve question bank for active tenant (Angular / Vue / Default)
 *     tags: [Quiz]
 *     security:
 *       - TenantHeader: []
 *     responses:
 *       200:
 *         description: List of quiz questions
 *
 * /v1/quiz/submit:
 *   post:
 *     summary: Submit quiz answers and calculate score
 *     tags: [Quiz]
 *     security:
 *       - BearerAuth: []
 *       - TenantHeader: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [answers]
 *             properties:
 *               answers:
 *                 type: object
 *                 example: { "q1": "A", "q2": "C" }
 *     responses:
 *       200:
 *         description: Quiz progress scorecard
 */
