## 2024-07-04 - Fix DoS vector in verifyWebhookSignature
**Vulnerability:** Node.js `crypto.timingSafeEqual` throws `ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH` if buffers have different lengths. An attacker could exploit this by sending an incorrectly sized signature to the webhook endpoint, crashing the application (DoS).
**Learning:** `crypto.timingSafeEqual` does not gracefully handle different length inputs like some other cryptographic comparison functions do.
**Prevention:** Always verify that buffer lengths match before calling `crypto.timingSafeEqual`.
