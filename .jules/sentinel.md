## 2026-06-08 - Prevent DoS from timingSafeEqual Length Mismatch
**Vulnerability:** Node.js `crypto.timingSafeEqual` crashes with an `ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH` error if the provided buffers do not have the exact same length. If user input directly dictates the size of the provided signature, an attacker can intentionally cause a length mismatch to crash the application, resulting in a Denial of Service (DoS).
**Learning:** Node.js standard library strictly enforces equal lengths for timing attack protection on string equality. It does not fail open or fail gracefully.
**Prevention:** Always manually verify that buffer lengths match before passing them to `crypto.timingSafeEqual()`. If lengths differ, immediately reject the input.
