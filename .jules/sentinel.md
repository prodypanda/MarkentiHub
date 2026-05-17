
## 2026-05-13 - [DoS Vulnerability in Webhook Signature Verification]
**Vulnerability:** A Denial of Service (DoS) vulnerability was present in `verifyWebhookSignature` within `pandamarket/backend/src/utils/crypto.ts`. The function directly called `crypto.timingSafeEqual` with a user-supplied webhook signature and an expected signature without checking if their buffer lengths matched.
**Learning:** In Node.js, `crypto.timingSafeEqual` throws an `ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH` error if the two buffers provided have different lengths. If this error is unhandled, it can crash the entire Node.js process, making the application susceptible to a DoS attack via malformed webhook signatures.
**Prevention:** Always verify that the buffers have the exact same length before passing them to `crypto.timingSafeEqual`. If the lengths do not match, the signatures are inherently unequal, and the function should safely return `false`.
