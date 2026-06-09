## 2026-06-09 - Accessible interactive Image Uploader
**Learning:** In PandaMarket, using generic `div` elements for rich interactions (like clicking to upload an image) without proper keyboard support or ARIA attributes creates an accessibility barrier for screen readers and keyboard-only users.
**Action:** When converting non-interactive elements like `div`s into click targets, always add `role="button"`, manage `tabIndex` based on disabled/uploading states, provide a descriptive `aria-label`, and add an `onKeyDown` handler that triggers the primary action on 'Enter' or 'Space'.
