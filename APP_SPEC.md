# Loan Board / 貸出・返却ボード — APP_SPEC

## 1. Product identity
- **Name:** Loan Board / 貸出・返却ボード
- **English helper:** Equipment Checkout & Return
- **Version:** v0.3.0
- **Purpose:** 誰に何を貸していて、最後に何が返ってきていないかを1台の端末ですぐ確認できる貸出・返却ボード。
- **Primary users:** イベント受付、学校、撮影・舞台現場、部活・サークル、社内イベントなど。
- **Release artifacts:** `dist/index.html`, `dist/index.self-extract.html`, `loan-board.html`.

## 2. Product outcome
高度な資産管理ではなく、最終的に **「未返却 0」** を確認するためのツールとする。

## 3. v0.3.0 scope — Return / 返却
v0.2.0の貸出に加えて以下を実装する。

- 現在Itemを借りているBorrowerだけを返却候補へ表示
- Borrowerごとの現在貸出中Item一覧
- 全返却
- 部分返却
- Return Event
- 返却Itemを即時 `available` へ戻す
- `currentBorrowerId` / `currentCheckoutAt` を返却時にクリア
- 部分返却後は残っているItemだけを継続表示
- 全返却後はBorrowerを返却候補から除外
- 返却済みItemをCheckout候補へ即時復帰
- 日本語 / 英語、PC / タブレット / スマートフォン
- 完全ローカル処理、実行時外部通信なし、単一HTML
- ヘッダーは最新 `htmlapps-template` UIを維持

### Not included yet
未返却専用ボード、Undo、履歴UI、連番登録、永続保存、JSONバックアップ、CSV、アーカイブ、QR / バーコード。

v0.3.0では業務データと貸出返却状態はメモリ上のみ。再読み込みで消える。言語設定のみローカル保存可。

## 4. Data model
### Item
`itemId`, `name`, `category`, `code`, `note`, `status`, `currentBorrowerId`, `currentCheckoutAt`, `archived`, `createdAt`, `updatedAt`

### Borrower
`borrowerId`, `name`, `note`, `archived`, `createdAt`, `updatedAt`

### Event
Checkout:
`eventId`, `type: "checkout"`, `borrowerId`, `itemIds`, `timestamp`, `note`

Return:
`eventId`, `type: "return"`, `borrowerId`, `itemIds`, `timestamp`, `note`

## 5. Return rules
- 返却候補は現在 `checked-out` Itemを1件以上持つBorrowerだけ。
- 全返却は通常ケースとして主ボタンにする。
- 「一部だけ返却」を選ぶまで個別チェックボックスを出さない。
- 部分返却は1件以上を選択した場合のみ確定可能。
- 返却確定時にも `status === checked-out` かつ `currentBorrowerId` 一致を再検証する。
- 返却Itemは `available`、`currentBorrowerId = null`、`currentCheckoutAt = null`。
- Return Eventは返却単位で1件生成する。
- 部分返却後、残りがあるBorrowerは返却画面に残す。
- 残り0になったBorrowerは返却画面から消す。
- 返却ItemはCheckout候補へ即時復帰する。

## 6. Checkout rules
- Borrower未選択では確定不可。
- 既存Borrower検索とその場での新規追加。
- `available` Itemだけを候補表示。
- 複数選択。
- 確定時にも状態を再検証し二重貸出を防ぐ。

## 7. Header contract
最新 `htmlapps-template` の現在UIを基準とする。
- 左: canonical faviconと同じアイコン
- アプリ名 + version badgeを同一行
- 下段に短い補助文
- 右: 言語切替 + ヘルプ

## 8. UX / accessibility
- 320px幅から利用可能。
- 全返却を返却画面の主操作にする。
- 部分返却は必要時だけ選択UIを開く。
- 長い備品名・貸出先名でも横スクロールなし。
- 十分なタップ領域。
- 可視Focus、ラベル、Esc、reduced-motion。
- 絵文字を主要UIアイコンにしない。

## 9. Privacy / runtime
Runtime CDN / API / analytics / telemetry / external font / user-data upload: none.
CSPは `connect-src 'none'`。direct `file://` required。third-party runtime dependencies: none。

## 10. v0.3.0 acceptance criteria
- 貸出中Itemを持つBorrowerだけ返却候補に出る。
- Borrower選択後、そのBorrowerが持つItemだけ表示。
- 全返却を1操作で実行できる。
- 部分返却モードへ切替できる。
- 部分返却は選択Itemだけを返す。
- Return Eventが生成される。
- 返却Itemが `available` になる。
- 返却Itemの現在Borrower / Checkout時刻がクリアされる。
- 部分返却後は残りItemだけ表示。
- 全返却後はBorrowerが返却候補から消える。
- 返却ItemがCheckout候補へ即時復帰。
- 日本語 / 英語。
- 360px幅で横スクロールなし。
- standalone / self-extract / root HTML生成。
- repository check成功。

## 11. Roadmap
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
