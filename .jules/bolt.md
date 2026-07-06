## 2026-05-14 - Optimizing React Filter Performance

**Learning:** When adding `useMemo` to cache a filtered list, standard fallback patterns like `const items = data || []` will silently break the memoization because `[]` creates a new reference on every render when `data` is undefined. Additionally, doing string transformations like `toLowerCase()` inside `.filter()` callbacks allocates a new string for every single item evaluated.
**Action:** Always define a stable constant like `const EMPTY_ARRAY = []` outside the component scope to act as a fallback to preserve referential equality. Hoist invariant transformations (like `search.toLowerCase()`) outside of iteration loops to avoid redundant memory allocations and CPU cycles.
