## 2026-05-28 - crypto.timingSafeEqual DoS Vulnerability
**Vulnerability:** Calling `crypto.timingSafeEqual` with buffers of different lengths throws a `RangeError: Input buffers must have the same byte length`. If user input can control the length of one of the buffers (like an incoming webhook signature), this will cause an unhandled exception and crash the node process, leading to a Denial of Service (DoS) vulnerability.
**Learning:** `crypto.timingSafeEqual` is strict about buffer lengths, and we must perform a length check *before* calling it.
**Prevention:** Always verify that `Buffer.length` matches for both buffers before passing them to `crypto.timingSafeEqual`. If the lengths do not match, return false immediately.
