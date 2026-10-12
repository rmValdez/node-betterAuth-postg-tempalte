import request from 'supertest';
import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { authenticate } from '../../src/middleware/auth.middleware';
import { auth } from '../../src/auth/better-auth';
import AuthRepo from '../../src/repositories/auth.repository';
import { ACCESS_TOKEN_SECRET } from '../../src/config';

jest.mock('../../src/repositories/auth.repository');
jest.mock('../../src/auth/better-auth', () => ({
  auth: {
    api: {
      getSession: jest.fn(),
    },
  },
}));

describe('Auth Middleware (Cookies & Bearer Header)', () => {
  let app: Express;

  const mockUser = {
    id: 'user-cookie-123',
    email: 'cookieuser@example.com',
    username: 'cookieuser',
    role: 'USER',
    isDeleted: false,
  };

  beforeAll(() => {
    app = express();
    app.use(cookieParser());
    app.use(express.json());

    app.get('/protected', authenticate, (req, res) => {
      res.json({ message: 'Access granted', user: req.user });
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (auth.api.getSession as unknown as jest.Mock).mockResolvedValue(null);
    (AuthRepo.findUserById as jest.Mock).mockResolvedValue(mockUser);
  });

  it('should authenticate successfully using accessToken cookie', async () => {
    const validToken = jwt.sign({ userId: mockUser.id }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

    const response = await request(app)
      .get('/protected')
      .set('Cookie', [`accessToken=${validToken}`]);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Access granted');
    expect(response.body.user.id).toBe(mockUser.id);
  });

  it('should authenticate successfully using access_token snake_case cookie', async () => {
    const validToken = jwt.sign({ userId: mockUser.id }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

    const response = await request(app)
      .get('/protected')
      .set('Cookie', [`access_token=${validToken}`]);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Access granted');
    expect(response.body.user.id).toBe(mockUser.id);
  });

  it('should authenticate successfully using Bearer Authorization header', async () => {
    const validToken = jwt.sign({ userId: mockUser.id }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

    const response = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Access granted');
    expect(response.body.user.id).toBe(mockUser.id);
  });

  it('should reject request when neither cookie nor header is provided', async () => {
    const response = await request(app).get('/protected');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('No token provided');
  });

  it('should reject request with invalid token in cookie', async () => {
    const response = await request(app)
      .get('/protected')
      .set('Cookie', ['accessToken=invalid-signature-token']);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid token');
  });

  it('should authenticate successfully using Better Auth session', async () => {
    (auth.api.getSession as unknown as jest.Mock).mockResolvedValueOnce({
      user: {
        id: 'better-auth-user-1',
        email: 'betterauth@example.com',
        role: 'USER',
        isActive: true,
      },
      session: {
        id: 'session-123',
        token: 'token-abc',
      },
    });

    const response = await request(app)
      .get('/protected')
      .set('Cookie', ['better-auth.session_token=token-abc']);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Access granted');
    expect(response.body.user.id).toBe('better-auth-user-1');
  });

  it('should reject request when Better Auth user account is deactivated', async () => {
    (auth.api.getSession as unknown as jest.Mock).mockResolvedValueOnce({
      user: {
        id: 'deactivated-user',
        email: 'deactivated@example.com',
        role: 'USER',
        isActive: false,
      },
      session: {
        id: 'session-456',
        token: 'token-xyz',
      },
    });

    const response = await request(app)
      .get('/protected')
      .set('Cookie', ['better-auth.session_token=token-xyz']);

    expect(response.status).toBe(403);
    expect(response.body.message).toMatch(/deactivated/i);
  });
});
