import React, { useState, useEffect } from "react";
import {
  Card,
  Toaster as Toast,
  Intent,
  Button,
  ButtonGroup
} from "@blueprintjs/core";
import { Keyring } from "@polkadot/api";

import { useHistory } from "react-router-dom";
import { useApi } from "./Api";

const cardStyle: any = {
  margin: "10px",
  padding: "100px",
  textAlign: "center"
};
const keyring = new Keyring({ type: "sr25519" });
export default function AddCert() {
  const { api } = useApi();

  const history = useHistory();
  let pt: any;
  function ce(e: any) {
    e.preventDefault();
    e.stopPropagation();
  }

  function read(e: any) {
    ce(e);
    pt = Toast.create();
    pt.show({
      message: "アップロードしています"
    });
    const file = e.dataTransfer.files[0];
    const fileReader = new FileReader();
    fileReader.onload = function(e: any) {
      signsend(new Uint8Array(e.target.result));
    };
    fileReader.readAsArrayBuffer(file);
  }

  function signsend(arr: Uint8Array) {
    pt.show({
      message: "アリスが署名しています"
    });

    const hex = toHex(arr);
    const alice = keyring.addFromUri("//Alice", { name: "Alice default" });
    const bob = keyring.addFromUri("//Bob", { name: "Alice default" });
    const transaction = api.tx.certStore.addCert(hex, [
      {
        account_id: alice.address,
        signature: alice.sign(arr)
      },
      {
        account_id: bob.address,
        signature: bob.sign(arr)
      }
    ]);
    pt.show({
      message: "ボブが署名しています"
    });
    pt.show(
      {
        message: "ブロックチェーンの結果を待っています"
      },
      "wait"
    );
    transaction.signAndSend(alice, (e: any) => {
      if (e.isError) {
        pt.show({
          message: "送信に失敗しました(Error)",
          intent: Intent.DANGER
        });
        pt.show({
          message:
            "送信を確認できませんでした。送信自体は成功しているかもしれません。",
          intent: Intent.DANGER
        });

        pt.dismiss("wait");
        return;
      }
      if (e.isFinalized) {
        pt.dismiss("wait");
        if (e.events.length) {
          e.events.forEach((m: any) => {
            const msg = m.event.meta.documentation[0].toString();
            pt.show({
              message: msg,
              intent: Intent.SUCCESS,
              timeout: 0
            });
          });
        } else {
          pt.show({
            message: "ブロックチェーンにしっかり書き込まれました(Finalized)",
            intent: Intent.SUCCESS
          });
        }
      }
      console.log("Event Fired. e:", e);
    });
  }
  function toHex(u: Uint8Array): string {
    let i = u.length;
    let a = new Array(i);
    while (i--) a[i] = (u[i] < 16 ? "0" : "") + u[i].toString(16);
    return "0x" + a.join("");
  }
  return (
    <section>
      <Card style={cardStyle} onDrop={read} onDragOver={ce} onDragEnter={ce}>
        <div id="dragarea">
          ここにPDFファイルをドラッグするとファイルを署名してブロックチェーンに書き込みます。PDF以外のファイルはうまくいかないことがあります。
        </div>
      </Card>
      <ButtonGroup fill={true} style={cardStyle}>
        <Button
          rightIcon="arrow-right"
          onClick={() => history.push("/CheckCert")}
        >
          確認はこちら
        </Button>
      </ButtonGroup>
    </section>
  );
}
