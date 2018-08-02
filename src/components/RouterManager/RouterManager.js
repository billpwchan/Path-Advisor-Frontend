import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MainPage from '../MainPage/MainPage';
import NotFoundPage from '../NotFoundPage/NotFoundPage';

const location = ':floor(floor/[^/]+)?/:coordinates(at/[^/]+)?';

const RouterManager = () => (
  <Router>
    <Switch>
      <Route path="/" component={MainPage} exact />
      <Route path={`/${location}`} component={MainPage} exact />
      <Route path={`/place/:place/${location}`} component={MainPage} exact />
      <Route
        path={`/search/from/:fromPlace/to/:toPlace/${location}`}
        component={MainPage}
        exact
      />
      <Route
        path={`/search/nearest/:mapItemType/from/:fromPlace/${location}?`}
        component={MainPage}
        exact
      />
      <Route component={NotFoundPage} />
    </Switch>
  </Router>
);

export default RouterManager;
