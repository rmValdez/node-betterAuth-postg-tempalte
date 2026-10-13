import request from 'supertest';
import express from 'express';
import AuthController from '../../src/controllers/auth.controller';
import AuthService from '../../src/services/auth.service';

jest.mock('../../src/services/auth.service');

describe('AuthController', () => {
  describe('GET /auth/me', () => {
    it('returns the current user profile with permissions', async () => {
      (AuthService.getCurrentUser as jest.Mock).mockResolvedValue({
        id: 'test-user-id',
        email: 'test@example.com',
        username: 'testuser',
        name: 'Test User',
        role: 'USER',
        onboardingCompleted: false,
        permissions: [],
      });

      const app = express();
      app.get('/auth/me', (req, res, next) => {
        // Only `.id` is read by the controller; a full Better Auth user isn't needed here
        req.user = { id: 'test-user-id' } as Express.Request['user'];
        AuthController.me(req, res, next);
      });

      const response = await request(app).get('/auth/me');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User profile retrieved');
      expect(response.body.data.email).toBe('test@example.com');
      expect(response.body.data.permissions).toEqual([]);
      expect(AuthService.getCurrentUser).toHaveBeenCalledWith('test-user-id');
    });

    it('returns 401 when no user is attached', async () => {
      const app = express();
      app.get('/auth/me', AuthController.me);

      const response = await request(app).get('/auth/me');

      expect(response.status).toBe(401);
    });
  });
});
