# Loan Board

Loan Board is a browser-based equipment checkout and return board for events, schools, shoots, stages, clubs, and other short-term lending situations.

The current milestone is **v0.3.0 (Return)**. It supports multi-item checkout plus full and partial returns.

## v0.3.0 features
- Board name editing
- Add / edit equipment and borrowers
- Borrower search and inline borrower creation
- Multi-item checkout with double-checkout prevention
- Return list containing only borrowers who currently hold equipment
- Return all items for a borrower
- Partial return of selected items
- Returned items immediately become available for checkout again
- Checkout / Return event generation
- Japanese / English
- Desktop, tablet, and smartphone layouts
- Fully local processing, no runtime network access
- Single-HTML build

## Return
1. In Return, choose a borrower who currently holds equipment.
2. If everything came back, use Return all.
3. If only some items came back, choose Return some and select those items.
4. Returned equipment immediately becomes Available and can be checked out again.

## Current limitation
Equipment, borrowers, and loan state are **in memory only**. Reloading clears the data.

The dedicated outstanding-loan board is planned for v0.4.0, Undo / History for v0.5.0, and persistence / backup for v0.7.0.

## Privacy
Equipment, borrower information, and loan state are not sent to an external server. There is no runtime CDN, API, analytics, or telemetry.

## Single HTML / offline
The build produces `dist/index.html`, `dist/index.self-extract.html`, and `loan-board.html` with no runtime network dependency.

## Roadmap
v0.4.0 Outstanding board → v0.5.0 Undo/History → v0.6.0 Item Management → v0.7.0 Persistence → v0.8.0 CSV → v0.9.0 RC → v1.0.0 Stable

## Development
```powershell
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-powershell-syntax.ps1
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-repository.ps1
```

## License
MIT License
