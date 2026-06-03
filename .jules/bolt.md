
## 2026-06-03 - [Frontend Client-Side Filtering Optimization]
**Learning:** In Next.js/React frontend dashboard list pages (e.g., Products, Orders), executing `search.toLowerCase()` inside a `.filter()` iteration causes unnecessary string allocation per row on every render.
**Action:** When filtering lists client-side based on search inputs, always use `useMemo` to prevent filtering on unrelated re-renders (like hover state or modal toggles), and hoist invariants like `search.toLowerCase()` outside the `.filter()` loop.
