// pandamarket/backend/src/api/routes/pd/products/[id]/route.ts
// =============================================================================
// PandaMarket — Product Detail Routes
// GET    /api/pd/products/:id   → Public product detail (must be published)
// PUT    /api/pd/products/:id   → Authenticated vendor update (owner only)
// DELETE /api/pd/products/:id   → Authenticated vendor delete (owner only)
// store_id is ALWAYS derived from JWT; the product's metadata.store_id must match.
// =============================================================================

import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { Modules } from '@medusajs/framework/utils';
import { z } from 'zod';

import { requireStoreContext } from '../../../../middlewares/auth-context';
import {
  PdNotFoundError,
  PdNotOwnerError,
  PdValidationError,
} from '../../../../../utils/errors';
import { SubscriptionPlan } from '../../../../../utils/constants';
import { createServiceLogger } from '../../../../../utils/logger';

const logger = createServiceLogger('ProductDetailRoute');

interface PdStoreLike {
  id: string;
  subscription_plan: SubscriptionPlan;
}

interface IPdStoreService {
  listPdStores(args: { filters: { id: string } }): Promise<PdStoreLike[]>;
}

interface IPdSubscriptionService {
  assertCanUploadImage(plan: SubscriptionPlan, currentCount: number): void;
}

interface ProductLike {
  id: string;
  status?: string;
  metadata?: Record<string, unknown> | null;
  images?: Array<{ url: string }> | null;
}

interface IProductModuleService {
  retrieveProduct(id: string, opts?: Record<string, unknown>): Promise<ProductLike>;
  updateProducts(id: string, data: Record<string, unknown>): Promise<ProductLike>;
  deleteProducts(id: string): Promise<void>;
}

async function getProductForOwner(
  req: MedusaRequest,
  productId: string,
  storeId: string,
): Promise<ProductLike> {
  const productModuleService = req.scope.resolve(Modules.PRODUCT) as unknown as IProductModuleService;
  let product: ProductLike;
  try {
    product = await productModuleService.retrieveProduct(productId);
  } catch {
    throw new PdNotFoundError('Produit');
  }
  const productStoreId = (product.metadata ?? {})['store_id'];
  if (productStoreId !== storeId) {
    throw new PdNotOwnerError(productId);
  }
  return product;
}

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> => {
  const productId = req.params.id;
  const productModuleService = req.scope.resolve(Modules.PRODUCT) as unknown as IProductModuleService;

  let product: ProductLike;
  try {
    product = await productModuleService.retrieveProduct(productId, {
      relations: ['variants', 'categories', 'images'],
    });
  } catch {
    throw new PdNotFoundError('Produit');
  }

  // Hide drafts & pending products from the public endpoint.
  if (product.status !== 'published') {
    throw new PdNotFoundError('Produit');
  }

  res.json({ product });
};

const updateProductSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
  price: z.number().finite().nonnegative().optional(),
  stock: z.number().int().nonnegative().optional(),
  images: z.array(z.string().url()).max(50).optional(),
  category: z.string().max(100).optional(),
});

export const PUT = async (
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> => {
  const { storeId } = requireStoreContext(req);
  const productId = req.params.id;

  const parsed = updateProductSchema.safeParse(req.body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    parsed.error.issues.forEach((issue) => {
      fields[issue.path.join('.')] = issue.message;
    });
    throw new PdValidationError('Données invalides', { fields });
  }
  const data = parsed.data;

  const product = await getProductForOwner(req, productId, storeId);

  const productModuleService = req.scope.resolve(Modules.PRODUCT) as unknown as IProductModuleService;

  // Image quota — compare new image count against plan limit.
  if (data.images && data.images.length > 0) {
    const storeService = req.scope.resolve<IPdStoreService>('pdStoreService');
    const subscriptionService = req.scope.resolve<IPdSubscriptionService>('pdSubscriptionService');
    const [store] = await storeService.listPdStores({ filters: { id: storeId } });
    if (store) {
      subscriptionService.assertCanUploadImage(store.subscription_plan, data.images.length);
    }
  }

  const updateData: Record<string, unknown> = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.images) {
    updateData.images = data.images.map((url) => ({ url }));
    updateData.thumbnail = data.images[0] ?? null;
  }

  if (
    data.category !== undefined ||
    data.price !== undefined ||
    data.stock !== undefined
  ) {
    updateData.metadata = {
      ...(product.metadata ?? {}),
      ...(data.category !== undefined ? { category: data.category } : {}),
      ...(data.price !== undefined ? { price: data.price } : {}),
      ...(data.stock !== undefined ? { stock: data.stock } : {}),
    };
  }

  const updated = await productModuleService.updateProducts(productId, updateData);

  logger.info({ store_id: storeId, product_id: productId }, 'Product updated');
  res.json({ product: updated });
};

export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> => {
  const { storeId } = requireStoreContext(req);
  const productId = req.params.id;

  await getProductForOwner(req, productId, storeId);

  const productModuleService = req.scope.resolve(Modules.PRODUCT) as unknown as IProductModuleService;
  await productModuleService.deleteProducts(productId);

  logger.info({ store_id: storeId, product_id: productId }, 'Product deleted');
  res.json({ success: true });
};
