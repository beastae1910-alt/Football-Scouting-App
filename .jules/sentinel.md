## 2024-05-18 - Auth Bypass via Client-Side Metadata Manipulation
**Vulnerability:** The app fell back to `user.user_metadata.role` for authorization and allowed clients to update it using `supabase.auth.updateUser`.
**Learning:** Never trust user metadata for authorization if clients can update it via the client-side Supabase client.
**Prevention:** Rely solely on database-backed roles securely fetched from tables protected by RLS.
