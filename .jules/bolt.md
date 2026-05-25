## 2026-05-25 - [Fix N+1 query in order-placed and outgoing-webhooks]
**Learning:** In MedusaJS v2, listing entities in loops like subscribers causes N+1 query bottlenecks. Bypassing restrictive MedusaJS generic type constraints for `$in` filters requires casting `as any` (e.g., `{ id: { $in: storeIds } as any }`).
**Action:** Always batch fetch dependent entities using `$in` and an in-memory Map when processing arrays or sets of related items in MedusaJS subscribers to avoid database bottlenecks.
