/* Node Modules */
import React from 'react';
import {HashRouter, Route} from "react-router-dom";
/* Screens */
import Homepage from '../screens/homepage/homepage';
import Portfolio from '../screens/portfolio/portfolio';

export default () => (
    <HashRouter>
        <Route exact path="/" component={Homepage}/>
        <Route exact path="/portfolio" component={Portfolio}/>
    </HashRouter>
);