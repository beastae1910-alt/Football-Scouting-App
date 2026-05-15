
## 2024-05-18 - Accessibility: Dashboard filter controls lack accessible names
**Learning:** The dashboard filter controls (inputs and selects) in the application's components (`PlayerDashboard.jsx`, `ScoutDashboard.jsx`) often lack explicit accessible names, causing issues for screen reader users who cannot determine their purpose.
**Action:** Always ensure that input and select filter controls have explicitly associated `<label>` elements or descriptive `aria-label` attributes to support screen readers.
