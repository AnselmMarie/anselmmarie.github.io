/* Node Modules */
import React from 'react';
import ReactDOM from 'react-dom';
/* CSS */
import 'bootstrap/dist/css/bootstrap.css';
import './assets/stylesheet/fonts.css';
import './assets/stylesheet/global.css';
/* Modules */
import Navigation from './modules/navigation/navigation.module';
import * as serviceWorker from './modules/service.worker';
import {initTrack} from './modules/track/track.module';

initTrack();

ReactDOM.render(<Navigation />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
