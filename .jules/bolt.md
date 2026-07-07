## 2025-02-14 - Memoizing large filtered lists
**Learning:** Large arrays passed via props that are filtered synchronously on every render can cause measurable lag during unrelated UI updates (like opening modals or clicking tabs), especially when rendering complex components.
**Action:** Always wrap heavy list filtering operations (like dashboard player filters) in `useMemo` so that they only recalculate when the dependencies (data or filter criteria) change.
