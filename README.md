# Loan Board

Loan Board is a browser-based equipment checkout and return board for events, schools, shoots, stages, clubs, and other short-term lending situations.

The current milestone is **v0.5.0 (Undo / History)**.

## v0.5.0 features
- Add / edit equipment and borrowers
- Multi-item checkout with double-checkout prevention
- Full and partial returns
- Outstanding board and completed state
- Undo immediately after checkout or return
- Undo the most recent compatible operation from History
- Checkout / Return / Undo history
- Search history by borrower, equipment, category, or code
- Filter history by action
- Newest-first / oldest-first order
- Mark original events as undone
- Japanese / English
- Desktop, tablet, and smartphone layouts
- Fully local processing
- No runtime network access
- Single-HTML build

## Undo behavior
Undo does not delete history. It restores state and adds an Undo event.

When a return is undone, the original borrower and checkout time are restored.

History exposes Undo only when the **last history event itself is an un-undone checkout or return**. After an Undo event, the app does not keep walking backward to older operations.

## Current limitation
Equipment, borrowers, loan state, and history are **in memory only**. Reloading clears the data.

Sequential item creation / item management is planned for v0.6.0. Persistence and backup / restore are planned for v0.7.0.

## Privacy
The app does not send equipment, borrower, loan state, or history to an external server. There is no runtime CDN, API, analytics, or telemetry.

## Single HTML / offline
The build produces `dist/index.html`, `dist/index.self-extract.html`, and `loan-board.html` with no runtime network dependency.

## Roadmap
v0.6.0 Item Management → v0.7.0 Persistence → v0.8.0 CSV → v0.9.0 RC → v1.0.0 Stable

## Development
```powershell
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-powershell-syntax.ps1
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-repository.ps1
```

## License
MIT License
