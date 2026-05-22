## 2025-05-22 - Prevent ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH Denial of Service
**Vulnerability:** Node.js `crypto.timingSafeEqual` throws an `ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH` exception and crashes the process if the two buffers passed to it have different lengths. This is a vector for Denial of Service (DoS) attacks, such as via malformed webhook payloads.
**Learning:** This existed because the application accepted a user-provided hexadecimal string representing an HMAC-SHA256 signature, turned it into a Buffer, and passed it to `crypto.timingSafeEqual` directly.
**Prevention:** Verify buffer lengths manually before using `crypto.timingSafeEqual`. If the lengths do not match, immediately return `false` because the signatures inherently differ without throwing exceptions.
