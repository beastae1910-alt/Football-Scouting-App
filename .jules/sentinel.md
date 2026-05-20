## 2026-05-20 - Insecure random number generation for file names
**Vulnerability:** `Math.random()` was used to generate random strings for uploaded video file names in `src/UploadVideo.jsx`.
**Learning:** `Math.random()` is not cryptographically secure, which can lead to predictable random values, file name collisions or potential path/file predictability vulnerabilities.
**Prevention:** Always use cryptographically secure random number generators like `crypto.randomUUID()` when generating unique identifiers, file names, or tokens.
