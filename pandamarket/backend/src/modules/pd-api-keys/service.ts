// @ts-nocheck
// pandamarket/backend/src/modules/pd-api-keys/service.ts
import { MedusaService } from '@medusajs/framework/utils';
import ApiKey from './models/api-key';
import { generateApiKey, hashApiKey } from '../../utils/crypto';
import { PdApiKeyInvalidError, PdApiKeyScopeDeniedError } from '../../utils/errors';
import { createServiceLogger } from '../../utils/logger';

const logger = createServiceLogger('ApiKeyService');

class PdApiKeyService extends MedusaService({ ApiKey }) {
  /**
   * Generate a new API key for a vendor's store.
   * Returns the raw key (shown once) and the persisted record.
   */
  async generateKey(params: {
    storeId: string;
    label: string;
    scopes: string[];
    expiresAt?: string;
  }): Promise<{ rawKey: string; apiKey: typeof ApiKey.$inferSelect }> {
    const { rawKey, hash, prefix } = generateApiKey();

    const apiKey = await this.createApiKeys({
      store_id: params.storeId,
      label: params.label,
      key_hash: hash,
      key_prefix: prefix,
      scopes: params.scopes,
      is_active: true,
      expires_at: params.expiresAt || null,
    });

    logger.info({ store_id: params.storeId, key_prefix: prefix, label: params.label }, 'API key generated');

    return { rawKey, apiKey };
  }

  /**
   * Validate an API key and return the associated store_id and scopes.
   * Updates last_used_at on successful validation.
   */
  async validateKey(rawKey: string): Promise<{
    storeId: string;
    scopes: string[];
  }> {
    const hash = hashApiKey(rawKey);

    const [key] = await this.listApiKeys({
      filters: { key_hash: hash, is_active: true },
    });

    if (!key) {
      throw new PdApiKeyInvalidError();
    }

    // Check expiration
    if (key.expires_at && new Date(key.expires_at) < new Date()) {
      throw new PdApiKeyInvalidError();
    }

    // Update last used timestamp
    await this.updateApiKeys({
      id: key.id,
      last_used_at: new Date().toISOString(),
    });

    return {
      storeId: key.store_id,
      scopes: key.scopes as string[],
    };
  }

  /**
   * Check if a key has a required scope, or throw
   */
  assertScope(scopes: string[], requiredScope: string): void {
    if (!scopes.includes(requiredScope)) {
      throw new PdApiKeyScopeDeniedError(requiredScope);
    }
  }

  /**
   * Revoke an API key (soft delete by setting is_active = false)
   */
  async revokeKey(keyId: string, storeId: string): Promise<void> {
    await this.updateApiKeys({
      id: keyId,
      is_active: false,
    });

    logger.info({ key_id: keyId, store_id: storeId }, 'API key revoked');
  }

  /**
   * List all active keys for a store (without exposing hashes)
   */
  async listKeysForStore(storeId: string) {
    return this.listApiKeys({
      filters: { store_id: storeId, is_active: true },
      order: { created_at: 'DESC' },
    });
  }
}

export default PdApiKeyService;
