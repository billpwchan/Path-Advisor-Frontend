import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import rootReducer from './reducers';
import RouterManager from './components/RouterManager/RouterManager';

const store = createStore(rootReducer);

const App = () => {
  return (
    <Provider store={store}>
      <RouterManager />
    </Provider>
  );
};

export default App;
