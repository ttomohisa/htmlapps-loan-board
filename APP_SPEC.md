# Loan Board / 貸出・返却ボード — APP_SPEC

## 1. Product identity
- **Name:** Loan Board / 貸出・返却ボード
- **English helper:** Equipment Checkout & Return
- **Version:** v0.7.0
- **Purpose:** 誰に何を貸していて、何が返ってきていないかを確認しながら、貸出・返却データを端末内で継続して利用できるようにする。
- **Primary outcome:** **未返却 0** を明確に確認できること。
- **Release artifacts:** `dist/index.html`, `dist/index.self-extract.html`, `loan-board.html`.

## 2. v0.7.0 scope — Persistence / Backup

v0.6.0までの貸出・返却・未返却ボード・Undo・履歴・備品管理に加え、ブラウザー内自動保存とJSONバックアップ / 復元を実装する。

### Browser autosave
保存対象:
- Board
- Items
- Borrowers
- Events
- Item archive state
- Current checkout state stored on each Item

保存しないもの:
- 検索文字列
- UIの選択状態
- 開いているダイアログ
- 履歴フィルタ
- 備品表示フィルタ
- 言語設定（既存のlanguage用localStorage keyで別管理）

保存先:
- `localStorage`
- key: `loan-board:state:v1`（実際には `APP_CONFIG.slug + ':state:v1'`）

## 3. Storage envelope

自動保存データは次のenvelopeで保持する。

```json
{
  "format": "browser-kitty-loan-board-state",
  "schemaVersion": 1,
  "appSlug": "loan-board",
  "appVersion": "0.7.0",
  "savedAt": "ISO-8601",
  "data": {
    "board": {},
    "items": [],
    "borrowers": [],
    "events": []
  }
}
```

### Autosave behavior
- 業務データを変更した後、約220msのdebounceで保存する。
- Board名の入力中もdebounce保存する。
- ページ離脱時に保存待ちがあればflushする。
- 保存成功時は「保存済み」と最終保存時刻を表示する。
- localStorageへ書き込めない場合はアプリ本体を止めず、自動保存のみ無効としてJSONバックアップを案内する。

## 4. Load safety

起動時に自動保存データがある場合:
1. JSON parse
2. envelope format確認
3. schema version確認
4. appSlug確認
5. Board / Item / Borrower / Event構造確認
6. ID重複確認
7. Itemの貸出状態とBorrower参照確認
8. EventのItem / Borrower参照確認
9. UndoのrelatedEventId確認

すべて成功した場合だけstateとして採用する。

### Corrupted autosave rule
保存データが壊れている場合:
- 空stateで画面を起動する。
- **壊れた既存localStorageを自動上書きしない。**
- 自動保存をblockedにする。
- 「保存データを読み込めませんでした」と表示する。
- JSONバックアップから復元、または明示的なリセットを待つ。

## 5. JSON backup

バックアップenvelope:

```json
{
  "format": "browser-kitty-loan-board-backup",
  "schemaVersion": 1,
  "appSlug": "loan-board",
  "appVersion": "0.7.0",
  "exportedAt": "ISO-8601",
  "data": {
    "board": {},
    "items": [],
    "borrowers": [],
    "events": []
  }
}
```

ファイル名には:
- app slug
- Board名
- timestamp

を含める。

例:

```text
loan-board-2026年度-文化祭-20261003T105000Z.json
```

JSONバックアップは**完全復元用**であり、CSV exportとは役割を分ける。

## 6. Restore

JSON復元時:
- 最大10 MiB。
- backup formatを確認。
- schemaVersionを確認。
- appSlugを確認。
- autosaveと同じstate validationを実施。
- validation完了後に確認ダイアログを表示。
- 確認後、現在のBoard / Items / Borrowers / Eventsをまとめて置換。
- Checkout / Return画面の一時選択状態をクリア。
- 復元したstateをlocalStorageへ保存。
- validationまたはJSON parseに失敗した場合、現在stateは変更しない。

## 7. Reset

「新しいボードにリセット」は破壊的操作。

- 確認を表示。
- 現在のBoard / Items / Borrowers / Eventsを破棄。
- localStorageのstate keyを削除。
- 新しい空Boardを生成。
- 新しい空Boardを自動保存する。

## 8. Browser-storage limitations

自動保存はサーバー同期ではない。

- 同じ端末・同じブラウザーの保存領域を利用する。
- ブラウザーのサイトデータ削除で消える。
- プライベートブラウズ等では永続化されない場合がある。
- `file://` ではブラウザーやファイルの開き方・保存場所により保存領域の扱いが異なる場合がある。
- 複数端末間で同期しない。
- 重要な運用ではJSONバックアップを併用する。

UI上もこの制約を明示する。

## 9. Existing invariants
- checked-out Itemを二重貸出しない。
- archived Itemを貸し出さない。
- checked-out Itemをアーカイブしない。
- Return確定時にBorrower一致を再検証する。
- Undoは履歴の最後にある整合するCheckout / Returnだけ。
- archived ItemをUndoでchecked-outへ戻さない。
- HistoryのItem / Borrower参照を保持する。

## 10. Header contract
作業時点の最新 `htmlapps-template` のヘッダー構造を維持する。

## 11. Privacy / runtime
- Runtime CDN: none
- API: none
- analytics: none
- telemetry: none
- external font: none
- user-data upload: none
- CSP: `connect-src 'none'`
- direct `file://`: required
- third-party runtime dependencies: none

自動保存、JSON書き出し、JSON読み込みはすべて端末内で処理する。

## 12. v0.7.0 acceptance criteria
- Item / Borrower追加後に自動保存される。
- Checkout / Return / Undo後に自動保存される。
- Archive / Restore後に自動保存される。
- Board名変更が自動保存される。
- 再読み込み後にstateを復元できる。
- 保存状態と最終保存時刻を確認できる。
- localStorage書き込み失敗時もアプリ本体は利用できる。
- 壊れたautosaveを自動上書きしない。
- JSONバックアップを保存できる。
- JSONバックアップにBoard / Items / Borrowers / Eventsが含まれる。
- JSONバックアップから全stateを復元できる。
- 不正JSONを復元しない。
- 他アプリ形式のJSONを復元しない。
- 復元前に確認が表示される。
- Reset前に確認が表示される。
- 自動保存の限界をUIとREADMEで説明する。
- 日本語 / 英語。
- 360px幅で横スクロールなし。
- standalone / self-extract / root HTML生成。
- repository check成功。

## 13. Roadmap
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
