## 2026-06-03 - Authorization Bypass via Client-Side Metadata
**Vulnerability:** Client-side modification of user.user_metadata.role via supabase.auth.updateUser allowed authorization bypass.
**Learning:** Relying on client-editable metadata for authorization is inherently insecure.
**Prevention:** Authorization logic must rely solely on securely fetched, database-backed profile data protected by RLS.
