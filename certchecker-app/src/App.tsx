import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Home from './Home'
import Api from './Api';
import Nav from './Nav';
import AddCert from './AddCert'
import CheckCert from './CheckCert'
import "@blueprintjs/core/lib/css/blueprint.css";

const App = () => {
  function push(a: string) {
    window.location.href = a
  }
  return (
    <div className="App">
      <Api>
        <Router>
          <Nav />
          <Route path='/' exact component={Home} />
          <Route path='/AddCert' component={AddCert} />
          <Route path='/CheckCert' component={CheckCert} />
        </Router>
      </Api>
    </div>
  );
}

export default App;
