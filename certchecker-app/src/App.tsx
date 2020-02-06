import React, { useState, useEffect } from "react";
import Router from "./Router";
import Api, { useApi } from "./Api";

import Loader from "./Loader";
import "@blueprintjs/core/lib/css/blueprint.css";

const App = () => {
  return (
    <div className="App">
      <Api>
        <Router></Router>
      </Api>
    </div>
  );
};

export default App;
