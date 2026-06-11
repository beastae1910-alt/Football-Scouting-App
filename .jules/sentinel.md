## 2024-06-11 - Authorization Bypass via User Metadata
**Vulnerability:** The application relied on 'user.user_metadata.role' as a fallback for authorization decisions (like setting 'effectiveRole'). Client-side code could update this via 'supabase.auth.updateUser'.
**Learning:** User metadata in Supabase can be modified directly by the authenticated user from the client if not handled carefully, bypassing secure role-based access control (RBAC) intended to be enforced via 'profiles' table and RLS policies.
**Prevention:** Authorization logic must rely solely on securely fetched, database-backed roles (e.g., 'profile.role' from a 'profiles' table protected by RLS). Never fall back to or allow client-side modification of 'user.user_metadata.role' for privilege escalation.
