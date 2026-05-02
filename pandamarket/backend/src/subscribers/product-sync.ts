import { type SubscriberConfig, type SubscriberArgs } from '@medusajs/framework';
import { Modules } from '@medusajs/framework/utils';
import { getMeiliClient, MEILI_PRODUCTS_INDEX } from '../utils/meilisearch';

export default async function productSyncSubscriber({
  event: { data, name },
  container,
}: SubscriberArgs<{ id: string }>) {
  const productModuleService = container.resolve(Modules.PRODUCT);
  const storeModuleService: any = container.resolve('pdStoreModuleService');
  const meili = getMeiliClient();
  const index = meili.index(MEILI_PRODUCTS_INDEX);

  const productId = data.id;

  if (name === 'product.deleted') {
    await index.deleteDocument(productId);
    return;
  }

  // Handle product.created and product.updated
  const product = await productModuleService.retrieveProduct(productId, {
    relations: ['variants', 'categories'],
  });

  if (!product) return;
  if (product.status !== 'published') {
    // If it was indexed but is now a draft, remove it from search
    await index.deleteDocument(productId);
    return;
  }

  const storeId = (product.metadata as Record<string, any>)?.store_id;
  let vendorName = 'PandaMarket Vendor';

  if (storeId) {
    try {
      const store = await storeModuleService.retrieveStore(storeId);
      vendorName = store.name;
    } catch (e) {
      // Store might not exist or be accessible
    }
  }

  // Format document for Meilisearch
  const document = {
    id: product.id,
    title: product.title,
    description: product.description,
    thumbnail: product.thumbnail,
    status: product.status,
    created_at: product.created_at,
    category: (product.metadata as Record<string, any>)?.category || 'autre',
    store_id: storeId,
    vendor_name: vendorName,
    // Typically price comes from variant price sets, but for MVP we use metadata
    price: (product.metadata as Record<string, any>)?.price || 0,
  };

  await index.addDocuments([document]);
}

export const config: SubscriberConfig = {
  event: ['product.created', 'product.updated', 'product.deleted'],
};
