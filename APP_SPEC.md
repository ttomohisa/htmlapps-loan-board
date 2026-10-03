# Loan Board / 貸出・返却ボード — APP_SPEC

## 1. Product identity

- **Name:** Loan Board / 貸出・返却ボード
- **English helper:** Equipment Checkout & Return
- **Version:** v0.9.0
- **Status:** Release Candidate
- **Purpose:** 誰に何を貸していて、何がまだ返ってきていないかを1台の端末で管理する。
- **Primary outcome:** **未返却 0** を明確に確認できること。
- **Primary environment:** 受付等で使う1台のPC / タブレット / スマートフォン。
- **Release artifacts:** `dist/index.html`, `dist/index.self-extract.html`, `loan-board.html`.

## 2. v0.9.0 scope — UX / Release Candidate

v0.8.0までで予定していたv1.0.0向け主要機能は揃っている。

v0.9.0では新しい業務機能を増やさず、次を優先する。

- 主要操作への移動
- PC / スマートフォンの操作性
- タップ領域
- 長い名前 / メモ
- 空状態 / 完了状態 / エラー状態
- ダイアログの収まり
- 日本語 / 英語
- 自動保存 / JSON backup / restore
- CSV export
- Undo / History
- standalone / self-extract
- runtime external network block
- v1.0.0向け回帰確認

## 3. Main navigation

Heroと未返却ボードの間に、固定ではない主要操作ナビを置く。

項目:
- Board / ボード
- Checkout / 貸出
- Return / 返却
- History / 履歴
- Manage / 登録・管理
- Data / データ

### Rules
- fixed bottom barにはしない。
- コンテンツを隠さない。
- 6項目をPCでは6列。
- 820px以下では3列。
- 380px以下では2列。
- 各ターゲットへanchor navigation。
- sticky header分を `scroll-margin-top` で補正。
- 1項目あたり最低46pxの高さ。
- アイコンはSVG。
- 日本語 / 英語を切り替える。

## 4. Mobile / touch polish

### Touch targets
- 通常button: 44px以上を維持。
- mobileのsmall button: 44px以上。
- Checkout貸出先suggestion: 44px以上。
- 貸出先選択解除button: 44×44px。
- ToastのUndo action: 40px以上。

### Dialogs
- mobileではbottom-sheet形式を維持。
- `100vw`。
- 最大 `90dvh`。
- bodyのみscroll可能。
- footer actionはsafe-areaを考慮。
- 長いdialog titleは折り返せる。

## 5. Core feature set frozen for v1.0.0 candidate

### Setup / item management
- Board名
- Item単品登録
- Item連番一括登録
- category / code / note
- Item archive / restore
- checked-out Itemのarchive禁止
- Borrower登録 / 編集

### Checkout
- 既存Borrower選択
- Checkout中にBorrower新規作成
- 複数Item選択
- double-checkout禁止
- Checkout Event

### Return
- 現在借りているBorrowerだけ表示
- Return all
- Partial return
- Return Event
- Return後にItemをavailableへ戻す

### Outstanding board
- Outstanding count
- Borrower count
- available / total
- Borrower単位group
- Return all
- Partial returnへの導線
- outstanding 0 complete state

### Undo / History
- 最後の整合するCheckout / ReturnだけUndo
- 元Eventを削除せずUndo Event追加
- Return Undoで元checkout time復元
- History search
- Action filter
- Newest / oldest order

### Persistence
- browser local autosave
- validated startup restore
- corrupt autosaveを自動上書きしない
- JSON backup / restore
- restore validation
- destructive reset confirmation

### CSV
- Outstanding CSV
- Operation History CSV
- Equipment CSV
- UTF-8 BOM
- CRLF
- quote escaping
- formula injection protection
- CSVはrestore formatではない

## 6. Empty / success / failure states

必須状態:
- Item 0
- Borrower 0
- available Item 0
- outstanding 0
- Return対象0
- History 0
- History filter no-match
- Item filter no-match
- Batch invalid
- Batch code duplicate
- Autosave unavailable
- Autosave load-error
- Backup invalid
- Backup too large
- Backup restore complete
- Reset complete
- Checkout complete
- Return complete
- Undo complete

エラー時に業務dataを不要に破棄しない。

## 7. Long-content rules

以下は横スクロールの原因にしない。
- Board name
- Item name
- Borrower name
- category
- code
- note
- selected backup filename
- History item list
- Dialog title

必要箇所は `min-width: 0` / `overflow-wrap: anywhere` / wrapping layoutを使う。

## 8. Privacy / runtime

- Runtime CDN: none
- API: none
- analytics: none
- telemetry: none
- external font: none
- user-data upload: none
- CSP: `connect-src 'none'`
- third-party runtime dependencies: none
- direct `file://`: supported target

Autosave、JSON、CSVは端末内で処理する。

「完全ローカル処理」の説明は、実行時にユーザーデータを外部へ送信しない実装を前提とする。

## 9. Persistence caveat

Browser autosaveはcloud syncではない。

- browser site data削除で消える可能性がある。
- private browsingでは永続化されない場合がある。
- `file://` のstorage behaviorはbrowser / file location等で差があり得る。
- 別端末同期はしない。
- 重要な運用はJSON backupを併用する。

## 10. Release Candidate regression matrix

### Desktop
- 1280px前後
- Japanese
- English
- long content
- keyboard focus
- dialogs
- JSON / CSV download

### Mobile
- 360px
- 320px minimum layout
- Japanese
- English
- no horizontal page scroll
- buttons / touch targets
- dialog overflow
- safe-area
- long filename
- outstanding / checkout / return flow

### State transitions
- empty → register → checkout → partial return → full return
- checkout → Undo
- return → Undo
- archive / restore
- reload restore
- JSON backup → reset → JSON restore
- corrupt autosave protection
- invalid JSON rejection
- 3 CSV exports

### Build
- PowerShell syntax / encoding
- repository check
- readable standalone
- self-extract
- root HTML copy
- CSP / network block
- canonical favicon / header icon
- Cloudflare PR Preview HTTP 200

Detailed manual checks are maintained in `RELEASE_CHECKLIST.md`.

## 11. v0.9.0 acceptance criteria

- v0.8.0 features remain available.
- Main operation navigation reaches all six primary areas.
- Navigation wraps without horizontal page scrolling at mobile widths.
- Sticky header does not cover anchor targets.
- Key mobile touch targets meet the intended sizes.
- Dialog title can wrap.
- Long names / notes / filenames do not force page overflow.
- Japanese / English labels exist for new RC UI.
- Autosave / JSON / CSV behavior is unchanged functionally.
- Header remains aligned with current `htmlapps-template`.
- 360px and 320px layout rules are represented in CSS.
- standalone / self-extract / root HTML generation succeeds.
- repository check succeeds.
- PR Preview returns HTTP 200.

## 12. Roadmap

- **v0.1.0:** Core Data
- **v0.2.0:** Checkout
- **v0.3.0:** Return / partial return
- **v0.4.0:** Outstanding board
- **v0.5.0:** Undo / History
- **v0.6.0:** Item Management / sequential creation
- **v0.7.0:** Persistence / backup
- **v0.8.0:** CSV export
- **v0.9.0:** UX / Release Candidate
- **v1.0.0:** Stable Release
