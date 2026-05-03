import { MeiliSearch } from 'meilisearch';

let meiliClient: MeiliSearch | null = null;

export const MEILI_PRODUCTS_INDEX = 'pandamarket_products';

export interface MeiliProductSource {
  id: string;
  title: string;
  description?: string | null;
  thumbnail?: string | null;
  status: string;
  created_at?: string | Date | null;
  metadata?: Record<string, unknown> | null;
}

export interface MeiliProductDocument {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  status: string;
  created_at: string;
  category: string;
  store_id: string | null;
  vendor_name: string;
  price: number;
}

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

  const host = process.env.MEILISEARCH_HOST;
  const apiKey = process.env.MEILISEARCH_API_KEY;
  if (process.env.PD_NODE_ENV === 'production' && !host) {
    throw new Error('MEILISEARCH_HOST must be set in production');
  }
  if (process.env.PD_NODE_ENV === 'production' && !apiKey) {
    throw new Error('MEILISEARCH_API_KEY must be set in production');
  }

  meiliClient = new MeiliSearch({
    host: host ?? 'http://localhost:7700',
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

function readIntegerEnv(name: string, defaultValue: number, min: number, max: number): number {
  const rawValue = process.env[name] ?? String(defaultValue);
  const value = Number(rawValue);
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${name} must be an integer between ${min} and ${max}`);
  }
  return value;
}

function metadataString(metadata: Record<string, unknown>, key: string): string | undefined {
  const value = metadata[key];
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function metadataNumber(metadata: Record<string, unknown>, key: string): number | undefined {
  const value = metadata[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function formatCreatedAt(value: string | Date | null | undefined): string {
  if (value instanceof Date) return value.toISOString();
  return typeof value === 'string' ? value : '';
}

function getMeiliBatchSize(): number {
  return readIntegerEnv('PD_MEILI_BATCH_SIZE', 500, 1, 1_000);
}

function getMeiliTaskTimeoutMs(): number {
  return readIntegerEnv('PD_MEILI_TASK_TIMEOUT_MS', 120_000, 1_000, 900_000);
}

function shouldWaitForMeiliTasks(): boolean {
  return process.env.PD_MEILI_WAIT_FOR_TASKS === 'true';
}

export function getProductStoreId(product: MeiliProductSource): string | undefined {
  return metadataString(product.metadata ?? {}, 'store_id');
}

export function buildMeiliProductDocument(
  product: MeiliProductSource,
  vendorName: string,
): MeiliProductDocument {
  const metadata = product.metadata ?? {};
  return {
    id: product.id,
    title: product.title,
    description: product.description ?? '',
    thumbnail: product.thumbnail ?? null,
    status: product.status,
    created_at: formatCreatedAt(product.created_at),
    category: metadataString(metadata, 'category') ?? 'autre',
    store_id: getProductStoreId(product) ?? null,
    vendor_name: vendorName,
    price: metadataNumber(metadata, 'price') ?? 0,
  };
}

export async function indexProductDocuments(
  documents: MeiliProductDocument[],
  batchSize = getMeiliBatchSize(),
): Promise<number> {
  const client = getMeiliClient();
  const index = client.index(MEILI_PRODUCTS_INDEX);
  let indexed = 0;

  for (let offset = 0; offset < documents.length; offset += batchSize) {
    const batch = documents.slice(offset, offset + batchSize);
    const task = await index.addDocuments(batch);
    if (shouldWaitForMeiliTasks()) {
      await client.waitForTask(task.taskUid, { timeOutMs: getMeiliTaskTimeoutMs() });
    }
    indexed += batch.length;
  }

  return indexed;
}

export async function deleteProductDocument(productId: string): Promise<void> {
  const client = getMeiliClient();
  const task = await client.index(MEILI_PRODUCTS_INDEX).deleteDocument(productId);
  if (shouldWaitForMeiliTasks()) {
    await client.waitForTask(task.taskUid, { timeOutMs: getMeiliTaskTimeoutMs() });
  }
}
