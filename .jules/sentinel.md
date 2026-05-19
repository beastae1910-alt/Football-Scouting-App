
## 2026-05-19 - Insecure file name generation
**Vulnerability:** In `src/UploadVideo.jsx`, the code used `Math.random().toString(36).slice(2, 9)` to generate randomized identifiers for uploaded video files.
**Learning:** `Math.random()` is not a cryptographically secure pseudo-random number generator (CSPRNG), which leads to predictable strings that could potentially cause file overwrites, collisions, or guessing of file paths.
**Prevention:** Use `crypto.randomUUID()` to generate collision-resistant, secure identifiers for file names and random IDs to ensure unpredictability.
