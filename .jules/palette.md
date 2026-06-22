## 2024-05-28 - Missing accessible names on filter controls
**Learning:** Dashboard filter controls (like search inputs and position/age dropdowns) frequently lack explicit labels or `aria-label` attributes, making them difficult for screen reader users to understand and navigate.
**Action:** Always ensure that inputs and select elements without visible text labels are provided with a descriptive `aria-label` to announce their purpose correctly.
