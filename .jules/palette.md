## 2024-06-20 - Missing ARIA Labels on Dashboard Filters
**Learning:** Filter controls (inputs and selects) in the dashboard components lacked explicit accessible names, relying solely on placeholder text or visual context, which is insufficient for screen readers.
**Action:** Always ensure interactive filter elements have explicit `<label>` elements or descriptive `aria-label` attributes to support keyboard and screen reader accessibility.
