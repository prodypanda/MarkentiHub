// @ts-nocheck
import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { z } from 'zod';
import { PdBadRequestError, PdForbiddenError } from '../../../../utils/errors';
import { Modules } from '@medusajs/framework/utils';
import { IPdSubscriptionModuleService } from '../../../../modules/pd-subscription/types';
import { IPdStoreModuleService } from '../../../../modules/pd-store/types';

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse,
) => {
  const storeId = req.query.store_id as string;
  if (!storeId) {
    throw new PdBadRequestError('store_id is required');
  }

  const productModuleService = req.scope.resolve(Modules.PRODUCT);

  // Note: in Medusa v2, you can associate products to a store via an external link table 
  // or by adding a custom field (metadata or actual table).
  // For PandaMarket, we will query products where metadata.store_id = storeId
  // or using the Medusa API depending on how we extended it.
  
  // As a fast implementation for MVP, we rely on metadata for store association
  const [products, count] = await productModuleService.listAndCountProducts(
    {
      // @ts-ignore - Metadata filtering depends on the exact Medusa config, but this is the standard pattern
      "metadata.store_id": storeId,
    },
    {
      select: ["id", "title", "description", "status", "thumbnail", "metadata", "created_at"],
      relations: ["variants", "categories"],
      skip: parseInt(req.query.offset as string) || 0,
      take: parseInt(req.query.limit as string) || 50,
    }
  );

  res.json({ products, count, offset: req.query.offset || 0, limit: req.query.limit || 50 });
};

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse,
) => {
  const schema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    price: z.number().min(0), // In a real setup, we map this to a variant and a price set
    stock: z.number().min(0),
    images: z.array(z.string()).optional(),
    category: z.string().optional(),
    is_digital: z.boolean().optional().default(false),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    throw new PdBadRequestError('Invalid request body', parsed.error.format());
  }

  const data = parsed.data;
  const authenticatedStoreId = (req as Record<string, unknown>).pd_store_id as string;
  if (!authenticatedStoreId) {
    throw new PdForbiddenError();
  }

  const storeId = authenticatedStoreId;

  // 1. Resolve services
  const storeModuleService: IPdStoreModuleService = req.scope.resolve('pdStoreModuleService');
  const subscriptionModuleService: IPdSubscriptionModuleService = req.scope.resolve('pdSubscriptionModuleService');
  const productModuleService = req.scope.resolve(Modules.PRODUCT);

  // 2. Verify store exists
  const store = await storeModuleService.retrieveStore(storeId);
  
  // 3. Quota Enforcement: Check if vendor can create a new product
  // Get current product count
  const [, productCount] = await productModuleService.listAndCountProducts({
      // @ts-ignore
      "metadata.store_id": storeId,
  });

  // This will throw a PdProductQuotaExceededError if limit is reached
  await subscriptionModuleService.canCreateProduct(storeId, productCount);

  // Also enforce image quota
  if (data.images && data.images.length > 0) {
    await subscriptionModuleService.canUploadImage(storeId, data.images.length);
  }

  // 4. Create the product via Medusa core
  const product = await productModuleService.createProducts([
    {
      title: data.title,
      description: data.description,
      status: 'published', // Default to published
      thumbnail: data.images && data.images.length > 0 ? data.images[0] : null,
      images: data.images ? data.images.map(url => ({ url })) : [],
      metadata: {
        store_id: storeId,
        category: data.category,
        is_digital: data.is_digital,
        price: data.price,
        stock: data.stock,
      },
      // In Medusa v2, prices and inventory are handled via separate modules (Pricing / Inventory).
      // For a simplified SaaS/MaaS approach, we can attach this to metadata initially, 
      // or we'd need to create default variants, price sets, and inventory items.
      options: [
        { title: 'Default Option' }
      ],
      variants: [
        {
          title: 'Default Variant',
          manage_inventory: !data.is_digital, // Digital items don't need strict inventory usually
          options: { 'Default Option': 'Default' }
        }
      ]
    }
  ]);

  // TODO: Create Price Set and Inventory Item for the variant created above

  res.json({ product: product[0] });
};
