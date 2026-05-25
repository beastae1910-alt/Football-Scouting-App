## 2024-06-25 - Explicit Accessible Names for Dashboard Filters
**Learning:** Filter controls (inputs and selects) in the dashboard components (`PlayerDashboard`, `ScoutDashboard`) lacked explicit `<label>` elements or descriptive `aria-label` attributes, potentially making it hard for screen readers to identify their purpose.
**Action:** When adding filter inputs and selects, ensure they have an explicit `aria-label` or an associated `<label>` element.
