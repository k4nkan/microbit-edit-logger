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

## 記録開始の条件

- 問題サイトのローカルAPI（`localhost:8000`）で実験が始まっていると、Edit Loggerは記録を自動で開始し、実験の終了とともに停止します。画面右上に `実験 P01 に記録中` と表示されます。
- APIを使わない場合や手動で記録したい場合は、`Start` / `Stop` を使います。手動で `Stop` した実験の間は、自動では再開しません。
- ブロック／TypeScriptの変更履歴は、学習者プログラムに `start sensor logging` ブロックがなくても記録できます。
- 起動マーカー（`boot`）は拡張機能が自動出力するため、`start sensor logging` ブロックは不要です。
- 加速度、明るさ、温度、ボタンなどの連続センサー値には、学習者プログラム内の `start sensor logging` ブロックが必要です。

各イベントには `eventId` が付き、記録と同時にAPIへ送信されます。送信できなかったイベントはLocalStorageに残り、5秒ごとに再送されます（画面右上の `サーバー未送信 N件`）。保存先は `microbit-research-website/backend/data/exports/sessions/<開始日時>_<参加者ID>/makecode-events.jsonl` です。JSON／CSVの手動出力も従来どおり使えます。

### 起動マーカー（EL_BOOT）

プログラム起動時（書き込み直後、または手動リセット時）に、シリアルへ 1 行だけ
`EL_BOOT,<経過ms>` を出力します。エディタ側はこの行を受け取ると、その時点で
直近に取得済みだったコードのスナップショット（`contentHash`）と紐付けた
`boot` イベントとして記録します。

これにより、記録されたログから「どのコードが実機（またはシミュレータ）で
実際に動いていたか」をおおまかに特定できます。実機かどうかは `sim` 列
（`false` なら実機）で判別できます。同一コードのまま手動リセットした場合も
発火するため、100% 書き込みタイミングと一致するわけではない点は注意してください。

WebUSBで書き込むと、micro:bitは数百ms以内に2回起動します。1.5秒以内に続いた起動は1回の `boot` としてまとめます。

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
