## 2026-05-09 - Insecure Randomness in Uploaded File Names
**Vulnerability:** The application used `Math.random()` to generate a pseudo-random string for uploaded video filenames in `UploadVideo.jsx`.
**Learning:** `Math.random()` is not cryptographically secure, which means the generated filenames are predictable and could potentially lead to collisions or malicious users guessing file paths before they are published.
**Prevention:** Always use `crypto.randomUUID()` or `crypto.getRandomValues()` when generating random identifiers for security-sensitive operations such as file names, session IDs, or tokens to ensure unpredictability and strong collision resistance.
