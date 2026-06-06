## 2024-05-24 - Missing ARIA Labels on Filter Controls
**Learning:** The dashboard components (PlayerDashboard and ScoutDashboard) use <input> and <select> elements for filtering and searching, but they rely entirely on placeholders or visual context for meaning. They lack explicitly associated <label> elements or aria-label attributes, making them inaccessible to screen reader users.
**Action:** Add descriptive aria-label attributes to all filter inputs and selects across dashboard components.
