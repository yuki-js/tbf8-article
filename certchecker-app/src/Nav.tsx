import React, { useState, useEffect } from 'react';
import { Navbar, Button, Alignment } from "@blueprintjs/core";

import { useApi } from './Api';
import { useHistory } from 'react-router-dom'
export default function Nav() {
  const { api } = useApi();
  const { push } = useHistory()

  return (
    <Navbar className="bp3-dark">
      <Navbar.Group>
        <Navbar.Heading>証明書チェッカー</Navbar.Heading>
      </Navbar.Group>
      <Navbar.Group align={Alignment.RIGHT}>
        <Button className="bp3-minimal" icon="home" text="Home" onClick={() => { push("/") }} />
        <Button className="bp3-minimal" icon="plus" text="Add" onClick={() => { push("/AddCert") }} />
        <Button className="bp3-minimal" icon="eye-open" text="Check" onClick={() => { push("/CheckCert") }} />
      </Navbar.Group>
    </Navbar>
  )
}
