# Loan Board / 貸出・返却ボード — APP_SPEC

## 1. Product identity
- **Name:** Loan Board / 貸出・返却ボード
- **English helper:** Equipment Checkout & Return
- **Version:** v0.6.0
- **Purpose:** 誰に何を貸していて、何が返ってきていないかを確認しながら、備品を現場で扱いやすい単位で登録・整理する。
- **Primary outcome:** **未返却 0** を明確に確認できること。
- **Release artifacts:** `dist/index.html`, `dist/index.self-extract.html`, `loan-board.html`.

## 2. v0.6.0 scope — Item Management / 備品管理

v0.5.0までの貸出・返却・未返却ボード・Undo・履歴に加え、備品登録と整理を強化する。

### Sequential batch creation
- 共通の備品名
- 開始番号
- 登録数
- 桁数
- 共通カテゴリ
- 任意の管理コードprefix
- 登録前プレビュー
- 一度に最大500件
- 番号は0〜999999の範囲内
- 生成される管理コードと既存Itemの重複を検出

例:

```text
共通名: 無線機
開始番号: 1
登録数: 20
桁数: 2
管理コードprefix: RADIO-

無線機 01 / RADIO-01
無線機 02 / RADIO-02
...
無線機 20 / RADIO-20
```

### Item management
- 備品名 / カテゴリ / 管理コード / メモで検索
- 有効 / アーカイブ済み / すべて の表示切替
- 有効件数 / アーカイブ件数を表示
- available Itemをアーカイブ
- archived Itemを復帰
- checked-out Itemはアーカイブ不可
- アーカイブしてもItem IDと過去履歴を保持
- archived ItemはCheckout候補へ出さない
- archived Itemは未返却ボードへ出さない

## 3. Item model

`itemId`, `name`, `category`, `code`, `note`, `status`, `currentBorrowerId`, `currentCheckoutAt`, `archived`, `createdAt`, `updatedAt`

### Archive semantics
アーカイブは削除ではない。

- `archived = true` にする。
- Item自体は `state.items` に残す。
- Historyの `itemIds` はそのまま解決できる。
- Restoreでは `archived = false` に戻す。
- checked-out中のItemはアーカイブしない。

## 4. Batch creation rules
- `namePrefix` は必須。
- `start`: 0〜999999。
- `count`: 1〜500。
- `digits`: 1〜6。
- `start + count - 1 <= 999999`。
- Item名は `namePrefix + " " + zero-padded number`。
- code prefixが空ならcodeは空。
- code prefixがある場合は `prefix + zero-padded number`。
- 生成codeが既存Item（archivedを含む）と重複する場合は一括登録不可。
- 一括登録は貸出・返却Historyには記録しない。

## 5. Archive / Undo interaction
アーカイブは貸出・返却Eventではないが、Undoの安全性に影響する。

- Checkout中Itemはアーカイブ不可。
- Return後にItemをアーカイブした場合、そのReturnはUndo不可。
- Restoreして現在状態が再びReturn直後と整合し、Return Eventが履歴の最後にある場合はUndo可能。
- Undo判定では対象Itemがarchivedでないことを確認する。
- 古いEventへ遡ってUndoしないv0.5.0のルールを維持する。

## 6. Existing invariants
- checked-out Itemを二重貸出しない。
- archived Itemを貸し出さない。
- Return確定時に対象Borrowerへの貸出状態を再検証する。
- 未返却ボードは有効なchecked-out Itemだけを表示する。
- 未返却0では完了状態を表示する。
- Undoは履歴の最後にある整合するCheckout / Returnだけ。

## 7. Header contract
作業時点の最新 `htmlapps-template` のヘッダー構造を維持する。

- canonical faviconと同じアプリアイコン
- アプリ名 + version badge
- 補助文
- 言語切替 + ヘルプ

## 8. UX / accessibility
- 単品登録を残し、連番登録は必要なときだけ展開する。
- 一括登録前に生成例を表示する。
- 貸出中Itemのアーカイブ操作はdisabledにし、理由をtitle / aria-labelで説明する。
- 長い名前・コードでも横スクロールを出さない。
- 320px幅から利用可能。
- スマートフォンでは一括登録フォームを1列にする。
- 可視Focus、ラベル、Esc、reduced-motion。
- 絵文字を主要UIアイコンにしない。

## 9. Privacy / runtime
Runtime CDN / API / analytics / telemetry / external font / user-data upload: none.
CSPは `connect-src 'none'`。direct `file://` required。third-party runtime dependencies: none。

v0.6.0では業務データ・履歴・アーカイブ状態はメモリ上だけに保持し、再読み込みで消える。

## 10. v0.6.0 acceptance criteria
- 単品登録を引き続き利用できる。
- 共通名・開始番号・件数・桁数から連番Itemを生成できる。
- 生成前にプレビューを確認できる。
- 最大500件の上限がある。
- 0〜999999を超える連番は登録できない。
- code prefix付き連番を生成できる。
- 既存codeとの重複を検出できる。
- Itemを名前 / カテゴリ / code / メモで検索できる。
- 有効 / archived / すべてを切り替えられる。
- available Itemをアーカイブできる。
- checked-out Itemをアーカイブできない。
- archived ItemをRestoreできる。
- archived ItemがCheckout候補へ出ない。
- archived Itemの過去Historyが表示される。
- archive後に不整合なReturn Undoを表示しない。
- 日本語 / 英語。
- 360px幅で横スクロールなし。
- standalone / self-extract / root HTML生成。
- repository check成功。

## 11. Roadmap
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
