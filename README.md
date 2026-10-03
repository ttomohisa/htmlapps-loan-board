# Loan Board

Loan Board is a browser-based equipment checkout and return board for short-term lending at events, schools, shoots, stages, clubs, and internal activities.

The current milestone is **v0.9.0 Release Candidate**. The v1.0.0 candidate feature set is in place, and this release focuses on usability and full regression checks.

## Main features

- Add / edit equipment and borrowers
- Sequential batch equipment creation
- Equipment archive / restore
- Multi-item checkout
- Full and partial returns
- Outstanding board
- Clear zero-outstanding completion state
- Undo the latest compatible checkout / return
- Checkout / Return / Undo history
- History search, filtering, and ordering
- Browser autosave
- JSON backup / restore
- Outstanding / operation-history / equipment CSV exports
- Japanese / English
- Desktop, tablet, and smartphone layouts
- Fully local processing
- No runtime network access
- Single-HTML builds

## Core flow

```text
Register equipment
↓
Choose a borrower
↓
Check out equipment
↓
Review the outstanding board
↓
Return all / return some
↓
Outstanding 0
```

## v0.9.0 UX polish

A normal, non-fixed navigation near the top jumps to:

- Board
- Checkout
- Return
- History
- Manage
- Data

It does not cover mobile content. The six actions wrap from six columns to three and then two at narrow widths.

Mobile touch targets were also adjusted for small action buttons, borrower suggestions, selection clearing, and Toast Undo.

## Persistence and backup

Operational data is automatically saved in this browser.

Autosave is not cloud sync. Clearing site data, private browsing, or browser-specific `file://` storage behavior can make saved data unavailable.

Keep **JSON backups** for important operations.

JSON is the full-state restore format. CSV is for spreadsheet review and analysis and is not a restore format.

## CSV

Three exports are available:

- Outstanding CSV
- Operation history CSV
- Equipment CSV

CSV uses UTF-8 with BOM, CRLF, quoted cells, and spreadsheet formula-injection protection for user-entered values beginning with formula-triggering characters.

## Privacy

Entries, loan state, history, autosave, JSON, and CSV are processed on the device. User data is not uploaded to an external server.

There is no runtime CDN, API, analytics, or telemetry.

## Release Candidate

The v1.0.0 regression matrix is maintained in `RELEASE_CHECKLIST.md`.

It covers:

- Desktop / mobile
- Japanese / English
- Long equipment, borrower, and file names
- Empty / completed / error states
- Checkout / Return / Partial Return / Undo
- Autosave / reload restore
- JSON backup / restore
- All three CSV exports
- Standalone / self-extract
- CSP / runtime network blocking
- Cloudflare PR Preview

## Single HTML / offline

The build produces `dist/index.html`, `dist/index.self-extract.html`, and `loan-board.html` with no runtime network dependency.

## Roadmap

v0.9.0 Release Candidate → v1.0.0 Stable

## Development

```powershell
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-powershell-syntax.ps1
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-repository.ps1
```

## License

MIT License
