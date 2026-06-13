## 2026-05-13 - Stable IDs for Forms
**Learning:** Manual string replacement for form IDs (e.g. `label.replace(...)`) is fragile, prone to collisions, and can cause hydration mismatches in Next.js. `aria-describedby` must link correctly to error and hint spans.
**Action:** Always use React's `useId()` for generating stable accessibility IDs in reusable UI components. Ensure conditionally rendered elements like errors and hints have IDs generated from the base `useId()`.
