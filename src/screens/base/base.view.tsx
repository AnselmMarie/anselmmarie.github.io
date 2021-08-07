import React, { ReactElement } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

import UiFooter from '../../ui/footer';

import HomepageScreen from '../homepage';
import PortfolioScreen from '../portfolio';
import NoMatchScreen from '../no.match';

const BaseView = (): ReactElement => (
  <HashRouter>
    <Switch>
      <Route exact path="/" component={HomepageScreen} />
      <Route
        exact
        path="/portfolio/:company/:project"
        component={PortfolioScreen}
      />
      <Route exact component={NoMatchScreen} />
    </Switch>
    <UiFooter />
  </HashRouter>
);

export default BaseView;
