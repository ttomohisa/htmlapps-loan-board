# Loan Board / 貸出・返却ボード — APP_SPEC

## 1. Product identity
- **Name:** Loan Board / 貸出・返却ボード
- **English helper:** Equipment Checkout & Return
- **Version:** v0.2.0
- **Purpose:** 誰に何を貸していて、最後に何が返ってきていないかを1台の端末ですぐ確認できる貸出・返却ボード。
- **Primary users:** イベント受付、学校、撮影・舞台現場、部活・サークル、社内イベントなど。
- **Release artifacts:** `dist/index.html`, `dist/index.self-extract.html`, `loan-board.html`.

## 2. Product outcome
高度な資産管理ではなく、最終的に **「未返却 0」** を確認するためのツールとする。

## 3. v0.2.0 scope — Checkout / 貸出
- v0.1.0のBoard / Item / Borrower基礎
- 貸出先検索・選択
- 貸出画面から新規貸出先追加
- available Itemの名前・カテゴリ・コード検索
- 複数Item選択
- Checkoutイベント生成
- `available` → `checked-out`
- `currentBorrowerId` / `currentCheckoutAt`
- 二重貸出防止
- 備品一覧で貸出先・貸出日時を表示
- 貸出先一覧で現在貸出中件数を表示
- 日本語 / 英語、PC / タブレット / スマートフォン
- 完全ローカル処理、実行時外部通信なし、単一HTML
- ヘッダーを作業時点の最新 `htmlapps-template` UIへ準拠

### Not included yet
返却、部分返却、未返却専用ボード、Undo、履歴UI、連番登録、永続保存、JSONバックアップ、CSV、アーカイブ、QR / バーコード。

v0.2.0では業務データと貸出状態はメモリ上のみ。再読み込みで消える。言語設定のみローカル保存可。

## 4. Data model
### Board
`id`, `name`, `createdAt`, `updatedAt`

### Item
`itemId`, `name`, `category`, `code`, `note`, `status`, `currentBorrowerId`, `currentCheckoutAt`, `archived`, `createdAt`, `updatedAt`

原則 **1個体 = 1 Item**。

### Borrower
`borrowerId`, `name`, `note`, `archived`, `createdAt`, `updatedAt`

### Checkout Event
`eventId`, `type: "checkout"`, `borrowerId`, `itemIds`, `timestamp`, `note`

## 5. Checkout rules
- Borrower未選択では確定不可。
- 既存Borrowerを検索できる。
- 完全一致するBorrowerがなければ、その場で新規追加できる。
- `available` Itemだけを候補表示。
- Itemを複数選択可能。
- 貸出確定時にもItemの状態を再検証。
- `checked-out` Itemは二重貸出不可。
- 確定後にCheckout Eventを生成し、選択をクリアしてUIを即時更新。

## 6. Header contract
最新 `htmlapps-template` の現在UIを基準とする。
- 左: canonical faviconと同じアイコン
- アプリ名 + version badgeを同一行
- 下段に短い補助文
- 右: 言語切替 + ヘルプ
- versionを右側の独立チップにしない
- 言語・ヘルプはテンプレート同様の軽量操作にする

## 7. UX / accessibility
- 320px幅から利用可能。
- 長い備品名・貸出先名でも横スクロールなし。
- 十分なタップ領域。
- 貸出確定は前提条件を満たすまでdisabled。
- モーダルは短い画面でも最後までスクロール可能。
- 可視Focus、ラベル、Esc、reduced-motion。
- 絵文字を主要UIアイコンにしない。

## 8. Privacy / runtime
Runtime CDN / API / analytics / telemetry / external font / user-data upload: none.
CSPは `connect-src 'none'`。direct `file://` required。third-party runtime dependencies: none。

## 9. v0.2.0 acceptance criteria
- Borrower検索・選択。
- Checkout画面から新規Borrower追加。
- available Item検索・複数選択。
- BorrowerまたはItem未選択時は確定不可。
- 複数Itemを一括Checkout。
- Checkout Event生成。
- Checkout後Itemは `checked-out`。
- checked-out Itemは次の候補から除外。
- 確定時にも状態再検証し二重貸出不可。
- Item一覧で貸出先・貸出日時を確認。
- Borrower一覧で貸出中件数を確認。
- ヘッダーが最新テンプレート構造に準拠。
- 再読み込みで消える制約をUI/Help/READMEへ明記。
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

## In-app help
現在実装されているCheckout操作、完全ローカル処理、再読み込みで消えること、返却はv0.3.0であることを説明する。
