## 2024-06-23 - Screen reader accessibility for inputs
**Learning:** React inputs must have explicit labels to be properly parsed by screen readers, particularly when their visual cues like `placeholder` are heavily relied upon.
**Action:** Always ensure that form inputs have semantic `<label>` associations or `aria-label` attributes where a visible label is missing or implicit.
