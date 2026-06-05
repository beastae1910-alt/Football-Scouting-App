## 2025-05-18 - Client-Side Authorization Bypass via user_metadata
**Vulnerability:** The application was using the client-modifiable `user.user_metadata.role` (which can be updated via `supabase.auth.updateUser`) to determine the user's authorization level (`effectiveRole`), allowing users to arbitrarily elevate their privileges to 'scout' or other roles.
**Learning:** `user_metadata` in Supabase Auth is editable by the authenticated user from the client side and thus cannot be trusted for critical authorization checks.
**Prevention:** Authorization logic must rely solely on securely fetched, database-backed data, such as `profile.role`, which is protected by Row Level Security (RLS) policies.
