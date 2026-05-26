## 2026-05-14 - Initial setup
**Learning:** Initial Palette setup.
**Action:** Use this file to record critical UX/a11y learnings.
## 2026-05-14 - Improve accessibility of ImageUploader
**Learning:** Icon-only buttons and custom interactive div elements need proper accessibility attributes to support screen readers and keyboard navigation.
**Action:** Always add `aria-label` to icon-only buttons. Always ensure interactive `div` elements have `role="button"`, `tabIndex={0}`, an appropriate `aria-label`, and keyboard event handlers (`onKeyDown`) for `Enter` and `Space`.
