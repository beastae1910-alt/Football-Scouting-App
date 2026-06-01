## 2024-06-01 - Fix authorization bypass via user_metadata role manipulation
**Vulnerability:** The application used user.user_metadata.role as a fallback for authorization, which could be modified directly by clients using supabase.auth.updateUser to grant themselves elevated privileges (e.g., scout).
**Learning:** Relying on client-editable metadata for authorization is insecure. Roles must exclusively come from the database (e.g., profiles table), which is protected by Row Level Security.
**Prevention:** Never use or fall back to user_metadata for critical authorization logic. Always verify roles against a secure, server-authoritative source.
