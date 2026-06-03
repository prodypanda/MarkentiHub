## 2026-05-13 - [DoS Vulnerability in Webhook Verification]
**Vulnerability:** Node.js `crypto.timingSafeEqual` throws an `ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH` exception instead of returning false when the two input buffers have different lengths.
**Learning:** Calling `timingSafeEqual` without first explicitly verifying that `bufferA.length === bufferB.length` creates an unhandled exception risk. Attackers can exploit this by sending a malformed signature length in webhooks to crash the Node process, leading to a Denial of Service (DoS).
**Prevention:** Always check buffer length equivalence (`signatureBuffer.length !== expectedBuffer.length`) before calling `crypto.timingSafeEqual`.
