## 2026-06-13 - [Denial of Service via timingSafeEqual Length Mismatch]
**Vulnerability:** Unhandled `ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH` error in `crypto.timingSafeEqual` when verifying webhook signatures with invalid signature lengths, leading to potential Denial of Service (DoS) through unhandled exceptions.
**Learning:** `crypto.timingSafeEqual` in Node.js throws an error if the buffers passed to it have different lengths. Attackers can exploit this by sending signatures of arbitrary lengths to crash the server or specific processes.
**Prevention:** Always verify that buffer lengths match before calling `crypto.timingSafeEqual`. Return early (e.g., `false`) if the lengths differ.
