## 2024-05-22 - Predictable Randomness in File Generation
**Vulnerability:** `Math.random()` was used to generate random IDs for file names in video uploads, which is predictable and collision-prone.
**Learning:** For security and uniqueness purposes, `Math.random()` is insufficient. In environments with many uploads, this can lead to accidental overwrites or predictable file paths.
**Prevention:** Always use cryptographically secure random number generators like `crypto.randomUUID()` when generating unguessable, collision-resistant identifiers for files or security tokens.
