## 2024-05-24 - Add Accessible Names to Filter Controls
**Learning:** Dashboard filter controls (inputs and selects) across the application, like in `PlayerDashboard.jsx` and `ScoutDashboard.jsx`, are frequently used without explicitly associated `<label>` elements or descriptive `aria-label` attributes.
**Action:** Always verify that input fields and dropdown menus have semantic `<label>` elements or descriptive `aria-label` attributes to ensure they are properly identified by screen readers, particularly in generic search/filter utility bars.
