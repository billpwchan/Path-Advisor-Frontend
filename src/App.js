import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import rootReducer from './reducers';
import RouterManager from './components/RouterManager/RouterManager';

/* eslint-disable no-underscore-dangle */
const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
/* eslint-enable */

const App = () => (
  <Provider store={store}>
    <RouterManager />
  </Provider>
);

export default App;
