
## 2024-05-17 - Insecure Random Number Generation for File Uploads
**Vulnerability:** File upload path generation in `src/UploadVideo.jsx` used `Math.random().toString(36).slice(2, 9)` to generate identifiers, creating predictable file names and increasing the risk of collisions or targeted enumeration attacks.
**Learning:** `Math.random()` is not cryptographically secure and should never be used for security-sensitive operations or generating collision-resistant identifiers like file names.
**Prevention:** Always use `crypto.randomUUID()` or the Web Crypto API (`crypto.getRandomValues()`) for generating unpredictable, collision-resistant random strings in browser contexts.
