## 2025-05-15 - [Critical DoS Fix in verifyWebhookSignature]
**Vulnerability:** Unhandled Exception causing Denial of Service via `crypto.timingSafeEqual`
**Learning:** In Node.js, `crypto.timingSafeEqual(buf1, buf2)` throws a `TypeError` (`ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH`) if the two buffers do not have the exact same length. If user-supplied input (such as an HMAC webhook signature) is parsed into a buffer of incorrect length and passed directly into this function without checking, the application crashes.
**Prevention:** Always verify `buf1.length === buf2.length` before calling `crypto.timingSafeEqual`.
