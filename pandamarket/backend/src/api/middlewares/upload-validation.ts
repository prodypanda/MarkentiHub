// pandamarket/backend/src/api/middlewares/upload-validation.ts
// =============================================================================
// PandaMarket — Upload Validation
// Pre-flight checks for presigned URL requests (mime + size).
// Accepts either {mimeType,fileSize} (legacy) or {content_type,file_size} (new).
// =============================================================================

import type { MedusaRequest, MedusaResponse, MedusaNextFunction } from '@medusajs/framework/http';

import {
  PdFileInvalidTypeError,
  PdFileTooLargeError,
  PdValidationError,
} from '../../utils/errors';
import { FILE_CONSTRAINTS } from '../../utils/constants';

interface UploadValidationBody {
  mimeType?: string;
  fileSize?: number;
  content_type?: string;
  file_size?: number;
}

const ALLOWED_MIME_TYPES: readonly string[] = [
  ...FILE_CONSTRAINTS.ALLOWED_IMAGE_TYPES,
  ...FILE_CONSTRAINTS.ALLOWED_KYC_TYPES,
];

export const validateUpload = (
  req: MedusaRequest,
  _res: MedusaResponse,
  next: MedusaNextFunction,
): void => {
  const body = (req.body ?? {}) as UploadValidationBody;
  const mimeType = body.mimeType ?? body.content_type;
  const fileSize = body.fileSize ?? body.file_size;

  if (!mimeType || typeof fileSize !== 'number') {
    return next(
      new PdValidationError('mimeType/content_type et fileSize/file_size sont requis'),
    );
  }

  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    return next(new PdFileInvalidTypeError([...ALLOWED_MIME_TYPES]));
  }

  if (fileSize > FILE_CONSTRAINTS.MAX_IMAGE_SIZE) {
    return next(
      new PdFileTooLargeError(
        `${Math.round(FILE_CONSTRAINTS.MAX_IMAGE_SIZE / (1024 * 1024))}MB`,
        fileSize,
      ),
    );
  }

  return next();
};
