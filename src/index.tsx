import { createRoot } from 'react-dom/client';

import 'bootstrap/dist/css/bootstrap.css';
import './assets/stylesheet/fonts.css';
import './assets/stylesheet/global.css';

import * as serviceWorker from './modules/service.worker';
import { initTrack } from './modules/track/track.module';

import BaseScreen from './screens/base';

initTrack();

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<BaseScreen />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
