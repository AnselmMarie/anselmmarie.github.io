import ReactGA from 'react-ga';

/**
 * @function modifyHash
 * @desc removes the hash part of the string
 * @author Anselm Marie
 * @param {string} hash - contents of the url hash
 * @return {string}
 */
const modifyHash = (hash) => hash.replace('#/', '');

/**
 * @function isProduction
 * @desc checking if the environment is production
 * @author Anselm Marie
 * @return {boolean}
 */
const isProduction = () => {
    return window.location.hostname !== 'localhost';
};

/**
 * @function initTrack
 * @desc initializes the google analytics
 * @author Anselm Marie
 */
export const initTrack = () => {
    if (isProduction()) {
        ReactGA.initialize('UA-123791717-1');
    }
};

/**
 * @function trackScreen
 * @desc tracks the current screen
 * @author Anselm Marie
 */
export const trackScreen = () => {
    if (isProduction()) {
        ReactGA.pageview('/' + modifyHash(window.location.hash));
    }
};