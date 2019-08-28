/* Node Modules */
import React from 'react';
import {cleanup, render} from "react-testing-library";
/* Screen */
import PortfolioContainer from "./portfolio.container";
/* JSON */
import portfolioJSON from '../../config/portfolio.item.json';
import {getPortfolio, updatePortfolio} from "../../data.store/store";

/**
 * @function urlSplit
 * @desc this will create a split for the first portfolio data url
 * @return {array}
 */
const urlSplit = portfolioJSON.data[0].url.split('/');

/**
 * @function props404
 * @desc props mock for initializing a 404 error
 * @return {object}
 */
const props404 = {
    history: [],
    match: {
        params: {
            company: 'fasfadsf',
            project: 'dafsasf'
        }
    }
};


/**
 * @function setupMount
 * @desc props mock for initializing a correct response
 * @return {object}
 */
const propsCorrect = {
    history: [],
    match: {
        params: {
            company: urlSplit[0],
            project: urlSplit[1]
        }
    }
};

afterEach(cleanup);

describe(`<Portfolio />`, () => {

    test('When the portfolio content doesn\'t exist', () => {
        render(<PortfolioContainer {...props404} />);
        expect(props404.history[0]).toBe('/404');
    });

    test('When the portfolio content is manually added', () => {
        // const wrapper = setupMount(propsCorrect);
        // console.log('propsCorrect', propsCorrect);
        // wrapper.unmount();
    });

    test('When the portfolio content is already present', () => {
        // updatePortfolio(portfolioJSON.data[0]);
        //
        // console.log('getPortfolio', getPortfolio());
        //
        // const wrapper = setupMount();
        //
        // wrapper.unmount();
    });

});