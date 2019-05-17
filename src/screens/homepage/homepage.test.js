/* Node Modules */
import React from 'react';
import {cleanup, render} from "react-testing-library";
/* Components */
import Homepage from './homepage';

beforeEach(() => {
    jest.resetModules();
});

afterEach(cleanup);

describe('<Homepage />', () => {

    test('should renders without crashing', () => {
        const wrapper = render(<Homepage />);
        expect(wrapper).toBeTruthy();
    });

    test('portfolio content does exist', () => {
        const wrapper = render(<Homepage />);
        const portfolioRow = wrapper.getByTestId('portfolio-row');
        expect(portfolioRow.children.length).toBeGreaterThanOrEqual(1);
    });

    test('check snapshot of Skills', () => {
        const wrapper = render(<Homepage />);
        const skillsRow = wrapper.getByTestId('skills-row');
        expect(skillsRow).toMatchSnapshot();
    });

    test(`portfolio content doesn't have exist`, () => {

        jest.doMock('../../data/portfolio.item.json', () => ({
            data: []
        }));

        const Homepage = require('./homepage').default;
        const wrapper = render(<Homepage />);
        const portfolioRow = wrapper.getByTestId('portfolio-row');
        expect(portfolioRow.children.length).toBe(1);
    });

});