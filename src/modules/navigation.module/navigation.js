/* Node Modules */
import React from 'react';
import {HashRouter, Route, Switch} from "react-router-dom";
/* Screens */
import Homepage from '../../screens/homepage/homepage';
import Portfolio from '../../screens/portfolio/portfolio';
import NoMatch from '../../screens/no.match/no.match';

export default () => (
    <HashRouter>
        <Switch>
            <Route exact path="/" component={Homepage}/>
            <Route exact path="/portfolio/:company/:project" component={Portfolio}/>
            <Route exact component={NoMatch} />
        </Switch>
    </HashRouter>
);