# Loan Board / 貸出・返却ボード

イベント、学校、撮影現場などの短期貸出で、誰が何を持っていて、何がまだ返ってきていないかを1台の端末で確認するブラウザーアプリです。

現在は **v0.5.0（Undo / 履歴）** です。

## v0.5.0でできること
- 備品 / 貸出先の登録・編集
- 複数備品をまとめて貸出
- 二重貸出防止
- 全返却 / 部分返却
- 未返却ボード
- 未返却0の完了状態
- 貸出・返却直後のUndo
- 履歴から直近のUndo可能操作を取り消し
- Checkout / Return / Undo履歴
- 貸出先名・備品名・カテゴリ・コードで履歴検索
- Undo済み操作の表示
- 日本語 / 英語
- PC / タブレット / スマートフォン
- 完全ローカル処理
- 実行時外部通信なし
- 単一HTML

## Undoの扱い
Undoでは過去の履歴を削除しません。

```text
貸出
↓
元に戻す
↓
「貸出を元に戻した」というUndo履歴を追加
```

返却を元に戻す場合は、返却前の貸出先と元の貸出時刻を復元します。

履歴から直接取り消せるのは、**現在の状態と整合する直近操作だけ**です。任意の古い操作を飛び越えて取り消すことはできません。

## 現在の制限
v0.5.0では備品・貸出先・貸出返却状態・履歴はメモリ上だけに保持します。**ページを再読み込みするとすべて消えます。**

連番登録・備品管理はv0.6.0、自動保存とバックアップ・復元はv0.7.0で追加予定です。

## プライバシー
入力内容、貸出返却状態、操作履歴を外部サーバーへ送信しません。ランタイムCDN、API、分析、テレメトリは使用しません。

## 単一HTML / オフライン
`dist/index.html`, `dist/index.self-extract.html`, `loan-board.html` を生成します。実行時の外部ネットワーク依存はありません。

## Roadmap
v0.6.0 備品管理 → v0.7.0 保存/バックアップ → v0.8.0 CSV → v0.9.0 RC → v1.0.0 正式版

## Development
```powershell
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-powershell-syntax.ps1
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-repository.ps1
```

## License
MIT License
