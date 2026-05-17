## 2026-05-17 - Accessible Names for Dashboard Filters
**Learning:** Dashboard filter controls (inputs and selects) in the application's components often lack explicit accessible names, causing screen readers to announce them ambiguously.
**Action:** Always ensure that inputs and selects have explicitly associated `<label>` elements or descriptive `aria-label` attributes to support screen readers, especially in dense dashboard layouts where visual context isn't enough for assistive technologies.
