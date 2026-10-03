# Loan Board / 貸出・返却ボード — APP_SPEC

## 1. Product identity

- **Name:** Loan Board / 貸出・返却ボード
- **English helper:** Equipment Checkout & Return
- **Version in this implementation:** v0.1.0
- **Purpose:** 誰に何を貸していて、最後に何が返ってきていないかを1台の端末ですぐ確認できる貸出・返却ボードを作る。
- **Primary users:** イベント受付、学校、撮影・舞台現場、部活・サークル、社内イベントなどの備品担当。
- **Primary operating model:** 受付担当者が1台のPC・タブレット・スマートフォンで操作する。
- **Release artifacts:** \`dist/index.html\`, \`dist/index.self-extract.html\`, \`loan-board.html\`.

## 2. Product outcome

Loan Boardは高度な資産管理システムではない。中心となる成果は、イベントや現場の終了時に **「未返却 0」** を確認できることである。

最終的な主要フロー:

1. 備品を登録する。
2. 貸出先を選ぶ。
3. 複数備品を貸し出す。
4. 全返却または部分返却する。
5. 未返却だけを確認する。
6. 最後に「すべて返却済み」を確認する。

## 3. v0.1.0 scope

v0.1.0は基礎データと画面骨格を完成させる段階であり、貸出・返却処理そのものはまだ実装しない。

### Included

- Boardモデル
- Itemモデル
- Borrowerモデル
- Eventモデルの空配列
- Board名の編集
- Itemの追加・編集
- Borrowerの追加・編集
- Item / Borrowerの空状態と一覧
- Itemの状態 \`available\` の表示
- 件数サマリー
- 日本語 / 英語切替
- PC / タブレット / スマートフォン対応
- キーボード操作と可視フォーカス
- ヘルプ
- 完全ローカル処理
- 実行時外部通信なし
- 単一HTMLビルド

### Explicitly not included in v0.1.0

- 貸出
- 返却
- 部分返却
- Undo
- 履歴UI
- 連番登録
- 永続保存
- JSONバックアップ
- CSV出力
- アーカイブ
- QR / バーコード

v0.1.0ではBoard / Item / Borrowerの業務データはメモリ上のみ保持し、再読み込みで消える。言語設定のみローカル保存してよい。この制約は画面とヘルプで明示する。

## 4. Data model

### Board

- \`id\`
- \`name\`
- \`createdAt\`
- \`updatedAt\`

v1.0.0までは1データセットにつき1 Boardを基本とする。

### Item

- \`itemId\`
- \`name\` — required
- \`category\` — optional
- \`code\` — optional
- \`note\` — optional
- \`status\` — v0.1.0では \`available\`
- \`archived\` — v0.1.0では常に false
- \`createdAt\`
- \`updatedAt\`

原則として **1個体 = 1 Item** とする。

### Borrower

- \`borrowerId\`
- \`name\` — required
- \`note\` — optional
- \`archived\` — v0.1.0では常に false
- \`createdAt\`
- \`updatedAt\`

個人名・班名・部署名を同じ概念として扱う。電話番号・メール・住所は標準項目にしない。

### Event

将来の貸出・返却・取消履歴用。v0.1.0では \`events: []\` のみ用意する。

将来のイベント種別:

- \`checkout\`
- \`return\`
- \`undo\`

## 5. v1.0.0 invariant rules

今後の実装でも以下を壊さない。

- 同じItemを同時に複数Borrowerへ貸し出さない。
- 貸出中Itemを削除・アーカイブしない。
- 履歴を持つItem / Borrowerは物理削除よりアーカイブを優先する。
- 一般ユーザー向けUIに不要な技術用語を出さない。
- ユーザーデータを外部へ送信しない。
- 取り消せる操作は確認ダイアログ乱用よりUndoを優先する。

## 6. Planned screen model for v1.0.0

1. ボード
2. 貸出
3. 返却
4. 備品・貸出先管理
5. データ管理

v0.1.0は「備品・貸出先管理」とBoard基礎部分のみを先行実装する。

## 7. UX requirements

- 320px幅から利用できること。
- 長い備品名・貸出先名で横スクロールを発生させないこと。
- タッチ操作できる十分なボタンサイズを持つこと。
- モーダルは短いスマートフォン画面でも最後までスクロールできること。
- 色だけで状態を伝えないこと。
- フォーム要素にはラベルを持たせること。
- \`Esc\` でダイアログを閉じられること。
- \`prefers-reduced-motion\` を尊重すること。
- 絵文字を主要UIアイコンとして使わないこと。

## 8. Privacy and runtime boundary

- Runtime CDN: none
- Runtime API: none
- Analytics / telemetry: none
- External fonts: none
- User-data upload: none
- CSP: \`connect-src 'none'\`
- Direct \`file://\` opening: required
- Third-party runtime dependencies in v0.1.0: none

「完全ローカル処理」と表示するのは、実装がこの条件を満たす場合に限る。

## 9. v0.1.0 acceptance criteria

- Board名を編集できる。
- Itemを名前必須で追加できる。
- Itemの名前・カテゴリ・コード・メモを編集できる。
- Borrowerを名前必須で追加できる。
- Borrowerの名前・メモを編集できる。
- 追加・編集結果が一覧と件数へ即時反映される。
- Item / Borrowerが0件のとき次の操作を説明する空状態を表示する。
- Itemは「利用可能 / Available」と表示される。
- 貸出・返却の非動作ボタンを置かない。
- 再読み込みで業務データが消えるv0.1.0制約を明示する。
- 日本語 / 英語をリロードなしで切り替えられる。
- 360px幅で横スクロールしない。
- \`dist/index.html\`, self-extract版、\`loan-board.html\` が生成される。
- Runtime CSPに \`connect-src 'none'\` が含まれる。
- テンプレートのrepository checkが成功する。

## 10. Development plan

### v0.1.0 — Core Data / 基礎データ

Board / Item / Borrower / Event基礎、登録・編集、レスポンシブUI。

### v0.2.0 — Checkout / 貸出

貸出先選択、利用可能Item検索・複数選択、Checkoutイベント、二重貸出防止。

### v0.3.0 — Return / 返却

貸出中Borrower一覧、全返却、部分返却、Returnイベント。

### v0.4.0 — Loan Board / 未返却ボード

未返却数、貸出先別グループ、貸出日時、未返却0完了状態。

### v0.5.0 — Undo / History

貸出・返却Undo、トースト、履歴、検索。

### v0.6.0 — Item Management

連番一括登録、カテゴリ、コード、アーカイブ、整合性保護。

### v0.7.0 — Persistence

IndexedDB等による自動保存、起動時復元、JSONバックアップ・復元。

### v0.8.0 — Export

未返却CSV、履歴CSV、備品CSV、編集可能な出力ファイル名。

### v0.9.0 — UX / Release Candidate

スマートフォン下部ナビ、全状態仕上げ、日本語/英語、README、スクリーンショット、回帰確認。

### v1.0.0 — Stable Release

全体回帰、単一HTML、外部通信、CSP、保存・復元、CSV、主要ブラウザ・スマートフォンの最終確認。

## 11. v1.0.0 non-goals

- 複数端末リアルタイム同期
- アカウント
- クラウド共有
- 予約
- 決済
- 料金請求
- メール / SMS通知
- 複数拠点管理
- ERP / 会計連携
- サーバー側API保存

## 12. Future candidates after v1

- QR / バーコード読み取り
- CSVインポート
- 返却期限
- 延滞表示
- 故障 / 紛失状態
- 数量備品
- QR付きラベル
- 複数Board

## In-app help contract

ヘッダー右上のヘルプから、現在のバージョンで実際にできる操作、完全ローカル処理、v0.1.0では再読み込みで登録内容が消えること、貸出・返却は次段階であることを説明する。実装段階が進むたびにヘルプも同じ変更で更新する。
