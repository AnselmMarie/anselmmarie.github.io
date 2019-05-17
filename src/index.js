import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './assets/stylesheet/fonts.css';
import './assets/stylesheet/global.css';
import Navigation from './modules/navigation/navigation';
import * as serviceWorker from './modules/service.worker';

ReactDOM.render(<Navigation />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
