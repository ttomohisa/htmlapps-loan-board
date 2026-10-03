# Changelog

All notable Loan Board changes are recorded here.

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
