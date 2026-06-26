## 2024-06-26 - Memoize expensive filters and lookups
**Learning:** Frequent state updates (like typing in a search bar or receiving real-time stats) trigger re-renders that re-evaluate list filtering and item lookups on every render if not memoized, which can block the main thread as the list grows.
**Action:** Always wrap `filter` operations on large data structures and object lookups derived from arrays with `useMemo` in React components.
