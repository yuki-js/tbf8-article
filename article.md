# Substrate v2.0対応 Substrateことはじめ

<div style="text-align:right">ミスモナコイン</div>

ミスモナコインです。最近活動再開しました。以前は、ご存知の方はご存知の通り、ウォレットアプリ[^monya]を開発していましたが、最近ではSubstrateを使って独自ブロックチェーンを開発しています。本記事ではSubstrateの紹介と、簡単なブロックチェーンを作ります。モナコイン要素はありません。

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

## 

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

起動できたら、Polkadot/Substrate Portal(https://polkadot.js.org/apps/)の Settings からLocal nodeを選んで接続します。接続したら、 Explorer から6秒毎にブロックが生成される様子が観察できます。 Accounts から残高確認・送金ができます。開発者モードが有効なら、ALICEやBOBに10億枚くらい残高が入っています。

## Palletを実装する


次に、Palletを実装し、独自の機能を実装していきます。

今回製作するものは、電子証明書を保存するチェーンです。証明書と証明書に対する複数の署名を付加し、それらをブロックチェーンに書き込みます。

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

Palletを識別するときに使う`TemplateModule`という名前を`CertStore`と変更し、`template`を`certstore`に変更します。

```
-TemplateModule: template::{Module, Call, Storage, Event<T>},
+TemplateModule: template::{Module, Call, Storage, Event<T>},
```

最後にruntime/src/certstore.rsの`decl_storage!`マクロ内の`TemplateModule`の名前を変更します。

```
-trait Store for Module<T: Trait> as TemplateModule {
+trait Store for Module<T: Trait> as CertStore {
```

これでcertstoreという名前でPalletを使えます。

### Palletの実装

runtime/src/certstore.rsにPalletのロジックなどを書いていきます。

Substrateは、Rustの強力なマクロ構文で、面倒臭い部分を隠蔽しています。マクロブロックに指定された構文で記述するだけで実装できます。そのため、Rustに慣れている人ほどソースコードを読んでも理解し難いかもしれません。

以下が完成品です。

```
use core::convert::TryFrom;
use frame_support::{
    decl_event, decl_module, decl_storage,
    dispatch::{Decode, DispatchResult, Encode, Vec},
};
use sp_core::{hash::{H256, H512}, Blake2Hasher, Hasher};
use sp_runtime::traits::Verify;
use sp_runtime::MultiSignature;
use system::ensure_signed;

pub trait Trait: system::Trait {
    type Event: From<Event<Self>> + Into<<Self as system::Trait>::Event>;
}

type CertificateData = Vec<u8>;

#[derive(Decode, Encode, Clone, PartialEq, Default, Debug)]
pub struct Sig {
    // Signatureって名前を使うとバグるっぽい
    pub signature: H512,
    pub account_id: sp_runtime::AccountId32,
}

#[derive(Decode, Encode, Clone, PartialEq, Default)]
#[cfg_attr(feature = "std", derive(Debug))]
pub struct Certificate {
    pub data: CertificateData,
    pub hash: H256,
    pub sigs: Vec<Sig>,
}

decl_storage! {
    trait Store for Module<T: Trait> as CertStore {
        /// 証明書のハッシュテーブル
        Certificates get(fn cert): map H256 => Certificate;

        /// 証明書ハッシュの配列
        CertificateArray: map u128 => H256;

        /// 証明書ハッシュ配列の要素数
        CertificateCount get(fn cert_count): u128;
    }
}

decl_event!(
    pub enum Event<T>
    where
        AccountId = <T as system::Trait>::AccountId,
    {
        /// 証明書が追加されました!
        CertAdded(AccountId, H256),
    }
);

decl_module! {
    pub struct Module<T: Trait> for enum Call where origin: T::Origin {
        fn deposit_event() = default;

        /// 証明書追加
        pub fn add_cert(origin, data: CertificateData, sigs: Vec<Sig>) -> DispatchResult {
            let sender = ensure_signed(origin)?;
            // some check
            Self::check_cert(&data, &sigs)?;
            let hash = Blake2Hasher::hash(&data[..]);
            let cert = Certificate {
                data: data,
                sigs: sigs,
                hash: hash.clone(),
            };
            Self::insert_cert(hash, cert)?;
            Self::deposit_event(RawEvent::CertAdded(sender, hash));

            Ok(())
        }
    }
}

impl<T: Trait> Module<T> {
    /// 証明書をチェックする
    pub fn check_cert(cert: &CertificateData, sigs: &Vec<Sig>) -> DispatchResult {
        for sig in sigs.iter() {
            let s = MultiSignature::Sr25519(
                sp_core::sr25519::Signature::try_from(&sig.signature[..]).map_err(|_| "This is not a signature")?,
            );
            if !s.verify(&cert[..], &sig.account_id) {
                return Err(sp_runtime::DispatchError::Other("Signature is invalid"));
            }
        }
        Ok(())
    }
    /// 証明書を記録する
    pub fn insert_cert(hash: H256, cert: Certificate) -> DispatchResult {
        Certificates::insert(hash.clone(), cert);
        let current_index = CertificateCount::get();
        CertificateArray::insert(current_index, &hash);
        let next_index = current_index.checked_add(1).ok_or("index overflowed")?;
        CertificateCount::put(next_index);
        Ok(())
    }
}
```

`use`のモジュール読み込みと`Trait`の定義は所謂「おまじない」です。
`decl_*!`からはじまるマクロブロックに処理を記述していきます。

#### decl_storage

ブロックチェーンに保存するデータ領域を宣言します。
Solidityでいう状態変数です。

今回は以下のように`Certificates`, `CertificateArray`, `CertificateCount`フィールド、`Certificate`構造体を宣言しました。
```
#[derive(Decode, Encode, Clone, PartialEq, Default)]
#[cfg_attr(feature = "std", derive(Debug))]
pub struct Certificate { ... 省略 ...}

decl_storage! {
    trait Store for Module<T: Trait> as CertStore {
        /// 証明書のハッシュテーブル
        Certificates get(fn cert): map H256 => Certificate;
        /// 証明書ハッシュの配列
        CertificateArray: map u128 => H256;
        /// 証明書ハッシュ配列の要素数
        CertificateCount get(fn cert_count): u128;
    }
}
```
`Certificates`はH256(256ビットのハッシュ値)をキーとし、Certificate構造体を値とするキーバリューペアです。
`CertificateArray`, `CertificateCount`は、`Certificates`のハッシュ値を列挙するための配列を作るための領域です。Substrateには配列フィールドはない[^noarr]ので、整数とハッシュ値のキーバリューペアと、配列長で表現します。要素を追加するときは、

```
let current_index = CertificateCount::get(); // 配列長(新要素の添字)を読み込み
CertificateArray::insert(current_index, &hash); // 新要素を追加
let next_index = current_index.checked_add(1).ok_or("index overflowed")?; // 1を足す。オーバーフローしたらエラー吐いて止まってくれる
CertificateCount::put(next_index); // 新しい配列長を書き込み
```
というふうに書きます。

なお、`decl_storage!`はrustdocsコメントも解釈して、フィールドにラベル付けしてUI側に伝えてくれます。変態。

構造体も保存できます。Rustは優秀なので`#[derive(Decode, Encode)]`をつけるだけでチェーンに保存できる形にエンコードしてくれます。

#### decl_module!

モジュール`Module`の定義と、外部から呼び出せる関数を表す`Call`の定義を自動でやってくれます。それぞれSolidityの`function`, `public`に相当します。
`fn deposit_event() = default;`はおまじないです。Rustにはこんな構文はないので、本当の意味でのおまじないだと思われます。イベントを呼び出す関数を定義しているようです。
あとは通常の関数の定義です。ここで定義された`Module`に`impl`もできます。

`let sender = ensure_signed(origin)?;`は、署名されているかどうかを調べ、署名者のアドレスを返してくれます。署名済みでなければErr(_)を返します。`ensure_none`というのもあって、署名されていないトランザクションかどうかを調べてくれます。これは、手数料をかけなくてもいいような軽い処理や、自前で署名検証機構を備えている時に便利です。

#### decl_event!

イベントの定義です。Solidityで言うイベントです。
引数に`AccountId`(`<T as system::Trait>::AccountId`)と`H256`を持つ`CertAdded`イベントです。ここにあるコメントも解釈してUI側に伝えてくれます。

#### 完成

完成したら、

```
cargo build --release
```

でビルドをし

```
./target/release/node-template purge-chain --dev
```

でチェーンをリセットし、

```
./target/release/node-template --dev
```

で起動できます。



## 困った時のリンク集

#### Substrate Developer Hub

https://substrate.dev/

Substrateの公式ドキュメントサイトです。

[^monya]: https://monya-wallet.github.io/
[^hello]: https://www.parity.io/hello-substrate/
[^wasm]: https://developer.mozilla.org/ja/docs/WebAssembly
[^noarr]: 探索コストがO(n)だとnが大きくなるとDoS攻撃ができてしまうため。Vecは存在するが、利用するときは注意。
