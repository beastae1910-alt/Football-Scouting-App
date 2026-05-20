## 2024-05-24 - Parallelize Independent DB Queries
**Learning:** Independent Supabase queries inside React components (like `PlayerDashboard` and `ScoutDashboard`) are sometimes fetched sequentially. This causes a waterfall of network requests, unnecessarily blocking UI rendering and increasing load times.
**Action:** When fetching multiple, independent data sets (e.g. `player_views`, `player_search_views`, `scout_interests`), always parallelize them using `Promise.all` to fetch concurrently.
