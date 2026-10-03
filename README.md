# Loan Board

Loan Board is a browser-based equipment checkout and return board for events, schools, shoots, stages, clubs, and other short-term lending situations.

The repository is currently at **v0.1.0 (Core Data)**. This stage implements the board foundation plus equipment and borrower setup. Checkout and return workflows are intentionally scheduled for later milestones.

## Available in v0.1.0

- Edit the board name
- Add and edit equipment
- Equipment category, code, and notes
- Add and edit borrowers / teams
- Live setup counts
- Japanese / English UI
- Desktop, tablet, and smartphone layouts
- Fully local processing
- No runtime network access
- Single-HTML build

## Current limitation

In v0.1.0, equipment and borrower data is kept **in memory only**. Reloading the page clears the working data.

Persistent storage plus backup / restore is planned for v0.7.0.

Not implemented yet:

- Checkout
- Return / partial return
- Outstanding-loan board
- Undo / history
- Sequential item creation
- CSV export

## Privacy

Equipment and borrower information is not sent to an external server by this app. There is no runtime CDN, API, analytics, or telemetry.

Business data is not persistently stored in v0.1.0. The selected interface language may be stored locally in the browser.

## Single HTML / offline

The build produces:

- \`dist/index.html\`
- \`dist/index.self-extract.html\`
- \`loan-board.html\`

Required code is embedded in the HTML and the app has no runtime network dependency.

## Roadmap

- **v0.1.0:** Core data
- **v0.2.0:** Checkout
- **v0.3.0:** Return and partial return
- **v0.4.0:** Outstanding-loan board
- **v0.5.0:** Undo and history
- **v0.6.0:** Sequential item creation and item management
- **v0.7.0:** Persistence and backup
- **v0.8.0:** CSV export
- **v0.9.0:** UX and release candidate
- **v1.0.0:** Stable release

See \`APP_SPEC.md\` for the product contract and acceptance criteria.

## Development

PowerShell syntax / encoding preflight:

\`\`\`powershell
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-powershell-syntax.ps1
\`\`\`

Build and repository verification:

\`\`\`powershell
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-repository.ps1
\`\`\`

## License

MIT License
