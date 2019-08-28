/* Node Modules */
import React from 'react';
import {HashRouter, Route, Switch} from "react-router-dom";
/* Screens */
import HomepageContainer from '../../screens/homepage';
import PortfolioContainer from '../../screens/portfolio';
import NoMatchContainer from '../../screens/no.match';

export default () => (
    <HashRouter>
        <Switch>
            <Route exact path="/" component={HomepageContainer}/>
            <Route exact path="/portfolio/:company/:project" component={PortfolioContainer}/>
            <Route exact component={NoMatchContainer} />
        </Switch>
    </HashRouter>
);
