/**
 * @swagger
 * /v1/users:
 *   get:
 *     summary: List users with pagination (ADMIN / SUPER_ADMIN only)
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
 *       401:
 *         description: Not signed in
 *       403:
 *         description: Insufficient role
 *
 * /v1/quiz:
 *   get:
 *     summary: Retrieve the quiz question bank
 *     tags: [Quiz]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: difficulty
 *         schema: { type: string, enum: [BEGINNER, INTERMEDIATE, ADVANCED, EXPERT] }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: List of quiz questions
 *
 * /v1/quiz/{id}:
 *   get:
 *     summary: Retrieve a single quiz question
 *     tags: [Quiz]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Quiz question
 *       404:
 *         description: Quiz question not found
 *
 * /v1/quiz/progress:
 *   get:
 *     summary: Get quiz progress (signed-in user, or guest via x-session-id)
 *     tags: [Quiz]
 *     parameters:
 *       - in: header
 *         name: x-session-id
 *         schema: { type: string }
 *         description: Required for guests (e.g. a client-generated UUID); ignored when signed in
 *     responses:
 *       200:
 *         description: Quiz progress
 *       400:
 *         description: Guest request without x-session-id
 *   post:
 *     summary: Save quiz progress (signed-in user, or guest via x-session-id)
 *     tags: [Quiz]
 *     parameters:
 *       - in: header
 *         name: x-session-id
 *         schema: { type: string }
 *         description: Required for guests; ignored when signed in
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               answers:
 *                 type: object
 *                 example: { "1": 2, "2": 0 }
 *               score: { type: integer }
 *               answeredCount: { type: integer }
 *     responses:
 *       200:
 *         description: Saved quiz progress
 *       400:
 *         description: Guest request without x-session-id
 *
 * /v1/quiz/progress/reset:
 *   post:
 *     summary: Reset quiz progress (signed-in user, or guest via x-session-id)
 *     tags: [Quiz]
 *     parameters:
 *       - in: header
 *         name: x-session-id
 *         schema: { type: string }
 *         description: Required for guests; ignored when signed in
 *     responses:
 *       200:
 *         description: Reset quiz progress
 *       400:
 *         description: Guest request without x-session-id
 */
