## 2024-06-30 - Authorization Bypass via user_metadata Modification
**Vulnerability:** Client-side fallback to `user.user_metadata.role` allows users to modify their metadata and gain unauthorized roles (e.g., 'scout').
**Learning:** Supabase allows clients to update their own `user_metadata` by default. Relying on it for authorization on the client is insecure.
**Prevention:** Always rely strictly on database-backed `profile` records protected by RLS or Custom Claims for authorization logic.
