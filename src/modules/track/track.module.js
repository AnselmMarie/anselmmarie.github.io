import ReactGA from 'react-ga';

const modifyHash = (hash) => hash.replace('#/', '');

const isProduction = () => {
  return window.location.hostname !== 'localhost';
};

export const initTrack = () => {
  if (isProduction()) {
    ReactGA.initialize('UA-123791717-1');
  }
};

export const trackScreen = () => {
  if (isProduction()) {
    ReactGA.pageview('/' + modifyHash(window.location.hash));
  }
};
