## 2026-07-02 - Prevent DoS via timingSafeEqual crash
**Vulnerability:** Unhandled length mismatch error when comparing webhook signatures with `crypto.timingSafeEqual`.
**Learning:** Node's `crypto.timingSafeEqual` strictly requires input buffers to have identical byte lengths. If a webhook signature with an arbitrary, unexpected length is received, the mismatch throws an unhandled `ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH` error, causing a 500 error or application crash, exposing the endpoint to DoS attacks.
**Prevention:** Always verify that buffer lengths match before calling `crypto.timingSafeEqual`. Return false early if `bufferA.byteLength !== bufferB.byteLength`.
