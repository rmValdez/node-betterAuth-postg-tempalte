/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication, session management, and profile access
 *   - name: Users
 *     description: User management and directory queries
 *   - name: Quiz
 *     description: Interactive quiz questions, submissions, and scorecards
 */

/**
 * @swagger
 * /auth/sign-up/email:
 *   post:
 *     summary: Register with email and password (Better Auth)
 *     description: "Sets the session cookie and returns `token`, usable as `Authorization: Bearer <token>`."
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, name]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: Password123!
 *               name:
 *                 type: string
 *                 example: John Doe
 *               username:
 *                 type: string
 *                 example: john_doe
 *     responses:
 *       200:
 *         description: User created and signed in
 *       400:
 *         description: Validation error, or a server-managed field (e.g. role) was sent
 *       422:
 *         description: Email already in use
 *
 * /auth/sign-in/email:
 *   post:
 *     summary: Sign in with email and password (Better Auth)
 *     description: "Sets the session cookie and returns `token`, usable as `Authorization: Bearer <token>`."
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Signed in
 *       401:
 *         description: Invalid email or password
 *
 * /auth/sign-out:
 *   post:
 *     summary: Revoke the current session (Better Auth)
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Signed out
 *
 * /v1/auth/me:
 *   get:
 *     summary: Retrieve currently authenticated user profile and permissions
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       401:
 *         description: No valid session
 *       403:
 *         description: Account deactivated
 */
