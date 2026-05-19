## 2026-05-19 - Ensure stable IDs for accessible Inputs in SSR
**Learning:** Using `String.replace` to generate random/derived element IDs for linking inputs and labels can cause Server-Side Rendering (SSR) hydration mismatches in Next.js/React 18+. Furthermore, inputs with hints or errors need `aria-describedby` to ensure screen readers correctly read context alongside the input field.
**Action:** When building or fixing form components, always use React's `useId()` hook to generate stable unique identifiers for `id`, `htmlFor`, and `aria-describedby` attributes.
