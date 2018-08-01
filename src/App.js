import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import rootReducer from './reducers';

const store = createStore(rootReducer);

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path="/floor/:floor/at/:coordindates" component={Test} />
        </Switch>
      </Router>
    </Provider>
  );
};

const Test = ({ match, location }) => {
  console.log(match, location);
  return <h1>Hello World</h1>;
};

export default App;
/**
  Coor: /floor/<floor>/at/0,0
  /places/<Room>/to/<Room>(/Coor)
  /nearest/<Obj>/from/<Room>(/Coor)
 */
