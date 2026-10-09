# Changelog

All notable Loan Board changes are recorded here.

## [1.0.2] - 2026-10-09

### Fixed
- Normalize the canonical app icon to `#16624f` with exact 25% background corner radii, preserving existing artwork and padding.
- Keep the app header, favicon, and generated standalone variants synchronized.

## [Unreleased]

### Added
- Search equipment names, categories, and codes while choosing a partial return, scoped to the selected borrower's current loans.
- Preserve item-ID selections across search changes and show both the matching count and the number of selected items hidden by search.
- Actual-source regression coverage for search, selection/focus identity, reset/restore boundaries, return/Undo, backup validation, and CSV invariants across standalone variants.

### Fixed
- Accepted schema-v1 backups with archived borrowers and active loans no longer hide those loans or show a false all-returned state. Archived borrowers remain excluded from new-checkout suggestions, without changing archive flags or backup validation.
- Partial-return checkbox changes retain keyboard focus instead of recreating the focused row.

## [1.0.1] - 2026-10-07

### Fixed

- Read the board release chip and localized release notice from the canonical app version, and omit stale pre-initialization badge text.
- Standardize the header language target to EN / JA, with localized target-language accessible labels and matching tooltips. Preserve the exact local-processing badge and adjacent Help.
- Add regression coverage for the JA → EN → JA round trip without losing loans, partial-return search, or hidden item selections.

## [1.0.0] - 2026-10-04

### Added
- Stable v1.0.0 release documentation and final product specification.
- Final Loan Board icon supplied for both favicon and header branding.
- English release screenshot target for the finalized README.

### Changed
- Version badge, app configuration, and in-app help moved from Release Candidate to v1.0.0 stable.
- Release Candidate notice removed from the application.
- Japanese and English README files rewritten around the stable product workflow, following the established PDF Organizer repository structure.
- Product documentation now clearly separates browser autosave, full-state JSON backup / restore, and review-oriented CSV export.

### Verified
- Core workflow remains equipment registration → checkout → outstanding review → full / partial return → outstanding 0.
- Browser autosave, JSON backup / restore, Undo / History, archive / restore, and all three CSV exports remain part of the stable feature set.

## [0.9.0] - 2026-10-03

### Added
- Non-fixed operation navigation for Board, Checkout, Return, History, Manage, and Data.
- Anchor offsets that account for the sticky application header.
- v1.0.0 manual regression matrix in `RELEASE_CHECKLIST.md`.

### Changed
- Product-facing hero copy now describes the complete lending workflow instead of the latest milestone feature.
- Mobile small-action buttons use larger touch targets.
- Borrower suggestion and selection-clear controls use larger touch targets.
- Toast actions are easier to tap and long Toast text can wrap.
- Long dialog titles can wrap.
- Operation navigation wraps to 3 columns on mobile and 2 columns at very narrow widths.
- Help, README files, and product specification now describe the Release Candidate state.

## [0.8.0] - 2026-10-03

### Added
- Outstanding CSV export with one row per currently checked-out item.
- Operation-history CSV export with one row per event-item pair.
- Equipment CSV export including active and archived equipment.
- UTF-8 BOM and CRLF for spreadsheet-friendly CSV files.
- Spreadsheet formula-injection protection for user-entered CSV cells.

### Changed
- Data management now separates full JSON backup / restore from review-and-analysis CSV exports.
- CSV filenames include the board name, export kind, and timestamp.
- Bilingual help, README files, and product specification now document CSV semantics and limitations.

## [0.7.0] - 2026-10-03

### Added
- Browser-local autosave for board, equipment, borrowers, loan state, history, and archive state.
- Automatic validated restore on reload.
- Save-status UI with last-saved time.
- Full-state JSON backup download.
- Validated JSON backup restore with replacement confirmation.
- Reset-to-new-board action with destructive confirmation.
- Backup schema / app-format validation and a 10 MiB restore limit.

### Changed
- Corrupted autosave data is no longer at risk of being overwritten by an empty state; autosave is blocked until explicit recovery or reset.
- Page exit flushes pending autosave work.
- Documentation now distinguishes browser autosave from JSON backup and future CSV export.

## [0.6.0] - 2026-10-03

### Added
- Sequential batch creation with shared name, start number, quantity, and digit width.
- Optional generated item-code prefix with conflict detection against existing and archived equipment.
- Batch preview before creation.
- Equipment search and Active / Archived / All filters.
- Equipment archive and restore actions.

### Changed
- The equipment count now represents active, non-archived equipment.
- Archived equipment is excluded from checkout and outstanding views while remaining resolvable in history.
- Checked-out equipment cannot be archived.
- Undo compatibility now rejects archived equipment.
- Bilingual help, README files, and product specification now cover item management.

## [0.5.0] - 2026-10-03

### Added
- Undo action in checkout and return completion toasts.
- Strict latest-event Undo: only the last checkout / return event can be undone, and Undo never walks backward past an Undo event.
- Undo events that preserve original history instead of deleting it.
- Restoration of original checkout timestamps when a return is undone.
- Searchable history for checkout, return, and undo operations.
- History filtering by action and newest / oldest ordering.
- History search by borrower, equipment, category, and code.
- Undone status on original events.

### Changed
- Bilingual help, README files, and product specification now describe Undo and History.

## [0.4.0] - 2026-10-03

### Added
- Outstanding board grouped by borrower.
- Outstanding item, active borrower, and available / total summaries.
- Checkout timestamp details on outstanding items.
- Return-all action directly from each outstanding borrower group.
- Partial-return shortcut from the outstanding board.
- Completed state shown when all equipment has been returned.

### Changed
- The top of the app now prioritizes outstanding equipment instead of setup counts.
- Bilingual help, README files, and product specification now describe the outstanding-board workflow.

## [0.3.0] - 2026-10-03

### Added
- Return workflow that lists only borrowers with outstanding equipment.
- Primary full-return action for all items held by a borrower.
- Partial-return mode with selected-item return.
- Return event generation.
- Immediate restoration of returned items to the available checkout pool.

### Changed
- Summary, equipment list, and borrower counts now update after returns.
- Bilingual help, README files, and product specification now cover checkout and return.

## [0.2.0] - 2026-10-03

### Added
- Borrower search and inline borrower creation for checkout.
- Search and multi-select for available equipment.
- Checkout events and checked-out item state.
- Double-checkout prevention.
- Borrower / checkout time display on equipment and checked-out counts on borrowers.

### Changed
- Header structure and controls now match the current htmlapps-template UI pattern.
- Updated bilingual help, README files, and product specification for v0.2.0.

## [0.1.0] - 2026-10-03

### Added

- Initial Loan Board application foundation based on the current Browser Kitty single-HTML template.
- Board, Item, Borrower, and Event state models.
- Board name editing.
- Equipment creation and editing with category, code, and notes.
- Borrower / team creation and editing with notes.
- Empty states, live setup counts, and available-item status.
- Responsive desktop, tablet, and smartphone UI.
- Japanese / English switching.
- In-app help describing current v0.1.0 behavior and data-loss limitation.
- Fully local runtime with no external network dependency.

### Not yet included

- Checkout and return workflows.
- Persistent business-data storage.
- Backup / restore and CSV export.
