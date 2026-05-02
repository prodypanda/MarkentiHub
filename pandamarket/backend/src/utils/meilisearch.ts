import { MeiliSearch } from 'meilisearch';

let meiliClient: MeiliSearch | null = null;

export const MEILI_PRODUCTS_INDEX = 'pandamarket_products';

export function getMeiliClient(): MeiliSearch {
  if (meiliClient) {
    return meiliClient;
  }

  const host = process.env.MEILISEARCH_HOST || 'http://localhost:7700';
  const apiKey = process.env.MEILISEARCH_API_KEY || 'masterKey';

  meiliClient = new MeiliSearch({
    host,
    apiKey,
  });

  return meiliClient;
}

/**
 * Ensures the index exists and has the correct searchable/filterable attributes
 */
export async function initializeMeilisearch() {
  const client = getMeiliClient();
  const index = client.index(MEILI_PRODUCTS_INDEX);

  try {
    await client.createIndex(MEILI_PRODUCTS_INDEX, { primaryKey: 'id' });
  } catch (e: any) {
    // Ignore if index already exists
  }

  await index.updateFilterableAttributes([
    'category',
    'store_id',
    'price',
    'vendor_name',
  ]);

  await index.updateSearchableAttributes([
    'title',
    'description',
    'category',
    'vendor_name',
  ]);

  await index.updateSortableAttributes([
    'price',
    'created_at',
  ]);
}
