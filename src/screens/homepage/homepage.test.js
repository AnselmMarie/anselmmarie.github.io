/* Node Modules */
import React from 'react';
import {cleanup, render} from "react-testing-library";
/* Components */
import HomepageContainer from './homepage.container';

beforeEach(() => {
    jest.resetModules();
});

afterEach(cleanup);

describe('<HomepageContainer />', () => {

    test('should renders without crashing', () => {
        const wrapper = render(<HomepageContainer />);
        expect(wrapper).toBeTruthy();
    });

    test('portfolio content does exist', () => {
        const wrapper = render(<HomepageContainer />);
        const portfolioRow = wrapper.getByTestId('portfolio-row');
        expect(portfolioRow.children.length).toBeGreaterThanOrEqual(1);
    });

    test('check snapshot of Skills', () => {
        const wrapper = render(<HomepageContainer />);
        const skillsRow = wrapper.getByTestId('skills-row');
        expect(skillsRow).toMatchSnapshot();
    });

    test(`portfolio content doesn't have exist`, () => {

        jest.doMock('../../data/portfolio.item.json', () => ({
            data: []
        }));

        const Homepage = require('./homepage.container').HomepageContainer;
        const wrapper = render(<Homepage />);
        const portfolioRow = wrapper.getByTestId('portfolio-row');
        expect(portfolioRow.children.length).toBe(1);
    });

});