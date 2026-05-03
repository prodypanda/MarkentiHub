// pandamarket/backend/src/api/routes/pd/upload/presigned-url/route.ts
// =============================================================================
// PandaMarket — Presigned Upload URL
// Returns a time-limited S3 presigned URL for uploading a product image.
// store_id is ALWAYS derived from JWT; if product_id is supplied it must
// belong to the authenticated store.
// =============================================================================

import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { Modules } from '@medusajs/framework/utils';
import { z } from 'zod';

import { getProductImageUploadUrl } from '../../../../../utils/s3';
import { requireStoreContext } from '../../../../middlewares/auth-context';
import {
  PdBadRequestError,
  PdNotOwnerError,
  PdValidationError,
} from '../../../../../utils/errors';
import { generatePdId } from '../../../../../utils/crypto';
import { FILE_CONSTRAINTS } from '../../../../../utils/constants';
import { createServiceLogger } from '../../../../../utils/logger';

const logger = createServiceLogger('PresignedUrlRoute');

const schema = z.object({
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/api/routes/pd/upload/presigned-url/route.ts
  product_id: z.string().optional(),
  filename: z.string().min(1).max(255),
=======
  product_id: z.string().trim().min(1).max(128).optional(),
  filename: z
    .string()
    .trim()
    .min(1)
    .max(255)
    .regex(/^[a-zA-Z0-9._-]+$/, 'Filename may only contain letters, numbers, dots, underscores, and hyphens'),
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/api/routes/pd/upload/presigned-url/route.ts
  content_type: z
    .string()
    .refine((v) => FILE_CONSTRAINTS.ALLOWED_IMAGE_TYPES.includes(v), {
      message: `Only ${FILE_CONSTRAINTS.ALLOWED_IMAGE_TYPES.join(', ')} are allowed`,
    }),
  file_size: z.number().int().positive().max(FILE_CONSTRAINTS.MAX_IMAGE_SIZE).optional(),
});

interface ProductLike {
  id: string;
  metadata?: Record<string, unknown> | null;
}

interface IProductModuleService {
  retrieveProduct(id: string): Promise<ProductLike>;
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> => {
  const { storeId } = requireStoreContext(req);

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    parsed.error.issues.forEach((issue) => {
      fields[issue.path.join('.')] = issue.message;
    });
    throw new PdValidationError('Données invalides', { fields });
  }

  const { filename, content_type } = parsed.data;
  let productId = parsed.data.product_id;

  // If product_id is provided, verify the authenticated store owns it.
  if (productId) {
    const productModuleService = req.scope.resolve(Modules.PRODUCT) as unknown as IProductModuleService;
    let product: ProductLike;
    try {
      product = await productModuleService.retrieveProduct(productId);
    } catch {
      throw new PdNotOwnerError(productId);
    }
    const owner = (product.metadata ?? {})['store_id'];
    if (owner !== storeId) {
      throw new PdNotOwnerError(productId);
    }
  } else {
    productId = generatePdId('tmp_prod');
  }

  try {
    const result = await getProductImageUploadUrl(storeId, productId, filename, content_type);
    logger.info(
      { store_id: storeId, product_id: productId, filename, content_type },
      'Presigned URL issued',
    );
    res.json(result);
  } catch (err) {
    logger.error({ err, store_id: storeId, product_id: productId }, 'Failed to presign URL');
    throw new PdBadRequestError('Impossible de générer l\'URL d\'upload');
  }
};
