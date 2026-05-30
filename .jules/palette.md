## 2024-05-30 - Missing Accessible Names on Filter Controls
**Learning:** Dashboard filter controls (inputs and selects) in the application's components, like `ScoutDashboard.jsx` and `PlayerDashboard.jsx`, lack explicit accessible names (like `aria-label`). This is a recurring pattern making it hard for screen readers to understand the purpose of the inputs.
**Action:** Always ensure filter inputs and selects have explicitly associated `<label>` elements or descriptive `aria-label` attributes to support screen readers when designing or modifying dashboard components.
