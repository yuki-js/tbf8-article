import React, { useEffect, useState } from 'react';
import { InputAddress, Button, Extrinsic } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { formatBalance, formatNumber } from '@polkadot/util';


export default function AddCert(props: Props): React.ReactElement<Props> {
  const {api} = useApi()
  const [accountId, setAccountId] = useState<string | null>(null)
  debugger;
  return (
    <section>
      <h1>{'Add certificate'}</h1>
      <InputAddress
          label={'using the selected account'}
          onChange={setAccountId}
          type='account'
      />
      <div>selecting account: {accountId}</div>
      <Extrinsic label={"Extrinsic"}/>
    </section>
  )
}
