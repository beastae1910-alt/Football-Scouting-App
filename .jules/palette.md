## 2024-07-02 - Ensure filter controls have accessible names
**Learning:** Dashboard filter controls (inputs and selects) in `ScoutDashboard.jsx` and `PlayerDashboard.jsx` lack explicit accessible names, which can be disorienting for screen reader users trying to navigate the application.
**Action:** Always ensure filter inputs and selects have explicitly associated `<label>` elements or descriptive `aria-label` attributes to support screen readers.
