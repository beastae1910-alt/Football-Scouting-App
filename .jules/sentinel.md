## 2025-02-12 - Prevent Predictable File Names
**Vulnerability:** In `src/UploadVideo.jsx`, the code used `Math.random()` combined with a timestamp to generate unique file names for video uploads.
**Learning:** `Math.random()` is not cryptographically secure and predictable, which could lead to file name collisions or allow attackers to guess file names and potentially overwrite them or gain unauthorized access to uploaded files if the storage backend relies entirely on the path for security.
**Prevention:** Use `crypto.randomUUID()` to generate unguessable, collision-resistant identifiers for files and resources.
