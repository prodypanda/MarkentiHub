## 2026-05-26 - Batched $in queries and MedusaJS constraints
**Learning:** When resolving N+1 query problems in MedusaJS background subscribers, passing arrays directly for generic ID filters works as an implicit `$in` operator, but you may need to cast the array `as any` to bypass strict generic type constraints on the `filters` object.
**Action:** When making batched database queries across `storeId` sets to avoid N+1 fetches inside loops, pass `Array.from(ids) as any` to the `id` filter field to ensure proper bulk retrieval.
