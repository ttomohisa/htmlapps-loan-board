# Loan Board / 貸出・返却ボード — APP_SPEC

## 1. Product identity
- **Name:** Loan Board / 貸出・返却ボード
- **English helper:** Equipment Checkout & Return
- **Version:** v0.5.0
- **Purpose:** 誰に何を貸していて、何が返ってきていないかを確認し、操作ミスから安全に戻せる貸出・返却ボード。
- **Primary outcome:** **未返却 0** を明確に確認できること。
- **Release artifacts:** `dist/index.html`, `dist/index.self-extract.html`, `loan-board.html`.

## 2. v0.5.0 scope — Undo / History

v0.4.0までの貸出・返却・未返却ボードに加え、操作履歴とUndoを実装する。

### History
- Checkout Event
- Return Event
- Undo Event
- 新しい順
- 貸出先名で検索
- 備品名・カテゴリ・コードで検索
- 日時
- 操作種別
- 貸出先
- 対象備品
- 取り消し済み表示

### Undo
- Checkout直後のUndo
- Return直後のUndo
- ToastからUndo
- Historyから直近のUndo可能操作をUndo
- 任意の古いイベントを直接Undoしない
- 元イベントを削除しない
- Undo Eventを追加する
- Return Undoでは元の貸出時刻を復元する

## 3. Event model

### Checkout
- `eventId`
- `type: "checkout"`
- `borrowerId`
- `itemIds`
- `timestamp`
- `note`

### Return
- `eventId`
- `type: "return"`
- `borrowerId`
- `itemIds`
- `timestamp`
- `note`
- `itemSnapshots[]`
  - `itemId`
  - `checkoutAt`

### Undo
- `eventId`
- `type: "undo"`
- `borrowerId`
- `itemIds`
- `timestamp`
- `relatedEventId`
- `reversedType: "checkout" | "return"`

## 4. Undo rules
- Undo対象は、UndoされていないCheckout / Returnのうち時系列上で直近のもの。
- Historyから任意の過去イベントを直接取り消さない。
- Checkout Undo時:
  - 対象Itemが同じBorrowerへ貸出中であることを再検証。
  - `currentCheckoutAt` が元Checkout Event時刻と一致することを再検証。
  - 対象Itemを `available` に戻す。
- Return Undo時:
  - 対象Itemがすべて `available` であることを再検証。
  - Return EventのsnapshotからBorrowerと貸出時刻を復元。
- 条件を満たさない場合はUndoしない。
- Undo後も元Eventは履歴に残し、Undo Eventを追加する。
- Undo後は未返却ボード、貸出候補、返却候補、履歴を同じ描画サイクルで更新する。

## 5. History rules
- 最新イベントを先頭に表示。
- 元EventがUndo済みなら「取り消し済み」を表示。
- Undo Eventは元の操作種別を明示。
- 検索は現在のBorrower名、Item名、カテゴリ、コード、操作種別を対象にする。
- v0.5.0では高度な日付範囲・分析・CSV履歴出力は不要。

## 6. Existing invariants
- checked-out Itemを二重貸出しない。
- Return確定時に対象Borrowerへの貸出状態を再検証。
- Return後はavailableへ戻す。
- 未返却ボードはchecked-out ItemだけをBorrower単位で表示。
- 未返却0では完了状態を表示。

## 7. Header contract
作業時点の最新 `htmlapps-template` のヘッダー構造を維持する。
- canonical faviconと同じアプリアイコン
- アプリ名 + version badge
- 補助文
- 言語切替 + ヘルプ

## 8. UX / accessibility
- Undoは操作直後のToastから押せる。
- History上でUndo可能なのは1件だけ明示する。
- 検索結果が0件の空状態を持つ。
- 320px幅から利用可能。
- 長い名前・備品名で横スクロールを出さない。
- 可視Focus、ラベル、Esc、reduced-motion。
- 絵文字を主要UIアイコンにしない。

## 9. Privacy / runtime
Runtime CDN / API / analytics / telemetry / external font / user-data upload: none.
CSPは `connect-src 'none'`。direct `file://` required。third-party runtime dependencies: none。

v0.5.0では業務データと履歴はメモリ上だけに保持し、再読み込みで消える。

## 10. v0.5.0 acceptance criteria
- Checkout後ToastからUndoできる。
- Return後ToastからUndoできる。
- Checkout UndoでItemがavailableへ戻る。
- Return UndoでItemが元Borrowerへのchecked-outへ戻る。
- Return Undoで元のCheckout時刻を復元する。
- Undo Eventを追加し元Eventを削除しない。
- 履歴を新しい順に表示する。
- Checkout / Return / Undoを区別できる。
- Undo済み元Eventを表示できる。
- 貸出先名で検索できる。
- 備品名・カテゴリ・コードで検索できる。
- HistoryでUndo可能なのは直近の整合する操作だけ。
- Undo後に未返却ボード・貸出・返却UIが即時更新される。
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
