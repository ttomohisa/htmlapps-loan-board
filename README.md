# Loan Board

Loan Board is a browser-based equipment checkout and return board for events, schools, shoots, stages, clubs, and other short-term lending situations.

The current milestone is **v0.8.0 (CSV Export)**.

## v0.8.0 features
- Add / edit equipment and borrowers
- Sequential batch equipment creation
- Equipment archive / restore
- Multi-item checkout
- Full and partial returns
- Outstanding board
- Undo the latest checkout / return
- Checkout / Return / Undo history
- Browser autosave
- JSON backup / restore
- **Outstanding CSV**
- **Operation history CSV**
- **Equipment CSV**
- Japanese / English
- Desktop, tablet, and smartphone layouts
- Fully local processing
- No runtime network access
- Single-HTML build

## CSV exports

Data management provides three CSV exports.

### Outstanding CSV

Exports every currently checked-out item as **one item per row**.

It includes board, borrower, borrower note, equipment, category, item code, checkout timestamp, and equipment note.

When nothing is outstanding, the app can still save a valid header-only CSV.

### Operation history CSV

Exports Checkout / Return / Undo as **one event-item pair per row**.

A checkout containing multiple items therefore becomes multiple rows.

The export includes Event ID, action, timestamp, borrower, item details, whether the source event has been undone, and the related Event ID for Undo.

### Equipment CSV

Exports every equipment item, including archived items.

It includes current status, archive state, current borrower, checkout timestamp, creation time, and update time.

## Spreadsheet compatibility and safety

CSV output uses:
- UTF-8 with BOM
- CRLF line endings
- comma-separated fields
- every field quoted
- escaped double quotes

User-entered cells beginning with formula-triggering characters such as `=`, `+`, `-`, or `@` are protected before export so spreadsheet software does not interpret them as formulas.

## CSV is not a backup

CSV is for **review and analysis**.

Use **JSON backup** when you need to restore the complete Loan Board state.

CSV Import / Restore is not supported.

## Persistence

Browser autosave and JSON backup / restore from v0.7.0 remain available.

Autosave is not cloud sync and can be removed by browser site-data settings. Keep JSON backups for important operations.

## Privacy

CSV generation, JSON backup, and autosave are all processed on the device. Equipment, borrower, loan, history, and export data are not uploaded to an external server. There is no runtime CDN, API, analytics, or telemetry.

## Single HTML / offline
The build produces `dist/index.html`, `dist/index.self-extract.html`, and `loan-board.html` with no runtime network dependency.

## Roadmap
v0.9.0 UX / Release Candidate → v1.0.0 Stable

## Development
```powershell
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-powershell-syntax.ps1
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-repository.ps1
```

## License
MIT License
