## 2026-06-05 - Optimize Dashboard Client-Side Filtering
**Learning:** In heavily used dashboard pages like Orders and Products, simple inline `.filter()` calls mapped to React state (like `search.toLowerCase()`) lead to O(N) string allocations *per keystroke* or per re-render.
**Action:** Always wrap client-side dashboard table filtering with `useMemo` and aggressively hoist invariant transformations like `search.toLowerCase()` outside of the iterator loop to reduce unnecessary memory allocation and blockages on the main thread.
