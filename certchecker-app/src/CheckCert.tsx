import React, { useState, useEffect } from 'react';


import {useApi} from './Api';

export default function AddCert() {
  const {api} = useApi();
  const [data, setData] = useState();
  useEffect(()=>{
    (async()=>{
      const len: any = await api.query.certStore.certificateCount()
      const hash = await api.query.certStore.certificateArray(len as any -1)
      const data: any = await api.query.certStore.certificates(hash)
      const buf = data["data"]
      const text = (new TextDecoder()).decode(buf)
      setData(text)
    })()
  })
  return (
      <div>{data}</div>
  )
}
