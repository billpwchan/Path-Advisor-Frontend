import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Main from '../Main/Main';
import NotFoundPage from '../NotFoundPage/NotFoundPage';

const position = ':floorPath(floor/[^/]+)?/:coordinatePath(at/[^/]+)?';

const Router = () => (
  <BrowserRouter>
    <Switch>
      {/* legacy route name */}
      <Route
        path="/interface.php"
        render={({ location }) => <Redirect to={{ ...location, pathname: '/' }} />}
        exact
      />
      {/* legacy route name */}
      <Route
        path="/m"
        render={({ location }) => <Redirect to={{ ...location, pathname: '/' }} />}
        exact
      />
      {/* legacy route name */}
      <Route
        path="/m.interface.html"
        render={({ location }) => <Redirect to={{ ...location, pathname: '/' }} />}
        exact
      />
      <Route path="/" component={Main} exact />
      <Route path={`/${position}`} component={Main} exact />
      <Route path={`/:search?/from/:fromPlace?/to/:toPlace?/${position}`} component={Main} exact />
      <Route
        path={`/:search?/nearest/:toNearestType/from/:fromPlace?/${position}`}
        component={Main}
        exact
      />
      <Route
        path={`/:search?/nearest/:fromNearestType/to/:toPlace?/${position}`}
        component={Main}
        exact
      />
      <Route component={NotFoundPage} />
    </Switch>
  </BrowserRouter>
);

export default Router;
