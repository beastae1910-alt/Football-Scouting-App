
## 2024-05-11 - Parallelize Independent Database Queries in Dashboard Components
**Learning:** React dashboard components (like `PlayerDashboard` and `ScoutDashboard`) were executing multiple independent database queries (e.g., fetching views, search appearances, and shortlists) sequentially using `await` inside `useEffect` hooks. This pattern causes a network waterfall effect, significantly increasing load times and degrading user experience.
**Action:** When implementing data fetching inside React components, identify independent queries and combine them using `Promise.all` to minimize network latency and improve rendering performance.
