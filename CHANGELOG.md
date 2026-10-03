# Changelog

All notable Loan Board changes are recorded here.

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
