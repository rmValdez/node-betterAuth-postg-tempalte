import { Request, Response, NextFunction } from 'express';
import { requireRole } from '../../src/middleware/role.middleware';

describe('requireRole', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('returns 401 when req.user is not set', () => {
    requireRole('ADMIN')(mockReq as Request, mockRes as Response, next);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 403 when the user role is not in the allowed list', () => {
    mockReq.user = { role: 'USER' } as Request['user'];

    requireRole('ADMIN', 'SUPER_ADMIN')(mockReq as Request, mockRes as Response, next);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next() when the user role is allowed', () => {
    mockReq.user = { role: 'ADMIN' } as Request['user'];

    requireRole('ADMIN', 'SUPER_ADMIN')(mockReq as Request, mockRes as Response, next);

    expect(next).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });
});
