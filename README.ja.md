# Loan Board / 貸出・返却ボード

イベント、学校、撮影現場などで使う備品について、誰に何を貸しているかと未返却を確認するためのブラウザーアプリです。

現在は **v0.3.0（Return / 返却）** です。複数備品の貸出に加え、全返却と部分返却まで行えます。

## v0.3.0でできること
- Board名の編集
- 備品 / 貸出先の追加・編集
- 貸出先検索とその場での新規追加
- 複数備品をまとめて貸出
- 二重貸出防止
- 現在借りている貸出先だけを返却候補に表示
- 貸出先ごとの全返却
- 一部だけ返却
- 返却後の備品を即時再貸出可能にする
- Checkout / Returnイベント生成
- 日本語 / 英語
- PC / タブレット / スマートフォン
- 完全ローカル処理、実行時外部通信なし
- 単一HTML

## 返却方法
1. 「返却する」で、現在備品を持っている貸出先を選びます。
2. 全部戻ってきた場合は「N点すべて返却」を押します。
3. 一部だけの場合は「一部だけ返却」を押し、返ってきた備品だけを選択します。
4. 返却した備品はすぐ「利用可能」へ戻り、次の貸出で選べます。

## 現在の制限
v0.3.0では備品・貸出先・貸出返却状態はメモリ上だけに保持します。**ページを再読み込みするとすべて消えます。**

未返却専用ボードはv0.4.0、Undo / 履歴はv0.5.0、自動保存とバックアップ・復元はv0.7.0で追加予定です。

## プライバシー
備品情報、貸出先情報、貸出返却状態は外部サーバーへ送信しません。ランタイムCDN、API、分析、テレメトリは使用しません。

## 単一HTML / オフライン
`dist/index.html`, `dist/index.self-extract.html`, `loan-board.html` を生成します。実行時の外部ネットワーク依存はありません。

## Roadmap
v0.4.0 未返却ボード → v0.5.0 Undo/履歴 → v0.6.0 備品管理 → v0.7.0 保存/バックアップ → v0.8.0 CSV → v0.9.0 RC → v1.0.0 正式版

## Development
```powershell
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-powershell-syntax.ps1
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-repository.ps1
```

## License
MIT License
