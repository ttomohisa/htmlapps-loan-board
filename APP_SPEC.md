# Loan Board / 貸出・返却ボード — APP_SPEC

## 1. Product identity

- **Name:** Loan Board / 貸出・返却ボード
- **English helper:** Equipment Checkout & Return
- **Version:** v1.0.0
- **Status:** Stable Release
- **Purpose:** 誰に何を貸していて、何がまだ返ってきていないかを1台の端末で管理する。
- **Primary outcome:** **未返却 0** を明確に確認できること。
- **Primary environment:** 受付などで使う1台のPC / タブレット / スマートフォン。
- **Runtime model:** ブラウザー内処理。ユーザーデータの外部送信なし。
- **Release artifacts:** `dist/index.html`, `dist/index.self-extract.html`, `loan-board.html`.

## 2. Stable v1.0.0 feature set

### Board / outstanding
- Board名
- 未返却件数
- 未返却の貸出先数
- 利用可能 / 全備品
- 貸出先ごとの未返却一覧
- 未返却0の完了状態
- 未返却ボードから返却操作へ移動

### Equipment
- 1備品 = 1 Item
- 備品名 / category / 管理code / note
- 単品登録
- 連番一括登録
- 一括登録preview
- 一括登録は最大500件
- 生成code重複check
- 検索
- active / archived / all filter
- archive / restore
- checked-out Itemはarchive不可

### Borrowers
- 貸出先名 / note
- 登録 / 編集
- Checkout中の新規作成

### Checkout
- Borrower選択
- 複数Item選択
- available Itemのみ候補
- archived Item除外
- double checkout防止
- Checkout Event記録

### Return
- 現在借りているBorrowerだけ表示
- 全返却
- 部分返却
- 部分返却では選択中の貸出先の未返却備品だけを名前 / category / codeで検索
- 検索は一時的なUI状態。備品IDによる選択を保持し、検索で非表示になった選択数と返却総数を表示
- 検索中とチェック操作中に入力 / 選択controlを作り直さずfocusを保持
- 貸出先変更 / 部分返却cancel / 返却成功 / Undo / reset / restoreで検索と選択を解除
- Return Event記録
- Itemをavailableへ戻す

### Undo / History
- 最後の整合するCheckout / ReturnだけUndo
- 元Eventは削除しない
- Undo Eventを追加
- Return Undoで元checkout timestampを復元
- History search
- Checkout / Return / Undo filter
- newest / oldest order

### Persistence / backup
- browser local autosave
- validated startup restore
- corrupt autosaveを空stateで自動上書きしない
- 保存状態 / 最終保存時刻
- JSON backup
- JSON restore
- backup format / schema / IDs / references / loan state validation
- restore前確認
- 10 MiB restore limit
- reset前確認

### CSV
- Outstanding CSV
- Operation History CSV
- Equipment CSV
- UTF-8 BOM
- CRLF
- every cell quoted
- embedded quote escape
- spreadsheet formula injection protection
- CSVは完全復元formatではない

### UI / language
- Japanese / English
- desktop / tablet / smartphone
- operation navigation
- 320px minimum layout target
- sticky header anchor offset
- visible focus
- mobile touch targets
- long-content wrapping
- mobile dialog containment
- reduced-motion

## 3. Core workflow

```text
備品を登録
↓
貸出先を選ぶ
↓
備品を貸し出す
↓
未返却ボードで確認
↓
全返却 / 部分返却
↓
未返却 0
```

v1.0.0は、同じ受付端末で短期貸出を記録する用途を対象とする。

## 4. Data model

### Board
- id
- name
- createdAt
- updatedAt

### Item
- itemId
- name
- category
- code
- note
- status: `available | checked-out`
- currentBorrowerId
- currentCheckoutAt
- archived
- createdAt
- updatedAt

### Borrower
- borrowerId
- name
- note
- archived
- createdAt
- updatedAt

### Event
- eventId
- type: `checkout | return | undo`
- borrowerId
- itemIds
- timestamp
- note
- return: itemSnapshots
- undo: relatedEventId / reversedType

Historyは削除せず、Undoもeventとして残す。

## 5. Operational invariants

- checked-out Itemを二重貸出しない。
- archived Itemを貸し出さない。
- checked-out Itemをarchiveしない。
- Return時にBorrower一致を再検証する。
- Outstanding boardはactive + checked-out Itemだけを表示する。
- 復元されたBorrowerがarchivedでも未返却Itemを持つ間はOutstanding / Returnに表示する。新たなCheckout候補には含めず、archive flagやbackup schemaは変更しない。
- 検索結果0件は未返却0の完了状態と区別する。
- Undoは履歴の最後にある現在stateと整合するCheckout / Returnだけ。
- archived ItemをUndoでchecked-outへ戻さない。
- EventからItem / Borrowerを追跡できる状態を維持する。

## 6. Persistence

Autosaveは `localStorage` を使用する。

- key: `APP_CONFIG.slug + ':state:v1'`
- debounce save
- pagehide時にpending saveをflush
- load時にformat / schema / appSlug / references / stateをvalidation
- load error時は既存storageを自動上書きしない

Autosaveはcloud syncではない。

ブラウザーのsite data削除、private browsing、`file://` のstorage behaviorなどで利用できなくなる場合があるため、重要な運用ではJSON backupを併用する。

## 7. JSON backup

JSON backupはLoan Board全体の復元format。

含む:
- Board
- Items
- Borrowers
- Events
- archive state
- current checkout state

Restore:
- 10 MiB limit
- format / schema / appSlug validation
- data structure / duplicate IDs / references validation
- replacement confirmation
- UI selections clear
- restored stateをautosave

CSVはbackup replacementではない。

## 8. CSV export

### Outstanding
1 checked-out Item = 1 row.

### History
1 Event × 1 Item = 1 row.

### Equipment
1 Item = 1 row. archived Itemも含む。

Common:
- UTF-8 BOM
- CRLF
- all fields quoted
- embedded quotes escaped
- formula-triggering user input protected
- Board名 / kind / timestampをfilenameに含む

## 9. Privacy / runtime

- Runtime CDN: none
- Runtime API: none
- analytics: none
- telemetry: none
- external font: none
- user-data upload: none
- third-party runtime dependencies: none
- CSP: `connect-src 'none'`
- direct local opening target

GitHub Pages版では最初のHTML配信は発生するが、Loan Boardへ入力したユーザーデータはアプリから外部送信しない。

## 10. Intended use

適する用途:
- 学園祭 / 学校行事
- 地域イベント
- 撮影 / 映像制作
- 舞台 / ライブ / 展示
- 社内イベント / 研修
- 部活 / サークル

v1.0.0で対象外:
- 複数端末の同期
- cloud共有
- 予約
- 期限 / overdue通知
- 請求 / 決済
- 大規模な在庫管理
- QR / barcode scan

## 11. Release requirements

- current `htmlapps-template` header structure
- user-provided Loan Board SVG used for favicon and header icon
- Japanese / English
- PC / smartphone
- 320px minimum layout target
- standalone / self-extract / root HTML generation
- `connect-src 'none'`
- no external runtime script / stylesheet / module / frame URL
- favicon and header icon identical
- Cloudflare PR Preview HTTP 200
- README Japanese / English
- release screenshots
- CHANGELOG
- `RELEASE_CHECKLIST.md`

## 12. Versioning

Semantic Versioning.

**v1.0.0** freezes the first stable Loan Board data model and user workflow described in this specification.
