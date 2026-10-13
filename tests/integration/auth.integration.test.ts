import request from 'supertest';
import app from '../../src/app';
import { auth } from '../../src/auth/better-auth';
import AuthSvc from '../../src/services/auth.service';
import UserService from '../../src/services/user.service';
import QuizService from '../../src/services/quiz.service';

/**
 * Integration tests for authentication and access rules, exercised through
 * the real Express app (routing, middleware, controllers). Better Auth's
 * session lookup and the service layer are mocked, so no Postgres/Redis is
 * needed — same infra-mocking approach as `health.test.ts`.
 */
jest.mock('../../src/auth/better-auth', () => ({
  auth: {
    handler: jest.fn(),
    api: { getSession: jest.fn() },
  },
}));
jest.mock('../../src/services/auth.service');
jest.mock('../../src/services/user.service');
jest.mock('../../src/services/quiz.service');

jest.mock('../../src/infrastructure/redis', () => ({
  redis: {
    connect: jest.fn().mockResolvedValue(undefined),
    close: jest.fn().mockResolvedValue(undefined),
    ping: jest.fn().mockResolvedValue(true),
    getClient: jest.fn(),
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

const getSession = auth.api.getSession as unknown as jest.Mock;

function sessionFor(role: string, id = `${role.toLowerCase()}-1`) {
  return {
    user: { id, email: `${id}@example.com`, role, isActive: true, isDeleted: false },
    session: { id: `session-${id}`, token: `token-${id}` },
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  getSession.mockResolvedValue(null);
});

describe('GET /api/v1/auth/me', () => {
  it('returns the profile for a signed-in user', async () => {
    getSession.mockResolvedValue(sessionFor('USER'));
    (AuthSvc.getCurrentUser as jest.Mock).mockResolvedValue({ id: 'user-1', role: 'USER' });

    const res = await request(app).get('/api/v1/auth/me').set('Authorization', 'Bearer token-user-1');

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe('user-1');
    expect(AuthSvc.getCurrentUser).toHaveBeenCalledWith('user-1');
  });

  it('returns 401 without a session', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
  });
});

describe('Legacy JWT routes are removed', () => {
  it.each(['/api/v1/auth/login', '/api/v1/auth/register', '/api/v1/auth/refresh', '/api/v1/login'])(
    'POST %s → 404',
    async (path) => {
      const res = await request(app).post(path).send({});
      expect(res.status).toBe(404);
    },
  );
});

describe('GET /api/v1/users', () => {
  it('returns 401 without a session', async () => {
    const res = await request(app).get('/api/v1/users');
    expect(res.status).toBe(401);
  });

  it('returns 403 for a regular user', async () => {
    getSession.mockResolvedValue(sessionFor('USER'));
    const res = await request(app).get('/api/v1/users');
    expect(res.status).toBe(403);
  });

  it('returns 200 for an admin', async () => {
    getSession.mockResolvedValue(sessionFor('ADMIN'));
    (UserService.listUsers as jest.Mock).mockResolvedValue({ users: [], total: 0 });

    const res = await request(app).get('/api/v1/users');

    expect(res.status).toBe(200);
  });
});

describe('POST /api/v1/file-uploads/upload', () => {
  it('returns 401 without a session', async () => {
    const res = await request(app).post('/api/v1/file-uploads/upload');
    expect(res.status).toBe(401);
  });
});

describe('Quiz progress', () => {
  it('rejects guests without x-session-id', async () => {
    const res = await request(app).get('/api/v1/quiz/progress');
    expect(res.status).toBe(400);
    expect(QuizService.getProgress).not.toHaveBeenCalled();
  });

  it('rejects guests trying to use a reserved user: session id', async () => {
    const res = await request(app).get('/api/v1/quiz/progress').set('x-session-id', 'user:victim-id');
    expect(res.status).toBe(400);
  });

  it('keys guest progress by x-session-id', async () => {
    (QuizService.getProgress as jest.Mock).mockResolvedValue(null);

    const res = await request(app).get('/api/v1/quiz/progress').set('x-session-id', 'guest-abc');

    expect(res.status).toBe(200);
    expect(QuizService.getProgress).toHaveBeenCalledWith({ sessionId: 'guest-abc' });
  });

  it('keys signed-in progress by user id, ignoring x-session-id', async () => {
    getSession.mockResolvedValue(sessionFor('USER'));
    (QuizService.getProgress as jest.Mock).mockResolvedValue(null);

    const res = await request(app).get('/api/v1/quiz/progress').set('x-session-id', 'guest-abc');

    expect(res.status).toBe(200);
    expect(QuizService.getProgress).toHaveBeenCalledWith({
      sessionId: 'user:user-1',
      userId: 'user-1',
    });
  });
});
