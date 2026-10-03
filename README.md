# Loan Board

Loan Board is a browser-based equipment checkout and return board for events, schools, shoots, stages, clubs, and other short-term lending situations.

The current milestone is **v0.2.0 (Checkout)**. Register equipment and borrowers, choose a borrower, and check out multiple available items in one operation.

## v0.2.0 features
- Board name editing
- Add / edit equipment and borrowers
- Borrower search and inline borrower creation
- Search available equipment by name, category, or code
- Multi-item checkout
- Double-checkout prevention
- Borrower and checkout time on checked-out equipment
- Current checked-out count per borrower
- Japanese / English
- Desktop, tablet, and smartphone layouts
- Fully local processing, no runtime network access
- Single-HTML build

## Current limitation
Equipment, borrowers, and checkout state are **in memory only** in v0.2.0. Reloading clears the data.

Return / partial return is planned for v0.3.0. Persistence and backup / restore are planned for v0.7.0.

## Checkout
1. Register equipment.
2. Search for and select a borrower. A new borrower can be added inline.
3. Select one or more available items.
4. Confirm checkout.
5. Checked-out items cannot be selected for another checkout.

## Privacy
Equipment, borrower information, and checkout state are not sent to an external server. There is no runtime CDN, API, analytics, or telemetry.

## Single HTML / offline
The build produces `dist/index.html`, `dist/index.self-extract.html`, and `loan-board.html` with no runtime network dependency.

## Roadmap
v0.3.0 Return → v0.4.0 Outstanding board → v0.5.0 Undo/History → v0.6.0 Item Management → v0.7.0 Persistence → v0.8.0 CSV → v0.9.0 RC → v1.0.0 Stable

## Development
```powershell
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-powershell-syntax.ps1
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-repository.ps1
```

## License
MIT License
