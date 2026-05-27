## 2026-05-27 - [Fix timingSafeEqual Buffer Length Vulnerability]
**Vulnerability:** Node.js `crypto.timingSafeEqual` crashes with an unhandled exception when passed buffers of different lengths. This leads to a DoS vulnerability.
**Learning:** `verifyWebhookSignature` in `pandamarket/backend/src/utils/crypto.ts` didn't check if the buffer lengths were equal before calling `crypto.timingSafeEqual()`, which could lead to application crash if an attacker provides a signature of a different length.
**Prevention:** Always verify that buffer lengths match before calling `crypto.timingSafeEqual` in Node.js to avoid `ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH` crashes.
