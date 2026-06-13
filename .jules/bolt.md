## 2026-06-13 - Client-side Filtering Performance

**Learning:** When dealing with client-side lists that filter based on string fields, recreating variables like `search.toLowerCase()` repeatedly inside `.filter()` loops creates unnecessary memory allocations on every re-render and iteration, which can degrade frontend performance.

**Action:** Wrap client-side filtering arrays in React components with `useMemo` to skip re-calculations when data/filters haven't changed, and hoist string casing normalizations outside of iteration loops.