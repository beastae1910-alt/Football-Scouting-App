
## 2026-06-27 - Dashboard filter controls missing accessible names
**Learning:** The PlayerDashboard and ScoutDashboard components had filter controls (`<input>` and `<select>`) without explicit accessible names (labels or aria-labels), reducing accessibility for screen reader users.
**Action:** Always ensure interactive elements like inputs and selects have descriptive `aria-label`s or associated labels, even if placeholder text or adjacent headings convey visual context.
