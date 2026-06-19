## 2024-06-19 - Keyboard Accessibility for Custom Interactive Elements
**Learning:** Interactive elements like custom upload wrappers (`div` acting as a button) require `role="button"`, `tabIndex`, and `onKeyDown` handlers for full keyboard accessibility, ensuring they work seamlessly with 'Enter' or 'Space' keys.
**Action:** Always ensure that custom interactive elements acting as buttons have `role="button"`, `tabIndex={0}`, an appropriate `aria-label`, and an `onKeyDown` handler to support keyboard interactions.
