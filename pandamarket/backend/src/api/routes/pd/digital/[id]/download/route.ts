// @ts-nocheck
import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { generatePresignedDownloadUrl, getDigitalProductKey } from '../../../../../../utils/s3';
import { PdBadRequestError, PdForbiddenError } from '../../../../../../utils/errors';
import { S3_BUCKETS } from '../../../../../../utils/constants';
import { Modules } from '@medusajs/framework/utils';

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse,
) => {
  // In a real flow, we verify if the user purchased this product!
  // E.g., req.user.id has an Order containing productId where status is paid.
  // For MVP, we'll verify a 'token' query param sent to the buyer's email.
  
  const productId = req.params.id;
  const token = req.query.token as string;

  if (!token) {
    throw new PdForbiddenError('Missing download token');
  }

  // Very basic token check for MVP (would be a JWT or db-stored token)
  if (token !== 'valid_purchase_token') {
    throw new PdForbiddenError('Invalid or expired download token');
  }

  const productModuleService = req.scope.resolve(Modules.PRODUCT);
  const product = await productModuleService.retrieveProduct(productId);
  
  const isDigital = (product.metadata as Record<string, any>)?.is_digital;
  if (!isDigital) {
    throw new PdBadRequestError('This product is not a digital product');
  }

  const storeId = (product.metadata as Record<string, any>)?.store_id;
  const filename = (product.metadata as Record<string, any>)?.digital_file_name || 'file.zip';

  const key = getDigitalProductKey(storeId, productId, filename);

  const downloadUrl = await generatePresignedDownloadUrl({
    bucket: S3_BUCKETS.PRIVATE_FILES,
    key,
    // URL expires in 24 hours
    expiresIn: 86400,
  });

  // Redirect the user directly to the S3 secure download
  res.redirect(downloadUrl);
};
