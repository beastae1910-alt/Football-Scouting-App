## 2024-05-08 - Added focus-visible states
**Learning:** Found that custom elements and buttons in the application lack a clear `:focus-visible` state across the application, which makes keyboard navigation difficult. The application relies on custom CSS files, specifically `src/index.css`.
**Action:** Added global `:focus-visible` states to interactive elements such as buttons (`.btn:focus-visible`), inputs (`.input-field:focus-visible`), and tabs (`.sport-tab:focus-visible`).
