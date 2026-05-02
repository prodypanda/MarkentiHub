// pandamarket/backend/src/__tests__/crypto.test.ts
// =============================================================================
// Unit Tests — Crypto Utilities
// Tests AES-256-GCM encryption, API key generation, webhook signatures
// =============================================================================

import { describe, it, expect, beforeAll } from 'vitest';
import {
  encryptAES256,
  decryptAES256,
  generateApiKey,
  hashApiKey,
  signWebhookPayload,
  verifyWebhookSignature,
  generatePdId,
  generateSecureToken,
} from '../utils/crypto';

// Set the encryption key for tests
beforeAll(() => {
  process.env.PD_ENCRYPTION_KEY = 'test_encryption_key_32_chars__!!';
});

describe('Crypto — AES-256-GCM Encryption', () => {
  it('should encrypt and decrypt a string correctly', () => {
    const plaintext = 'flouci_app_token_123456';
    const encrypted = encryptAES256(plaintext);
    const decrypted = decryptAES256(encrypted);
    expect(decrypted).toBe(plaintext);
  });

  it('should produce different ciphertexts for the same plaintext (random IV)', () => {
    const plaintext = 'same_secret_value';
    const encrypted1 = encryptAES256(plaintext);
    const encrypted2 = encryptAES256(plaintext);
    expect(encrypted1).not.toBe(encrypted2);
  });

  it('should produce the correct format (iv:authTag:ciphertext)', () => {
    const encrypted = encryptAES256('test');
    const parts = encrypted.split(':');
    expect(parts.length).toBe(3);
  });

  it('should throw on tampered ciphertext', () => {
    const encrypted = encryptAES256('secret');
    const tampered = encrypted.slice(0, -5) + 'XXXXX';
    expect(() => decryptAES256(tampered)).toThrow();
  });
});

describe('Crypto — API Key Generation', () => {
  it('should generate a key with pd_sk_ prefix', () => {
    const { rawKey, hash, prefix } = generateApiKey();
    expect(rawKey).toMatch(/^pd_sk_[a-f0-9]{64}$/);
    expect(hash).toHaveLength(64); // SHA-256 hex
    expect(prefix).toBe(rawKey.substring(0, 10));
  });

  it('should produce unique keys on each call', () => {
    const key1 = generateApiKey();
    const key2 = generateApiKey();
    expect(key1.rawKey).not.toBe(key2.rawKey);
    expect(key1.hash).not.toBe(key2.hash);
  });

  it('should verify a key against its hash', () => {
    const { rawKey, hash } = generateApiKey();
    expect(hashApiKey(rawKey)).toBe(hash);
  });
});

describe('Crypto — Webhook Signatures', () => {
  it('should generate and verify a valid signature', () => {
    const payload = JSON.stringify({ order_id: 'pd_order_123', amount: 85.000 });
    const secret = 'webhook_secret_xyz';

    const signature = signWebhookPayload(payload, secret);
    const isValid = verifyWebhookSignature(payload, signature, secret);

    expect(isValid).toBe(true);
  });

  it('should reject a tampered payload', () => {
    const payload = JSON.stringify({ amount: 100 });
    const secret = 'webhook_secret';

    const signature = signWebhookPayload(payload, secret);
    const tamperedPayload = JSON.stringify({ amount: 999 });

    const isValid = verifyWebhookSignature(tamperedPayload, signature, secret);
    expect(isValid).toBe(false);
  });
});

describe('Crypto — Utility Functions', () => {
  it('should generate pd_ prefixed IDs', () => {
    const id = generatePdId('store');
    expect(id).toMatch(/^pd_store_[a-f0-9]{24}$/);
  });

  it('should generate secure tokens of correct length', () => {
    const token = generateSecureToken(32);
    expect(token).toHaveLength(64); // hex doubles the bytes
  });
});
