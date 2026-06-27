## 2026-06-27 - [crypto.timingSafeEqual DoS Vulnerability Fix]
**Vulnerability:** Unhandled exceptions causing Denial of Service (DoS) due to `ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH` in `crypto.timingSafeEqual` in `verifyWebhookSignature`.
**Learning:** `crypto.timingSafeEqual` throws an error and crashes the Node.js process if the two buffers being compared have different lengths. This can be exploited by an attacker sending arbitrary length signatures in webhook payloads to cause a DoS.
**Prevention:** Always verify that the buffer lengths match (and return false if they don't) before calling `crypto.timingSafeEqual`.
