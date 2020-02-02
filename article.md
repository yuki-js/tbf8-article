# Substrateを使ってみた

<div style="text-align:right">ミスモナコイン</div>

ミスモナコインです。最近活動再開しました。以前は、ご存知の方はご存知の通り、ウォレットアプリを開発していましたが、最近ではSubstrateを使って独自ブロックチェーンを開発しています。本記事ではSubstrateの紹介と、簡単なブロックチェーンを作ります。モナコイン要素はありません。

本記事の情報は全て2020年2月現在のものです。

## Substrateとは

Substrateとは、**拡張性が高く**、**モジュール化された**、**オープンソース**なブロックチェーン開発フレームワークです[^hello]。開発元はParity Technologiesです。ParityはPolkadot, Parity Ethereum Clientなどを提供している企業です。Polkadotを開発する過程で、コア部分を分離してできたものがSubstrateです。

Parity社紹介ページ: https://www.parity.io/substrate/

Substrate Developer Hub: https://substrate.dev/

ブロックチェーンの基本要素として、

- データベース層
- ネットワーク層
- コンセンサス層
- アプリケーション層

がありますが、Substrateはアプリケーション層を除いた3層を提供し、アプリケーション層の開発に注力することができ、簡単かつ迅速なブロックチェーン開発ができます。

## Substrateの特徴

### Rustで書ける

RustはC/C++に代わる高速で安全なコンパイラ型言語です。機械語とWebAssemblyにコンパイルでき、また、ガベージコレクションを使わないメモリ管理により高速に動作するブロックチェーンを作れます。また、Rustのスパルタコンパイラーに叱られまくることによって、安全なコードが書けます。

### WebAssembly

WebAssemblyとは、「ネイティブに近いパフォーマンスで動作するコンパクトなバイナリー形式の低レベルなアセンブリ風言語」です[^wasm]。スタックマシン型のWebAssembly VM上で動作します。当初はJavaScriptに代わってブラウザで実行されることを想定されていましたが、シンプルで汎用的な仕様が受け、ブロックチェーンなどに応用されています

SubstrateはWebAssemblyインタプリタを備えていて、WebAssemblyバイナリを与えることで、ノード全体を再コンパイルすることなく、ブロック生成ロジック(ランタイム)を変更することができます。WebAssemblyなので、速度もそこそこです。

### フォークレス・アップグレード

今までのブロックチェーンでは、後方互換性がない変更をチェーンに加える場合、ハードフォークを実行しなければなりませんでした。DAO事件、Segwit論争を通して、ハードフォークには多くの政治的論争がつきものだということがわかりました。また、ハードフォークをするには、全てのノードをアップグレードしなければなりません。これがノード運営者の負担になっています。

Substrateでは、WebAssemblyによるランタイム実行をできるようにすることで、外部からノードの挙動をアップグレードできるようになります。さらに、「アップグレードを投票で決める」という風に、チェーンアップグレードのコンセンサスを決めておくことで、論争を民主的かつブロックチェーンらしい方法で解決することができます。(オンチェーンガバナンス)

### モジュール

Substrateの各機能はモジュール化されています。ブロックチェーンを構築する際には、Palletと呼ばれるモジュールを組み合わて、 Framework for Runtime Aggregation of Modularized Entities(FRAME)を作ります。例えば、Contract Palletを実装すれば、スマートコントラクトVMを設定でき、Staking Palletを取り込めばステーキングが実装できます。多分。本記事では、Palletを作り、独自の処理を実装します。

### Polkadot

Parity Polkadot実装はSubstrateの上に実装されています。なので、Polkadotとの親和性が高いです。

## 環境構築

以下のコマンドで、依存環境、Rustのインストール、WASMツールチェーンのインストールを自動で行ってくれます。
```
curl https://getsubstrate.io -sSf | bash
```

失敗する方は公式ドキュメントを参照してください。

https://substrate.dev/docs/en/overview/getting-started

## 素のチェーンを動かしてみる

まずは、テンプレートから何も手を加えない状態の、特に何をするわけでもないブロックチェーンノードを起動してみます。

```
git clone https://github.com/substrate-developer-hub/substrate-node-template
cd substrate-node-template
cargo build --release
```

ちなみに、上記gitリポジトリの執筆当時のコミットハッシュは1d6e830474290d3a1893a475aca305c1c65b5f03です

ビルドが完了したら

```
./target/release/node-template purge-chain --dev
```

でチェーンをリセットし、

```
./target/release/node-template --dev
```

でノードを開発者モードで起動します。
`localhost`以外からのRPC接続を受け付けるには`--ws-external --rpc-external`オプションを追加します。

起動できたら、Polkadot/Substrate Portal(https://polkadot.js.org/apps/)の Settings からノードに接続します。接続したら、 Explorer から6秒毎にブロックが生成される様子が観察できます。 Accounts から残高確認・送金ができます。開発者モードが有効なら、ALICEやBOBに10億枚くらい残高が入っています。

## Palletを実装する


次に、Palletを実装し、独自の機能を実装していきます。

今回製作するものは、電子証明書を保存するチェーンです。なんだこれは、と感じる方もいらっしゃると思います。実はこれは現在私が製作しているものに繋がるものです。

### Palletの準備

まず、runtime/src/template.rsを、runtime/src/certstore.rsにリネームします。

次に、runtime/src/lib.rsをエディタで開きます。

```
mod template;
```
となっている部分を、
```
mod certstore;
```
に置換します。

`impl template`の部分を`impl certstore`に置換します。
```
-impl template::Trait for Runtime {
+impl certstore::Trait for Runtime {
```

最後にPalletを識別するときに使う`TemplateModule`という名前を`CertStore`と変更し、`template`を`certstore`に変更します。

```
-TemplateModule: template::{Module, Call, Storage, Event<T>},
+TemplateModule: template::{Module, Call, Storage, Event<T>},
```

これでcertstoreという名前でPalletを使えます。



[^hello]: https://www.parity.io/hello-substrate/
[^wasm]: https://developer.mozilla.org/ja/docs/WebAssembly
