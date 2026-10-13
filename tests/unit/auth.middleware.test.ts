import request from 'supertest';
import express, { Express } from 'express';
import { authenticate, optionalAuth } from '../../src/middleware/auth.middleware';
import { auth } from '../../src/auth/better-auth';

jest.mock('../../src/auth/better-auth', () => ({
  auth: {
    api: {
      getSession: jest.fn(),
    },
  },
}));

const getSession = auth.api.getSession as unknown as jest.Mock;

const activeSession = {
  user: {
    id: 'better-auth-user-1',
    email: 'betterauth@example.com',
    role: 'USER',
    isActive: true,
    isDeleted: false,
  },
  session: { id: 'session-123', token: 'token-abc' },
};

const deactivatedSession = {
  ...activeSession,
  user: { ...activeSession.user, id: 'deactivated-user', isActive: false },
};

describe('Auth Middleware (Better Auth sessions)', () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.get('/protected', authenticate, (req, res) => {
      res.json({ message: 'Access granted', user: req.user });
    });
    app.get('/optional', optionalAuth, (req, res) => {
      res.json({ user: req.user ?? null });
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    getSession.mockResolvedValue(null);
  });

  describe('authenticate', () => {
    it('authenticates with a valid Better Auth session', async () => {
      getSession.mockResolvedValueOnce(activeSession);

      const response = await request(app)
        .get('/protected')
        .set('Cookie', ['better-auth.session_token=token-abc']);

      expect(response.status).toBe(200);
      expect(response.body.user.id).toBe('better-auth-user-1');
    });

    it('passes the request headers (cookie or Bearer) to Better Auth', async () => {
      getSession.mockResolvedValueOnce(activeSession);

      await request(app).get('/protected').set('Authorization', 'Bearer token-abc');

      const headers = getSession.mock.calls[0][0].headers as Headers;
      expect(headers.get('authorization')).toBe('Bearer token-abc');
    });

    it('rejects requests without a session', async () => {
      const response = await request(app).get('/protected');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized');
    });

    it('rejects requests when the session lookup throws', async () => {
      getSession.mockRejectedValueOnce(new Error('db down'));

      const response = await request(app).get('/protected');

      expect(response.status).toBe(401);
    });

    it('rejects deactivated accounts', async () => {
      getSession.mockResolvedValueOnce(deactivatedSession);

      const response = await request(app).get('/protected');

      expect(response.status).toBe(403);
      expect(response.body.message).toMatch(/deactivated/i);
    });
  });

  describe('optionalAuth', () => {
    it('attaches the user when a session exists', async () => {
      getSession.mockResolvedValueOnce(activeSession);

      const response = await request(app).get('/optional');

      expect(response.status).toBe(200);
      expect(response.body.user.id).toBe('better-auth-user-1');
    });

    it('continues as a guest without a session', async () => {
      const response = await request(app).get('/optional');

      expect(response.status).toBe(200);
      expect(response.body.user).toBeNull();
    });

    it('treats deactivated accounts as guests', async () => {
      getSession.mockResolvedValueOnce(deactivatedSession);

      const response = await request(app).get('/optional');

      expect(response.status).toBe(200);
      expect(response.body.user).toBeNull();
    });
  });
});
