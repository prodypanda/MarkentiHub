## 2024-05-16 - [Input Field Accessibility & Hydration]
**Learning:** Found that custom Inputs were using non-unique fallback IDs (like lowercasing labels) and lacking `aria-describedby` for error and hint messages. This caused screen reader disconnection for critical validation info and posed SSR hydration risks with React 18.
**Action:** Use React 18's `useId()` hook for hydration-safe, globally unique fallback IDs, and explicitly map `aria-describedby` to the error/hint element IDs. Add `aria-invalid` when an error state is active.
