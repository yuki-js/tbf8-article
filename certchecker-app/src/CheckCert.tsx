import React, { useState, useEffect, CSSProperties } from "react";

import {
  Card,
  Spinner,
  Text,
  Drawer,
  Divider,
  Button,
  Intent
} from "@blueprintjs/core";

import { useApi } from "./Api";
const elemStyle: CSSProperties = {
  margin: "5px",
  wordWrap: "break-word"
};
// https://stackoverflow.com/questions/25354313/saving-a-uint8array-to-a-binary-file
var downloadBlob: any, downloadURL: any;

downloadBlob = function(data: any, fileName: any, mimeType: any) {
  var blob, url: any;
  blob = new Blob([data], {
    type: mimeType
  });
  url = window.URL.createObjectURL(blob);
  downloadURL(url, fileName);
  setTimeout(function() {
    return window.URL.revokeObjectURL(url);
  }, 1000);
};

downloadURL = function(data: any, fileName: any) {
  var a;
  a = document.createElement("a");
  a.href = data;
  a.download = fileName;
  document.body.appendChild(a);
  a.style.display = "none";
  a.click();
  a.remove();
};

export default function AddCert() {
  const { api } = useApi();
  const [hashes, setHashes] = useState<Array<any>>([]);
  const [data, setData] = useState<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);
  useEffect(() => {
    (async () => {
      const len: any = await api.query.certStore.certificateCount();

      const hashList = await api.query.certStore.certificateArray.multi(
        Array.from({ length: len }, (v, k) => k)
      );

      setHashes(hashList);
    })();
  }, []);
  async function fetch(hash: any) {
    setOpen(true);
    const data = await api.query.certStore.certificates(hash);
    setData(data);
  }
  function download() {
    downloadBlob(
      new Uint8Array(data.data),
      "certificate_" + data.hash.toString() + ".pdf",
      "application/pdf"
    );
  }
  function close() {
    setData(null);
    setOpen(false);
  }
  return (
    <section>
      <Text>クリックするとダウンロードできます</Text>
      {hashes.map((h, i) => (
        <Card
          interactive={true}
          onClick={() => fetch(h)}
          key={i}
          style={elemStyle}
        >
          {h.toString()}
        </Card>
      ))}
      {!hashes.length && <Spinner />}
      <Drawer isOpen={isOpen} onClose={() => close()} style={elemStyle}>
        {data && (
          <div>
            <Text>{data.hash.toString()}</Text>
            <Divider />
            {data.sigs.map((f: any, i: any) => (
              <Text key={i}>{f.account_id.toString()}</Text>
            ))}
            <Text>に署名されています</Text>
            <Divider />
            <Button onClick={download} intent={Intent.PRIMARY} icon="import">
              Download
            </Button>
          </div>
        )}
      </Drawer>
    </section>
  );
}
