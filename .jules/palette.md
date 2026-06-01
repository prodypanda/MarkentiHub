## 2024-06-01 - Accessible Custom Upload Triggers
**Learning:** Custom interactive elements, such as `div`-based image upload triggers in Next.js apps, frequently lack keyboard support and screen reader context out of the box, preventing accessibility.
**Action:** Always ensure non-button interactive elements include `role="button"`, `tabIndex={0}`, an appropriate `aria-label`, and an `onKeyDown` handler to listen for "Enter" and " " (Space) keys to trigger the action equivalent to a click.
