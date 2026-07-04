## 2025-07-04 - Memoize Player Filtering
**Learning:** The application performs redundant calculations (like `toLowerCase()` inside loops) and lacks memoization for player filtering arrays in `PlayerDashboard` and `ScoutDashboard`, which can cause unnecessary re-renders when data updates.
**Action:** Extract loop-invariant computations and use `useMemo` to memoize the filtered player lists across the dashboards.
