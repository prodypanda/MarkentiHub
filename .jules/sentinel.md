## 2026-06-05 - DoS Vulnerability in Webhook Signature Verification
**Vulnerability:** Node's `crypto.timingSafeEqual` throws `ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH` if the input buffers are not of the same length, leading to an unhandled exception and a potential Denial of Service (DoS) vulnerability. This was found in `verifyWebhookSignature` in `pandamarket/backend/src/utils/crypto.ts`.
**Learning:** `crypto.timingSafeEqual` does not gracefully handle unequal buffer lengths; it is designed strictly for preventing timing attacks on equal-length data.
**Prevention:** Always compare buffer lengths (`buffer1.length !== buffer2.length`) and return `false` before passing them to `crypto.timingSafeEqual`.
