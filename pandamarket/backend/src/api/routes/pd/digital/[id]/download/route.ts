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

import {
  generatePresignedDownloadUrl,
  getDigitalProductKey,
} from '../../../../../../utils/s3';
import {
  PdBadRequestError,
  PdForbiddenError,
  PdNotFoundError,
} from '../../../../../../utils/errors';
import { S3_BUCKETS, FILE_CONSTRAINTS } from '../../../../../../utils/constants';
import { createServiceLogger } from '../../../../../../utils/logger';

const logger = createServiceLogger('DigitalDownloadRoute');

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
