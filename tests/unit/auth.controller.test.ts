import request from 'supertest';
import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import AuthController from '../../src/controllers/auth.controller';
import AuthService from '../../src/services/auth.service';

// Mock AuthService
jest.mock('../../src/services/auth.service');

describe('AuthController', () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(cookieParser());
    app.use(express.json());

    // Create routes for testing
    app.post('/auth/register', AuthController.register);
    app.post('/auth/login', AuthController.login);
    app.post('/auth/refresh-token', AuthController.refreshToken);
    app.post('/auth/logout', (req, res, next) => {
      // Only `.id` is read by the controller — a full Prisma `User` row
      // (every scalar column + `avatar`) isn't needed for this HTTP-layer test.
      req.user = { id: 'test-user-id' } as Express.Request['user'];
      AuthController.logout(req, res, next);
    });
    app.get('/auth/me', (req, res, next) => {
      // `me` just passes `req.user` through to the response body, so a
      // partial stand-in is enough — see note above.
      req.user = {
        id: 'test-user-id',
        email: 'test@example.com',
        username: 'testuser',
        name: 'Test User',
        role: 'USER',
        onboardingCompleted: false,
      } as Express.Request['user'];
      AuthController.me(req, res, next);
    });
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const registerData = {
        email: 'newuser@example.com',
        password: 'SecurePass123',
        username: 'newuser',
        name: 'New User',
      };

      (AuthService.register as jest.Mock).mockResolvedValue({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: {
          id: '123',
          email: registerData.email,
          username: registerData.username,
          name: registerData.name,
          role: 'USER',
          onboardingCompleted: false,
        },
      });

      const response = await request(app).post('/auth/register').send(registerData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User created successfully');
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.user.email).toBe(registerData.email);

      // Verify cookies are set
      const rawCookies = response.headers['set-cookie'];
      expect(rawCookies).toBeDefined();
      const cookies = (Array.isArray(rawCookies) ? rawCookies : [rawCookies]) as string[];
      expect(cookies.some((c: string) => c.startsWith('accessToken='))).toBe(true);
      expect(cookies.some((c: string) => c.startsWith('refreshToken='))).toBe(true);
    });

    it('should return 400 for invalid email', async () => {
      const response = await request(app).post('/auth/register').send({
        email: 'invalid-email',
        password: 'SecurePass123',
        username: 'newuser',
        name: 'New User',
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('email');
    });

    it('should return 400 for weak password', async () => {
      const response = await request(app).post('/auth/register').send({
        email: 'test@example.com',
        password: '123', // Too short
        username: 'testuser',
        name: 'Test User',
      });

      expect(response.status).toBe(400);
    });

    it('should return 400 when user already exists', async () => {
      const registerData = {
        email: 'existing@example.com',
        password: 'SecurePass123',
        username: 'newuser',
        name: 'New User',
      };

      (AuthService.register as jest.Mock).mockRejectedValue({
        status: 400,
        message: 'User with this email already exists',
      });

      const response = await request(app).post('/auth/register').send(registerData);

      expect(response.status).toBe(400);
    });
  });

  describe('POST /auth/login', () => {
    it('should login user successfully and set auth cookies', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'SecurePass123',
      };

      (AuthService.login as jest.Mock).mockResolvedValue({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: {
          id: '123',
          email: loginData.email,
          username: 'testuser',
          name: 'Test User',
          role: 'USER',
          onboardingCompleted: false,
        },
      });

      const response = await request(app).post('/auth/login').send(loginData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.data.accessToken).toBeDefined();

      const rawCookies = response.headers['set-cookie'];
      expect(rawCookies).toBeDefined();
      const cookies = (Array.isArray(rawCookies) ? rawCookies : [rawCookies]) as string[];
      expect(cookies.some((c: string) => c.startsWith('accessToken='))).toBe(true);
      expect(cookies.some((c: string) => c.startsWith('refreshToken='))).toBe(true);
    });

    it('should return 401 for invalid credentials', async () => {
      (AuthService.login as jest.Mock).mockRejectedValue({
        status: 401,
        message: 'Invalid credentials',
      });

      const response = await request(app).post('/auth/login').send({
        email: 'test@example.com',
        password: 'WrongPassword',
      });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /auth/refresh-token', () => {
    it('should refresh token successfully from request body', async () => {
      (AuthService.refreshToken as jest.Mock).mockResolvedValue({
        accessToken: 'new-access-token',
        user: {
          id: '123',
          email: 'test@example.com',
          username: 'testuser',
          name: 'Test User',
          role: 'USER',
          onboardingCompleted: false,
        },
      });

      const response = await request(app)
        .post('/auth/refresh-token')
        .send({ refreshToken: 'valid-refresh-token' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Token refreshed successfully');
      expect(response.body.data.accessToken).toBeDefined();

      const rawCookies = response.headers['set-cookie'];
      expect(rawCookies).toBeDefined();
      const cookies = (Array.isArray(rawCookies) ? rawCookies : [rawCookies]) as string[];
      expect(cookies.some((c: string) => c.startsWith('accessToken='))).toBe(true);
    });

    it('should refresh token successfully from cookie when body is empty', async () => {
      (AuthService.refreshToken as jest.Mock).mockResolvedValue({
        accessToken: 'cookie-refreshed-access-token',
        user: {
          id: '123',
          email: 'test@example.com',
          username: 'testuser',
          name: 'Test User',
          role: 'USER',
          onboardingCompleted: false,
        },
      });

      const response = await request(app)
        .post('/auth/refresh-token')
        .set('Cookie', ['refreshToken=valid-cookie-refresh-token']);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Token refreshed successfully');
      expect(response.body.data.accessToken).toBe('cookie-refreshed-access-token');

      const rawCookies = response.headers['set-cookie'];
      expect(rawCookies).toBeDefined();
      const cookies = (Array.isArray(rawCookies) ? rawCookies : [rawCookies]) as string[];
      expect(cookies.some((c: string) => c.startsWith('accessToken='))).toBe(true);
    });

    it('should return 401 for invalid refresh token', async () => {
      (AuthService.refreshToken as jest.Mock).mockRejectedValue({
        status: 401,
        message: 'Invalid refresh token',
      });

      const response = await request(app)
        .post('/auth/refresh-token')
        .send({ refreshToken: 'invalid-token' });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /auth/logout', () => {
    it('should logout user successfully and clear cookies', async () => {
      (AuthService.logout as jest.Mock).mockResolvedValue({
        message: 'Logged out successfully',
      });

      const response = await request(app)
        .post('/auth/logout')
        .set('Cookie', ['refreshToken=cookie-token'])
        .send();

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Logged out successfully');

      const rawCookies = response.headers['set-cookie'];
      expect(rawCookies).toBeDefined();
      const cookies = (Array.isArray(rawCookies) ? rawCookies : [rawCookies]) as string[];
      // Clearing cookies sets Max-Age=0 or empty/expired date
      expect(cookies.some((c: string) => c.startsWith('accessToken=;') || c.includes('Max-Age=0'))).toBe(true);
      expect(cookies.some((c: string) => c.startsWith('refreshToken=;') || c.includes('Max-Age=0'))).toBe(true);
    });

    it('should return 401 when user is not authenticated', async () => {
      const app2 = express();
      app2.use(express.json());
      app2.post('/auth/logout', AuthController.logout);

      const response = await request(app2).post('/auth/logout').send({ refreshToken: 'token' });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /auth/me', () => {
    it('should return current user profile', async () => {
      const response = await request(app).get('/auth/me');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User profile retrieved');
      expect(response.body.data.email).toBe('test@example.com');
      expect(response.body.data.username).toBe('testuser');
    });

    it('should return 401 when user is not authenticated', async () => {
      const app2 = express();
      app2.get('/auth/me', AuthController.me);

      const response = await request(app2).get('/auth/me');

      expect(response.status).toBe(401);
    });
  });
});
