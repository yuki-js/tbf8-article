import React from 'react';
import Api from './Api';
import AddCert from './AddCert'
import CheckCert from './CheckCert'
const App = () => {
  return (
    <div className="App">
      <Api>
      <AddCert />
      <CheckCert />
      </Api>
    </div>
  );
}

export default App;
