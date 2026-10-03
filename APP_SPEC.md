# Loan Board / 貸出・返却ボード — APP_SPEC

## 1. Product identity
- **Name:** Loan Board / 貸出・返却ボード
- **English helper:** Equipment Checkout & Return
- **Version:** v0.8.0
- **Purpose:** 誰に何を貸していて、何が返ってきていないかを確認し、必要な情報を表計算ソフト等へ持ち出せるようにする。
- **Primary outcome:** **未返却 0** を明確に確認できること。
- **Release artifacts:** `dist/index.html`, `dist/index.self-extract.html`, `loan-board.html`.

## 2. v0.8.0 scope — CSV Export

v0.7.0までの貸出・返却・未返却ボード・Undo・履歴・備品管理・自動保存・JSONバックアップに加えて、確認・集計用途のCSV出力を実装する。

CSVは復元形式ではない。**完全復元はJSONバックアップを使用する。**

出力:
1. 未返却一覧CSV
2. 操作履歴CSV
3. 備品一覧CSV

## 3. CSV common rules

- UTF-8 with BOM
- line ending: CRLF
- comma separated
- every cell quoted
- embedded double quote is escaped as `""`
- filename includes app slug, board name, export kind, timestamp
- UI languageが日本語なら日本語header、日本語向け値
- UI languageがEnglishならEnglish header / values
- CSV生成・ダウンロードは端末内で完結
- 外部送信なし

### Spreadsheet formula injection protection

備品名、貸出先名、メモ等はユーザー入力のため、CSVをExcel等で開いた際に式として評価されないよう保護する。

セル文字列が空白等を含めて次の記号から始まる場合:
- `=`
- `+`
- `-`
- `@`
- tab / CR / LF

先頭へ `'` を追加して数式評価を避ける。

CSV quotingだけではformula injection対策にならないため、別途この処理を行う。

## 4. Filename

形式:

```text
loan-board-{board}-{kind}-{timestamp}.csv
```

kind:
- `outstanding`
- `history`
- `equipment`

例:

```text
loan-board-2026年度-文化祭-outstanding-20261003T111500Z.csv
```

## 5. Outstanding CSV

現在 `checked-out` かつ `archived === false` のItemだけを出力する。

**1 Item = 1 row**

日本語columns:
- ボード名
- 貸出先
- 貸出先メモ
- 備品名
- カテゴリ
- 管理コード
- 貸出日時
- 備品メモ

English columns:
- Board
- Borrower
- Borrower note
- Equipment
- Category
- Item code
- Checked out at
- Equipment note

貸出日時はISO-8601値を出力する。

未返却0の場合もheaderのみの有効なCSVを生成できる。

## 6. Operation History CSV

Checkout / Return / Undo Eventを出力する。

**1 Event × 1 Item = 1 row**

複数ItemのCheckout / Returnは、Item単位で複数行になる。

columns:
- Board
- Event ID
- Action
- Timestamp
- Borrower
- Equipment
- Category
- Item code
- Source event undone
- Related event ID

### Action
UI languageに応じて:
- Checkout / 貸出
- Return / 返却
- Checkout undone / 貸出を元に戻した
- Return undone / 返却を元に戻した

### Source event undone
元のCheckout / Return Eventが後続Undo Eventによって取り消されているかをYes / Noまたは はい / いいえ で出力する。

### Related event ID
Undo Eventの場合に元Event IDを出力する。

## 7. Equipment CSV

**1 Item = 1 row**

active / archivedを含む全Itemを出力する。

columns:
- Board
- Equipment
- Category
- Item code
- Note
- Status
- Archived
- Current borrower
- Checked out at
- Created at
- Updated at

Status:
- Available / 利用可能
- Checked out / 貸出中
- Archived / アーカイブ済み

Archived:
- Yes / No
- はい / いいえ

## 8. JSON backupとの違い

### JSON
目的:
- Loan Board全体の完全復元

含む:
- Board
- Items
- Borrowers
- Events
- IDs
- archive state
- current checkout state

### CSV
目的:
- Excel等で閲覧
- 集計
- 共有用データ作成
- 記録の確認

CSVからのImport / Restoreはv0.8.0では実装しない。

UIとREADMEで「CSVはバックアップではない」と明示する。

## 9. Existing persistence rules
- Browser autosaveを継続。
- autosave破損時は自動上書きしない。
- JSON restore validationを継続。
- JSON restore前の置換確認を継続。
- Reset前の破壊的確認を継続。

CSV exportはstateを変更しないためautosaveを発生させる必要はない。

## 10. Existing operational invariants
- checked-out Itemを二重貸出しない。
- archived Itemを貸し出さない。
- checked-out Itemをアーカイブしない。
- Return時にBorrower一致を再検証。
- Undoは最後の整合するCheckout / Returnだけ。
- archived ItemをUndoでchecked-outへ戻さない。
- History参照を維持する。

## 11. Header contract
作業時点の最新 `htmlapps-template` のヘッダー構造を維持する。

## 12. Privacy / runtime
- Runtime CDN: none
- API: none
- analytics: none
- telemetry: none
- external font: none
- user-data upload: none
- CSP: `connect-src 'none'`
- direct `file://`: required
- third-party runtime dependencies: none

CSVはBlobとしてブラウザー内で生成し、ダウンロードする。

## 13. v0.8.0 acceptance criteria
- 未返却一覧CSVを出力できる。
- 未返却は1 Item 1 row。
- 未返却0でもheaderだけのCSVを出力できる。
- 操作履歴CSVを出力できる。
- 履歴は1 Event × 1 Item 1 row。
- Undo元Eventの取消状態を確認できる。
- Undo Eventのrelated event IDを確認できる。
- 備品一覧CSVを出力できる。
- archived Itemも備品CSVへ含まれる。
- current borrower / checkout timeを備品CSVへ含める。
- UTF-8 BOM付き。
- CRLF。
- 全セルをquoteする。
- CSV Formula Injection対策を行う。
- Board名をファイル名へ含める。
- timestampをファイル名へ含める。
- CSVとJSONバックアップの役割をUIで区別する。
- 日本語 / 英語。
- 360px幅で横スクロールなし。
- standalone / self-extract / root HTML生成。
- repository check成功。

## 14. Roadmap
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
