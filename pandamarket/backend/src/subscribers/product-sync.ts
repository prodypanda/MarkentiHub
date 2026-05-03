// pandamarket/backend/src/subscribers/product-sync.ts
// =============================================================================
// PandaMarket — Meilisearch Product Sync
// Keeps the Meilisearch index mirrored with published products.
// =============================================================================

import { type SubscriberConfig, type SubscriberArgs } from '@medusajs/framework';
import { Modules } from '@medusajs/framework/utils';

import { getMeiliClient, MEILI_PRODUCTS_INDEX } from '../utils/meilisearch';
import { createServiceLogger } from '../utils/logger';

const logger = createServiceLogger('ProductSyncSubscriber');

interface ProductLike {
  id: string;
  title: string;
  description?: string | null;
  thumbnail?: string | null;
  status: string;
  created_at: string;
  metadata?: Record<string, unknown> | null;
}

interface PdStoreLike {
  id: string;
  name: string;
}

interface IPdStoreService {
  listPdStores(args: { filters: { id: string } }): Promise<PdStoreLike[]>;
}

interface IProductModuleService {
  retrieveProduct(id: string, opts?: Record<string, unknown>): Promise<ProductLike>;
}

export default async function productSyncSubscriber({
  event: { data, name },
  container,
}: SubscriberArgs<{ id: string }>): Promise<void> {
  const productModuleService = container.resolve(Modules.PRODUCT) as unknown as IProductModuleService;
  const pdStoreService = container.resolve<IPdStoreService>('pdStoreService');
  const index = getMeiliClient().index(MEILI_PRODUCTS_INDEX);

  const productId = data.id;

  if (name === 'product.deleted') {
    try {
      await index.deleteDocument(productId);
    } catch (err) {
      logger.warn({ err, product_id: productId }, 'Meilisearch delete failed');
    }
    return;
  }

  let product: ProductLike;
  try {
    product = await productModuleService.retrieveProduct(productId, {
      relations: ['variants', 'categories'],
    });
  } catch (err) {
    logger.warn({ err, product_id: productId }, 'Product retrieve failed during sync');
    return;
  }

  if (product.status !== 'published') {
    try {
      await index.deleteDocument(productId);
    } catch (err) {
      logger.debug({ err, product_id: productId }, 'Meilisearch delete (non-published) failed');
    }
    return;
  }

  const metadata = (product.metadata ?? {}) as { store_id?: string; category?: string; price?: number };
  const storeId = metadata.store_id;
  let vendorName = 'PandaMarket Vendor';

  if (storeId) {
    try {
      const [store] = await pdStoreService.listPdStores({ filters: { id: storeId } });
      if (store) vendorName = store.name;
    } catch (err) {
      logger.debug({ err, store_id: storeId }, 'Store resolution failed');
    }
  }

  const document = {
    id: product.id,
    title: product.title,
    description: product.description ?? '',
    thumbnail: product.thumbnail ?? null,
    status: product.status,
    created_at: product.created_at,
    category: metadata.category ?? 'autre',
    store_id: storeId ?? null,
    vendor_name: vendorName,
    price: metadata.price ?? 0,
  };

  try {
    await index.addDocuments([document]);
  } catch (err) {
    logger.error({ err, product_id: productId }, 'Meilisearch upsert failed');
  }
}

export const config: SubscriberConfig = {
  event: ['product.created', 'product.updated', 'product.deleted'],
};
