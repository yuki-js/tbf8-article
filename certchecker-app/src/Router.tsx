import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Nav from "./Nav";
import Home from "./Home";
import AddCert from "./AddCert";
import CheckCert from "./CheckCert";
import Loader from "./Loader";
import { useApi } from "./Api";

export default function Router() {
  const { isReady } = useApi();

  return (
    <>
      {isReady && (
        <BrowserRouter>
          <Nav />
          <Route path="/" exact component={Home} />
          <Route path="/AddCert" component={AddCert} />
          <Route path="/CheckCert" component={CheckCert} />
        </BrowserRouter>
      )}
      {!isReady && <Loader />}
    </>
  );
}
