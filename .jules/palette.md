## 2024-06-14 - SSR-Safe Accessible Input IDs
**Learning:** Using `useId()` for generating unique input IDs ensures React SSR hydration mismatches are avoided while maintaining perfect accessibility associations (`aria-describedby`) for dynamically rendered errors and hints.
**Action:** Always prefer `useId()` over string-replacement fallback logic when associating `label`, `input`, and accessible descriptions in reusable UI components.
