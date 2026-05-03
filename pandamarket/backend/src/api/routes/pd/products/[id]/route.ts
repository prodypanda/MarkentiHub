// @ts-nocheck
import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { z } from 'zod';
import { PdBadRequestError, PdForbiddenError, PdNotOwnerError } from '../../../../../utils/errors';
import { Modules } from '@medusajs/framework/utils';

export const PUT = async (
  req: MedusaRequest,
  res: MedusaResponse,
) => {
  const storeId = (req as any).pd_store_id as string;
  if (!storeId) throw new PdForbiddenError();

  const productId = req.params.id;
  const schema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    price: z.number().min(0).optional(),
    stock: z.number().min(0).optional(),
    images: z.array(z.string()).optional(),
    category: z.string().optional(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    throw new PdBadRequestError('Invalid request body', parsed.error.format());
  }

  const data = parsed.data;
  const productModuleService = req.scope.resolve(Modules.PRODUCT);

  // 1. Verify ownership via authenticated store_id
  const product = await productModuleService.retrieveProduct(productId);
  if ((product.metadata as Record<string, any>)?.store_id !== storeId) {
    throw new PdNotOwnerError(productId);
  }

  // 2. Update the product
  const updateData: any = {};
  if (data.title) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.images) {
    updateData.images = data.images.map(url => ({ url }));
    if (data.images.length > 0) updateData.thumbnail = data.images[0];
  }
  
  // Metadata updates
  if (data.category !== undefined || data.price !== undefined || data.stock !== undefined) {
    updateData.metadata = {
      ...product.metadata,
      ...(data.category && { category: data.category }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.stock !== undefined && { stock: data.stock }),
    };
  }

  const updated = await productModuleService.updateProducts(productId, updateData);

  res.json({ product: updated });
};

export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse,
) => {
  const storeId = (req as any).pd_store_id as string;
  if (!storeId) throw new PdForbiddenError();

  const productId = req.params.id;
  const productModuleService = req.scope.resolve(Modules.PRODUCT);

  // Verify ownership before deleting
  const product = await productModuleService.retrieveProduct(productId);
  if ((product.metadata as Record<string, any>)?.store_id !== storeId) {
    throw new PdNotOwnerError(productId);
  }

  await productModuleService.deleteProducts(productId);

  res.status(200).json({ success: true });
};

