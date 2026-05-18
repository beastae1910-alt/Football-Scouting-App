## 2024-05-18 - Missing Accessible Names on Filter Controls
**Learning:** Dashboard filter controls (like search inputs and selects) in this application often lack explicit accessible names, causing poor experiences for screen reader users.
**Action:** When adding or modifying inputs and selects used as filters without visible `<label>`s, always ensure they have an explicit `aria-label` attribute indicating their purpose.
