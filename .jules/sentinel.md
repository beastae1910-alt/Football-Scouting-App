## 2024-05-18 - Insecure Randomness using Math.random
**Vulnerability:** The application used `Math.random()` to generate random suffixes for uploaded video files.
**Learning:** `Math.random()` is not cryptographically secure and can lead to predictable file names, which could potentially be exploited to overwrite or access unintended files. The memory context mentions we should use `crypto.randomUUID()` instead of `Math.random()` to ensure unpredictable, collision-resistant string generation.
**Prevention:** Always use `crypto.randomUUID()` or a dedicated cryptographic library for generating random tokens, IDs, or file names, especially in contexts where uniqueness and unpredictability are important for security.
