// pandamarket/backend/src/utils/crypto.ts
// =============================================================================
// PandaMarket — Encryption & Hashing Utilities
// AES-256-GCM for vendor payment keys, SHA-256 for API keys, bcrypt for passwords
// =============================================================================

import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const BCRYPT_SALT_ROUNDS = 12;
const API_KEY_PBKDF2_ITERATIONS = 210_000;
const API_KEY_PBKDF2_KEYLEN = 32;
const API_KEY_PBKDF2_DIGEST = 'sha256';

/**
 * Get the encryption key from environment variables.
 * Must be exactly 32 bytes for AES-256.
 */
function getEncryptionKey(): Buffer {
  const key = process.env.PD_ENCRYPTION_KEY;
  if (!key) {
    throw new Error('PD_ENCRYPTION_KEY environment variable is not set');
  }
  // Ensure 32-byte key by hashing with SHA-256
  return crypto.createHash('sha256').update(key).digest();
}

/**
 * Encrypt a plaintext string using AES-256-GCM.
 * Returns a combined string: iv:authTag:ciphertext (all base64)
 *
 * Used for: vendor payment API keys stored in database
 */
export function encryptAES256(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(plaintext, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  const authTag = cipher.getAuthTag();

  return [
    iv.toString('base64'),
    authTag.toString('base64'),
    encrypted,
  ].join(':');
}

/**
 * Decrypt an AES-256-GCM encrypted string.
 * Expects format: iv:authTag:ciphertext (all base64)
 */
export function decryptAES256(encryptedData: string): string {
  const key = getEncryptionKey();
  const parts = encryptedData.split(':');

  if (parts.length !== 3) {
    throw new Error('Invalid encrypted data format');
  }

  const iv = Buffer.from(parts[0], 'base64');
  const authTag = Buffer.from(parts[1], 'base64');
  const ciphertext = parts[2];

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(ciphertext, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

function getApiKeyPepper(): string {
  const pepper = process.env.PD_API_KEY_PEPPER;
  if (!pepper) {
    throw new Error('PD_API_KEY_PEPPER environment variable is not set');
  }
  return pepper;
}

/**
 * Hash an API key using PBKDF2 (deterministic with server-side pepper).
 * The raw key is shown to the vendor once; only the hash is stored.
 */
export function hashApiKey(apiKey: string): string {
  const pepper = getApiKeyPepper();
  return crypto
    .pbkdf2Sync(
      apiKey,
      pepper,
      API_KEY_PBKDF2_ITERATIONS,
      API_KEY_PBKDF2_KEYLEN,
      API_KEY_PBKDF2_DIGEST,
    )
    .toString('hex');
}

/**
 * Generate a random API key with the pd_sk_ prefix.
 * Returns { rawKey, hash, prefix }
 */
export function generateApiKey(): {
  rawKey: string;
  hash: string;
  prefix: string;
} {
  const randomPart = crypto.randomBytes(32).toString('hex');
  const rawKey = `pd_sk_${randomPart}`;
  const hash = hashApiKey(rawKey);
  const prefix = rawKey.substring(0, 10);

  return { rawKey, hash, prefix };
}

/**
 * Hash a password using bcrypt (12 rounds) as per security guidelines.
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}

/**
 * Compare a plaintext password against a bcrypt hash.
 */
export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

/**
 * Generate an HMAC-SHA256 signature for webhook payloads.
 */
export function signWebhookPayload(
  payload: string,
  secret: string,
): string {
  return crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');
}

/**
 * Verify an HMAC-SHA256 webhook signature.
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string,
): boolean {
  const expected = signWebhookPayload(payload, secret);
  const signatureBuffer = Buffer.from(signature, 'hex');
  const expectedBuffer = Buffer.from(expected, 'hex');

  if (signatureBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
}

/**
 * Generate a random unique ID with pd_ prefix.
 */
export function generatePdId(entityPrefix: string): string {
  const random = crypto.randomBytes(12).toString('hex');
  return `pd_${entityPrefix}_${random}`;
}

/**
 * Generate a secure random token (for email verification, password reset, etc.)
 */
export function generateSecureToken(length: number = 48): string {
  return crypto.randomBytes(length).toString('hex');
}
