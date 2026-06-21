## 2026-06-21 - ImageUploader keyboard and a11y support
**Learning:** Custom 'div' based upload triggers frequently lack `role`, `tabIndex`, and keyboard event handlers, breaking a11y for users navigating with keyboards. Also, icon-only remove buttons often miss `aria-label` and `title`.
**Action:** When creating interactive divs (like upload zones), always set `role="button"`, `tabIndex={0}`, and an `onKeyDown` handler that responds to 'Enter' and 'Space'. Always add `aria-label` to icon-only buttons.
