## 2024-05-24 - Accessible Custom Upload Zones
**Learning:** Custom file upload dropzones/clickzones implemented using `div` elements often lack keyboard accessibility (tab index, enter/space key handling) and screen reader support (`role="button"`, `aria-label`). Also, inline delete buttons for images often lack `aria-label`s.
**Action:** Always ensure custom interactive elements like upload zones have `role="button"`, `tabIndex={0}`, and `onKeyDown` handlers for Space/Enter. Icon-only remove buttons must have `aria-label` or `title` attributes.
