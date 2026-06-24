## 2024-06-24 - Client-side metadata trust bypass
**Vulnerability:** The application trusts `user.user_metadata.role` (which can be manipulated by the user client-side via Supabase API) as a fallback for authorization, bypassing DB row-level security.
**Learning:** Authorization should only rely on server-side profiles.
**Prevention:** Never use `user_metadata` for authorization, only use secure db profile.
