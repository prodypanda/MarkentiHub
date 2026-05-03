import { MeiliSearch } from 'meilisearch';

let meiliClient: MeiliSearch | null = null;

export const MEILI_PRODUCTS_INDEX = 'pandamarket_products';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isIndexAlreadyExistsError(error: unknown): boolean {
  if (!isRecord(error)) return false;
  const code = error.code;
  const type = error.type;
  const message = error.message;
  return (
    code === 'index_already_exists' ||
    type === 'index_already_exists' ||
    (typeof message === 'string' && message.toLowerCase().includes('already exists'))
  );
}

export function getMeiliClient(): MeiliSearch {
  if (meiliClient) {
    return meiliClient;
  }

  const host = process.env.MEILISEARCH_HOST || 'http://localhost:7700';
  const apiKey = process.env.MEILISEARCH_API_KEY;
  if (process.env.PD_NODE_ENV === 'production' && !apiKey) {
    throw new Error('MEILISEARCH_API_KEY must be set in production');
  }

  meiliClient = new MeiliSearch({
    host,
    ...(apiKey ? { apiKey } : {}),
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
  } catch (error: unknown) {
    // Ignore if index already exists
    if (!isIndexAlreadyExistsError(error)) {
      throw error;
    }
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
