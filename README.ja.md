# Loan Board / 貸出・返却ボード

イベント、学校、撮影現場などの短期貸出で、誰が何を持っていて、何がまだ返ってきていないかを1台の端末で確認するブラウザーアプリです。

現在は **v0.8.0（CSV出力）** です。

## v0.8.0でできること
- 備品 / 貸出先の登録・編集
- 連番の備品をまとめて登録
- 備品のアーカイブ / 復帰
- 複数備品をまとめて貸出
- 全返却 / 部分返却
- 未返却ボード
- 直前の貸出 / 返却のUndo
- Checkout / Return / Undo履歴
- ブラウザー内自動保存
- JSONバックアップ / 復元
- **未返却一覧CSV**
- **操作履歴CSV**
- **備品一覧CSV**
- 日本語 / 英語
- PC / タブレット / スマートフォン
- 完全ローカル処理
- 実行時外部通信なし
- 単一HTML

## CSV出力

「データ管理」から3種類を保存できます。

### 未返却一覧CSV

現在貸出中の備品だけを **1備品1行** で出力します。

主な項目:
- ボード名
- 貸出先
- 貸出先メモ
- 備品名
- カテゴリ
- 管理コード
- 貸出日時
- 備品メモ

未返却が0件の場合もheaderだけのCSVを保存できます。

### 操作履歴CSV

Checkout / Return / Undoの履歴を **1イベント×1備品1行** で出力します。

複数備品をまとめて貸し出した操作は、備品ごとに複数行になります。

Event ID、操作、日時、貸出先、備品、管理コード、元イベントの取消状態、Undoの関連Event IDなどを確認できます。

### 備品一覧CSV

有効・アーカイブ済みを含む全備品を1行ずつ出力します。

状態、アーカイブ状態、現在の貸出先、貸出日時、登録日時、更新日時も含みます。

## Excel等での利用

CSVは次の形式です。

- UTF-8 BOM付き
- CRLF
- comma separated
- 全セルをダブルクォート
- セル内のダブルクォートをエスケープ

日本語版ではExcel等で開いたときの文字化けを減らすためUTF-8 BOMを付けています。

また、備品名や貸出先名が `=`, `+`, `-`, `@` 等で始まる場合、表計算ソフトで数式として実行されないよう保護して出力します。

## CSVはバックアップではありません

CSVの目的は **確認・集計** です。

Loan Board全体を復元する場合は、**JSONバックアップ**を使用してください。

CSVからのImport / Restoreには対応していません。

## 保存について

ブラウザー内自動保存とJSONバックアップはv0.7.0から引き続き利用できます。

自動保存はクラウド同期ではなく、ブラウザーのサイトデータ削除等で消える可能性があります。重要な運用ではJSONバックアップを併用してください。

## プライバシー

CSV、JSON、自動保存はすべて端末内で処理します。入力内容やファイルを外部サーバーへ送信しません。ランタイムCDN、API、分析、テレメトリも使用しません。

## 単一HTML / オフライン
`dist/index.html`, `dist/index.self-extract.html`, `loan-board.html` を生成します。実行時の外部ネットワーク依存はありません。

## Roadmap
v0.9.0 UX / Release Candidate → v1.0.0 正式版

## Development
```powershell
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-powershell-syntax.ps1
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-repository.ps1
```

## License
MIT License
