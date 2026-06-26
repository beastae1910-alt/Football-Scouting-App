## 2024-06-26 - Missing ARIA Labels on Dashboard Filter Controls
**Learning:** Dashboard filter controls (inputs, selects, buttons) in ScoutDashboard and PlayerDashboard lacked explicit `aria-label` attributes. Without these, screen readers struggle to convey the purpose of these standalone controls.
**Action:** Added `aria-label` attributes to explicitly associate descriptions with search inputs, position/age dropdowns, and reset buttons to improve accessibility.
