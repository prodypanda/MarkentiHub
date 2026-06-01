## 2024-05-13 - [DoS fix]
**Vulnerability:** Unhandled buffer length mismatch in `verifyWebhookSignature` via `timingSafeEqual`
**Learning:** `crypto.timingSafeEqual` in Node.js explicitly throws an `ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH` error if the passed buffers have different lengths. Since webhook signatures are user-provided, an attacker passing a signature of wrong length could crash the process.
**Prevention:** Always compare `buffer.length` before passing variables to `crypto.timingSafeEqual`.
