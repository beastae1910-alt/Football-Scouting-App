## 2024-05-24 - [Predictable Random Number Generation]
**Vulnerability:** File names for video uploads in UploadVideo.jsx were generated using Math.random(), leading to predictable file names and potential collisions.
**Learning:** Using Math.random() for security-sensitive operations like file name generation or session IDs is insecure because it relies on a pseudo-random number generator that is not cryptographically strong, making output predictable.
**Prevention:** Use crypto.randomUUID() for secure, collision-resistant string generation when creating unique identifiers like file names.
