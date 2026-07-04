## 2024-05-24 - Missing ARIA Labels on Dashboard Filters
**Learning:** Search inputs and filter select dropdowns in dashboard components (like PlayerDashboard and ScoutDashboard) lack explicit associated `<label>` elements or `aria-label` attributes, making them inaccessible to screen readers.
**Action:** Always ensure interactive filter controls have an `aria-label` to describe their purpose when visible text labels are absent.
