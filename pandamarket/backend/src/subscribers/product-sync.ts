// pandamarket/backend/src/subscribers/product-sync.ts
// =============================================================================
// PandaMarket — Meilisearch Product Sync
// Keeps the Meilisearch index mirrored with published products.
// =============================================================================

import { type SubscriberConfig, type SubscriberArgs } from '@medusajs/framework';
import { Modules } from '@medusajs/framework/utils';

import {
  buildMeiliProductDocument,
  deleteProductDocument,
  getProductStoreId,
  indexProductDocuments,
  type MeiliProductSource,
} from '../utils/meilisearch';
import { createServiceLogger } from '../utils/logger';

const logger = createServiceLogger('ProductSyncSubscriber');

type ProductLike = MeiliProductSource;

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

  const productId = data.id;

  if (name === 'product.deleted') {
    try {
      await deleteProductDocument(productId);
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
      await deleteProductDocument(productId);
    } catch (err) {
      logger.debug({ err, product_id: productId }, 'Meilisearch delete (non-published) failed');
    }
    return;
  }

  const storeId = getProductStoreId(product);
  let vendorName = 'PandaMarket Vendor';

  if (storeId) {
    try {
      const [store] = await pdStoreService.listPdStores({ filters: { id: storeId } });
      if (store) vendorName = store.name;
    } catch (err) {
      logger.debug({ err, store_id: storeId }, 'Store resolution failed');
    }
  }

  const document = buildMeiliProductDocument(product, vendorName);

  try {
    await indexProductDocuments([document], 1);
  } catch (err) {
    logger.error({ err, product_id: productId }, 'Meilisearch upsert failed');
  }
}

export const config: SubscriberConfig = {
  event: ['product.created', 'product.updated', 'product.deleted'],
};
