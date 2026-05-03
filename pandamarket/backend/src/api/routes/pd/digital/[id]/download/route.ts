// pandamarket/backend/src/api/routes/pd/digital/[id]/download/route.ts
// =============================================================================
// PandaMarket — Digital Product Download
// GET /api/pd/digital/:id/download?token=XXX
// The token is a short-lived JWT signed with PD_JWT_SECRET that the order
// fulfillment subscriber emails to the buyer. We verify the token carries:
//   { sub: buyer_id, product_id, order_id, iat, exp }
// and that it matches the requested product id.
// =============================================================================

import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { Modules } from '@medusajs/framework/utils';
import jwt from 'jsonwebtoken';
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/api/routes/pd/digital/[id]/download/route.ts
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/api/routes/pd/digital/[id]/download/route.ts
=======
import { z } from 'zod';
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/api/routes/pd/digital/[id]/download/route.ts
=======
import { z } from 'zod';
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/api/routes/pd/digital/[id]/download/route.ts

import {
  generatePresignedDownloadUrl,
  getDigitalProductKey,
} from '../../../../../../utils/s3';
import {
  PdBadRequestError,
  PdForbiddenError,
  PdNotFoundError,
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/api/routes/pd/digital/[id]/download/route.ts
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/api/routes/pd/digital/[id]/download/route.ts
=======
  PdValidationError,
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/api/routes/pd/digital/[id]/download/route.ts
=======
  PdValidationError,
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/api/routes/pd/digital/[id]/download/route.ts
} from '../../../../../../utils/errors';
import { S3_BUCKETS, FILE_CONSTRAINTS } from '../../../../../../utils/constants';
import { createServiceLogger } from '../../../../../../utils/logger';

const logger = createServiceLogger('DigitalDownloadRoute');

<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/api/routes/pd/digital/[id]/download/route.ts
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/api/routes/pd/digital/[id]/download/route.ts
=======
=======
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/api/routes/pd/digital/[id]/download/route.ts
const paramsSchema = z.object({
  id: z.string().trim().min(1).max(128),
});

const querySchema = z.object({
  token: z.string().trim().min(1).max(4096),
});

<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/api/routes/pd/digital/[id]/download/route.ts
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/api/routes/pd/digital/[id]/download/route.ts
=======
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/api/routes/pd/digital/[id]/download/route.ts
interface DownloadTokenPayload {
  sub: string;
  product_id: string;
  order_id: string;
  iat?: number;
  exp?: number;
}

interface ProductLike {
  id: string;
  metadata?: Record<string, unknown> | null;
}

interface IProductModuleService {
  retrieveProduct(id: string): Promise<ProductLike>;
}

<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/api/routes/pd/digital/[id]/download/route.ts
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/api/routes/pd/digital/[id]/download/route.ts
=======
=======
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/api/routes/pd/digital/[id]/download/route.ts
function firstQueryValue(value: unknown): string | undefined {
  if (Array.isArray(value)) {
    return typeof value[0] === 'string' ? value[0] : undefined;
  }
  return typeof value === 'string' ? value : undefined;
}

function validationFields(error: z.ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  error.issues.forEach((issue) => {
    fields[issue.path.join('.')] = issue.message;
  });
  return fields;
}

function isDownloadTokenPayload(value: unknown): value is DownloadTokenPayload {
  if (typeof value !== 'object' || value === null) return false;
  const payload = value as Record<string, unknown>;
  return (
    typeof payload.sub === 'string' &&
    typeof payload.product_id === 'string' &&
    typeof payload.order_id === 'string'
  );
}

<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/api/routes/pd/digital/[id]/download/route.ts
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/api/routes/pd/digital/[id]/download/route.ts
=======
>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/api/routes/pd/digital/[id]/download/route.ts
function getJwtSecret(): string {
  const secret = process.env.PD_JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error('PD_JWT_SECRET must be set (>= 16 chars)');
  }
  return secret;
}

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> => {
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/api/routes/pd/digital/[id]/download/route.ts
<<<<<<< H:/markentihub/MarkentiHub/pandamarket/backend/src/api/routes/pd/digital/[id]/download/route.ts
  const productId = req.params.id;
  const token = typeof req.query.token === 'string' ? req.query.token : '';

  if (!token) {
    throw new PdForbiddenError('PD_PERM_FORBIDDEN', 'Token de téléchargement manquant');
  }

  let payload: DownloadTokenPayload;
  try {
    payload = jwt.verify(token, getJwtSecret()) as DownloadTokenPayload;
  } catch {
    throw new PdForbiddenError('PD_PERM_FORBIDDEN', 'Token invalide ou expiré');
  }

  if (payload.product_id !== productId) {
    throw new PdForbiddenError('PD_PERM_FORBIDDEN', 'Token non valable pour ce produit');
  }

  const productModuleService = req.scope.resolve(Modules.PRODUCT) as unknown as IProductModuleService;
  let product: ProductLike;
  try {
    product = await productModuleService.retrieveProduct(productId);
  } catch {
    throw new PdNotFoundError('Produit');
  }

  const metadata = (product.metadata ?? {}) as {
    is_digital?: boolean;
    store_id?: string;
    digital_file_name?: string;
  };

=======
  const parsedParams = paramsSchema.safeParse(req.params);
  const parsedQuery = querySchema.safeParse({
    token: firstQueryValue(req.query.token),
  });
  if (!parsedParams.success || !parsedQuery.success) {
    throw new PdValidationError('Données invalides', {
      fields: {
        ...(!parsedParams.success ? validationFields(parsedParams.error) : {}),
        ...(!parsedQuery.success ? validationFields(parsedQuery.error) : {}),
      },
    });
  }
  const productId = parsedParams.data.id;
  const { token } = parsedQuery.data;

  let payload: DownloadTokenPayload;
  try {
    const decoded = jwt.verify(token, getJwtSecret());
    if (!isDownloadTokenPayload(decoded)) {
      throw new Error('Invalid download token payload');
    }
    payload = decoded;
  } catch {
    throw new PdForbiddenError('PD_PERM_FORBIDDEN', 'Token invalide ou expiré');
  }

  if (payload.product_id !== productId) {
    throw new PdForbiddenError('PD_PERM_FORBIDDEN', 'Token non valable pour ce produit');
  }

  const productModuleService = req.scope.resolve(Modules.PRODUCT) as unknown as IProductModuleService;
  let product: ProductLike;
  try {
    product = await productModuleService.retrieveProduct(productId);
  } catch {
    throw new PdNotFoundError('Produit');
  }

  const metadata = (product.metadata ?? {}) as {
    is_digital?: boolean;
    store_id?: string;
    digital_file_name?: string;
  };

>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/api/routes/pd/digital/[id]/download/route.ts
=======
  const parsedParams = paramsSchema.safeParse(req.params);
  const parsedQuery = querySchema.safeParse({
    token: firstQueryValue(req.query.token),
  });
  if (!parsedParams.success || !parsedQuery.success) {
    throw new PdValidationError('Données invalides', {
      fields: {
        ...(!parsedParams.success ? validationFields(parsedParams.error) : {}),
        ...(!parsedQuery.success ? validationFields(parsedQuery.error) : {}),
      },
    });
  }
  const productId = parsedParams.data.id;
  const { token } = parsedQuery.data;

  let payload: DownloadTokenPayload;
  try {
    const decoded = jwt.verify(token, getJwtSecret());
    if (!isDownloadTokenPayload(decoded)) {
      throw new Error('Invalid download token payload');
    }
    payload = decoded;
  } catch {
    throw new PdForbiddenError('PD_PERM_FORBIDDEN', 'Token invalide ou expiré');
  }

  if (payload.product_id !== productId) {
    throw new PdForbiddenError('PD_PERM_FORBIDDEN', 'Token non valable pour ce produit');
  }

  const productModuleService = req.scope.resolve(Modules.PRODUCT) as unknown as IProductModuleService;
  let product: ProductLike;
  try {
    product = await productModuleService.retrieveProduct(productId);
  } catch {
    throw new PdNotFoundError('Produit');
  }

  const metadata = (product.metadata ?? {}) as {
    is_digital?: boolean;
    store_id?: string;
    digital_file_name?: string;
  };

>>>>>>> C:/Users/PC/.windsurf/worktrees/MarkentiHub/MarkentiHub-5cc0a1c8/pandamarket/backend/src/api/routes/pd/digital/[id]/download/route.ts
  if (!metadata.is_digital) {
    throw new PdBadRequestError('Ce produit n\'est pas un produit numérique');
  }
  if (!metadata.store_id) {
    throw new PdNotFoundError('Fichier numérique');
  }

  const filename = metadata.digital_file_name ?? 'file.zip';
  const key = getDigitalProductKey(metadata.store_id, productId, filename);

  const downloadUrl = await generatePresignedDownloadUrl({
    bucket: S3_BUCKETS.PRIVATE_FILES,
    key,
    expiresIn: FILE_CONSTRAINTS.PRESIGNED_URL_EXPIRY_DOWNLOAD,
  });

  logger.info(
    { product_id: productId, order_id: payload.order_id, buyer_id: payload.sub },
    'Digital download authorized',
  );

  res.redirect(downloadUrl);
};
