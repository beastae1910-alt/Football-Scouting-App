## 2024-05-15 - Explicit Accessible Names for Dashboard Filters
**Learning:** Dashboard filter controls (inputs and selects) across components like PlayerDashboard and ScoutDashboard lacked explicit accessible names, which hinders screen reader users from understanding what the controls filter.
**Action:** Always add descriptive `aria-label` attributes to filter inputs and select dropdowns, as well as utility buttons like 'RESET' to ensure full keyboard and screen reader accessibility.
