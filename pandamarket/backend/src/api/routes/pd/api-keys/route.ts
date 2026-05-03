// pandamarket/backend/src/api/routes/pd/api-keys/route.ts
// =============================================================================
// PandaMarket — Vendor API Key Management
// GET  /api/pd/api-keys   → List keys for the authenticated store
// POST /api/pd/api-keys   → Generate a new key; raw key returned ONCE
// Access gated by subscription plan (hasApiKeys must be true).
// =============================================================================

import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { z } from 'zod';

import { requireStoreContext } from '../../../middlewares/auth-context';
import { PdPlanRequiredError, PdStoreNotFoundError, PdValidationError } from '../../../../utils/errors';
import { PLAN_LIMITS, SubscriptionPlan } from '../../../../utils/constants';
import { createServiceLogger } from '../../../../utils/logger';

const logger = createServiceLogger('ApiKeysRoute');

const ALLOWED_SCOPES = ['read', 'write', 'products:read', 'products:write', 'orders:read'] as const;

const createKeySchema = z.object({
  label: z.string().min(1).max(100),
  scopes: z
    .array(z.enum(ALLOWED_SCOPES))
    .min(1)
    .default(['read']),
  expires_at: z.string().datetime().optional(),
});

interface ApiKeyRecord {
  id: string;
  store_id: string;
  label: string;
  key_hash: string;
  key_prefix: string;
  scopes: string[];
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
  last_used_at?: string | null;
}

interface IPdApiKeyService {
  listKeysForStore(storeId: string): Promise<ApiKeyRecord[]>;
  generateKey(args: {
    storeId: string;
    label: string;
    scopes: string[];
    expiresAt?: string;
  }): Promise<{ rawKey: string; apiKey: ApiKeyRecord }>;
}

interface PdStoreLike {
  id: string;
  subscription_plan: SubscriptionPlan;
}

interface IPdStoreService {
  listPdStores(args: { filters: { id: string } }): Promise<PdStoreLike[]>;
}

async function assertPlanHasApiKeys(
  req: MedusaRequest,
  storeId: string,
): Promise<void> {
  const storeService = req.scope.resolve<IPdStoreService>('pdStoreService');
  const [store] = await storeService.listPdStores({ filters: { id: storeId } });
  if (!store) throw new PdStoreNotFoundError(storeId);
  const plan = store.subscription_plan;
  if (!PLAN_LIMITS[plan].hasApiKeys) {
    throw new PdPlanRequiredError('Agency', plan);
  }
}

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> => {
  const { storeId } = requireStoreContext(req);
  await assertPlanHasApiKeys(req, storeId);

  const apiKeyService = req.scope.resolve<IPdApiKeyService>('pdApiKeyService');
  const keys = await apiKeyService.listKeysForStore(storeId);

  const sanitized = keys.map((k) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { key_hash, ...rest } = k;
    return rest;
  });

  res.json({ api_keys: sanitized });
};

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> => {
  const { storeId } = requireStoreContext(req);
  await assertPlanHasApiKeys(req, storeId);

  const parsed = createKeySchema.safeParse(req.body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    parsed.error.issues.forEach((i) => {
      fields[i.path.join('.')] = i.message;
    });
    throw new PdValidationError('Données invalides', { fields });
  }

  const apiKeyService = req.scope.resolve<IPdApiKeyService>('pdApiKeyService');
  const { rawKey, apiKey } = await apiKeyService.generateKey({
    storeId,
    label: parsed.data.label,
    scopes: parsed.data.scopes,
    expiresAt: parsed.data.expires_at,
  });

  logger.info({ store_id: storeId, key_prefix: apiKey.key_prefix }, 'API key generated');

  res.status(201).json({
    // Raw key is shown ONCE — vendor must persist it client-side.
    raw_key: rawKey,
    api_key: {
      id: apiKey.id,
      label: apiKey.label,
      key_prefix: apiKey.key_prefix,
      scopes: apiKey.scopes,
      expires_at: apiKey.expires_at,
      created_at: apiKey.created_at,
    },
  });
};
