/* Node Modules */
import React from 'react';
import {render, cleanup} from "@testing-library/react";
/* Components */
import PortfolioItem from './portfolio.item.container';
/* JSON */
import portFolioJSON from '../../config/portfolio.item.json';

/**
 * @function propsMock
 * @desc props mock for the portfolio item
 * @return {object}
 */
const propsMock = {
    history: [],
    item: portFolioJSON.data[0]
};

afterEach(cleanup);

describe('<PortfolioItem />', () => {

    test('should render', () => {
        const wrapper = render(<PortfolioItem {...propsMock} />);
        expect(wrapper).toBeTruthy();
    });

    test('on click should redirect to portfolio url', () => {
    });

    test('should display the correct portfolio content', () => {
        const {getByText} = render(<PortfolioItem {...propsMock} />);
        const title = getByText(propsMock.item.title);
        const subtitle = getByText(propsMock.item.subtitle);
        const company = getByText(propsMock.item.company);

        expect(title).toBeTruthy();
        expect(subtitle).toBeTruthy();
        expect(company).toBeTruthy();
    });

});