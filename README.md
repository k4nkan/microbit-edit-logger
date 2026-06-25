# microbit-edit-logger

MakeCode for micro:bit の editor extension として、編集中コードの変更履歴を記録する最小実装です。

この repository は **GitHub に push する拡張機能本体** です。MakeCode 本体のローカル起動環境は含めません。

## できること

- `main.ts` / `main.blocks` を `extusercode` で読み取る
- Start / Stop で記録範囲を決める
- Start中にコード内容が変わった時だけ履歴を保存する
- micro:bit 実行中のセンサー値を serial 経由で保存する
- ブロック種別数と前回との差分を表示する
- JSON / CSV を画面内に表示してコピーできる

ログはブラウザの `localStorage` に保存されます。MakeCode の iframe sandbox では通常の自動ダウンロードがブロックされるため、エクスポート内容は画面内のテキスト欄にも表示します。

## 重要な制約

通常のブロック拡張としては GitHub に push すれば MakeCode から追加できます。

ただし editor extension の画面は iframe で外部URLを開くため、MakeCode 側に許可されたURLしか動きません。公式の `https://makecode.microbit.org` では、この開発用 `localhost` editor extension は許可されません。

検証にはローカル MakeCode を使います。

```text
http://localhost:3232/index.html?debugExtensions=1#local_token=...&wsport=3233
```

`local_token` はローカル MakeCode server がターミナルに表示する値を使います。

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

このURLを直接開いた場合はUI確認だけできます。コードを読むには、MakeCode の `Edit Logger` ボタンからこの画面を開く必要があります。

## センサーログ

micro:bit 側のプログラムに、`Edit Logger` の `start sensor logging every 1000 ms` ブロックを置きます。

```typescript
editLogger.startSensorLogging(1000);
```

このブロックは、実行中に次の値を serial へ出力します。

- running time
- acceleration x / y / z
- light level
- temperature

editor extension の `Start` を押している間だけ、`EL_SENSOR,...` 行を `sensor` event として保存します。

## ローカル MakeCode で確認

別 repository の MakeCode ローカル起動環境を使います。

```bash
cd /Users/kanta/dev/active/microbit-edit-logger-local
npm run serve
```

`microbit-edit-logger-local` 側の `npm run serve` は、ローカル開発用に `localhost:8080` を editor extension の承認済みURLへ追加してから MakeCode を起動します。

ターミナルに出るURLを確認します。

```text
http://localhost:3232/#local_token=...&wsport=3233
```

ブラウザでは、`debugExtensions=1` を `index.html` の後ろ、`#` より前に入れて開きます。

```text
http://localhost:3232/index.html?debugExtensions=1#local_token=...&wsport=3233
```

GitHub に push 済みのこの repository URL を MakeCode の「拡張機能」に貼ります。

```text
https://github.com/k4nkan/microbit-edit-logger
```

末尾に `.git` は付けません。`.git` 付きURLは MakeCode 側で解決できず、拡張機能検索に出ません。

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

`edit logger is enabled` ブロックは、MakeCode に拡張として認識させるための最小ブロックです。編集ログの記録範囲は editor extension パネルの `Start` / `Stop` で決めます。
