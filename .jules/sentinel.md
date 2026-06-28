## 2026-05-14 - Prevent DoS from timingSafeEqual Buffer Length Mismatch
**Vulnerability:** Calling `crypto.timingSafeEqual` with Buffers of different lengths throws an `ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH` error, which can crash the application (Denial of Service) if not caught. This was found in webhook signature verification.
**Learning:** `crypto.timingSafeEqual` is strictly designed to compare buffers of the *exact same length* to prevent timing attacks. It intentionally throws an error rather than returning false if lengths differ.
**Prevention:** Always verify that buffer lengths match before passing them to `crypto.timingSafeEqual` to safely return `false` on mismatch rather than crashing.
