## 2026-06-06 - React Client-Side Filtering Optimization
**Learning:** In dashboard views with client-side filtering, chaining `.toLowerCase().includes(search.toLowerCase())` inside a `.filter()` callback forces redundant string allocations for every element on every re-render, severely degrading performance as the list grows.
**Action:** Always wrap client-side filtering arrays in `useMemo` with proper dependencies, and hoist invariant operations like `search.toLowerCase()` outside the iteration loop to prevent memory churn and unnecessary recalculations.
