
## 2026-05-25 - Use `useId` and `aria-describedby` in Reusable UI Components
**Learning:** Hydration mismatches can occur if `Math.random()` or manual string replacements (e.g., `label.toLowerCase().replace(/\s+/g, '-')`) are used for generating IDs in Next.js / React 18, leading to accessibility issues because IDs are not unique across multiple instantiations of a component.
**Action:** Use React's native `useId()` hook to reliably generate unique identifiers for ARIA associations like linking error and hint messages to custom input components (`aria-describedby`) and defining input/label relationships.
