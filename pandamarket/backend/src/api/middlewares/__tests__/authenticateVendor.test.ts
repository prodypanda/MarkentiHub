import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authenticateVendor } from '../authenticate-vendor';
import jwt from 'jsonwebtoken';

vi.mock('jsonwebtoken');

describe('authenticateVendor Middleware', () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: any;

  beforeEach(() => {
    mockReq = {
      headers: {},
      scope: {
        register: vi.fn()
      }
    };
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    mockNext = vi.fn();
    vi.clearAllMocks();
  });

  it('should return 401 if no Authorization header is present', async () => {
    await authenticateVendor(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Unauthorized: Missing token' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 if token is invalid or expired', async () => {
    mockReq.headers.authorization = 'Bearer invalid-token';
    (jwt.verify as any).mockImplementation(() => {
      throw new Error('jwt expired');
    });

    await authenticateVendor(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Unauthorized: Invalid token' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should inject store_id into scope and call next() on valid token', async () => {
    mockReq.headers.authorization = 'Bearer valid-token';
    (jwt.verify as any).mockReturnValue({ store_id: 'store_123' });

    await authenticateVendor(mockReq, mockRes, mockNext);
    
    expect(jwt.verify).toHaveBeenCalledWith('valid-token', expect.any(String));
    expect(mockReq.scope.register).toHaveBeenCalledWith({
      loggedInVendorStoreId: expect.objectContaining({ resolve: expect.any(Function) })
    });
    expect(mockNext).toHaveBeenCalled();
  });
});
