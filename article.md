# Substrateを使ってみた

ミスモナコイン

ミスモナコインです。最近活動再開しました。以前は、ご存知の方はご存知の通り、Bitcoin系のウォレットを開発していましたが、最近ではSubstrateを使って独自ブロックチェーンを開発しています。本記事ではSubstrateの紹介と、簡単なブロックチェーンを作ります。モナコイン要素はありません。

本記事の情報は全て2020年2月現在のものです。

## Substrateとは

Substrateとは、Rustでブロックチェーンを開発できる、ブロックチェーンフレームワークです。開発元はParity Technologiesです。ParityはPolkadot, Parity Ethereum Clientなどを提供している企業です。Polkadotを開発する過程で、コア部分を分離してできたものがSubstrateです。

Substrateで採用されている技術を紹介ページ[^lp]から抜粋すると

  * WebAssembly上に構成されている
  * 拡張性の高いLibp2pネットワーク
  * 高速で信頼性の高いRustによる主要部分の実装
  * 開発しやすいJavaScriptによる実装

Suubstrate Developer Hub[^sdh]

[^lp]: https://www.parity.io/substrate/
[^sdh]: https://substrate.dev/
