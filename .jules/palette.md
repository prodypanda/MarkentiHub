## 2026-07-04 - Accessible Custom Upload Triggers
**Learning:** Custom `div` elements used as upload triggers via hidden `<input type="file">` need explicit keyboard accessibility attributes (`role="button"`, `tabIndex={0}`) and `onKeyDown` handlers listening for "Enter" or " " (Space) to be accessible to keyboard and screen reader users.
**Action:** Always add keyboard accessibility attributes and `onKeyDown` handlers to custom `div` elements that act as buttons or triggers, and ensure they have appropriate `aria-label` attributes.
