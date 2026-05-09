## 2024-05-24 - Missing Accessible Names on Filter Controls
**Learning:** Found a pattern where interactive filter controls (inputs and selects) across dashboard components relied solely on placeholder text or visual context, lacking explicit `aria-label`s. This makes them inaccessible to screen readers.
**Action:** Always ensure `input` and `select` elements have explicitly associated `<label>` elements or descriptive `aria-label` attributes to provide accessible names, especially when used in filter bars or toolbars.
