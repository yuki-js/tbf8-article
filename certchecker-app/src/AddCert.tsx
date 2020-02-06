import React, { useState, useEffect } from 'react';

import {useApi} from './Api';

export default function AddCert() {
  const {api} = useApi();
  
  return (
      <section>
      <input type="file" />
      </section>
  )
}
