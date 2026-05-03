// pandamarket/backend/src/api/routes/pd/products/route.ts
// =============================================================================
// PandaMarket — Product Collection Routes
// GET  /api/pd/products?store_id=...   → Public product listing (published only)
// POST /api/pd/products                → Authenticated vendor creates a product
//                                        store_id is derived from JWT; unverified
//                                        vendors create draft (admin-approved),
//                                        verified vendors publish instantly.
// =============================================================================

import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { Modules } from '@medusajs/framework/utils';
import { z } from 'zod';

import { requireStoreContext } from '../../../middlewares/auth-context';
import {
  PdStoreNotFoundError,
  PdStoreSuspendedError,
  PdValidationError,
} from '../../../../utils/errors';
import {
  StoreStatus,
  SubscriptionPlan,
  ProductType,
  PD_EVENTS,
} from '../../../../utils/constants';
import { createServiceLogger } from '../../../../utils/logger';

const logger = createServiceLogger('ProductsRoute');

interface PdStoreLike {
  id: string;
  is_verified: boolean;
  status: StoreStatus;
  subscription_plan: SubscriptionPlan;
}

interface IPdStoreService {
  listPdStores(args: { filters: { id: string } }): Promise<PdStoreLike[]>;
}

interface IPdSubscriptionService {
  assertCanCreateProduct(plan: SubscriptionPlan, currentCount: number): void;
  assertCanUploadImage(plan: SubscriptionPlan, currentCount: number): void;
}

/**
 * GET /api/pd/products — public listing of published products.
 * Filter by store_id if provided. No auth required.
 */
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> => {
  const storeId = typeof req.query.store_id === 'string' ? req.query.store_id : undefined;
  const offset = Number.parseInt(req.query.offset as string, 10) || 0;
  const limit = Math.min(Number.parseInt(req.query.limit as string, 10) || 50, 100);

  const productModuleService = req.scope.resolve(Modules.PRODUCT) as unknown as {
    listAndCountProducts: (
      where: Record<string, unknown>,
      opts: Record<string, unknown>,
    ) => Promise<[unknown[], number]>;
  };

  const filter: Record<string, unknown> = { status: 'published' };
  if (storeId) {
    (filter as { 'metadata.store_id'?: string })['metadata.store_id'] = storeId;
  }

  const [products, count] = await productModuleService.listAndCountProducts(filter, {
    select: ['id', 'title', 'description', 'status', 'thumbnail', 'metadata', 'created_at'],
    relations: ['variants', 'categories'],
    skip: offset,
    take: limit,
  });

  res.json({ products, count, offset, limit });
};

const createProductSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  price: z.number().finite().nonnegative(),
  stock: z.number().int().nonnegative(),
  images: z.array(z.string().url()).max(50).optional(),
  category: z.string().max(100).optional(),
  product_type: z.nativeEnum(ProductType).optional().default(ProductType.Physical),
});

/**
 * POST /api/pd/products — authenticated vendor creates a product.
 * - store_id is ALWAYS derived from JWT; never trusted from body.
 * - Quota + image-count checks enforced.
 * - Unverified vendors create draft products for admin approval.
 */
export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> => {
  const { storeId } = requireStoreContext(req);

  const parsed = createProductSchema.safeParse(req.body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    parsed.error.issues.forEach((issue) => {
      fields[issue.path.join('.')] = issue.message;
    });
    throw new PdValidationError('Données invalides', { fields });
  }
  const data = parsed.data;

  const storeService = req.scope.resolve<IPdStoreService>('pdStoreService');
  const subscriptionService = req.scope.resolve<IPdSubscriptionService>('pdSubscriptionService');
  const productModuleService = req.scope.resolve(Modules.PRODUCT) as unknown as {
    listAndCountProducts: (
      where: Record<string, unknown>,
      opts: Record<string, unknown>,
    ) => Promise<[unknown[], number]>;
    createProducts: (input: unknown[]) => Promise<Array<{ id: string }>>;
  };
  const eventBus = req.scope.resolve(Modules.EVENT_BUS) as unknown as {
    emit: (args: { name: string; data: Record<string, unknown> }) => Promise<void>;
  };

  const [store] = await storeService.listPdStores({ filters: { id: storeId } });
  if (!store) throw new PdStoreNotFoundError(storeId);
  if (store.status === StoreStatus.Suspended) throw new PdStoreSuspendedError(storeId);

  // Quota: current product count for this vendor.
  const [, productCount] = await productModuleService.listAndCountProducts(
    { 'metadata.store_id': storeId },
    { skip: 0, take: 1 },
  );
  subscriptionService.assertCanCreateProduct(store.subscription_plan, productCount);

  // Image quota per product (already zero existing images on creation).
  const newImageCount = data.images?.length ?? 0;
  if (newImageCount > 0) {
    subscriptionService.assertCanUploadImage(store.subscription_plan, newImageCount);
  }

  const isDigital = data.product_type === ProductType.Digital;
  const shouldPublishImmediately = store.is_verified;
  const productStatus = shouldPublishImmediately ? 'published' : 'draft';

  const [product] = await productModuleService.createProducts([
    {
      title: data.title,
      description: data.description,
      status: productStatus,
      thumbnail: data.images?.[0] ?? null,
      images: (data.images ?? []).map((url) => ({ url })),
      metadata: {
        store_id: storeId,
        category: data.category,
        product_type: data.product_type,
        is_digital: isDigital,
        price: data.price,
        stock: data.stock,
      },
      options: [{ title: 'Default Option' }],
      variants: [
        {
          title: 'Default Variant',
          manage_inventory: !isDigital,
          options: { 'Default Option': 'Default' },
        },
      ],
    },
  ]);

  if (shouldPublishImmediately) {
    await eventBus.emit({
      name: PD_EVENTS.PRODUCT_PUBLISHED,
      data: { product_id: product.id, store_id: storeId },
    });
  } else {
    await eventBus.emit({
      name: PD_EVENTS.PRODUCT_PENDING_APPROVAL,
      data: { product_id: product.id, store_id: storeId },
    });
  }

  logger.info(
    { store_id: storeId, product_id: product.id, status: productStatus },
    'Product created',
  );

  res.status(201).json({
    product,
    requires_approval: !shouldPublishImmediately,
  });
};
