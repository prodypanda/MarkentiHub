## 2024-05-23 - [Fix Denial of Service in Webhook Signature Verification]
**Vulnerability:** A DoS vulnerability (Unhandled Exception / ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH) was discovered in the `verifyWebhookSignature` function of `pandamarket/backend/src/utils/crypto.ts` due to passing buffers of unequal length to `crypto.timingSafeEqual()`.
**Learning:** `crypto.timingSafeEqual` in Node.js throws an error if the two buffers being compared have different lengths. If an attacker passes a signature of an incorrect length, an unhandled exception will crash the node process.
**Prevention:** Always check buffer lengths (`buf1.length !== buf2.length`) and return early before comparing them with `timingSafeEqual`.
