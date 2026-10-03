# Loan Board / 貸出・返却ボード

イベント、学校、撮影現場、舞台、社内行事などの短期貸出で、**誰が何を持っていて、何がまだ返ってきていないか**を1台の端末で確認するブラウザーアプリです。

現在は **v0.9.0 Release Candidate** です。v1.0.0向けの主要機能は揃っており、この版では操作性と全体回帰を中心に確認します。

## 主な機能

- 備品 / 貸出先の登録・編集
- 連番の備品をまとめて登録
- 備品のアーカイブ / 復帰
- 複数備品をまとめて貸出
- 全返却 / 部分返却
- 未返却ボード
- 未返却0の完了状態
- 直前の貸出 / 返却のUndo
- Checkout / Return / Undo履歴
- 履歴検索・絞り込み・並び順
- ブラウザー内自動保存
- JSONバックアップ / 復元
- 未返却一覧 / 操作履歴 / 備品一覧のCSV
- 日本語 / 英語
- PC / タブレット / スマートフォン
- 完全ローカル処理
- 実行時外部通信なし
- 単一HTML

## 基本フロー

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

## v0.9.0のUX調整

画面上部に、次の6エリアへ移動する通常のナビゲーションを追加しています。

- ボード
- 貸出
- 返却
- 履歴
- 登録・管理
- データ

固定の下部バーではないため、スマートフォンでコンテンツを隠しません。幅に応じて6列 → 3列 → 2列へ折り返します。

スマートフォンでは、小さい操作ボタン、貸出先候補、選択解除、ToastのUndoなどのタップ領域も調整しています。

## 保存とバックアップ

業務データはこのブラウザーへ自動保存します。

ただし、自動保存はクラウド同期ではありません。ブラウザーのサイトデータ削除、プライベートブラウズ、`file://` の扱いなどによって保存データが利用できなくなる場合があります。

重要な運用では **JSONバックアップ**を併用してください。

JSONはLoan Board全体の復元用です。CSVはExcel等での確認・集計用で、復元形式ではありません。

## CSV

次の3種類を保存できます。

- 未返却一覧CSV
- 操作履歴CSV
- 備品一覧CSV

UTF-8 BOM付き、CRLF、全セルquoteで出力します。ユーザー入力が `=`, `+`, `-`, `@` 等で始まる場合のformula injection対策も行います。

## プライバシー

入力内容、貸出状態、履歴、自動保存、JSON、CSVは端末内で処理します。ユーザーデータを外部サーバーへ送信しません。

ランタイムCDN、API、分析、テレメトリも使用しません。

## Release Candidate

v1.0.0前の確認項目は `RELEASE_CHECKLIST.md` にまとめています。

主な確認範囲:

- PC / スマートフォン
- 日本語 / 英語
- 長い備品名 / 貸出先名 / ファイル名
- 空状態 / 完了状態 / エラー状態
- Checkout / Return / Partial Return / Undo
- 自動保存 / reload復元
- JSON backup / restore
- CSV 3種
- standalone / self-extract
- CSP / 外部通信
- Cloudflare PR Preview

## 単一HTML / オフライン

`dist/index.html`, `dist/index.self-extract.html`, `loan-board.html` を生成します。実行時の外部ネットワーク依存はありません。

## Roadmap

v0.9.0 Release Candidate → v1.0.0 正式版

## Development

```powershell
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-powershell-syntax.ps1
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-repository.ps1
```

## License

MIT License
