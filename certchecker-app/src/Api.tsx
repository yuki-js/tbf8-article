import React, { useState, useEffect, useContext } from 'react';

import { ApiPromise, WsProvider } from '@polkadot/api';

interface Props {
  children: React.ReactNode;
}
export interface ApiProps {
  api: ApiPromise;
  isApiConnected: boolean;
}
let api: ApiPromise;
const ApiContext = React.createContext({} as ApiProps)

export {api}
export default function Api({children}: Props): React.ReactElement<Props> | null{
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect((): void => {
    const provider = new WsProvider('ws://ec2-54-197-6-7.compute-1.amazonaws.com:9944');
    api = new ApiPromise({
      provider,
      types:{
        "Sig":{
          "signature":"H512",
          "account_id":"AccountId"
        },
        "Certificate":{
          "data":"CertificateData",
          "hash":"H256",
          "sigs":"Vec<Sig>"
        },
        "CertificateData":"Vec<u8>"
      }
    });

    api.on('connected', (): void => setIsApiConnected(true));
    api.on('disconnected', (): void => setIsApiConnected(false));
    api.on('ready', (): void => setIsInitialized(true));
  }, []);
  if(!isInitialized) {
    return null
  }
  return (
      <ApiContext.Provider value={{ api, isApiConnected }}>
        {children}
      </ApiContext.Provider>
  )
}
export function useApi(): ApiProps {
  return useContext(ApiContext)
}
