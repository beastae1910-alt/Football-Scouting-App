## 2026-06-08 - Adding Accessible Names to Search Filters
**Learning:** Dashboard filter controls (inputs and selects) in `PlayerDashboard.jsx` and `ScoutDashboard.jsx` lack explicit accessible names (`aria-label`), making them difficult to use for screen reader users.
**Action:** Always ensure that all form controls, especially those without visible text labels (like search bars and dropdown filters), have descriptive `aria-label` attributes to support screen readers.
