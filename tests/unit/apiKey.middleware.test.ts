import { Request, Response, NextFunction } from 'express';
import { apiKeyAuth } from '../../src/middleware/apiKey.middleware';

jest.mock('../../src/config', () => ({
  API_KEYS: new Map([['valid-key-123', 'partner-a']]),
}));

describe('apiKeyAuth', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = { headers: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('returns 401 when the x-api-key header is missing', () => {
    apiKeyAuth(mockReq as Request, mockRes as Response, next);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'error', statusCode: 401 }),
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when the key is not recognized', () => {
    mockReq.headers = { 'x-api-key': 'unknown-key' };

    apiKeyAuth(mockReq as Request, mockRes as Response, next);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('resolves the client name and calls next() for a valid key', () => {
    mockReq.headers = { 'x-api-key': 'valid-key-123' };

    apiKeyAuth(mockReq as Request, mockRes as Response, next);

    expect(mockReq.apiClient).toBe('partner-a');
    expect(next).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });
});
