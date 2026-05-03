// pandamarket/backend/src/api/middlewares/upload-validation.ts
// =============================================================================
// PandaMarket — Upload Validation
// Pre-flight checks for presigned URL requests (mime + size).
// Accepts either {mimeType,fileSize} (legacy) or {content_type,file_size} (new).
// =============================================================================

import type { MedusaRequest, MedusaResponse, MedusaNextFunction } from '@medusajs/framework/http';
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/api/middlewares/upload-validation.ts
=======
import { z } from 'zod';
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/api/middlewares/upload-validation.ts

import {
  PdFileInvalidTypeError,
  PdFileTooLargeError,
  PdValidationError,
} from '../../utils/errors';
import { FILE_CONSTRAINTS } from '../../utils/constants';

<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/api/middlewares/upload-validation.ts
interface UploadValidationBody {
  mimeType?: string;
  fileSize?: number;
  content_type?: string;
  file_size?: number;
}

=======
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/api/middlewares/upload-validation.ts
const ALLOWED_MIME_TYPES: readonly string[] = [
  ...FILE_CONSTRAINTS.ALLOWED_IMAGE_TYPES,
  ...FILE_CONSTRAINTS.ALLOWED_KYC_TYPES,
];
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/api/middlewares/upload-validation.ts
=======

const uploadValidationSchema = z
  .object({
    mimeType: z.string().optional(),
    fileSize: z.coerce.number().int().positive().optional(),
    content_type: z.string().optional(),
    file_size: z.coerce.number().int().positive().optional(),
  })
  .passthrough()
  .superRefine((data, ctx) => {
    if (!data.mimeType && !data.content_type) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['content_type'],
        message: 'mimeType/content_type est requis',
      });
    }
    if (data.fileSize === undefined && data.file_size === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['file_size'],
        message: 'fileSize/file_size est requis',
      });
    }
  });
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/api/middlewares/upload-validation.ts

export const validateUpload = (
  req: MedusaRequest,
  _res: MedusaResponse,
  next: MedusaNextFunction,
): void => {
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/api/middlewares/upload-validation.ts
  const body = (req.body ?? {}) as UploadValidationBody;
  const mimeType = body.mimeType ?? body.content_type;
  const fileSize = body.fileSize ?? body.file_size;

  if (!mimeType || typeof fileSize !== 'number') {
    return next(
      new PdValidationError('mimeType/content_type et fileSize/file_size sont requis'),
    );
=======
  const parsed = uploadValidationSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return next(
      new PdValidationError('mimeType/content_type et fileSize/file_size sont requis'),
    );
  }

  const mimeType = parsed.data.mimeType ?? parsed.data.content_type;
  const fileSize = parsed.data.fileSize ?? parsed.data.file_size;
  if (!mimeType || typeof fileSize !== 'number') {
    return next(new PdValidationError('mimeType/content_type et fileSize/file_size sont requis'));
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/api/middlewares/upload-validation.ts
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
