import { Modules } from '@medusajs/framework/utils';

import {
  buildMeiliProductDocument,
  getProductStoreId,
  indexProductDocuments,
  initializeMeilisearch,
  type MeiliProductDocument,
  type MeiliProductSource,
} from '../utils/meilisearch';
import { createServiceLogger } from '../utils/logger';

const logger = createServiceLogger('MeilisearchSyncScript');

interface PdStoreLike {
  id: string;
  name: string;
}

interface IProductModuleService {
  listAndCountProducts(
    filters: Record<string, unknown>,
    options: Record<string, unknown>,
  ): Promise<[MeiliProductSource[], number]>;
}

interface IPdStoreService {
  listPdStores(args: { filters: { id: string } }): Promise<PdStoreLike[]>;
}

interface SyncContainer {
  resolve(name: typeof Modules.PRODUCT): IProductModuleService;
  resolve(name: 'pdStoreService'): IPdStoreService;
}

function readIntegerEnv(name: string, defaultValue: number, min: number, max: number): number {
  const rawValue = process.env[name] ?? String(defaultValue);
  const value = Number(rawValue);
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${name} must be an integer between ${min} and ${max}`);
  }
  return value;
}

async function resolveVendorName(
  storeId: string | undefined,
  storeService: IPdStoreService,
  vendorNameCache: Map<string, string>,
): Promise<string> {
  if (!storeId) return 'PandaMarket Vendor';
  const cached = vendorNameCache.get(storeId);
  if (cached) return cached;

  try {
    const [store] = await storeService.listPdStores({ filters: { id: storeId } });
    const vendorName = store?.name ?? 'PandaMarket Vendor';
    vendorNameCache.set(storeId, vendorName);
    return vendorName;
  } catch (err) {
    logger.warn({ err, store_id: storeId }, 'Store resolution failed during Meilisearch sync');
    vendorNameCache.set(storeId, 'PandaMarket Vendor');
    return 'PandaMarket Vendor';
  }
}

export default async function syncMeilisearchProducts({ container }: { container: SyncContainer }): Promise<void> {
  const productModuleService = container.resolve(Modules.PRODUCT);
  const storeService = container.resolve('pdStoreService');
  const pageSize = readIntegerEnv('PD_MEILI_SYNC_PAGE_SIZE', 500, 1, 1_000);
  const vendorNameCache = new Map<string, string>();

  await initializeMeilisearch();

  let offset = 0;
  let total = 0;
  let indexed = 0;

  do {
    const [products, count] = await productModuleService.listAndCountProducts(
      { status: 'published' },
      {
        select: ['id', 'title', 'description', 'status', 'thumbnail', 'metadata', 'created_at'],
        relations: ['variants', 'categories'],
        skip: offset,
        take: pageSize,
      },
    );
    total = count;

    const documents: MeiliProductDocument[] = [];
    for (const product of products) {
      const storeId = getProductStoreId(product);
      const vendorName = await resolveVendorName(storeId, storeService, vendorNameCache);
      documents.push(buildMeiliProductDocument(product, vendorName));
    }

    const batchIndexed = await indexProductDocuments(documents);
    indexed += batchIndexed;
    logger.info(
      { offset, page_size: pageSize, batch_indexed: batchIndexed, indexed, total },
      'Meilisearch product batch indexed',
    );
    offset += pageSize;
  } while (offset < total);

  logger.info({ indexed, total, vendors_cached: vendorNameCache.size }, 'Meilisearch product sync completed');
}
