import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { authenticateVendor } from '../authenticate-vendor';
import jwt from 'jsonwebtoken';
import { PdAuthenticationError, PdTokenExpiredError } from '../../../utils/errors';

vi.mock('jsonwebtoken');

describe('authenticateVendor Middleware', () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: any;

  beforeEach(() => {
    process.env.PD_JWT_SECRET = 'test-secret';
    mockReq = {
      headers: {},
    };
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    mockNext = vi.fn();
    vi.clearAllMocks();
  });

  afterEach(() => {
    delete process.env.PD_JWT_SECRET;
  });

  it('should call next(error) with 401 if no Authorization header is present', async () => {
    await authenticateVendor(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledOnce();
    const err = mockNext.mock.calls[0][0];
    expect(err).toBeInstanceOf(PdAuthenticationError);
    expect(err.statusCode).toBe(401);
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it('should call next(error) with 401 if token is invalid', async () => {
    mockReq.headers.authorization = 'Bearer invalid-token';
    (jwt.verify as any).mockImplementation(() => {
      throw new Error('invalid signature');
    });

    await authenticateVendor(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledOnce();
    const err = mockNext.mock.calls[0][0];
    expect(err).toBeInstanceOf(PdAuthenticationError);
    expect(err.statusCode).toBe(401);
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it('should call next(error) with 401 if token is expired', async () => {
    mockReq.headers.authorization = 'Bearer expired-token';
    // Make jwt.TokenExpiredError check work
    (jwt as any).TokenExpiredError = class TokenExpiredError extends Error {
      constructor() { super('jwt expired'); this.name = 'TokenExpiredError'; }
    };
    (jwt.verify as any).mockImplementation(() => {
      throw new (jwt as any).TokenExpiredError();
    });

    await authenticateVendor(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledOnce();
    const err = mockNext.mock.calls[0][0];
    expect(err.statusCode).toBe(401);
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it('should inject pd_store_id and call next() without error on valid token', async () => {
    mockReq.headers.authorization = 'Bearer valid-token';
    (jwt.verify as any).mockReturnValue({ store_id: 'store_abc', sub: 'user_1', role: 'vendor' });

    await authenticateVendor(mockReq, mockRes, mockNext);

    expect(jwt.verify).toHaveBeenCalledWith('valid-token', 'test-secret');
    expect(mockReq.pd_store_id).toBe('store_abc');
    expect(mockReq.user_id).toBe('user_1');
    expect(mockNext).toHaveBeenCalledWith();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it('should call next(error) if token has no store_id', async () => {
    mockReq.headers.authorization = 'Bearer valid-token';
    (jwt.verify as any).mockReturnValue({ sub: 'user_1', role: 'vendor' });

    await authenticateVendor(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledOnce();
    const err = mockNext.mock.calls[0][0];
    expect(err).toBeInstanceOf(PdAuthenticationError);
    expect(err.statusCode).toBe(401);
  });
});

