import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Main from '../Main/Main';
import NotFoundPage from '../NotFoundPage/NotFoundPage';

const position = ':floor(floor/[^/]+)?/:coordinates(at/[^/]+)?';

const RouterManager = () => (
  <Router>
    <Switch>
      <Route path="/" component={Main} exact />
      <Route path={`/${position}`} component={Main} exact />
      <Route path={`/place/:place/${position}`} component={Main} exact />
      <Route path={`/search/from/:fromPlace/to/:toPlace/${position}`} component={Main} exact />
      <Route
        path={`/search/nearest/:mapItemType/from/:fromPlace/${position}?`}
        component={Main}
        exact
      />
      <Route component={NotFoundPage} />
    </Switch>
  </Router>
);

export default RouterManager;
