# Loan Board

Loan Board is a browser-based equipment checkout and return board for events, schools, shoots, stages, clubs, and other short-term lending situations.

The current milestone is **v0.6.0 (Item Management / Sequential Creation)**.

## v0.6.0 features
- Add / edit equipment and borrowers
- **Create numbered equipment in a batch**
- Preview generated names and codes before creation
- Optional item-code prefix
- Detect generated item-code conflicts
- Search equipment
- Filter Active / Archived / All
- Archive and restore unused equipment
- Prevent archiving checked-out equipment
- Multi-item checkout with double-checkout prevention
- Full and partial returns
- Outstanding board and completed state
- Undo the latest checkout / return
- Checkout / Return / Undo history
- History search, action filter, and ordering
- Japanese / English
- Desktop, tablet, and smartphone layouts
- Fully local processing
- No runtime network access
- Single-HTML build

## Sequential batch creation

For 20 radios, enter:

```text
Shared equipment name: Radio
Start number: 1
Quantity: 20
Digits: 2
Item-code prefix: RADIO-
```

The app previews and creates:

```text
Radio 01 / RADIO-01
Radio 02 / RADIO-02
...
Radio 20 / RADIO-20
```

A batch can contain up to 500 items, and generated numbers may not exceed 999999.

When an item-code prefix is used, generated codes are checked against all existing equipment, including archived items.

## Archive

Archive equipment you no longer use instead of deleting it.

Archived equipment is removed from checkout choices but remains available to History by its original item ID. It can be restored later.

**Checked-out equipment cannot be archived.** Return it first.

## Undo interaction

Archiving an item after a return makes that return incompatible with Undo. Undo never restores an archived item into the checked-out state.

## Current limitation
Equipment, borrowers, loan state, history, and archive state are **in memory only**. Reloading clears the data.

Automatic persistence and JSON backup / restore are planned for v0.7.0.

## Privacy
The app does not send equipment, borrower, loan state, or history to an external server. There is no runtime CDN, API, analytics, or telemetry.

## Single HTML / offline
The build produces `dist/index.html`, `dist/index.self-extract.html`, and `loan-board.html` with no runtime network dependency.

## Roadmap
v0.7.0 Persistence / Backup → v0.8.0 CSV → v0.9.0 RC → v1.0.0 Stable

## Development
```powershell
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-powershell-syntax.ps1
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-repository.ps1
```

## License
MIT License
