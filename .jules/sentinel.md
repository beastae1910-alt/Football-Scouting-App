## 2024-05-15 - Authorization Bypass via Client-Side Role Modification
**Vulnerability:** The application was allowing users to bypass role restrictions by modifying their client-side `user_metadata` directly and trusting this source for authorization.
**Learning:** Client-side updates to Supabase authentication metadata are easily manipulable by users. Authorization logic should never rely on these fields.
**Prevention:** Ensure all authorization logic relies strictly on RLS-protected database queries (e.g., a `profiles` table), which prevents users from arbitrarily escalating privileges.
