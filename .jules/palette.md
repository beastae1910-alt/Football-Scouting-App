
## 2025-02-13 - Avoid visual-only pseudo-buttons
**Learning:** Attaching `onClick` to non-interactive `<div>` containers while making the actual visual `<button>` unclickable (`pointerEvents: 'none'`) breaks keyboard accessibility. Form controls without associated text labels also present accessibility barriers.
**Action:** Always attach crucial interaction handlers to semantic `<button>` elements, ensuring they are reachable via Tab and activatable via Enter/Space. Ensure form inputs and selects have descriptive `aria-label`s when visual labels are omitted.
