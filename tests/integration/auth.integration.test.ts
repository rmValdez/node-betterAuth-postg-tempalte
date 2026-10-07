import request from 'supertest';
import app from '../../src/app';
import AuthRepo from '../../src/repositories/auth.repository';
import AuthSvc from '../../src/services/auth.service';

/**
 * Integration tests for the auth flow, exercised through the real Express
 * app (real routing, middleware, controllers, services) with only the
 * persistence layer swapped out.
 *
 * `AuthRepo` is mocked and backed by a tiny in-memory store below, so the
 * flow behaves like a real database across requests (register a user, then
 * log in as them, refresh, log out) without needing a live Postgres/Redis —
 * following the same infra-mocking approach as `health.test.ts`.
 */
jest.mock('../../src/infrastructure/redis', () => ({
  redis: {
    connect: jest.fn().mockResolvedValue(undefined),
    close: jest.fn().mockResolvedValue(undefined),
    ping: jest.fn().mockResolvedValue(true),
    getClient: jest.fn(() => ({
      get: jest.fn().mockResolvedValue(null),
      setEx: jest.fn().mockResolvedValue('OK'),
      set: jest.fn().mockResolvedValue('OK'),
      del: jest.fn().mockResolvedValue(1),
    })),
  },
}));

jest.mock('../../src/infrastructure/rabbitmq', () => ({
  rabbitmq: {
    connect: jest.fn().mockResolvedValue(undefined),
    close: jest.fn().mockResolvedValue(undefined),
    isReady: jest.fn().mockReturnValue(true),
    publish: jest.fn().mockResolvedValue(true),
    consume: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('../../src/repositories/auth.repository');

interface FakeUser {
  id: string;
  email: string;
  password: string;
  username: string;
  name: string | null;
  role: 'USER';
  onboardingCompleted: boolean;
  avatar: null;
}

interface FakeSession {
  refreshToken: string;
  userId: string;
  expiresAt: Date;
}

let users: FakeUser[] = [];
let sessions: FakeSession[] = [];
let nextId = 1;

beforeEach(() => {
  users = [];
  sessions = [];
  nextId = 1;
  jest.clearAllMocks();

  (AuthRepo.findUserByEmailOrUsername as jest.Mock).mockImplementation(
    async (email: string, username: string) =>
      users.find((u) => u.email === email || u.username === username) ?? null,
  );

  (AuthRepo.createUser as jest.Mock).mockImplementation(
    async (data: { email: string; password?: string; username: string; name?: string }) => {
      const user: FakeUser = {
        id: `user-${nextId++}`,
        email: data.email,
        password: data.password ?? '',
        username: data.username,
        name: data.name ?? null,
        role: 'USER',
        onboardingCompleted: false,
        avatar: null,
      };
      users.push(user);
      return user;
    },
  );

  (AuthRepo.findUserByEmail as jest.Mock).mockImplementation(
    async (email: string) => users.find((u) => u.email === email) ?? null,
  );

  (AuthRepo.updateUserLoginStatus as jest.Mock).mockImplementation(
    async (userId: string) => users.find((u) => u.id === userId) ?? null,
  );

  (AuthRepo.findUserById as jest.Mock).mockImplementation(
    async (userId: string) => users.find((u) => u.id === userId) ?? null,
  );

  (AuthRepo.createSession as jest.Mock).mockImplementation(
    async (data: { userId: string; refreshToken: string; expiresAt: Date }) => {
      sessions.push({
        refreshToken: data.refreshToken,
        userId: data.userId,
        expiresAt: data.expiresAt,
      });
      return data;
    },
  );

  (AuthRepo.findValidSession as jest.Mock).mockImplementation(
    async (refreshToken: string) =>
      sessions.find((s) => s.refreshToken === refreshToken && s.expiresAt > new Date()) ?? null,
  );

  (AuthRepo.deleteSession as jest.Mock).mockImplementation(async (refreshToken: string) => {
    const before = sessions.length;
    sessions = sessions.filter((s) => s.refreshToken !== refreshToken);
    return { count: before - sessions.length };
  });
});

describe('Auth Endpoints (Integration Tests)', () => {
  const testUserEmail = 'test-user@example.com';
  const testUsername = 'testuser';
  const testPassword = 'TestPassword123!';

  describe('User Registration & Login Flow', () => {
    it('should register a new user', async () => {
      const response = await request(app).post('/api/v1/auth/register').send({
        email: testUserEmail,
        password: testPassword,
        username: testUsername,
        name: 'Test User',
      });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User created successfully');
      expect(response.body.data.user.email).toBe(testUserEmail);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
      // Password hash must never be echoed back.
      expect(response.body.data.user.password).toBeUndefined();
    });

    it('should not allow registering with duplicate email', async () => {
      await request(app).post('/api/v1/auth/register').send({
        email: testUserEmail,
        password: testPassword,
        username: testUsername,
        name: 'Test User',
      });

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: testUserEmail,
          password: 'AnotherPass123!',
          username: `${testUsername}-2`,
          name: 'Another User',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('already exists');
    });

    it('should login successfully with correct credentials', async () => {
      const registerRes = await request(app).post('/api/v1/auth/register').send({
        email: testUserEmail,
        password: testPassword,
        username: testUsername,
        name: 'Test User',
      });
      const userId = registerRes.body.data.user.id;

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: testUserEmail, password: testPassword });

      expect(response.status).toBe(200);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
      expect(response.body.data.user.id).toBe(userId);
      expect(AuthRepo.updateUserLoginStatus).toHaveBeenCalledWith(userId);
    });

    it('should reject login with incorrect password', async () => {
      await request(app).post('/api/v1/auth/register').send({
        email: testUserEmail,
        password: testPassword,
        username: testUsername,
        name: 'Test User',
      });

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: testUserEmail, password: 'WrongPassword123!' });

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('Invalid credentials');
    });
  });

  describe('Token Management', () => {
    // Seeds a user via the service layer directly (bypassing the rate-limited
    // HTTP /register route) — these tests exercise /me and /refresh-token,
    // not registration itself. See the "Rate Limiting" note below.
    async function seedUser() {
      const result = await AuthSvc.register({
        email: testUserEmail,
        password: testPassword,
        username: testUsername,
        name: 'Test User',
      });
      return {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        userId: result.user.id,
      };
    }

    it('should get current user with valid access token', async () => {
      const { accessToken, userId } = await seedUser();

      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(userId);
      expect(response.body.data.email).toBe(testUserEmail);
    });

    it('should reject request without access token', async () => {
      const response = await request(app).get('/api/v1/auth/me');
      expect(response.status).toBe(401);
    });

    it('should reject request with malformed token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer invalid.token.here');

      expect(response.status).toBe(401);
    });

    it('should refresh access token successfully', async () => {
      const { refreshToken } = await seedUser();

      const response = await request(app).post('/api/v1/auth/refresh-token').send({ refreshToken });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Token refreshed successfully');
      // Not asserting the new access token differs from the original: JWT
      // signing here is deterministic (same payload + same second-precision
      // `iat`), so a refresh issued in the same second as registration can
      // legitimately produce an identical token string — not a bug.
      expect(response.body.data.accessToken).toEqual(expect.any(String));
      expect(response.body.data.accessToken.split('.')).toHaveLength(3);
      // The service issues a fresh access token but does not rotate the
      // refresh token itself (see README Roadmap: "Refresh token rotation").
      expect(response.body.data).not.toHaveProperty('refreshToken');
    });

    it('should reject refresh with invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh-token')
        .send({ refreshToken: 'invalid.token.here' });

      expect(response.status).toBe(401);
    });
  });

  describe('Logout & Session Invalidation', () => {
    // Seeds via the service layer directly — see the "Token Management"
    // block's `seedUser` for why (avoids exhausting the shared authLimiter).
    async function seedUser() {
      const result = await AuthSvc.register({
        email: testUserEmail,
        password: testPassword,
        username: testUsername,
        name: 'Test User',
      });
      return {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      };
    }

    it('should logout successfully', async () => {
      const { accessToken, refreshToken } = await seedUser();

      const response = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ refreshToken });

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('Logged out');
    });

    it('should reject using the refresh token again after logout', async () => {
      const { accessToken, refreshToken } = await seedUser();
      await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ refreshToken });

      const response = await request(app).post('/api/v1/auth/refresh-token').send({ refreshToken });

      expect(response.status).toBe(401);
    });

    // Documents real (if surprising) behavior rather than asserting the
    // wrong thing: `authenticate` only verifies the JWT + looks up the user
    // by id — it never checks the session table. Logout deletes the
    // *refresh-token* session, not the access token, so an access token
    // issued before logout keeps working until it naturally expires.
    it('does NOT invalidate an already-issued access token on logout', async () => {
      const { accessToken, refreshToken } = await seedUser();
      await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ refreshToken });

      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
    });
  });

  describe('Password & Security', () => {
    it('should enforce password minimum length', async () => {
      const response = await request(app).post('/api/v1/auth/register').send({
        email: 'weak-password@example.com',
        password: 'short',
        username: 'weakpassworduser',
        name: 'Test',
      });

      expect(response.status).toBe(400);
    });
  });

  describe('Rate Limiting', () => {
    // Runs last deliberately: authLimiter (10 req/15min, shared across
    // /register and /login) is process-lifetime in-memory state, so tripping
    // it here would poison every earlier test in this file if it ran first.
    it('should rate limit login attempts', async () => {
      const attempts: number[] = [];

      for (let i = 0; i < 15; i++) {
        const response = await request(app)
          .post('/api/v1/auth/login')
          .send({ email: `nonexistent-${i}@example.com`, password: 'password' });
        attempts.push(response.status);
      }

      expect(attempts).toContain(429);
    });
  });
});
