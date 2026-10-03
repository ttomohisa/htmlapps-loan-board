# Loan Board

Loan Board is a browser-based equipment checkout and return board for events, schools, shoots, stages, clubs, and other short-term lending situations.

The current milestone is **v0.7.0 (Persistence / JSON Backup)**.

## v0.7.0 features
- Add / edit equipment and borrowers
- Sequential batch equipment creation
- Equipment archive / restore
- Multi-item checkout
- Full and partial returns
- Outstanding board
- Undo the latest checkout / return
- Checkout / Return / Undo history
- **Browser autosave**
- **Automatic restore after reload**
- **Save status and last-saved time**
- **JSON backup**
- **Full-state restore from JSON backup**
- Japanese / English
- Desktop, tablet, and smartphone layouts
- Fully local processing
- No runtime network access
- Single-HTML build

## Browser autosave

Equipment, borrowers, loan state, history, archive state, and board name are automatically stored in browser-local storage.

After reload, saved data is validated before it is used.

If saved data is malformed, Loan Board **does not automatically overwrite it with an empty state**. Autosave is blocked until you restore a JSON backup or explicitly reset to a new board.

## JSON backup

Save JSON backup exports the complete board state:

- Board
- Items
- Borrowers
- Checkout / Return / Undo Events
- Archive state
- Current checkout state

Unlike CSV, JSON backup is intended for **full Loan Board restoration**.

Restore validates the file format, schema, references, and loan state before asking for confirmation to replace the current board.

## Storage limitations

Autosave is not cloud sync.

- Clearing browser site data can remove it.
- Private browsing may not persist it.
- When the standalone HTML is opened with `file://`, storage behavior can vary by browser and by how or where the file is opened.
- It does not automatically sync across devices or browsers.

For important operations, keep a **JSON backup** as well.

## Privacy
Autosave and JSON backup are processed on the device. Equipment, borrower, loan, history, and backup data are not uploaded to an external server. There is no runtime CDN, API, analytics, or telemetry.

## Single HTML / offline
The build produces `dist/index.html`, `dist/index.self-extract.html`, and `loan-board.html` with no runtime network dependency.

## Roadmap
v0.8.0 CSV → v0.9.0 RC → v1.0.0 Stable

## Development
```powershell
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-powershell-syntax.ps1
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-repository.ps1
```

## License
MIT License
