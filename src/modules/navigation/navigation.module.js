/* Node Modules */
import React from 'react';
import { HashRouter, Route, Switch } from "react-router-dom";
/* Screens */
import HomepageScreen from '../../screens/homepage';
import PortfolioScreen from '../../screens/portfolio';
import NoMatchScreen from '../../screens/no.match';

export default () => (
    <HashRouter>
        <Switch>
            <Route exact path="/" component={HomepageScreen} />
            <Route exact path="/portfolio/:company/:project" component={PortfolioScreen} />
            <Route exact component={NoMatchScreen} />
        </Switch>
    </HashRouter>
);
