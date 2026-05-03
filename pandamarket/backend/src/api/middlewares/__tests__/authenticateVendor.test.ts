import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authenticateVendor } from '../authenticate-vendor';
import jwt from 'jsonwebtoken';
import type { MedusaRequest, MedusaResponse, MedusaNextFunction } from '@medusajs/framework/http';
import { PdAuthenticationError } from '../../../utils/errors';
import { UserRole } from '../../../utils/constants';

vi.mock('jsonwebtoken');

interface MockRequestShape {
  headers: { authorization?: string };
  pd_store_id?: string;
  pd_user_id?: string;
  pd_role?: UserRole;
}

type MockNext = ReturnType<typeof vi.fn>;

describe('authenticateVendor Middleware', () => {
  let mockReq: MockRequestShape;
  let mockRes: MedusaResponse;
  let mockNext: MockNext;
  const jwtVerifyMock = vi.mocked(jwt.verify);

  beforeEach(() => {
    process.env.PD_JWT_SECRET = 'test-secret-with-16-chars';
    mockReq = {
      headers: {},
    };
    mockRes = {} as MedusaResponse;
    mockNext = vi.fn();
    vi.clearAllMocks();
  });

  it('should return 401 if no Authorization header is present', async () => {
    await authenticateVendor(
      mockReq as unknown as MedusaRequest,
      mockRes,
      mockNext as MedusaNextFunction,
    );

    expect(mockNext).toHaveBeenCalledWith(expect.any(PdAuthenticationError));
    expect(mockNext.mock.calls[0][0]).toMatchObject({
      code: 'PD_AUTH_TOKEN_INVALID',
      statusCode: 401,
    });
  });

  it('should return 401 if token is invalid or expired', async () => {
    mockReq.headers.authorization = 'Bearer invalid-token';
    jwtVerifyMock.mockImplementation(() => {
      throw new Error('jwt expired');
    });

    await authenticateVendor(
      mockReq as unknown as MedusaRequest,
      mockRes,
      mockNext as MedusaNextFunction,
    );

    expect(mockNext).toHaveBeenCalledWith(expect.any(PdAuthenticationError));
    expect(mockNext.mock.calls[0][0]).toMatchObject({
      code: 'PD_AUTH_TOKEN_INVALID',
      statusCode: 401,
    });
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/api/middlewares/__tests__/authenticateVendor.test.ts
=======
  });

  it('should return 401 if token payload is missing store_id', async () => {
    mockReq.headers.authorization = 'Bearer invalid-payload-token';
    jwtVerifyMock.mockReturnValue({ sub: 'user_123', role: UserRole.Vendor });

    await authenticateVendor(
      mockReq as unknown as MedusaRequest,
      mockRes,
      mockNext as MedusaNextFunction,
    );

    expect(mockNext).toHaveBeenCalledWith(expect.any(PdAuthenticationError));
    expect(mockNext.mock.calls[0][0]).toMatchObject({
      code: 'PD_AUTH_TOKEN_INVALID',
      statusCode: 401,
    });
    expect(mockReq.pd_store_id).toBeUndefined();
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/api/middlewares/__tests__/authenticateVendor.test.ts
  });

  it('should inject store_id into scope and call next() on valid token', async () => {
    mockReq.headers.authorization = 'Bearer valid-token';
    jwtVerifyMock.mockReturnValue({ sub: 'user_123', store_id: 'store_123', role: UserRole.Vendor });

    await authenticateVendor(
      mockReq as unknown as MedusaRequest,
      mockRes,
      mockNext as MedusaNextFunction,
    );
    
    expect(jwt.verify).toHaveBeenCalledWith('valid-token', expect.any(String));
    expect(mockReq.pd_store_id).toBe('store_123');
    expect(mockReq.pd_user_id).toBe('user_123');
    expect(mockReq.pd_role).toBe(UserRole.Vendor);
    expect(mockNext).toHaveBeenCalled();
  });
});
