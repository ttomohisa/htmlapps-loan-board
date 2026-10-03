# Loan Board

Loan Board is a browser-based equipment checkout and return board for events, schools, shoots, stages, clubs, and other short-term lending situations.

The current milestone is **v0.4.0 (Outstanding Board)**.

## v0.4.0 features
- Add / edit equipment and borrowers
- Multi-item checkout with double-checkout prevention
- Full and partial returns
- Outstanding item count
- Number of borrowers who currently hold equipment
- Available / total equipment count
- Outstanding items grouped by borrower
- Return all directly from the outstanding board
- Jump into partial return from the outstanding board
- Clear completed state when the outstanding count reaches zero
- Japanese / English
- Desktop, tablet, and smartphone layouts
- Fully local processing
- No runtime network access
- Single-HTML build

## Core flow

```text
Register equipment
↓
Check out
↓
See who has what on the outstanding board
↓
Return all / return some
↓
Outstanding 0
```

## Current limitation
Equipment, borrowers, and loan state are **in memory only**. Reloading clears the data.

Undo / History is planned for v0.5.0. Persistence and backup / restore are planned for v0.7.0.

## Privacy
The app does not send equipment, borrower, or loan state to an external server. There is no runtime CDN, API, analytics, or telemetry.

## Single HTML / offline
The build produces `dist/index.html`, `dist/index.self-extract.html`, and `loan-board.html` with no runtime network dependency.

## Roadmap
v0.5.0 Undo/History → v0.6.0 Item Management → v0.7.0 Persistence → v0.8.0 CSV → v0.9.0 RC → v1.0.0 Stable

## Development
```powershell
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-powershell-syntax.ps1
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-repository.ps1
```

## License
MIT License
