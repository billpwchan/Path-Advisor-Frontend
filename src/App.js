import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    const props = { a: '1' };

    return (
      <div className="App" {...props}>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
/**
  Coor: /floor/<floor>/at/0,0
  /places/<Room>/to/<Room>(/Coor)
  /nearest/<Obj>/from/<Room>(/Coor)
 */
