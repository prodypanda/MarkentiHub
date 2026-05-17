## 2024-05-17 - React 18 Accessibility ID Generation
**Learning:** For components that generate dynamic ID references for accessibility attributes (like `aria-describedby` linking input fields to error messages or hint texts), manual ID generation based on labels or strings can cause SSR hydration mismatches in Next.js/React 18.
**Action:** Use React's `useId()` hook to generate guaranteed unique IDs for linking input elements to their respective contextual labels/error blocks.
