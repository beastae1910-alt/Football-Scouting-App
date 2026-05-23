## 2025-02-28 - Insecure Randomness in Uploaded File Names
**Vulnerability:** File names for video uploads in `src/UploadVideo.jsx` were generated using `Math.random().toString(36).slice(2, 9)`, which is predictable and insecure. This could lead to predictable filenames, opening up the possibility for attackers to overwrite files or conduct predictable path traversals/references in cloud storage.
**Learning:** `Math.random()` should never be used for security-critical operations, including generating identifiers, tokens, or filenames that need to be unpredictable and collision-resistant.
**Prevention:** Always use cryptographically secure random number generators like `crypto.randomUUID()` or `crypto.getRandomValues()` for generating unique identifiers.
