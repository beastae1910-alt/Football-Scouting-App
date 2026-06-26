## 2025-02-14 - Fix authorization bypass via user_metadata
**Vulnerability:** Application relied on client-side Supabase `user.user_metadata.role` as a fallback for authorization, which can be modified by the user.
**Learning:** Client-side updates to user metadata bypass server-side role constraints.
**Prevention:** Rely entirely on database-backed profile roles protected by Row Level Security (RLS) for authorization.
