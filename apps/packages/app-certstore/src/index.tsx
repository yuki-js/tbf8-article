// Copyright 2017-2020 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps as Props } from '@polkadot/react-components/types';

import React, { useState } from 'react';

export default function TemplateApp ({ className }: Props): React.ReactElement<Props> {
  const [accountId, setAccountId] = useState<string | null>(null);
  return (
    <main className={className}></main>
  );
}
