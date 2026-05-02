// @ts-nocheck
import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { z } from 'zod';
import { PdBadRequestError, PdForbiddenError } from '../../../../utils/errors';

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse,
) => {
  const storeId = (req as any).pd_store_id as string;
  if (!storeId) {
    // For local dev without auth middleware, mock a store id
    // throw new PdForbiddenError();
  }

  const activeStoreId = storeId || 'store_123';
  const apiKeyService = req.scope.resolve('pdApiKeyService');
  
  const keys = await apiKeyService.listKeysForStore(activeStoreId);
  
  // Omit key_hash from response
  const sanitizedKeys = keys.map((k: any) => {
    const { key_hash, ...rest } = k;
    return rest;
  });

  res.json({ api_keys: sanitizedKeys });
};

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse,
) => {
  const storeId = (req as any).pd_store_id as string || 'store_123';
  
  const schema = z.object({
    label: z.string().min(1),
    scopes: z.array(z.string()).default(['read', 'write']),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    throw new PdBadRequestError('Invalid request body', parsed.error.format());
  }

  const apiKeyService = req.scope.resolve('pdApiKeyService');

  // Generate the key
  const { rawKey, apiKey } = await apiKeyService.generateKey({
    storeId,
    label: parsed.data.label,
    scopes: parsed.data.scopes,
  });

  // Only return the rawKey once!
  res.json({
    raw_key: rawKey,
    api_key: {
      id: apiKey.id,
      label: apiKey.label,
      key_prefix: apiKey.key_prefix,
      scopes: apiKey.scopes,
      created_at: apiKey.created_at,
    }
  });
};
