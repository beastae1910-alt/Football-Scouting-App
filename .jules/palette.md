## 2024-03-24 - Accessibility improvements for Dashboard Filters
**Learning:** Dashboard filter controls (inputs and selects) in the application's components lack explicit accessible names (like aria-label or explicit labels), making them difficult for screen reader users to understand their purpose.
**Action:** Add descriptive aria-label attributes to filter inputs and selects in ScoutDashboard and PlayerDashboard components to support screen readers.
