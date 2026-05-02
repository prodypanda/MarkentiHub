// @ts-nocheck
import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { z } from 'zod';
import { getProductImageUploadUrl } from '../../../../../utils/s3';
import { PdBadRequestError } from '../../../../../utils/errors';
import { generatePdId } from '../../../../../utils/crypto';

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse,
) => {
  const schema = z.object({
    store_id: z.string(),
    product_id: z.string().optional(),
    filename: z.string(),
    content_type: z.string().refine((val) => val.startsWith('image/'), {
      message: 'Only images are allowed',
    }),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    throw new PdBadRequestError('Invalid request body', parsed.error.format());
  }

  const { store_id, filename, content_type } = parsed.data;
  
  // If no product_id is provided, generate a temporary one for the upload path
  const product_id = parsed.data.product_id || generatePdId('tmp_prod');

  try {
    const result = await getProductImageUploadUrl(
      store_id,
      product_id,
      filename,
      content_type,
    );

    res.json(result);
  } catch (error) {
    throw new PdBadRequestError('Failed to generate presigned URL');
  }
};
