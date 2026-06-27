## 2023-11-20 - Unnecessary Recalculations of Filtered Data Sets on Asynchronous State Changes
**Learning:** Found that filtered view lists in dashboard components are being needlessly recalculated on every render due to state updates (e.g., fetching real views and search appearances asynchronously) triggering component re-renders.
**Action:** Use `useMemo` to memoize expensive derivations of filtered lists in dashboard components that execute data-fetching logic inside `useEffect`.
