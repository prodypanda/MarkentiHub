## 2026-05-13 - [DoS Risk] TimingSafeEqual Length Mismatch Crash
**Vulnerability:** Denial of Service (DoS) risk in `verifyWebhookSignature` via `crypto.timingSafeEqual` length mismatch.
**Learning:** Node.js's `crypto.timingSafeEqual` throws an `ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH` error instead of returning `false` if the two buffers compared have different lengths. If a webhook endpoint passes user-supplied or external signature strings directly into `timingSafeEqual` without first comparing buffer lengths, an attacker can crash the node process by supplying an invalid length signature.
**Prevention:** Always verify that `buffer1.length === buffer2.length` before calling `crypto.timingSafeEqual(buffer1, buffer2)`.
