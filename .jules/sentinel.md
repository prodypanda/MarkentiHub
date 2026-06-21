## 2026-05-13 - DoS via Unchecked Buffer Length in crypto.timingSafeEqual
**Vulnerability:** Application crashed (`ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH`) when `crypto.timingSafeEqual` was called with buffers of unequal lengths during webhook signature verification, posing a Denial of Service (DoS) risk.
**Learning:** `crypto.timingSafeEqual` throws an exception instead of returning false if the provided buffers differ in length, leading to unhandled application crashes when checking arbitrary attacker-provided signatures.
**Prevention:** Always verify that `bufferA.length === bufferB.length` before invoking `crypto.timingSafeEqual` to safely fail on invalid inputs without crashing the process.
