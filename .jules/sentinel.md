## 2026-06-18 - Prevent ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH DoS in Webhook Signature Verification
**Vulnerability:** Node.js `crypto.timingSafeEqual` throws `ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH` when provided buffers of different lengths. If unhandled, this crash can lead to a Denial of Service (DoS) when an attacker sends invalid or incorrectly-sized webhook signatures.
**Learning:** In `pandamarket/backend/src/utils/crypto.ts`, the `verifyWebhookSignature` function called `timingSafeEqual` directly without ensuring the two buffers had matching lengths. The vulnerability existed because Node.js expects same-size buffers for timing-safe comparison.
**Prevention:** Always ensure that `Buffer` lengths are equal before calling `crypto.timingSafeEqual` to avoid unhandled exceptions.
