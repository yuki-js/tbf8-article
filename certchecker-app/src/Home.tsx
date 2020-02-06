import React, { useState, useEffect } from 'react';
import { Card } from "@blueprintjs/core";

import { useApi } from './Api';
import { Button, ButtonGroup } from "@blueprintjs/core";
import { useHistory } from 'react-router-dom'
export default function Home() {
  const { api } = useApi();
  const history = useHistory()

  return (
    <section>
      <h1>証明書アップローダ/チェッカ</h1>

      <p>このアプリケーションは</p>
      <ul>
        <li>証明書本文を保存します</li>
        <li>証明書に対する署名を保存します</li>
        <li>発行者、被発行者の署名を保存することで、証明書本文、発行元、発行先の真正性が保たれます。</li>
        <li>ブロックチェーンに保存する前に署名の検証が行われ、不正な署名は拒否されます。</li>
        <li>ブロックチェーンには署名された証明書だけが保存されます</li>
      </ul>
      <p>このアプリケーションのステップ</p>
      <ol>
        <li>証明書に対する署名を作る</li>
        <li>証明書と署名からトランザクションを作成します</li>
        <li>トランザクションをブロックチェーンにアップロードします</li>
        <li>アップロードされた証明書を表示します。</li>
      </ol>
      <p>このブロックチェーンはParity Substrateで構築されています</p>
      <ButtonGroup fill={true} large={true}>
        <Button icon="plus" onClick={() => history.push("/AddCert")}>証明書を登録する</Button>
        <Button icon="eye-open" onClick={() => history.push("/CheckCert")}>証明書を確認する</Button>
      </ButtonGroup>
    </section>
  )
}
