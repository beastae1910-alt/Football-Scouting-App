## 2026-06-08 - [Authorization Bypass via Client-Side Metadata Modification]
**Vulnerability:** The application was falling back to `user.user_metadata.role` for authorization logic, and explicitly allowing the client to update this value using `supabase.auth.updateUser()` during role selection.
**Learning:** Client-side user metadata in Supabase can be modified by the user directly. Relying on it for authorization bypasses row-level security (RLS) and allows users to grant themselves arbitrary roles (e.g., escalating from player to scout).
**Prevention:** Authorization logic must rely solely on securely fetched, database-backed data (like the `profiles` table protected by RLS). Never fall back to or allow client-side modification of metadata for sensitive attributes like roles.
