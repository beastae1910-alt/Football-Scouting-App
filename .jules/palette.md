## 2026-05-28 - Add Accessible Labels to Dashboard Filter Controls
**Learning:** The dashboard filters (text inputs and dropdowns) lack visible labels, which makes them inaccessible to screen readers. Adding explicit `aria-label` attributes fixes this by providing context for each filter field.
**Action:** Always verify that input elements have an associated `label` or an `aria-label` if a visible label is intentionally omitted.
