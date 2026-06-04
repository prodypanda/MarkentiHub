## 2026-06-04 - Client-Side Filtering Optimization
**Learning:** Found redundant string allocation and execution in client-side `.filter()` loops inside React components (`toLowerCase()` being called inside the iteration on the search string, and missing `useMemo` for filtering operations that re-run on every re-render).
**Action:** Always wrap expensive list filtering logic in `useMemo` and hoist invariant operations (like `toLowerCase()` on a search query) outside the `.filter()` loop to reduce memory allocation and CPU cycles during re-renders.
