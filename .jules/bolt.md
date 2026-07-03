## 2026-07-03 - useMemo Cache Busting During SWR Loading
**Learning:** Using an inline fallback array (e.g., `data?.items || []`) causes `useMemo` dependencies to break referential equality on every re-render (like during SWR's loading states), completely defeating the purpose of memoization for expensive computations.
**Action:** Always define a stable empty array constant (`const EMPTY_ARRAY: any[] = []`) outside the component or `useMemo` scope to preserve referential equality when falling back from undefined data.
