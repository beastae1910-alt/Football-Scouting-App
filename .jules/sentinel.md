
## 2026-06-07 - Authorization Bypass via Client-Side Metadata
**Vulnerability:** Authorization logic relied on user.user_metadata.role which can be modified client-side.
**Learning:** Relying on client-editable fields for auth creates privilege escalation risks.
**Prevention:** Authorization must rely exclusively on securely fetched, RLS-protected database fields (e.g., profile.role).
