# microbit-edit-logger

MakeCode for micro:bit の editor extension として、編集中コードのスナップショットを記録する最小実装です。

この repository は **GitHub に push する拡張機能本体** です。MakeCode 本体のローカル起動環境は含めません。

## できること

- `main.ts` / `main.blocks` を `extusercode` で読み取る
- Snapshot ボタン、または一定間隔で履歴を保存する
- ブロック種別数と前回との差分を表示する
- JSON / CSV でエクスポートする

ログはブラウザの `localStorage` に保存されます。自動でファイル保存はしません。

## 重要な制約

通常のブロック拡張としては GitHub に push すれば MakeCode から追加できます。

ただし editor extension の画面は iframe で外部URLを開くため、MakeCode 側に許可されたURLしか動きません。公式の `https://makecode.microbit.org` では、この開発用 `localhost` editor extension は許可されません。

検証にはローカル MakeCode を使います。

```text
http://localhost:3232/?debugExtensions=1
```

## Setup

```bash
cd /Users/kanta/dev/active/microbit-edit-logger
npm install
```

## Build

```bash
npm run build
```

## Editor UI を配信

```bash
npm run serve:editor
```

このサーバーは `http://localhost:8080/extension.html` を配信します。

## ローカル MakeCode で確認

別 repository の MakeCode ローカル起動環境を使います。

```bash
cd /Users/kanta/dev/active/microbit-make-code
npm run serve
```

`microbit-make-code` 側の `npm run serve` は、ローカル開発用に `localhost:8080` を editor extension の承認済みURLへ追加してから MakeCode を起動します。

ブラウザで開きます。

```text
http://localhost:3232/?debugExtensions=1
```

GitHub に push 済みのこの repository URL を MakeCode の「拡張機能」に貼ります。

```text
https://github.com/<your-name>/microbit-edit-logger
```

成功すると `Edit Logger` カテゴリ内で editor extension のボタン/パネルが開けます。`npm run serve:editor` 側のターミナルには次のようなログが出ます。

```text
GET /extension.html HTTP/1.1 200
```

`HEAD` だけの場合、まだパネルは開けていません。

## ファイル構成

```text
.
├── editor/
│   └── extension.html
├── scripts/
│   └── init-pxt-target.js
├── main.ts
├── pxt.json
├── package.json
└── test.ts
```

## 注意

`edit logger is enabled` ブロックは、MakeCode に拡張として認識させるための最小ブロックです。実際のログ取得は editor extension パネルの `Snapshot` / `Start Auto` で行います。
