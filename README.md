# microbit-edit-logger

## 概要

MakeCode for micro:bit 用の editor extension です。
編集中コードの変更履歴と、micro:bit 実行中のセンサー値を記録します。

この repository は公開用 extension 本体です。ローカル MakeCode の起動環境は含めません。


## 記録する値

センサーログでは、次の値を周期的に保存します。

- 加速度 X / Y / Z
- 明るさ
- 温度
- ボタン A / B
- タッチロゴ
- 音量

方位は UI/CSV の列だけ残しています。`start sensor logging` の標準ログでは、安定性を優先して取得しません。

## セットアップ

依存関係を入れます。

```bash
cd microbit-edit-logger
npm install
```

ビルドします。

```bash
npm run build
```

editor UI だけ確認する場合は、次を実行します。

```bash
npm run serve:editor
```

```text
http://localhost:8080/extension.html
```

ローカル MakeCode で確認する場合は、親 workspace から起動します。

```bash
cd ..
make dev
```

MakeCode の「拡張機能」に次を貼ります。

```text
https://github.com/k4nkan/microbit-edit-logger
```

公式の `https://makecode.microbit.org` では、開発用 `localhost` の editor UI は許可されません。
