# Loan Board v1.0.0 Release Checklist

This checklist is the manual release-candidate regression matrix for Loan Board v0.9.0 → v1.0.0.

## Automated checks

- [ ] `scripts/check-powershell-syntax.ps1`
- [ ] `scripts/check-repository.ps1`
- [ ] readable standalone build generated
- [ ] self-extract build generated
- [ ] repository-root `loan-board.html` matches readable standalone
- [ ] CSP includes `connect-src 'none'`
- [ ] no external runtime script / stylesheet / module / frame URL
- [ ] canonical favicon and header icon match
- [ ] Cloudflare PR Preview returns HTTP 200

## Desktop — Japanese

- [ ] empty board state is understandable
- [ ] board name accepts long text without horizontal page overflow
- [ ] single equipment creation
- [ ] 20-item sequential batch creation
- [ ] duplicate generated item-code rejection
- [ ] borrower creation
- [ ] borrower creation during checkout
- [ ] multi-item checkout
- [ ] double checkout prevented
- [ ] outstanding board updates immediately
- [ ] partial return
- [ ] full return
- [ ] outstanding 0 completion state
- [ ] checkout Undo
- [ ] return Undo
- [ ] History search
- [ ] History action filter
- [ ] History newest / oldest order
- [ ] equipment archive / restore
- [ ] checked-out equipment cannot be archived
- [ ] autosave status changes to saved
- [ ] reload restores the board
- [ ] JSON backup download
- [ ] reset confirmation
- [ ] JSON restore confirmation and full restore
- [ ] invalid JSON rejected without replacing current state
- [ ] Outstanding CSV
- [ ] History CSV
- [ ] Equipment CSV

## Desktop — English

- [ ] header / hero / operation navigation
- [ ] Checkout / Return / History terminology
- [ ] empty and completion states
- [ ] dialogs
- [ ] autosave and error messages
- [ ] JSON backup / restore labels
- [ ] CSV labels and downloaded headers

## Mobile — 360px

- [ ] no horizontal page scroll
- [ ] header does not overlap page content
- [ ] operation navigation wraps to three columns
- [ ] anchor targets are not hidden under the sticky header
- [ ] summary cards fit
- [ ] checkout borrower search fits
- [ ] long borrower name wraps
- [ ] long equipment name wraps
- [ ] selected-item controls remain tappable
- [ ] small buttons meet the intended mobile touch target
- [ ] return borrower list fits
- [ ] partial-return item selection is usable
- [ ] History rows fit
- [ ] registration forms fit
- [ ] batch registration form fits
- [ ] archive / restore actions fit
- [ ] backup filename wraps
- [ ] Data actions fit
- [ ] CSV actions fit
- [ ] edit dialogs stay within viewport
- [ ] dialog body scrolls independently
- [ ] dialog actions remain visible
- [ ] Toast does not extend outside the viewport

## Minimum width — 320px

- [ ] no horizontal page scroll
- [ ] operation navigation wraps to two columns at the narrow breakpoint
- [ ] summary switches to one column where defined
- [ ] long translated labels wrap
- [ ] dialogs remain usable

## Long-content regression

Test with:
- 100-character board name
- 120-character equipment name
- 120-character borrower name
- 80-character category
- 80-character item code
- 500-character note
- long JSON backup filename

Verify:
- [ ] no page-level horizontal overflow
- [ ] cards and records wrap
- [ ] history wraps
- [ ] dialog title wraps
- [ ] selected backup filename wraps
- [ ] CSV export succeeds

## Persistence / failure cases

- [ ] localStorage unavailable: app remains usable and shows autosave unavailable
- [ ] malformed autosave: existing stored text is not overwritten automatically
- [ ] explicit reset recovers from malformed autosave state
- [ ] malformed backup JSON is rejected
- [ ] wrong backup format is rejected
- [ ] backup over 10 MiB is rejected
- [ ] restored references remain valid
- [ ] archived items remain archived after reload / restore
- [ ] outstanding loan state remains correct after reload / restore

## CSV safety

- [ ] UTF-8 BOM present
- [ ] CRLF line endings
- [ ] every cell quoted
- [ ] embedded double quotes escaped
- [ ] value beginning with `=SUM(1,1)` is protected
- [ ] value beginning with `+cmd` is protected
- [ ] value beginning with `-1+1` is protected
- [ ] value beginning with `@example` is protected
- [ ] empty outstanding list exports a header-only CSV

## Privacy / offline

- [ ] no user-data upload
- [ ] no runtime CDN
- [ ] no runtime API call
- [ ] no analytics / telemetry
- [ ] standalone opens directly
- [ ] self-extract variant works as intended
- [ ] normal lending workflow works without network access

## Release documentation

- [ ] `app.config.json` version
- [ ] header version badge
- [ ] APP_SPEC
- [ ] README Japanese
- [ ] README English
- [ ] CHANGELOG
- [ ] screenshots Japanese desktop
- [ ] screenshots English desktop
- [ ] smartphone screenshot
- [ ] favicon
- [ ] root standalone HTML
- [ ] release tag / release notes
