import { NextFunction } from 'express';
import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { PdFileInvalidTypeError, PdFileTooLargeError, PdValidationError } from '../../utils/errors';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const validateUpload = (
  req: MedusaRequest,
  _res: MedusaResponse,
  next: NextFunction
) => {
  const body = req.body as { mimeType?: string; fileSize?: number };
  const { mimeType, fileSize } = body;

  if (!mimeType || !fileSize) {
    return next(new PdValidationError('mimeType and fileSize are required for presigned URLs'));
  }

  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    return next(new PdFileInvalidTypeError(ALLOWED_MIME_TYPES));
  }

  if (fileSize > MAX_FILE_SIZE) {
    return next(new PdFileTooLargeError('10MB', fileSize));
  }

  next();
};
