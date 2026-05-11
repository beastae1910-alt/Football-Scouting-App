## 2024-05-18 - Missing Accessible Names on Dashboard Filters
**Learning:** Dashboard filter controls (like search inputs and dropdown selects) in the application's components frequently lack explicit accessible names because they don't have visible associated `<label>` elements. This prevents screen reader users from understanding the purpose of these inputs.
**Action:** Always verify that every input and select element in dashboard components has either an explicit `<label>` or a descriptive `aria-label` attribute.
