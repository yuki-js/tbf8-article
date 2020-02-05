async function addcert(){
  const アリスのアドレス = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
  const 証明書の本文 = "0x01"
  const 署名者1の署名 = "0x5818c071cffd757306d586d090207cde3a6c1f6a49b6d6cef96f41d61a8bc4074b18cb0961b9988ed35df54348ae9d6651dc76d37f6a041cbe6b8e8dae42e085"
  const トランザクション = api.tx.certStore.addCert(証明書の本文, [{
    signature: 署名者1の署名,
    account_id: アリスのアドレス
  }])
  トランザクション.signAndSend(アリスのアドレス, ({ events = [], status }) => {
    if (status.isFinalized) {
      console.log('Successful with hash ' + status.asFinalized.toHex());
    } else {
      console.log('Status of transfer: ' + status.type);
    }

    events.forEach(({ phase, event: { data, method, section } }) => {
      console.log(phase.toString() + ' : ' + section + '.' + method + ' ' + data.toString());
    });
  })
}
async function getcert(){
  const hash = await api.query.certStore.certificateArray(0)
  const data = await api.query.certStore.certificates(hash)
  console.log("データ:", data.data)
  console.log("ハッシュ:", hash)
  data.sigs.forEach((sig,i)=>{
    console.log("署名者"+i)
    console.log("\tアドレス: "+ sig.account_id)
    console.log("\t署名: "+ sig.signature)
  })
}
