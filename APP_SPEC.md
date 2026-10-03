# Loan Board / 貸出・返却ボード — APP_SPEC

## 1. Product identity
- **Name:** Loan Board / 貸出・返却ボード
- **English helper:** Equipment Checkout & Return
- **Version:** v0.4.0
- **Purpose:** 誰に何を貸していて、最後に何が返ってきていないかを1台の端末ですぐ確認する。
- **Primary outcome:** **未返却 0** を明確に確認できること。
- **Release artifacts:** `dist/index.html`, `dist/index.self-extract.html`, `loan-board.html`.

## 2. v0.4.0 scope — Outstanding Board / 未返却ボード

v0.3.0までの貸出・全返却・部分返却に加えて、アプリの中心画面となる未返却ボードを実装する。

### Summary
- 未返却Item数
- 現在Itemを借りているBorrower数
- 利用可能Item数 / 全Item数

### Outstanding board
- 現在 `checked-out` のItemだけを表示
- Borrower単位でグループ化
- Borrower名
- 未返却点数
- 最初の貸出時刻
- Item名
- Itemカテゴリ / コード
- Itemごとの貸出時刻
- ボードから全返却
- ボードから部分返却フローへ移動

### Completion state
未返却が0の場合は一覧を表示せず、次を明示する。

```text
すべて返却済みです
未返却の備品はありません。
```

そこから「貸し出す」でCheckoutへ移動できる。

## 3. Data model

### Item
`itemId`, `name`, `category`, `code`, `note`, `status`, `currentBorrowerId`, `currentCheckoutAt`, `archived`, `createdAt`, `updatedAt`

### Borrower
`borrowerId`, `name`, `note`, `archived`, `createdAt`, `updatedAt`

### Event
- `checkout`
- `return`

Undoイベントはv0.5.0で追加予定。

## 4. Outstanding-board rules
- `checked-out` Itemだけを集計する。
- 借りているItemが0件のBorrowerはボードに出さない。
- Itemは必ず `currentBorrowerId` のBorrower配下へ表示する。
- 全返却は既存のReturn処理を使用し、Return Eventを生成する。
- 部分返却はReturnセクションの部分返却モードへ接続する。
- 返却後は同じ描画サイクルで未返却数・Borrower数・利用可能数を更新する。
- 未返却0になった瞬間に完了状態へ切り替える。

## 5. Checkout / Return invariants
- `checked-out` Itemを二重貸出しない。
- Return確定時にItemが対象Borrowerへ貸出中か再検証する。
- Return後は `available` に戻し、Borrower / Checkout時刻をクリアする。
- 部分返却では選択したItemだけを戻す。

## 6. Header contract
作業時点の最新 `htmlapps-template` のヘッダー構造を維持する。
- canonical faviconと同じアプリアイコン
- アプリ名 + version badge
- 補助文
- 言語切替 + ヘルプ

## 7. UX / accessibility
- 未返却ボードをページ上部に置く。
- 未返却0を明確な完了状態として扱う。
- 320px幅から利用可能。
- 長い備品名・貸出先名で横スクロールを出さない。
- スマートフォンでは返却操作ボタンを押しやすい幅にする。
- 可視Focus、ラベル、Esc、reduced-motion。
- 絵文字を主要UIアイコンにしない。

## 8. Privacy / runtime
Runtime CDN / API / analytics / telemetry / external font / user-data upload: none.
CSPは `connect-src 'none'`。direct `file://` required。third-party runtime dependencies: none。

v0.4.0では業務データはメモリ上だけに保持し、再読み込みで消える。

## 9. v0.4.0 acceptance criteria
- Checkoutすると未返却ボードへ即時表示される。
- Borrower単位にItemがグループ化される。
- 未返却Item数が正しい。
- 現在借りているBorrower数が正しい。
- 利用可能 / 全備品数が正しい。
- Item名・貸出時刻を確認できる。
- ボードから全返却できる。
- ボードから部分返却へ移動できる。
- 部分返却後は残りItemだけ表示される。
- 全返却後はBorrowerグループが消える。
- 未返却0で「すべて返却済みです」を表示する。
- 完了状態からCheckoutへ移動できる。
- 日本語 / 英語。
- 360px幅で横スクロールなし。
- standalone / self-extract / root HTML生成。
- repository check成功。

## 10. Roadmap
- **v0.1.0:** Core Data
- **v0.2.0:** Checkout
- **v0.3.0:** Return / partial return
- **v0.4.0:** Outstanding-loan board
- **v0.5.0:** Undo / History
- **v0.6.0:** Item Management / sequential creation
- **v0.7.0:** Persistence / backup
- **v0.8.0:** CSV export
- **v0.9.0:** UX / Release Candidate
- **v1.0.0:** Stable Release
