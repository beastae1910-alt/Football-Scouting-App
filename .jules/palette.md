## 2024-06-17 - Add ARIA Labels to Dashboard Filters
**Learning:** Dashboard filter controls (search input, position select, age select) in `PlayerDashboard.jsx` and `ScoutDashboard.jsx` are missing explicitly associated labels, rendering them inaccessible to screen readers.
**Action:** Add descriptive `aria-label` attributes to these inputs and selects across all dashboard views. Ensure any new filters or search inputs introduced in the future either have associated `<label>` elements or use `aria-label`.
