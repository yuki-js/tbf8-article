// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from './types';

import Component from '../../app-certstore/src';

export default ([
  {
    Component,
    display: {
      isHidden: false,
      needsAccounts: true,
      needsApi: [
        'tx.balances.transfer',
        'tx.certStore.addCert'
      ]
    },
    i18n: {
      defaultValue: 'CertStore'
    },
    icon: 'th',
    name: 'CertStore'
  }
] as Routes);
