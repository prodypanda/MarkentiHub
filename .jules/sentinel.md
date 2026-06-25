## 2026-06-25 - [Preventing DoS via `crypto.timingSafeEqual` Length Mismatch]
**Vulnerability:** Unhandled `ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH` in `verifyWebhookSignature`. Passing a signature with a different length than the expected signature caused `crypto.timingSafeEqual` to throw, which could crash the application (DoS).
**Learning:** Node.js's `crypto.timingSafeEqual` strictly requires both buffers to have exactly the same length.
**Prevention:** Always check if the lengths of the two buffers match before calling `crypto.timingSafeEqual`, returning false if they differ.
