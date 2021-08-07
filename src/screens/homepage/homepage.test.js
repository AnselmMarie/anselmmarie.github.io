import React from 'react';
import { cleanup, render } from '@testing-library/react';

import HomepageScreen from './homepage.container';

beforeEach(() => {
    jest.resetModules();
});

afterEach(cleanup);

describe('<HomepageScreen />', () => {

    test('should renders without crashing', () => {
        const wrapper = render(<HomepageScreen />);
        expect(wrapper).toBeTruthy();
    });

    test('portfolio content does exist', () => {
        const wrapper = render(<HomepageScreen />);
        const portfolioRow = wrapper.getByTestId('portfolio-row');
        expect(portfolioRow.children.length).toBeGreaterThanOrEqual(1);
    });

    test('check snapshot of Skills', () => {
        const wrapper = render(<HomepageScreen />);
        const skillsRow = wrapper.getByTestId('skills-row');
        expect(skillsRow).toMatchSnapshot();
    });

    test(`portfolio content doesn't exist`, () => {

        jest.doMock('../../config/portfolio.item.json', () => ({
            data: []
        }));

        const Homepage = require('./homepage.container').default;
        const wrapper = render(<Homepage />);
        const portfolioRow = wrapper.getByTestId('portfolio-row');
        expect(portfolioRow.children.length).toBe(1);
    });

});