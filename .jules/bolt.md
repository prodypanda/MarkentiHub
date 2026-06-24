## 2026-05-14 - Stable Fallbacks for useMemo
**Learning:** Using inline fallback arrays like `data?.items || []` in React components busts `useMemo` caches on every render during loading or undefined states, causing unnecessary recalculations for operations like client-side filtering.
**Action:** Define a stable `const EMPTY_ARRAY: any[] = []` outside the component scope to maintain referential equality when falling back from undefined data.
