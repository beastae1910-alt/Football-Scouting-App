## 2024-05-18 - Client-side filtering in Dashboard
**Learning:** Dashboard components re-ran client-side filtering logic on every render. This involves string lowercasing inside loops which is an O(N) operation happening repeatedly.
**Action:** Extract loop-invariant operations like `.toLowerCase()` out of loops and wrap filtered arrays in `useMemo` to prevent unnecessary recalculations on re-renders.
