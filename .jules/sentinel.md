## 2026-05-13 - [DoS Vulnerability in Webhook Signature Verification]
**Vulnerability:** Found a DoS vulnerability where `crypto.timingSafeEqual` was called without verifying if the length of the buffers was equal, which can lead to `ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH` and crash the server.
**Learning:** `crypto.timingSafeEqual` throws an exception if buffers are of different lengths.
**Prevention:** Always check buffer length before comparing buffers with `crypto.timingSafeEqual`.
