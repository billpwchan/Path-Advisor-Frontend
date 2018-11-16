import 'core-js/fn/array/find';
import 'core-js/fn/array/includes';
import 'core-js/fn/number/is-nan';
import 'core-js/fn/number/parse-int';
import 'core-js/fn/string/starts-with';
import 'core-js/fn/object/values';
import 'core-js/fn/math/sign';

import 'react-app-polyfill/ie11'; // For IE 11 support

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { unregister } from './registerServiceWorker';

function noop() {}

if (process.env.NODE_ENV !== 'development') {
  console.log = noop;
  console.warn = noop;
  console.error = noop;
}

ReactDOM.render(<App />, document.getElementById('root'));
unregister();
