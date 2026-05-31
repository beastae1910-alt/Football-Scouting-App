## 2024-05-24 - Supabase client-side metadata spoofing
**Vulnerability:** Application checked `user?.user_metadata?.role` to determine authorization level (`effectiveRole`), and `src/RoleSelection.jsx` allowed updating this via `supabase.auth.updateUser()`.
**Learning:** Client-side updates to Supabase Auth's `user_metadata` are allowed by default and trust user input. Relying on this metadata for authorization allows malicious actors to inject arbitrary roles (e.g., changing 'player' to 'scout' or 'admin').
**Prevention:** Authorization logic must rely solely on the securely fetched, database-backed `profile.role` (protected by PostgreSQL constraints and RLS). Do not fall back to or allow client-side modification of `user_metadata.role` for authorization decisions.
