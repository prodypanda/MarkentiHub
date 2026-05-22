## 2026-05-22 - MedusaJS N+1 Query Optimizations

**Learning:** MedusaJS `MedusaService` generated CRUD operations support batched actions. For example, `updateNotifications` accepts an array of objects to perform a bulk update, replacing individual updates in loops. Additionally, Medusa's query filters accept MongoDB-style operators like `$in` (e.g., `filters: { id: { $in: ids } as any }`) but may require a TypeScript `as any` assertion due to restrictive generic type constraints.
**Action:** When working with multiple records, use `$in` to fetch data upfront outside of loops, map them by ID, and use bulk update APIs instead of iteratively querying/updating inside a loop.
