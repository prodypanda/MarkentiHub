## 2024-06-22 - [Fix] crypto.timingSafeEqual DoS Vulnerability
**Vulnerability:** \`crypto.timingSafeEqual\` in \`verifyWebhookSignature\` crashes the node process if buffer lengths mismatch.
**Learning:** Node.js native \`crypto.timingSafeEqual\` throws an unhandled exception when buffer lengths are not identical, leading to potential Denial of Service (DoS) attacks on endpoints relying on it for signature verification.
**Prevention:** Always verify that buffer lengths match before calling \`crypto.timingSafeEqual\`. If they do not match, return \`false\` early.
