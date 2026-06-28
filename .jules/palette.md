
## 2026-06-28 - Input Accessibility & SSR Hydration
**Learning:** Using manual ID generation like `label.toLowerCase()` can cause SSR hydration mismatch errors. Furthermore, for inputs with error or hint messages, screen readers won't automatically associate them unless we link them using `aria-describedby` that points to a valid generated ID, and we should only apply `aria-describedby` when the related text is actually rendered to prevent screen readers from reading empty references.
**Action:** Always use React's `useId()` for generating component IDs. Conditionally attach `aria-invalid` and `aria-describedby` when linking error or helper text to an input field.
