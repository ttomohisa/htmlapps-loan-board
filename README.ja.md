# Loan Board / 貸出・返却ボード

イベント、学校、撮影現場などの短期貸出で、**誰が何を持っていて、何がまだ返ってきていないか**を1台の端末で確認するブラウザーアプリです。

現在は **v0.4.0（未返却ボード）** です。

## v0.4.0でできること
- 備品 / 貸出先の登録・編集
- 複数備品をまとめて貸出
- 二重貸出防止
- 全返却 / 部分返却
- 未返却数を表示
- 現在借りている貸出先数を表示
- 利用可能数 / 全備品数を表示
- 貸出先ごとに未返却備品を一覧化
- 未返却ボードから全返却
- 未返却ボードから部分返却へ移動
- 未返却0で「すべて返却済みです」を表示
- 日本語 / 英語
- PC / タブレット / スマートフォン
- 完全ローカル処理
- 実行時外部通信なし
- 単一HTML

## 中心となる使い方

```text
備品を登録
↓
貸し出す
↓
未返却ボードで誰が何を持っているか確認
↓
全返却 / 部分返却
↓
未返却 0
```

## 現在の制限
v0.4.0では備品・貸出先・貸出返却状態はメモリ上だけに保持します。**ページを再読み込みするとすべて消えます。**

Undo / 履歴はv0.5.0、自動保存とバックアップ・復元はv0.7.0で追加予定です。

## プライバシー
入力内容や貸出返却状態を外部サーバーへ送信しません。ランタイムCDN、API、分析、テレメトリは使用しません。

## 単一HTML / オフライン
`dist/index.html`, `dist/index.self-extract.html`, `loan-board.html` を生成します。実行時の外部ネットワーク依存はありません。

## Roadmap
v0.5.0 Undo/履歴 → v0.6.0 備品管理 → v0.7.0 保存/バックアップ → v0.8.0 CSV → v0.9.0 RC → v1.0.0 正式版

## Development
```powershell
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-powershell-syntax.ps1
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-repository.ps1
```

## License
MIT License
